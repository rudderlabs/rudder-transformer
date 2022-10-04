/* eslint-disable no-useless-catch */
/* eslint-disable no-unused-vars */
const JSZip = require("jszip");
const fs = require("fs");
const Lambda = require("aws-sdk/clients/lambda");
const logger = require("../../logger");

const MAX_ATTEMPTS = parseInt(process.env.MAX_ATTEMPTS || "5", 10);
const DELAY = parseInt(process.env.DELAY || "1", 10);
const EVENT_SIZE_LIMIT_IN_MB =
  parseInt(process.env.EVENT_SIZE_LIMIT_IN_MB || "3", 10) * 1024 * 1024;

const lambda = new Lambda({
  apiVersion: "2015-03-31",
  region: process.env.AWS_REGION || "",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
});

const {
  createFunction,
  getFunction,
  invoke,
  updateFunctionCode,
  waitFor
} = lambda;

const promisify = fn => (...args) =>
  new Promise((resolve, reject) => {
    fn(...args, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });

const createZip = async (fileName, code) => {
  return new Promise((resolve, reject) => {
    const zip = new JSZip();
    zip.file(`${fileName}.py`, code);

    zip
      .generateNodeStream({ type: "nodebuffer", streamFiles: true })
      .pipe(fs.createWriteStream(`${fileName}.zip`))
      .on("finish", () => {
        logger.debug(`${fileName}.zip has been created`);
        resolve();
      })
      .on("error", err => {
        logger.error(`Error while creating zip file: ${err.message}`);
        reject(err);
      });
  });
};

const createLambdaFunction = async (functionName, code, publish) => {
  try {
    logger.debug(`Creating lambda for ${functionName} with publish:${publish}`);
    // create, read and delete zip
    await createZip(functionName, code);
    const zipContent = fs.readFileSync(`./${functionName}.zip`);
    fs.unlink(`./${functionName}.zip`, err => {
      if (err) {
        logger.error(`Error occurred while deleting zip file: ${err.message}`);
      }
      logger.debug(`Zip file has been deleted: ${functionName}.zip`);
    });
    // Create function
    const params = {
      Code: {
        ZipFile: zipContent /* required */
      },
      FunctionName: functionName /* required */,
      Handler: `${functionName}.lambda_handler` /* required */,
      Role: process.env.AWS_ROLE /* required */,
      Runtime: "python3.7" /* required */,
      Description: "Generated from node script",
      PackageType: "Zip",
      Architectures: ["x86_64"],
      MemorySize: 128,
      Timeout: 4,
      Publish: publish
    };
    const createFunctionPromise = promisify(createFunction.bind(lambda));
    const resp = await createFunctionPromise(params);
    logger.debug(`Created lambda for ${functionName}: ${JSON.stringify(resp)}`);

    // verify creation
    const qualifier = resp.Version;
    const functionParams = {
      FunctionName: functionName,
      Qualifier: qualifier,
      $waiter: {
        maxAttempts: MAX_ATTEMPTS,
        delay: DELAY
      }
    };
    const functionActiveStatusPromise = promisify(waitFor.bind(lambda));
    const result = await functionActiveStatusPromise(
      "functionActiveV2",
      functionParams
    );
    logger.debug(
      `Lambda active for ${functionName}: ${JSON.stringify(result)}`
    );
    return result;
  } catch (err) {
    logger.error(`Error while creating function: ${err.message}`);
    throw err;
  }
};

const updateLambdaFunction = async (functionName, code, publish) => {
  try {
    logger.debug(`Updating lambda for ${functionName} with publish:${publish}`);
    // create, read and delete zip
    await createZip(functionName, code);
    const zipContent = fs.readFileSync(`./${functionName}.zip`);
    fs.unlink(`./${functionName}.zip`, err => {
      if (err) {
        logger.error(`Error occurred while deleting zip file: ${err.message}`);
      }
      logger.debug(`Zip file has been deleted: ${functionName}.zip`);
    });
    // Update function code
    const params = {
      ZipFile: zipContent,
      FunctionName: functionName /* required */,
      Publish: publish
    };
    const updateFunctionPromise = promisify(updateFunctionCode.bind(lambda));
    const resp = await updateFunctionPromise(params);
    logger.debug(`Updated lambda for ${functionName}: ${JSON.stringify(resp)}`);

    // verify updation
    const qualifier = resp.Version;
    const functionParams = {
      FunctionName: functionName,
      Qualifier: qualifier,
      $waiter: {
        maxAttempts: MAX_ATTEMPTS,
        delay: DELAY
      }
    };
    const functionUpdateStatusPromise = promisify(waitFor.bind(lambda));
    const result = await functionUpdateStatusPromise(
      "functionUpdatedV2",
      functionParams
    );
    logger.debug(
      `Lambda updated for ${functionName}: ${JSON.stringify(result)}`
    );
    return result;
  } catch (err) {
    logger.error(`Error while creating function: ${err.message}`);
    throw err;
  }
};

const getLambdaFunction = async (functionName, qualifier = "") => {
  try {
    logger.debug(`Fetching lambda for ${functionName}`);
    const params = { FunctionName: functionName };
    if (qualifier) {
      params.Qualifier = qualifier;
    }
    const getFunctionPromise = promisify(getFunction.bind(lambda));
    const resp = await getFunctionPromise(params);
    logger.debug(`Fetched lambda for ${functionName}: ${JSON.stringify(resp)}`);
    return resp;
  } catch (err) {
    logger.error(`Error while fetching function: ${err.message}`);
    throw err;
  }
};

const invokeLambdaFunction = async (
  functionName,
  transformationPayload,
  qualifier = ""
) => {
  try {
    const params = {
      FunctionName: functionName,
      InvocationType: "RequestResponse",
      LogType: "None",
      Payload: JSON.stringify(transformationPayload)
    };
    if (qualifier) {
      params.Qualifier = qualifier;
    }

    const invokeFunctionPromise = promisify(invoke.bind(lambda));
    const result = await invokeFunctionPromise(params);
    if (result.StatusCode !== 200 || result.FunctionError) {
      throw new Error(JSON.stringify(result.Payload || result.FunctionError));
    }
    return JSON.parse(result.Payload);
  } catch (err) {
    logger.error(`Error while invoking function: ${err.message}`);
    throw err;
  }
};

/*
 * Request payload for invoke call cannot exceed 6 MB
 * Calculating payload size by simple stringifying
 * instead of using expensive TextEncoder or Buffer to calculate size
 * Set size limit to 3 MB
 * Following function loops over batch of events &
 * makes several invoke calls with payload less than 3 MB
 * No size restriction on single event
 */
async function invokeLambdaInLoop(
  functionName,
  transformationPayload,
  qualifier,
  result,
  start,
  end
) {
  logger.debug(`Executing invocation for events in indices: ${start}-${end}`);
  const size = JSON.stringify(transformationPayload.events).length;
  if (end > start && size > EVENT_SIZE_LIMIT_IN_MB) {
    const mid = Math.floor((start + end) / 2);
    if (mid !== start) {
      await invokeLambdaInLoop(
        functionName,
        {
          transformationType: transformationPayload.transformationType,
          events: transformationPayload.events.slice(start, mid)
        },
        qualifier,
        result,
        start,
        mid
      );
      await invokeLambdaInLoop(
        functionName,
        {
          transformationType: transformationPayload.transformationType,
          events: transformationPayload.events.slice(mid, end)
        },
        qualifier,
        result,
        mid,
        end
      );
    }
  }
  const res = await invokeLambdaFunction(
    functionName,
    transformationPayload,
    qualifier
  );

  result.transformedEvents.push(...res.transformedEvents);
  result.logs.push(...res.logs);
  logger.debug(`Finished invocation for events in indices: ${start}-${end}`);
}

const invokeLambda = async (functionName, transformationPayload, qualifier) => {
  try {
    logger.debug("Executing lambda invoke flow");
    const end = transformationPayload.events?.length || 0;
    const start = 0;
    const result = {
      transformedEvents: [],
      logs: []
    };
    await invokeLambdaInLoop(
      functionName,
      transformationPayload,
      qualifier,
      result,
      start,
      end
    );
    logger.debug("Finished lambda invoke flow");
    return result;
  } catch (err) {
    logger.error(`Error while invoking lambda: ${err.message}`);
    throw err;
  }
};

const setupLambda = async (functionName, code, publish) => {
  try {
    logger.debug("Executing setting up a lambda function");
    let functionExists = true;
    try {
      await getLambdaFunction(functionName);
    } catch (err) {
      functionExists = false;
    }

    // create or update function
    let resp;
    if (!functionExists) {
      resp = await createLambdaFunction(functionName, code, publish);
    } else {
      resp = await updateLambdaFunction(functionName, code, publish);
    }

    const qualifier = resp.Configuration?.Version || "$LATEST";
    logger.debug("Finished setting lambda with version:", qualifier);
    return {
      success: true,
      publishedVersion: publish ? qualifier : null
    };
  } catch (err) {
    logger.error(`Error while setting up lambda: ${err.message}`);
    throw err;
  }
};

module.exports = {
  invokeLambda,
  setupLambda
};

/* eslint-disable no-useless-catch */
/* eslint-disable no-unused-vars */
const JSZip = require("jszip");
const fs = require("fs");
const AWS = require("aws-sdk");
const logger = require("../../logger");

const MAX_ATTEMPTS = parseInt(process.env.MAX_ATTEMPTS || "5", 10);
const DELAY = parseInt(process.env.DELAY || "1", 10);

const lambda = new AWS.Lambda({
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

    // verify creation
    const functionParams = {
      FunctionName: functionName,
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
    return result;
  } catch (err) {
    logger.error(`Error while creating function: ${err.message}`);
    throw err;
  }
};

const updateLambdaFunction = async (functionName, code, publish) => {
  try {
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

    // verify updation
    const qualifier = resp.Configuration?.Version;
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
    return result;
  } catch (err) {
    logger.error(`Error while creating function: ${err.message}`);
    throw err;
  }
};

const getLambdaFunction = async (functionName, qualifier = "") => {
  try {
    const params = { FunctionName: functionName };
    if (qualifier) {
      params.Qualifier = qualifier;
    }
    const getFunctionPromise = promisify(getFunction.bind(lambda));
    const resp = await getFunctionPromise(params);
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

const testLambda = async (
  functionName,
  code,
  transformationPayload,
  publish
) => {
  try {
    logger.debug("Executing lambda test flow");
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
    // invoke function
    const qualifier = resp.Configuration?.Version || "$LATEST";
    const result = await invokeLambdaFunction(
      functionName,
      transformationPayload,
      qualifier
    );

    logger.debug("Finished lambda test flow");
    return {
      ...result,
      publishedVersion: publish ? qualifier : ""
    };
  } catch (err) {
    logger.error(`Error while testing lambda: ${err.message}`);
    throw err;
  }
};

const invokeLambda = async (functionName, transformationPayload, qualifier) => {
  try {
    logger.debug("Executing lambda invoke flow");
    const result = await invokeLambdaFunction(
      functionName,
      transformationPayload,
      qualifier
    );
    logger.debug("Finished lambda invoke flow");
    return result;
  } catch (err) {
    logger.error(`Error while invoking lambda: ${err.message}`);
    throw err;
  }
};

module.exports = {
  invokeLambda,
  testLambda
};

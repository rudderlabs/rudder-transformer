/* eslint-disable no-useless-catch */
/* eslint-disable no-unused-vars */
const JSZip = require('jszip');
const fs = require('fs/promises');
const fsNonPromise = require('fs');
const {
  LambdaClient,
  CreateFunctionCommand,
  GetFunctionCommand,
  InvokeCommand,
  UpdateFunctionCodeCommand,
  waitUntilFunctionActiveV2,
  waitUntilFunctionUpdatedV2,
} = require('@aws-sdk/client-lambda');
const { v4: uuidv4 } = require('uuid');
const logger = require('../../logger');
const stats = require('../stats');
const { isABufferValue, bufferToString, TRANSFORM_WRAPPER_CODE } = require('./utils');

const LAMBDA_MAX_WAIT_TIME = parseInt(process.env.MAX_WAIT_TIME || '30', 10);
const LAMBDA_DELAY = parseInt(process.env.DELAY || '2', 10);
const LAMBDA_EVENT_SIZE_LIMIT_IN_MB =
  parseInt(process.env.EVENT_SIZE_LIMIT_IN_MB || '3', 10) * 1024 * 1024;

const client = new LambdaClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

const waiterConfig = {
  client,
  maxWaitTime: LAMBDA_MAX_WAIT_TIME,
  minDelay: LAMBDA_DELAY,
  maxDelay: LAMBDA_DELAY,
};

const createZip = async (userCode) =>
  new Promise((resolve, reject) => {
    const zip = new JSZip();
    const fileName = `${uuidv4()}.zip`;
    zip.file('transform_wrapper.py', TRANSFORM_WRAPPER_CODE);
    zip.file('user_transformation.py', userCode);

    zip
      .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
      .pipe(fsNonPromise.createWriteStream(fileName))
      .on('finish', () => {
        logger.debug(`${fileName} has been created`);
        resolve(fileName);
      })
      .on('error', (err) => {
        stats.counter('create_zip_error', 1, { fileName });
        logger.error(`Error while creating zip file: ${err.message}`);
        reject(err);
      });
  });

const createAndReadZip = async (functionName, code) => {
  const zipFileName = await createZip(code);
  const zipContent = await fs.readFile(zipFileName);
  fsNonPromise.unlink(zipFileName, (err) => {
    if (err) {
      logger.error(`Error occurred while deleting zip file: ${err.message}`);
      stats.counter('delete_zip_error', 1, { functionName });
      return;
    }
    logger.debug(`Zip file has been deleted: ${zipFileName}`);
  });
  return zipContent;
};

const createLambdaFunction = async (functionName, code, publish) => {
  try {
    logger.debug(`Creating lambda for ${functionName} with publish:${publish}`);
    // create, read and delete zip
    const zipContent = await createAndReadZip(functionName, code);
    // Create function
    const params = {
      Code: {
        ZipFile: zipContent /* required */,
      },
      FunctionName: functionName /* required */,
      Handler: `transform_wrapper.lambda_handler` /* required */,
      Runtime: 'python3.7' /* required */,
      Role: process.env.USER_TRANSFORMATION_LAMBDA_EXECUTION_ROLE /* required */,
      Description: 'Generated from node script',
      PackageType: 'Zip',
      Architectures: ['x86_64'],
      MemorySize: 128,
      Timeout: 4,
      Publish: publish,
    };
    const command = new CreateFunctionCommand(params);
    const resp = await client.send(command);
    logger.debug(`Created lambda for ${functionName}: ${JSON.stringify(resp)}`);

    // verify creation
    const qualifier = resp.Version;
    const functionParams = {
      FunctionName: functionName,
      Qualifier: qualifier,
    };
    const result = await waitUntilFunctionActiveV2(waiterConfig, functionParams);
    logger.debug(`Lambda with name ${functionName} is active: ${JSON.stringify(result)}`);
    return resp;
  } catch (err) {
    logger.error(`Error while creating function: ${err.message}`);
    throw err;
  }
};

const updateLambdaFunction = async (functionName, code, publish) => {
  try {
    logger.debug(`Updating lambda for ${functionName} with publish:${publish}`);
    // create, read and delete zip
    const zipContent = await createAndReadZip(functionName, code);
    // Update function code
    const params = {
      ZipFile: zipContent,
      FunctionName: functionName /* required */,
      Publish: publish,
    };
    const command = new UpdateFunctionCodeCommand(params);
    const resp = await client.send(command);
    logger.debug(`Updated lambda for ${functionName}: ${JSON.stringify(resp)}`);

    // verify updation
    const qualifier = resp.Version;
    const functionParams = {
      FunctionName: functionName,
      Qualifier: qualifier,
    };
    const result = await waitUntilFunctionUpdatedV2(waiterConfig, functionParams);
    logger.debug(`Lambda updated for ${functionName}: ${JSON.stringify(result)}`);
    return resp;
  } catch (err) {
    logger.error(`Error while creating function: ${err.message}`);
    throw err;
  }
};

const getLambdaFunction = async (functionName, qualifier = '') => {
  try {
    logger.debug(`Fetching lambda for ${functionName}`);
    const params = { FunctionName: functionName };
    if (qualifier) {
      params.Qualifier = qualifier;
    }
    const command = new GetFunctionCommand(params);
    const resp = await client.send(command);
    logger.debug(`Fetched lambda for ${functionName}: ${JSON.stringify(resp)}`);
    return resp;
  } catch (err) {
    logger.error(`Error while fetching function: ${err.message}`);
    throw err;
  }
};

const invokeLambdaFunction = async (functionName, events, qualifier = '') => {
  try {
    const params = {
      FunctionName: functionName,
      InvocationType: 'RequestResponse',
      LogType: 'None',
      Payload: JSON.stringify(events),
    };
    if (qualifier) {
      params.Qualifier = qualifier;
    }

    const command = new InvokeCommand(params);
    const result = await client.send(command);
    if (result.StatusCode !== 200 || result.FunctionError) {
      const errorPayload = isABufferValue(result.Payload)
        ? bufferToString(result.Payload)
        : result.Payload || result.FunctionError;
      throw new Error(JSON.stringify(errorPayload));
    }
    const resultPayload = bufferToString(result.Payload);
    return JSON.parse(resultPayload);
    // return resultPayload;
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
async function invokeLambdaInLoop(functionName, events, qualifier, result, start, end) {
  if (end <= start) return;
  logger.debug(`Executing invocation for events in indices: ${start}-${end}`);
  const size = JSON.stringify(events.slice(start, end)).length;
  if (size > LAMBDA_EVENT_SIZE_LIMIT_IN_MB) {
    const mid = Math.floor((start + end) / 2);
    if (mid !== start) {
      await invokeLambdaInLoop(functionName, events, qualifier, result, start, mid);
      await invokeLambdaInLoop(functionName, events, qualifier, result, mid, end);
    } else {
      const res = await invokeLambdaFunction(functionName, events.slice(start, end), qualifier);
      result.transformedEvents.push(...res.transformedEvents);
      result.logs.push(...res.logs);
    }
  } else {
    const res = await invokeLambdaFunction(functionName, events.slice(start, end), qualifier);
    result.transformedEvents.push(...res.transformedEvents);
    result.logs.push(...res.logs);
  }
  logger.debug(`Finished invocation for events in indices: ${start}-${end}`);
}

const invokeLambda = async (functionName, events, qualifier) => {
  try {
    logger.debug('Executing lambda invoke flow');
    const end = events.length || 0;
    const start = 0;
    const result = {
      transformedEvents: [],
      logs: [],
    };
    await invokeLambdaInLoop(functionName, events, qualifier, result, start, end);
    logger.debug('Finished lambda invoke flow');
    return result;
  } catch (err) {
    logger.error(`Error while invoking lambda: ${err.message}`);
    throw err;
  }
};

const setupLambda = async (functionName, code, publish) => {
  try {
    logger.debug('Executing setting up a lambda function');
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

    const qualifier = resp?.Version || '$LATEST';
    logger.debug('Finished setting lambda with version:', qualifier);
    return {
      success: true,
      publishedVersion: publish ? qualifier : null,
    };
  } catch (err) {
    logger.error(`Error while setting up lambda: ${err.message}`);
    throw err;
  }
};

module.exports = {
  invokeLambda,
  setupLambda,
};

import path from 'path';
import fs from 'fs/promises';
import { WorkflowExecutionError, WorkflowCreationError } from '@rudderstack/workflow-engine';
import { PlatformError } from '@rudderstack/integrations-lib';
import logger from '../../logger';
import { generateErrorObject } from '../../v0/util';
import tags from '../../v0/util/tags';
import { CatchErr } from '../../util/types';

const CDK_V2_ROOT_DIR = __dirname;

export async function getWorkflowPath(destDir, feature) {
  // The values are of array type to support aliases
  const featureWorkflowMap = {
    // Didn't add any prefix as processor transformation is the default
    [tags.FEATURES.PROCESSOR]: ['workflow.yaml', 'procWorkflow.yaml'],
    [tags.FEATURES.ROUTER]: ['rtWorkflow.yaml'],
    // Note: intentionally avoided the `proxy` term here
    [tags.FEATURES.DATA_DELIVERY]: ['dataDeliveryWorkflow.yaml'],
    [tags.FEATURES.BATCH]: ['batchWorkflow.yaml'],
  };

  const workflowFilenames = featureWorkflowMap[feature];
  // Find the first workflow file that exists
  const files = await fs.readdir(destDir);
  const matchedFilename = workflowFilenames?.find((filename) => files.includes(filename));
  let validWorkflowFilepath;
  if (matchedFilename) {
    validWorkflowFilepath = path.join(destDir, matchedFilename);
  }

  if (!validWorkflowFilepath) {
    throw new PlatformError('Unable to identify the workflow file. Invalid feature input');
  }
  return validWorkflowFilepath;
}

export function getRootPathForDestination(destName) {
  // TODO: Resolve the CDK v2 destination directory
  // path from the root directory
  return path.join(CDK_V2_ROOT_DIR, 'destinations', destName);
}

export async function getPlatformBindingsPaths() {
  const allowedExts = ['.js'];
  const bindingsPaths: string[] = [];
  const bindingsDir = path.join(CDK_V2_ROOT_DIR, 'bindings');
  const files = await fs.readdir(bindingsDir);
  files.forEach((fileName) => {
    const { ext } = path.parse(fileName);
    if (allowedExts.includes(ext.toLowerCase())) {
      bindingsPaths.push(path.resolve(bindingsDir, fileName));
    }
  });

  return bindingsPaths;
}

/**
 * Return message with workflow engine metadata
 * @param {*} err
 */
export function getWorkflowEngineErrorMessage(err) {
  let errMsg = err instanceof Error ? err.message : '';

  if (err instanceof WorkflowCreationError || err instanceof WorkflowExecutionError) {
    errMsg = `${err.message}: Workflow: ${err.workflowName}, Step: ${err.stepName}, ChildStep: ${err.childStepName}`;

    if (err instanceof WorkflowExecutionError) {
      errMsg = `${errMsg}, OriginalError: ${err.originalError?.message}`;
    }
  }

  return errMsg;
}
/**
 * Translated workflow engine errors to the transformer error types
 * @param {*} err Error thrown by the workflow engine library
 * @param {*} isProd A flag to determine if this is in execution for production CDK v2
 * @param {*} defTags default stat tags
 * @returns Error type object
 */
export function getErrorInfo(err: CatchErr, isProd: boolean, defTags) {
  // Handle various CDK error types
  const message = isProd ? getWorkflowEngineErrorMessage(err) : err.message;

  if (err instanceof WorkflowExecutionError) {
    logger.error(`Error occurred during workflow step execution: ${message}`, err);

    // Determine the error instance
    let errInstance: CatchErr = err;
    if (err.originalError) {
      errInstance = err.originalError;
      errInstance.message = message;
      errInstance.status = errInstance.status || err.status;
    }

    return generateErrorObject(errInstance, defTags);
  }

  // Treat all other errors as platform related errors
  logger.error(
    `Error occurred during workflow creation or unrecognized error during workflow execution: ${getWorkflowEngineErrorMessage(
      err,
    )}`,
    err,
  );

  return generateErrorObject(new PlatformError(message), defTags);
}

export function isCdkV2Destination(event) {
  return Boolean(event?.destination?.DestinationDefinition?.Config?.cdkV2Enabled);
}

export function getCdkV2TestThreshold(event) {
  return event.destination?.DestinationDefinition?.Config?.cdkV2TestThreshold || 0;
}

import { client as errNotificationClient } from '../util/errorNotifier';
import logger from '../logger';
// TODO: To be refactored and redisgned

const getDestFileUploadHandler = (version, dest) => require(`../${version}/destinations/${dest}/fileUpload`);
const getPollStatusHandler = (version, dest) => require(`../${version}/destinations/${dest}/poll`);
const getJobStatusHandler = (version, dest) => require(`../${version}/destinations/${dest}/fetchJobStatus`);

const getCommonMetadata = (ctx) => 
  // TODO: Parse information such as
  // cluster, namespace, etc information
  // from the request
   ({
    namespace: 'Unknown',
    cluster: 'Unknown',
  })
;

export const fileUpload = async (ctx) => {
  logger.debug(
    'Native(Bulk-Upload): Request to transformer:: /fileUpload route',
    JSON.stringify(ctx.request.body),
  );
  const getReqMetadata = () => {
    try {
      const reqBody = ctx.request.body;
      return { destType: reqBody?.destType };
    } catch (error) {
      // Do nothing
    }
    return {};
  };

  const { destType } = ctx.request.body;
  const destFileUploadHandler = getDestFileUploadHandler('v0', destType.toLowerCase());

  if (!destFileUploadHandler || !destFileUploadHandler.processFileData) {
    ctx.status = 404;
    ctx.body = `${destType} doesn't support bulk upload`;
    return null;
  }
  let response;
  try {
    response = await destFileUploadHandler.processFileData(ctx.request.body);
  } catch (error: any) {
    response = {
      statusCode: error.response ? error.response.status : 400,
      error: error.message || 'Error occurred while processing payload.',
      metadata: error.response ? error.response.metadata : null,
    };
    errNotificationClient.notify(error, 'File Upload', {
      ...response,
      ...getCommonMetadata(ctx),
      ...getReqMetadata(),
    });
  }
  ctx.body = response;
  logger.debug(
    'Native(Bulk-Upload): Response from transformer:: /fileUpload route',
    JSON.stringify(ctx.body),
  );
  return ctx.body;
};

export const pollStatus = async (ctx) => {
  logger.debug(
    'Native(Bulk-Upload): Request to transformer:: /pollStatus route',
    JSON.stringify(ctx.request.body),
  );
  const getReqMetadata = () => {
    try {
      const reqBody = ctx.request.body;
      return { destType: reqBody?.destType, importId: reqBody?.importId };
    } catch (error) {
      // Do nothing
    }
    return {};
  };

  const { destType } = ctx.request.body;
  const destFileUploadHandler = getPollStatusHandler('v0', destType.toLowerCase());
  let response;
  if (!destFileUploadHandler || !destFileUploadHandler.processPolling) {
    ctx.status = 404;
    ctx.body = `${destType} doesn't support bulk upload`;
    return null;
  }
  try {
    response = await destFileUploadHandler.processPolling(ctx.request.body);
  } catch (error: any) {
    response = {
      statusCode: error.response?.status || 400,
      error: error.message || 'Error occurred while processing payload.',
    };
    errNotificationClient.notify(error, 'Poll Status', {
      ...response,
      ...getCommonMetadata(ctx),
      ...getReqMetadata(),
    });
  }
  ctx.body = response;
  logger.debug(
    'Native(Bulk-Upload): Request from transformer:: /pollStatus route',
    JSON.stringify(ctx.body),
  );
  return ctx.body;
};

export const getWarnJobStatus = async (ctx) => {
  logger.debug(
    'Native(Bulk-Upload): Request to transformer:: /getWarningJobs route',
    JSON.stringify(ctx.request.body),
  );
  const getReqMetadata = () => {
    try {
      const reqBody = ctx.request.body;
      return { destType: reqBody?.destType, importId: reqBody?.importId };
    } catch (error) {
      // Do nothing
    }
    return {};
  };

  const { destType } = ctx.request.body;
  const destFileUploadHandler = getJobStatusHandler('v0', destType.toLowerCase());

  if (!destFileUploadHandler || !destFileUploadHandler.processJobStatus) {
    ctx.status = 404;
    ctx.body = `${destType} doesn't support bulk upload`;
    return null;
  }
  let response;
  try {
    response = await destFileUploadHandler.processJobStatus(ctx.request.body, 'warn');
  } catch (error: any) {
    response = {
      statusCode: error.response ? error.response.status : 400,
      error: error.message || 'Error occurred while processing payload.',
    };
    errNotificationClient.notify(error, 'Job Status', {
      ...response,
      ...getCommonMetadata(ctx),
      ...getReqMetadata(),
    });
  }
  ctx.body = response;
  logger.debug(
    'Native(Bulk-Upload): Request from transformer:: /getWarningJobs route',
    JSON.stringify(ctx.body),
  );
  return ctx.body;
};

export const getFailedJobStatus = async (ctx) => {
  logger.debug(
    'Native(Bulk-Upload): Request to transformer:: /getFailedJobs route',
    JSON.stringify(ctx.request.body),
  );
  const getReqMetadata = () => {
    try {
      const reqBody = ctx.request.body;
      return { destType: reqBody?.destType, importId: reqBody?.importId };
    } catch (error) {
      // Do nothing
    }
    return {};
  };

  const { destType } = ctx.request.body;
  const destFileUploadHandler = getJobStatusHandler('v0', destType.toLowerCase());

  if (!destFileUploadHandler || !destFileUploadHandler.processJobStatus) {
    ctx.status = 404;
    ctx.body = `${destType} doesn't support bulk upload`;
    return null;
  }
  let response;
  try {
    response = await destFileUploadHandler.processJobStatus(ctx.request.body, 'fail');
  } catch (error: any) {
    response = {
      statusCode: error.response ? error.response.status : 400,
      error: error.message || 'Error occurred while processing payload.',
    };
    errNotificationClient.notify(error, 'Job Status', {
      ...response,
      ...getCommonMetadata(ctx),
      ...getReqMetadata(),
    });
  }
  ctx.body = response;
  logger.debug(
    'Native(Bulk-Upload): Request from transformer:: /getFailedJobs route',
    JSON.stringify(ctx.body),
  );
  return ctx.body;
};

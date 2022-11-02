const request = require("request");
const util = require("util");
const { isEmpty } = require("lodash");
const Batchelor = require("batchelor");
const logger = require("../../../logger");
const { httpPOST } = require("../../../adapters/network");
const ErrorBuilder = require("../../util/error");
const { executeCommonValidations } = require("../../util/regulation-api");
const { GA_USER_DELETION_ENDPOINT } = require("./config");
const { gaResponseHandler } = require("./utils");

const promisifiedRequestPost = util.promisify(request.post);

/**
 * This function will help to delete the users one by one from the userAttributes array.
 *
 * @param {*} userAttributes Array of objects with userId, emaail and phone
 * @param {*} config Destination.Config provided in dashboard
 * @param {Record<string, any> | undefined} rudderDestInfo contains information about the authorisation details to successfully send deletion request
 * @returns
 */
const userDeletionHandler = async (userAttributes, config, rudderDestInfo) => {
  const { secret } = rudderDestInfo;
  // TODO: Should we do more validations ?
  if (secret && isEmpty(secret)) {
    throw new ErrorBuilder()
      .setMessage(
        // This would happen when server doesn't send "x-rudder-dest-info" header
        // Todo's in-case this exception happen:
        // 1. The server version might be an older one
        // 2. There would have been some problem with how we are sending this header
        `The "secret" field is not sent in "x-rudder-dest-info" header`
      )
      .setStatus(500)
      .build();
  }
  await Promise.all(
    userAttributes.map(async userAttribute => {
      if (!userAttribute.userId) {
        throw new ErrorBuilder()
          .setMessage("User id for deletion not present")
          .setStatus(400)
          .build();
      }
      // Reference for building userDeletionRequest
      // Ref: https://developers.google.com/analytics/devguides/config/userdeletion/v3/reference/userDeletion/userDeletionRequest#resource
      const reqBody = {
        kind: "analytics#userDeletionRequest",
        id: {
          type: "USER_ID",
          userId: userAttribute.userId
        }
      };
      // TODO: Check with team if this condition needs to be handled
      if (config.useNativeSDK) {
        reqBody.propertyId = config.trackingID;
      } else {
        reqBody.webPropertyId = config.trackingID;
      }
      const headers = {
        Authorization: `Bearer ${secret?.access_token}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      };
      const response = await httpPOST(GA_USER_DELETION_ENDPOINT, reqBody, {
        headers
      });
      // process the response to know about refreshing scenario
      return gaResponseHandler(response);
    })
  );
  return { statusCode: 200, status: "successful" };
};

// The below method is prepared using the below link as reference
// https://stackoverflow.com/questions/54337324/how-to-send-multipart-mixed-request-for-google-indexing-batch-request-in-nodejs
const userDeletionHandlerWithBatch = async (
  userAttributes,
  config,
  rudderDestInfo
) => {
  const { secret } = rudderDestInfo;
  if (secret && isEmpty(secret)) {
    throw new ErrorBuilder()
      .setMessage(
        // This would happen when server doesn't send "x-rudder-dest-info" header
        // Todo's in-case this exception happen:
        // 1. The server version might be an older one
        // 2. There would have been some problem with how we are sending this header
        `The "secret" field is not sent in "x-rudder-dest-info" header`
      )
      .setStatus(500)
      .build();
  }

  const multipartData = userAttributes.map((userAttribute, _attrId) => {
    if (!userAttribute.userId) {
      throw new ErrorBuilder()
        .setMessage("User id for deletion not present")
        .setStatus(400)
        .build();
    }
    // Reference for building userDeletionRequest
    // Ref: https://developers.google.com/analytics/devguides/config/userdeletion/v3/reference/userDeletion/userDeletionRequest#resource
    const reqBody = {
      kind: "analytics#userDeletionRequest",
      id: {
        type: "USER_ID",
        userId: userAttribute.userId
      }
    };
    // TODO: Check with team if this condition needs to be handled
    if (config.useNativeSDK) {
      reqBody.propertyId = config.trackingID;
    } else {
      reqBody.webPropertyId = config.trackingID;
    }
    const stringifiedBody = JSON.stringify(reqBody);
    let body =
      `--batch\n` +
      `Content-Type: application/http\nContent-Transfer-Encoding: binary\n\n` +
      `POST ${GA_USER_DELETION_ENDPOINT}\n` +
      `Content-Type: application/json\n\n` +
      `${stringifiedBody}\n`;
    if (_attrId === userAttributes.length - 1) {
      body += "--batch--";
    }
    // let body = `POST ${GA_USER_DELETION_ENDPOINT} HTTP/1.1
    // Content-Type: application/json

    // ${JSON.stringify(reqBody)}`;
    // body += "\n";
    return { body };
  });

  const options = {
    headers: {
      "Content-Type": "multipart/mixed; boundary=batch"
    },
    auth: { bearer: secret?.access_token },
    multipart: { data: multipartData }
  };

  const result = await promisifiedRequestPost(
    "https://www.googleapis.com/batch/analytics/v3",
    options
  );
  logger.info("Result of promisifiedRequestPost call");
  logger.info(JSON.stringify(result, null, 2));

  return { statusCode: 200, status: "successful" };
};

const userDeletionHandlerWithBatchelor = async (
  userAttributes,
  config,
  rudderDestInfo
) => {
  const { secret } = rudderDestInfo;
  if (secret && isEmpty(secret)) {
    throw new ErrorBuilder()
      .setMessage(
        // This would happen when server doesn't send "x-rudder-dest-info" header
        // Todo's in-case this exception happen:
        // 1. The server version might be an older one
        // 2. There would have been some problem with how we are sending this header
        `The "secret" field is not sent in "x-rudder-dest-info" header`
      )
      .setStatus(500)
      .build();
  }

  const batch = new Batchelor({
    uri: "https://www.googleapis.com/batch/analytics/v3/",
    method: "POST",
    auth: {
      bearer: secret?.access_token
    },
    headers: {
      "Content-Type": "multipart/mixed"
    }
  });

  const multiPartRequests = userAttributes.map(userAttribute => {
    if (!userAttribute.userId) {
      throw new ErrorBuilder()
        .setMessage("User id for deletion not present")
        .setStatus(400)
        .build();
    }
    // Reference for building userDeletionRequest
    // Ref: https://developers.google.com/analytics/devguides/config/userdeletion/v3/reference/userDeletion/userDeletionRequest#resource
    const reqBody = {
      kind: "analytics#userDeletionRequest",
      id: {
        type: "USER_ID",
        userId: userAttribute.userId
      }
    };
    // TODO: Check with team if this condition needs to be handled
    if (config.useNativeSDK) {
      reqBody.propertyId = config.trackingID;
    } else {
      reqBody.webPropertyId = config.trackingID;
    }

    return {
      method: "POST",
      path: "/analytics/v3/userDeletion/userDeletionRequests:upsert",
      parameters: {
        "Content-Type": "application/json;",
        body: reqBody
      }
    };
  });

  batch.add(multiPartRequests);
  // const promisifiedBatchRun = util.promisify(batchInstance.run);

  const promisifiedRun = () =>
    new Promise((resolve, reject) => {
      batch.run(function batchRunner(err, result) {
        if (err) {
          logger.error(err);
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  // const result = await promisifiedBatchRun();
  const result = await promisifiedRun();

  logger.info("Result of promisifiedRequestPost call");
  logger.info(JSON.stringify(result, null, 2));

  return { statusCode: 200, status: "successful" };
};

const processDeleteUsers = async event => {
  const { userAttributes, config, rudderDestInfo } = event;
  executeCommonValidations(userAttributes);
  // const resp = await userDeletionHandler(
  //   userAttributes,
  //   config,
  //   rudderDestInfo
  // );
  const resp = await userDeletionHandlerWithBatchelor(
    userAttributes,
    config,
    rudderDestInfo
  );
  return resp;
};

module.exports = { processDeleteUsers };

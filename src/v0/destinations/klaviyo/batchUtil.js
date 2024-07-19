const lodash = require('lodash');
const { defaultBatchRequestConfig, getSuccessRespEvents } = require('../../util');
const { JSON_MIME_TYPE } = require('../../util/constant');
const { BASE_ENDPOINT, CONFIG_CATEGORIES, MAX_BATCH_SIZE, revision } = require('./config');
const { buildRequest, getSubscriptionPayload } = require('./util');
/**
 * This function groups the subscription responses on list id
 * @param {*} subscribeResponseList
 * @returns
 * Example subsribeResponseList =
 * [
 * { payload: {id:'list_id', profile: {}}, metadata:{} },
 * { payload: {id:'list_id', profile: {}}, metadata:{} }
 * ]
 */
const groupSubscribeResponsesUsingListIdV2 = (subscribeResponseList) => {
  const subscribeEventGroups = lodash.groupBy(
    subscribeResponseList,
    (event) => event.payload.listId,
  );
  return subscribeEventGroups;
};

/**
 * This function returns the list of profileReq which do not metadata common with subcriptionMetadataArray
 * @param {*} profileReq
 * @param {*} subscriptionMetadataArray
 * @returns
 */
const getRemainingProfiles = (profileReq, subscriptionMetadataArray) => {
  const subscriptionListJobIds = subscriptionMetadataArray.map((metadata) => metadata.jobId);
  return profileReq.filter((profile) => !subscriptionListJobIds.includes(profile.metadata.jobId));
};

/**
 * This function builds all the profile requests whose metadata is not there in subscriptionMetadataArray
 * @param {*} profileRespList
 * @param {*} subscriptionMetadataArray
 * @param {*} destination
 * @returns
 */
const getProfiles = (profileRespList, subscriptionMetadataArray, destination) => {
  const profiles = [];
  const remainingProfileReq = getRemainingProfiles(profileRespList, subscriptionMetadataArray);
  remainingProfileReq.forEach((input) => {
    profiles.push(
      getSuccessRespEvents(
        buildRequest(input.payload, destination, CONFIG_CATEGORIES.IDENTIFYV2),
        [input.metadata],
        destination,
      ),
    );
  });
  return profiles;
};

/**
 * This function takes susbscriptions as input and batches them into a single request body
 * @param {events}
 * events= [
 * { payload: {id:'list_id', profile: {}}, metadata:{} },
 * { payload: {id:'list_id', profile: {}}, metadata:{} }
 * ]
 */
const generateBatchedSubscriptionRequest = (events, destination) => {
  const batchEventResponse = defaultBatchRequestConfig();
  const metadata = [];
  // fetching listId from first event as listId is same for all the events
  const listId = events[0].payload?.listId;
  const profiles = []; // list of profiles to be subscribes
  // Batch profiles into dest batch structure
  events.forEach((ev) => {
    profiles.push(...ev.payload.profile);
    metadata.push(ev.metadata);
  });

  batchEventResponse.batchedRequest = Object.values(batchEventResponse);
  batchEventResponse.batchedRequest[0].body.JSON = getSubscriptionPayload(listId, profiles);

  batchEventResponse.batchedRequest[0].endpoint = `${BASE_ENDPOINT}/api/profile-subscription-bulk-create-jobs`;

  batchEventResponse.batchedRequest[0].headers = {
    Authorization: `Klaviyo-API-Key ${destination.Config.privateApiKey}`,
    'Content-Type': JSON_MIME_TYPE,
    Accept: JSON_MIME_TYPE,
    revision,
  };

  return {
    ...batchEventResponse,
    metadata,
    destination,
  };
};

/**
 * This function fetches the profileRequests with metadata present in metadata array build a request for them
 * and add these requests batchEvent Response
 * @param {*} profileReq array of profile requests
 * @param {*} metadataArray array of metadata
 * @param {*} batchEventResponse
 * Example: /**
 *
 * @param {*} subscribeEventGroups
 * @param {*} identifyResponseList
 * @returns
 * Example:
 * profileReq = [
 * { payload: {}, metadata:{} },
 * { payload: {}, metadata:{} }
 * ]
 */
const updateBatchEventResponseWithProfileRequests = (
  profileReqArr,
  subscriptionMetadataArray,
  batchEventResponse,
) => {
  const subscriptionListJobIds = subscriptionMetadataArray.map((metadata) => metadata.jobId);
  const profilesRequests = [];
  profileReqArr.forEach((profile) => {
    if (subscriptionListJobIds.includes(profile.metadata.jobId)) {
      profilesRequests.push(
        buildRequest(profile.payload, batchEventResponse.destination, CONFIG_CATEGORIES.IDENTIFYV2),
      );
    }
  });
  // we are keeping profiles request prior to subscription ones
  batchEventResponse.batchedRequest.unshift(...profilesRequests);
};

const processSubscribeChunk = (chunk, destination, profileRespList) => {
  const batchEventResponse = generateBatchedSubscriptionRequest(chunk, destination);
  const { metadata: subscriptionMetadataArray } = batchEventResponse;
  updateBatchEventResponseWithProfileRequests(
    profileRespList,
    subscriptionMetadataArray,
    batchEventResponse,
  );
  return batchEventResponse;
};

/**
 * This function batches the requests. Alogorithm
 * Batch events from Subscribe Resp List having same listId/groupId to be subscribed and  have their metadata array
 * For this metadata array get all profileRequests and add them prior to batched Subscribe Request in the same batched Request
 * Make another batched request for the remaning profile requests and another for all the event requests
 * @param {*} subscribeRespList
 * @param {*} profileRespList
 * @param {*} eventRespList
 * subscribeRespList = [
 * { payload: {id:'list_id', profile: {}}, metadata:{} },
 * { payload: {id:'list_id', profile: {}}, metadata:{} }
 * ]
 * profileRespList = [
 * { payload: {}, metadata:{} },
 * { payload: {}, metadata:{} }
 * ]
 *
 */
const batchSubscriptionRequestV2 = (subscribeRespList, profileRespList, destination) => {
  const batchedResponseList = [];
  const subscriptionMetadataArrayForAll = [];
  const subscribeEventGroups = groupSubscribeResponsesUsingListIdV2(subscribeRespList);
  Object.keys(subscribeEventGroups).forEach((listId) => {
    // eventChunks = [[e1,e2,e3,..batchSize],[e1,e2,e3,..batchSize]..]
    const eventChunks = lodash.chunk(subscribeEventGroups[listId], MAX_BATCH_SIZE);
    const batchedResponse = [];
    eventChunks.forEach((chunk) => {
      // returns subscriptionMetadata and batchEventResponse
      const { metadata: subscriptionMetadataArray, batchedRequest } = processSubscribeChunk(
        chunk,
        destination,
        profileRespList,
      );
      subscriptionMetadataArrayForAll.push(...subscriptionMetadataArray);
      batchedResponse.push(
        getSuccessRespEvents(batchedRequest, subscriptionMetadataArray, destination, true),
      );
    });
    batchedResponseList.push(...batchedResponse);
  });
  const profiles = getProfiles(profileRespList, subscriptionMetadataArrayForAll, destination);

  return [...profiles, ...batchedResponseList];
};
module.exports = { batchSubscriptionRequestV2, groupSubscribeResponsesUsingListIdV2 };

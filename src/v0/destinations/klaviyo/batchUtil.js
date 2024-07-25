const lodash = require('lodash');
const {
  defaultBatchRequestConfig,
  getSuccessRespEvents,
  isDefinedAndNotNull,
} = require('../../util');
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
 * This function takes susbscription as input and batches them into a single request body
 * @param {subscription}
 * subscription= {listId, subscriptionProfileList}
 */
const generateBatchedSubscriptionRequest = (subscription, destination) => {
  const batchEventResponse = defaultBatchRequestConfig();
  // if( !isDefinedAndNotNull(subscription) )
  // fetching listId from first event as listId is same for all the events
  const profiles = []; // list of profiles to be subscribed
  const { listId, subscriptionProfileList } = subscription;
  subscriptionProfileList.forEach((profileList) => profiles.push(...profileList));
  batchEventResponse.batchedRequest.body.JSON = getSubscriptionPayload(listId, profiles);
  batchEventResponse.batchedRequest.endpoint = `${BASE_ENDPOINT}/api/profile-subscription-bulk-create-jobs`;
  batchEventResponse.batchedRequest.headers = {
    Authorization: `Klaviyo-API-Key ${destination.Config.privateApiKey}`,
    'Content-Type': JSON_MIME_TYPE,
    Accept: JSON_MIME_TYPE,
    revision,
  };
  return batchEventResponse.batchedRequest;
};

/**
 * This function updates batchedRequest with profile requests
 * @param {*} profiles
 * @param {*} batchedRequest
 * @param {*} destination
 */
const updateBatchEventResponseWithProfileRequests = (profiles, batchedRequest, destination) => {
  const profilesRequests = [];
  profiles.forEach((profile) => {
    profilesRequests.push(buildRequest(profile, destination, CONFIG_CATEGORIES.IDENTIFYV2));
  });
  // we are keeping profiles request prior to subscription ones as first profile creation and then subscription should happen
  batchedRequest.unshift(...profilesRequests);
};

/**
 * this function populates profileSubscriptionAndMetadataArr with respective profiles based upon common metadata
 * @param {*} profileSubscriptionAndMetadataArr
 * @param {*} metadataIndexMap
 * @param {*} profiles
 * @returns updated profileSubscriptionAndMetadataArr obj
 */
const populateArrWithRespectiveProfileData = (
  profileSubscriptionAndMetadataArr,
  metadataIndexMap,
  profiles,
) => {
  const updatedPSMArr = profileSubscriptionAndMetadataArr;
  profiles.forEach((profile) => {
    const index = metadataIndexMap[profile.metadata.jobId];
    if (isDefinedAndNotNull(index)) {
      // using isDefinedAndNotNull as index can be 0
      updatedPSMArr[index].profiles.push(profile.payload);
    } else {
      // in case there is no subscription for a given profile
      updatedPSMArr.push({
        profiles: [profile.payload],
        metadataList: [profile.metadata],
      });
    }
  });
  return updatedPSMArr;
};

/**
 * This function generates the final output batched payload for each object in profileSubscriptionAndMetadataArr
 * ex: 
 * profileSubscriptionAndMetadataArr = [
      {
        subscription: { subscriptionProfileList, listId1 },
        metadataList1,
        profiles: [respectiveProfiles for above metadata]
      },
      {
        subscription: { subscriptionProfile List With No Profiles, listId2 },
        metadataList2,
      },
      {
        metadataList3,
        profiles: [respectiveProfiles for above metadata with no subscription]
      }
  ]
 * @param {*} profileSubscriptionAndMetadataArr 
 * @param {*} destination 
 * @returns 
 */
const buildRequestsForProfileSubscriptionAndMetadataArr = (
  profileSubscriptionAndMetadataArr,
  destination,
) => {
  const batchedResponseList = [];
  profileSubscriptionAndMetadataArr.forEach((input) => {
    const batchedRequest = [];
    if (input.subscription) {
      batchedRequest.push(generateBatchedSubscriptionRequest(input.subscription, destination));
    }
    updateBatchEventResponseWithProfileRequests(input.profiles, batchedRequest, destination);
    batchedResponseList.push(
      getSuccessRespEvents(batchedRequest, input.metadataList, destination, true),
    );
  });
  return batchedResponseList;
};

const batchRequestV2 = (subscribeRespList, profileRespList, destination) => {
  const subscribeEventGroups = groupSubscribeResponsesUsingListIdV2(subscribeRespList);
  let profileSubscriptionAndMetadataArr = [];
  const metadataIndexMap = {};
  Object.keys(subscribeEventGroups).forEach((listId) => {
    // eventChunks = [[e1,e2,e3,..batchSize],[e1,e2,e3,..batchSize]..]
    const eventChunks = lodash.chunk(subscribeEventGroups[listId], MAX_BATCH_SIZE);
    eventChunks.forEach((chunk, index) => {
      // get subscriptionProfiles for the chunk
      const subscriptionProfileList = chunk.map((event) => event.payload?.profile);
      // get metadata for this chunk
      const metadataList = chunk.map((event) => event.metadata);
      // get list of jobIds from the above metdadata
      const jobIdList = metadataList.map((metadata) => metadata.jobId);
      // push the jobId: index to metadataIndex mapping which let us know the metadata respective payload index position in batched request
      jobIdList.forEach((jobId) => {
        metadataIndexMap[jobId] = index;
      });
      profileSubscriptionAndMetadataArr.push({
        subscription: { subscriptionProfileList, listId },
        metadataList,
        profiles: [],
      });
    });
  });
  profileSubscriptionAndMetadataArr = populateArrWithRespectiveProfileData(
    profileSubscriptionAndMetadataArr,
    metadataIndexMap,
    profileRespList,
  );
  /* Till this point I have a profileSubscriptionAndMetadataArr 
  containing the the events in one object for which batching has to happen in following format
  [
      {
        subscription: { subscriptionProfileList, listId1 },
        metadataList1,
        profiles: [respectiveProfiles for above metadata]
      },
      {
        subscription: { subscriptionProfile List With No Profiles, listId2 },
        metadataList2,
      },
      {
        metadataList3,
        profiles: [respectiveProfiles for above metadata with no subscription]
      }
  ]
  */
  return buildRequestsForProfileSubscriptionAndMetadataArr(
    profileSubscriptionAndMetadataArr,
    destination,
  );
  /* for identify calls with batching batched with identify with no batching
  we will sonctruct O/P as:
    [
      [2 calls for identifywith batching],
      [1 call identify calls with batching]
    ] 
  */
};

module.exports = {
  groupSubscribeResponsesUsingListIdV2,
  populateArrWithRespectiveProfileData,
  generateBatchedSubscriptionRequest,
  batchRequestV2,
};

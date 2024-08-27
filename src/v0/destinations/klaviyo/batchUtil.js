const lodash = require('lodash');
const { defaultRequestConfig, getSuccessRespEvents, isDefinedAndNotNull } = require('../../util');
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
 * subscription= {listId, subscriptionProfileList, operation}
 * subscription.operation could be either subscribe or unsubscribe
 */
const generateBatchedSubscriptionRequest = (subscription, destination) => {
  const subscriptionPayloadResponse = defaultRequestConfig();
  // fetching listId from first event as listId is same for all the events
  const profiles = []; // list of profiles to be subscribed
  const { listId, subscriptionProfileList, operation } = subscription;
  subscriptionProfileList.forEach((profileList) => profiles.push(...profileList));
  subscriptionPayloadResponse.body.JSON = getSubscriptionPayload(listId, profiles, operation);
  subscriptionPayloadResponse.endpoint = `${BASE_ENDPOINT}/api/${operation === 'subscribe' ? 'profile-subscription-bulk-create-jobs' : 'profile-subscription-bulk-delete-jobs'}`;
  subscriptionPayloadResponse.headers = {
    Authorization: `Klaviyo-API-Key ${destination.Config.privateApiKey}`,
    'Content-Type': JSON_MIME_TYPE,
    Accept: JSON_MIME_TYPE,
    revision,
  };
  return subscriptionPayloadResponse;
};

/**
 * This function generates requests using profiles array and returns an array of all these requests
 * @param {*} profiles
 * @param {*} destination
 */
const getProfileRequests = (profiles, destination) => {
  const profilePayloadResponses = profiles.map((profile) =>
    buildRequest(profile, destination, CONFIG_CATEGORIES.IDENTIFYV2),
  );
  return profilePayloadResponses;
};

/**
 * this function populates profileSubscriptionAndMetadataArr with respective profiles based upon common metadata
 * @param {*} profileSubscriptionAndMetadataArr
 * @param {*} metaDataIndexMap
 * @param {*} profiles
 * @returns updated profileSubscriptionAndMetadataArr obj
 */
const populateArrWithRespectiveProfileData = (
  profileSubscriptionAndMetadataArr,
  metaDataIndexMap,
  profiles,
) => {
  const updatedPSMArr = lodash.cloneDeep(profileSubscriptionAndMetadataArr);
  profiles.forEach((profile) => {
    const index = metaDataIndexMap.get(profile.metadata.jobId);
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
        subscription: { subscriptionProfileList, listId1, operation },
        metadataList1,
        profiles: [respectiveProfiles for above metadata]
      },
      {
        subscription: { subscriptionProfile List With No Profiles, listId2, operation },
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
const buildProfileAndSubscriptionRequests = (profileSubscriptionAndMetadataArr, destination) => {
  const finalResponseList = [];
  profileSubscriptionAndMetadataArr.forEach((profileSubscriptionData) => {
    const batchedRequest = [];
    // we are keeping profiles request prior to subscription ones as first profile creation and then subscription should happen
    if (profileSubscriptionData.profiles?.length > 0) {
      batchedRequest.push(...getProfileRequests(profileSubscriptionData.profiles, destination));
    }
    // following condition ensures if no subscriptions are present we won't build subscription payload
    if (profileSubscriptionData.subscription?.subscriptionProfileList?.length > 0) {
      batchedRequest.push(
        generateBatchedSubscriptionRequest(profileSubscriptionData.subscription, destination),
      );
    }

    finalResponseList.push(
      getSuccessRespEvents(batchedRequest, profileSubscriptionData.metadataList, destination, true),
    );
  });
  return finalResponseList;
};

/**
 * This function updates the profileSubscriptionAndMetadataArr array with the subscription requests
 * @param {*} subscribeStatusList
 * @param {*} profilesList
 * @param {*} operation
 * @param {*} profileSubscriptionAndMetadataArr
 * @param {*} metaDataIndexMap
 */
const updateArrWithSubscriptions = (
  subscribeStatusList,
  profilesList,
  operation,
  profileSubscriptionAndMetadataArr,
  metaDataIndexMap,
) => {
  const subscribeEventGroups = groupSubscribeResponsesUsingListIdV2(subscribeStatusList);

  Object.keys(subscribeEventGroups).forEach((listId) => {
    // eventChunks = [[e1,e2,e3,..batchSize],[e1,e2,e3,..batchSize]..]
    const eventChunks = lodash.chunk(subscribeEventGroups[listId], MAX_BATCH_SIZE);
    eventChunks.forEach((chunk) => {
      // get subscriptionProfiles for the chunk
      const subscriptionProfileList = chunk.map((event) => event.payload?.profile);
      // get metadata for this chunk
      const metadataList = chunk.map((event) => event.metadata);
      // get list of jobIds from the above metdadata
      const jobIdList = metadataList.map((metadata) => metadata.jobId);
      // using length as index
      const index = profileSubscriptionAndMetadataArr.length;
      // push the jobId: index to metadataIndex mapping which let us know the metadata respective payload index position in batched request
      jobIdList.forEach((jobId) => {
        metaDataIndexMap.set(jobId, index);
      });
      profileSubscriptionAndMetadataArr.push({
        subscription: { subscriptionProfileList, listId, operation },
        metadataList,
        profiles: [],
      });
    });
  });
};

/**
 * This function performs batching for the subscription and unsubscription requests and attaches respective profile request as well if present
 * @param {*} subscribeList
 * @param {*} unsubscribeList
 * @param {*} profilesList
 * @param {*} destination
 * @returns
 */
const batchRequestV2 = (subscribeList, unsubscribeList, profilesList, destination) => {
  const profileSubscriptionAndMetadataArr = [];
  const metaDataIndexMap = new Map();
  updateArrWithSubscriptions(
    subscribeList,
    profilesList,
    'subscribe',
    profileSubscriptionAndMetadataArr,
    metaDataIndexMap,
  );
  updateArrWithSubscriptions(
    unsubscribeList,
    profilesList,
    'unsubscribe',
    profileSubscriptionAndMetadataArr,
    metaDataIndexMap,
  );
  const subscriptionsAndProfileArr = populateArrWithRespectiveProfileData(
    profileSubscriptionAndMetadataArr,
    metaDataIndexMap,
    profilesList,
  );
  /* Till this point I have a profileSubscriptionAndMetadataArr 
  containing the the events in one object for which batching has to happen in following format
  [
      {
        subscription: { subscriptionProfileList, listId1, operation },
        metadataList1,
        profiles: [respectiveProfiles for above metadata]
      },
      {
        subscription: { subscriptionProfile List With No Profiles, listId2, operation },
        metadataList2,
      },
      {
        metadataList3,
        profiles: [respectiveProfiles for above metadata with no subscription]
      }
  ]
  */
  return buildProfileAndSubscriptionRequests(subscriptionsAndProfileArr, destination);
  /* for identify calls with batching batched with identify with no batching
  we will construct O/P as:
    [
      [2 calls for identify with batching],
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

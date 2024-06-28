const crypto = require('crypto');
const {
    getSuccessRespEvents,
    defaultBatchRequestConfig,
} = require('../../util');
/**
 * This fucntion calculates hash of incoming event
 * @param {*} event 
 * @returns 
 *  Example event : {
  endpoint: 'https://www.abc.com/{userId}/{anonId}',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token'
  },
  params: { userId: '123', anonId: '456' },
  method: 'GET'
};
 */
const getHash = (event) => {
    const { endpoint, headers, params, method } = event;

    const data = {
        endpoint,
        headers,
        params,
        method
    };
    const dataString = JSON.stringify(data);
    const hash = crypto.createHash('sha256').update(dataString).digest('hex');
    return hash;
};

const generateBatchedPayloadForArray = (events) => {
    let batchEventResponse = defaultBatchRequestConfig();
    const metadata = [];
    // extracting destination from the first event in a batch
    const { message, destination } = events[0];

    const jsonArray = [];
    // Batch event into destination batch structure
    events.forEach((event) => {
        jsonArray.push(event.message.body.JSON);
        metadata.push(event.metadata);
    });
    batchEventResponse.batchedRequest.endpoint = message.endpoint;
    batchEventResponse.batchedRequest.method = message.method;
    batchEventResponse.batchedRequest.headers = message.headers;
    batchEventResponse.batchedRequest.params = message.params;
    batchEventResponse.batchedRequest.body.JSON = jsonArray;
    batchEventResponse = {
        ...batchEventResponse,
        metadata,
        destination,
    };
    return batchEventResponse;
};
const batchEvents = (groupedEvents, maxBatchSize) => {
    // batching and chunking logic
    Object.keys(groupedEvents).forEach(group => {
        const eventChunks = lodash.chunk(groupedEvents[group], maxBatchSize);
        eventChunks.forEach((chunk) => {
            const batchEventResponse = generateBatchedPayloadForArray(chunk, combination);
            batchedResponseList.push(
                getSuccessRespEvents(
                    batchEventResponse.batchedRequest,
                    batchEventResponse.metadata,
                    batchEventResponse.destination,
                    true,
                ),
            );
        });
    });
}
const groupEvents = (batch, maxBatchSize) => {
    const groupedEvents = {};
    let batchEvents = [];
    // grouping events
    batch.forEach(event => {
        const eventHash = getHash(event);
        if (!groupedEvents[eventHash]) {
            groupedEvents[eventHash] = [event];
        } else {
            groupedEvents[eventHash].push(event);
        }
    });
    return batchEvents(groupedEvents, maxBatchSize);
};

module.exports = { groupEvents };

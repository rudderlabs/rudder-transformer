const crypto = require('crypto');
const get = require('get-value');
const set = require('set-value');

const {
    getSuccessRespEvents,
    defaultBatchRequestConfig,
    getHashFromArray,
    applyCustomMappings
} = require('../../util');
/**
 * This function calculates hash of incoming event
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
const prefix = '$.';
const havePrefix = (str) => str.startsWith(prefix);
const removePrefix = (str) => {
    if (havePrefix(str)) {
        return str.slice(prefix.length);
    }
    return str;
}
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

const handleMappings = (message, mapArray, from = 'from', to = 'to') => {
    const customMappings = [];
    const normalMappings = []
    mapArray.forEach(mapping => {
        if (havePrefix(mapping[from])) {
            customMappings.push(mapping)
        } else {
            normalMappings.push(mapping)
        }
    });
    const constToConst = []; // use getHashFromArray
    const constToJsonPath = []; // use set method
    normalMappings.forEach(mapping => {
        if (havePrefix(mapping[to])) {
            constToJsonPath.push(mapping)
        } else {
            constToConst.push(mapping)
        }
    })
    const finalMapping = {};
    constToJsonPath.forEach(mapping => {
        set(finalMapping, mapping[to].replace(prefix, ''), mapping[from])
    })
    const constToConstMapping = getHashFromArray(constToConst, from, to, false)
    const jsonPathToJsonPath = []; // use custom mapping module for this
    const jsonPathToConst = []; // use set and get 
    customMappings.forEach(mapping => {
        if (havePrefix(mapping[to])) {
            jsonPathToJsonPath.push(mapping)
        } else {
            const value = get(message, mapping[from].replace(prefix, ''));
            set(finalMapping, mapping[to], value)
            // jsonPathToConst.push({ [`$.${mapping[to]}`]:  })
        }
    })
    const jsonPathToConstMapping = applyCustomMappings(message, jsonPathToConst);
    const jsonPathToJsonPathMapping = applyCustomMappings(message, jsonPathToJsonPath);
    return { ...finalMapping, ...jsonPathToJsonPathMapping, ...constToConstMapping, ...jsonPathToConstMapping }

}

module.exports = { groupEvents, removePrefix, handleMappings };

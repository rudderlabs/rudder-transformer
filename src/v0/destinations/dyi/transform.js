/* eslint-disable no-nested-ternary */
const get = require('get-value');
const set = require('set-value');
import { JsonTemplateEngine } from 'https://cdn.jsdelivr.net/npm/@rudderstack/json-template-engine@0.16.0/build/json-template.min.js';
const { ConfigurationError } = require('@rudderstack/integrations-lib');
const {
    defaultPostRequestConfig,
    defaultPutRequestConfig,
    defaultPatchRequestConfig,
    defaultGetRequestConfig,
    defaultRequestConfig,
    getFieldValueFromMessage,
    flattenJson,
    isDefinedAndNotNull,
    getHashFromArray,
    simpleProcessRouterDest,
    applyCustomMappings
} = require('../../util');

const { EventType } = require('../../../constants');

const buildRequestPayload = (payload, method, headers, params) => {
    const response = defaultRequestConfig();
    response.method = method;
    if (method === 'GET') {
        response.params = { ...params, payload };
    } else {
        response.params = params;
        response.body.JSON = payload;
    }
    response.headers = headers;
    return response;
}

const trackResponseBuilder = (message, destination) => {
    const { track } = destination.Config;
    respList = [];
    /*
    [
        {
            "trackEventName": "Product Added",
            "trackEndpoint": "https://www.test.com/user/{userId}",
            "trackMethod": "PUT",
            "trackHeaders": [
                {
                    "from": "content-type",
                    "to": "application/json"
                }
            ],
            "trackQueryParams": [
                {
                    "from": "queryparam",
                    "to": "123"
                }
            ],
            "trackPathVariables": [
                {
                    "from": "userId",
                    "to": "$.event.userId"
                }
            ]
        }
    ]
    */
   const eventRequest = track.filter((key) => {
    return message.event === key.trackEventName;
  });
   eventRequest.forEach(request => {
        const { trackEndpoint, trackMethod, trackHeaders, trackQueryParams, trackPathVariables, trackParameterMapping } = request;
        const headers = getHashFromArray(trackHeaders);
        const params = getHashFromArray(trackQueryParams);
        const pathVariables = getHashFromArray(trackPathVariables);
        const endpoint = trackEndpoint.replace(/{(\w+)}/g, (_, key) => {
            if (!pathVariables[key]) {
                throw new Error(`Key ${key} not found in the pathVariables`);
            }
            return pathVariables;
        });
        const payload = applyCustomMappings(message, trackParameterMapping);
        respList.push(buildRequestPayload(endpoint, payload, trackMethod, headers, params))
    });
};
const identifyResponseBuilder = (message, destination) => {
    /* 
    Example Config :     {
        "http-connectionMode": "cloud",
        "connectionMode": {
            "cloud": "cloud"
        },
        "identify": [
            {
                "identifyEndpoint": "https://www.test.com/user/{userId}",
                "identifyMethod": "POST",
                "identifyHeaders": [
                    {
                        "from": "content-type",
                        "to": "application/json"
                    }
                ],
                "identifyQueryParams": [
                    {
                        "from": "queryParam",
                        "to": "123"
                    }
                ],
                "identifyPathVariables": [
                    {
                        "from": "userId",
                        "to": "$.events.userId"
                    }
                ]
            }
        ]
    }
    */
    const { identify } = destination.Config;
    respList = [];
    identify.forEach(request => {
        const { identifyEndpoint, identifyMethod, identifyHeaders, identifyQueryParams, identifyPathVariables, identifyParameterMapping } = request;
        const headers = getHashFromArray(identifyHeaders);
        const params = getHashFromArray(identifyQueryParams);
        const pathVariables = getHashFromArray(identifyPathVariables);
        const endpoint = identifyEndpoint.replace(/{(\w+)}/g, (_, key) => {
            if (!pathVariables[key]) {
                throw new Error(`Key ${key} not found in the pathVariables`);
            }
            return pathVariables;
        });
        const payload = applyCustomMappings(message, identifyParameterMapping);
        respList.push(buildRequestPayload(endpoint, payload, identifyMethod, headers, params))
    });
};
const processEvent = (event) => {
    const { message, destination } = event;
    switch (messageType) {
        case EventType.IDENTIFY:
            response = identifyResponseBuilder(message, destination);
            break;
        case EventType.TRACK:
            response = trackResponseBuilder(message, destination);
            break;
        default:
            throw new InstrumentationError(`Message type ${messageType} not supported`);
    }
};
const process = (event) => {
    const response = processEvent({ ...event, DESTINATION });
    return response;
};

const processRouterDest = async (inputs, reqMetadata) => {
    const destNameRichInputs = inputs.map((input) => ({ ...input, DESTINATION }));
    const respList = simpleProcessRouterDest(destNameRichInputs, processEvent, reqMetadata);
    return respList;
};

module.exports = { processEvent, process, processRouterDest };

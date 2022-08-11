const {
    defaultBatchRequestConfig
  } = require("../../util");

const {
    TRIGGERTYPE
  } = require("./config");

function generateBatchedPayloadForArray(events) {
    const batchResponseList = [];
    const metadata = [];
  
    // extracting destination
    // from the first event in a batch
    const { destination } = events[0];
    const destConfig = destination.Config;
    const triggerType  = destConfig.TriggerType;  
    const  url = destConfig.googleCloudFunctionUrl;
    const {apiKeyId , gcloudAuthorization} = destConfig;
  
    let batchEventResponse = defaultBatchRequestConfig();
  
    // Batch event into dest batch structure
    events.forEach(ev => {
      batchResponseList.push(ev.message.body.JSON);
      metadata.push(ev.metadata);
    });
  
    batchEventResponse.batchedRequest.body.JSON_ARRAY = {
      batch: JSON.stringify(batchResponseList)
    };
  
    batchEventResponse.batchedRequest.endpoint = url;

    if(TRIGGERTYPE.HTTPS==triggerType)
    {
      batchEventResponse.batchedRequest.headers = {
        "content-type": "application/json",
        Authorization: `Bearer ${gcloudAuthorization}`,
        ApiKey: `Basic ${apiKeyId}`
      };
    }
    else {
        batchEventResponse.batchedRequest.headers = {
        "content-type": "application/json",
        Authorization: `Basic ${apiKeyId}`
      };
    }
    batchEventResponse = {
      ...batchEventResponse,
      metadata,
      destination
    };
  
    return batchEventResponse;
  }


  module.exports = {
    generateBatchedPayloadForArray
  };
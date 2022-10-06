const IMPORT_CODE = `
import json
import requests
`;

const TRANSFORM_WRAPPER_CODE = `
logs = []

def log(*args):
    log_string = 'Log:'
    for arg in args:
        log_string += f' {arg}'
    logs.append(log_string)

def lambda_handler(event, context):
    # TODO implement
    res = transformWrapper(event)
    return res

def transformWrapper(transformationPayload):
    events = transformationPayload["events"]
    transformType = transformationPayload["transformationType"]
    outputEvents = []
    eventMessages = [event["message"] for event in events]
    eventsMetadata = {}
    for ev in events:
        eventsMetadata[ev['message']['messageId']] = ev['metadata']
    
    def isObject(o):
        return isinstance(o, dict)
    
    def matafunc(event):
        if not isObject(event):
            return {}
        eventMetadata = eventsMetadata[event['messageId']] if event or {}  else {}
        return eventMetadata
    metadata = matafunc

    def batchfunc(event):
        if not isObject(event):
            return { "error": "returned event in events array from transformBatch(events) is not an object", "metadata": {}}
        return { "transformedEvent": event, "metadata": metadata(event)}
    
    if transformType == "transformBatch":
        transformedEventsBatch = transformBatch(eventMessages, metadata)
        if not isinstance(transformedEventsBatch, list):
            outputEvents.append({
                "error": "returned events from transformBatch(event) is not an array",
                "metadata": {}
            })
        outputEvents = [ batchfunc(transformEvent) for transformEvent in transformedEventsBatch ]
    elif transformType == "transformEvent":
        for ev in eventMessages:
            currMsgId = ev['messageId']
            try:
                transformedOutput = transformEvent(ev, metadata)
                if transformedOutput == None:
                    continue
                
                if isinstance(transformedOutput, list):
                    producedEvents = []
                    encounteredError = False
                    for e in transformedOutput:
                        if isObject(e):
                            producedEvents.append({
                                "transformedEvent": e,
                                "metadata": eventsMetadata[currMsgId] or {}
                            })
                        else:
                            outputEvents.append({
                                "error": "returned event in events array from transformEvent(event) is not an object",
                                "metadata": eventsMetadata[currMsgId] or {}
                            })
                            encounteredError = True
                    if not encounteredError:
                        outputEvents.extend(producedEvents)
                    continue
                
                if not isObject(transformedOutput):
                    outputEvents.append({
                        "error": "returned event from transformEvent(event) is not an object",
                        "metadata": eventsMetadata[currMsgId] or {}
                    })
                outputEvents.append({
                    "transformedEvent": transformedOutput,
                    "metadata": eventsMetadata[currMsgId] or {}
                })
            except Exception as e:
                outputEvents.append({
                    "error": str(e),
                    "metadata": eventsMetadata[currMsgId] or {}
                })
    result = dict()
    result['transformedEvents'] = outputEvents
    result['logs'] = logs
    return result
`;

module.exports = {
  IMPORT_CODE,
  TRANSFORM_WRAPPER_CODE
};

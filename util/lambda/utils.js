const JSON_IMPORT_CODE = `
import json
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
    
    def func(event):
        eventMetadata = event if eventsMetadata[event['messageId']] or {}  else {}
        return eventMetadata
    metadata = func
    
    if transformType == "transformBatch":
        transformedEventsBatch = transformBatch(eventMessages, metadata)
        if not isinstance(transformedEventsBatch, list):
            outputEvents.append({
                "error": "returned events from transformBatch(event) is not an array",
                "metadata": {}
            })
    elif transformType == "transformEvent":
        for ev in eventMessages:
            currMsgId = ev['messageId']
            try:
                transformedOutput = transformEvent(ev, metadata)
                if transformedOutput == None:
                    return
                
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
                    return
                
                if not isObject(transformedOutput):
                    return outputEvents.append({
                        "error": "returned event from transformEvent(event) is not an object",
                        "metadata": eventsMetadata[currMsgId] or {}
                    })
                outputEvents.append({
                    "transformedEvent": transformedOutput,
                    "metadata": eventsMetadata[currMsgId] or {}
                })
            except Exception as e:
                return outputEvents.append({
                    "error": str(e),
                    "metadata": eventsMetadata[currMsgId] or {}
                })
    result = dict()
    result['transformedEvents'] = outputEvents
    result['logs'] = logs
    return result
`;

module.exports = {
  JSON_IMPORT_CODE,
  TRANSFORM_WRAPPER_CODE
};

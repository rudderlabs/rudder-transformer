const LOG_DEF_CODE = `
def log(*args):
    log_string = 'Log:'
    for arg in args:
        log_string += f' {arg}'
    import transform_wrapper
    transform_wrapper.logs.append(log_string)

`;

const TRANSFORM_WRAPPER_CODE = `
import json
import requests
import user_transformation

logs = []

def get_transform_function():
    supported_func_names = ["transformEvent", "transformBatch"]
    available_func_names = []
    func_names = dir(user_transformation)
    for fname in func_names:
        if fname in supported_func_names:
            available_func_names.append(fname)
    if len(available_func_names) != 1:
        raise Exception(f"Expected one of {supported_func_names}. Found {available_func_names}")
    return available_func_names[0]

def log(*args):
    log_string = 'Log:'
    for arg in args:
        log_string += f' {arg}'
    logs.append(log_string)

def lambda_handler(event, context):
    # TODO implement
    res = transformWrapper(event)
    return res

def transformWrapper(events):
    transformType = get_transform_function()
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
        transformedEventsBatch = user_transformation.transformBatch(eventMessages, metadata)
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
                transformedOutput = user_transformation.transformEvent(ev, metadata)
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

const isABufferValue = value => {
  return (
    value &&
    value.buffer instanceof ArrayBuffer &&
    value.byteLength !== undefined
  );
};

const bufferToString = value => {
  return Buffer.from(value).toString();
};

module.exports = {
  LOG_DEF_CODE,
  TRANSFORM_WRAPPER_CODE,
  bufferToString,
  isABufferValue
};

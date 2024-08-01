export function processPixelEvent(inputEvent) {
  const { name, data, context, clientId } = inputEvent;
  const payload = {
    type: 'track',
    event: name,
    properties: data,
    anonymousId: clientId,
    context,
  };
  return payload;
}

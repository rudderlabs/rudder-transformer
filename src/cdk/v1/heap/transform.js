async function commonPostMapper(event, mappedPayload) {
  const { destination } = event;
  const payload = mappedPayload;
  if (payload.properties && payload.properties.idempotencyKey) {
    delete payload.properties.idempotencyKey;
  }
  const responseBody = {
    ...payload,
    app_id: destination.Config.appId,
  };

  return responseBody; // this flows onto the next stage in the yaml
}

module.exports = { commonPostMapper };

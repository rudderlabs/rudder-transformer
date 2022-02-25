function commonPostMapper(event, mappedPayload, rudderContext) {
  const { destination } = event;
  const payload = mappedPayload;
  const responseBody = {
    ...payload,
    app_id: destination.Config.appId
  };

  return responseBody; // this flows onto the next stage in the yaml
}

module.exports = { commonPostMapper };

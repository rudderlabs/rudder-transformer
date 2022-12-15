const { PlatformError } = require("../../v0/util/errorTypes");
const tags = require("../../v0/util/tags");

async function commonPostMapper(event, mappedPayload, rudderContext) {
  throw new PlatformError(
    `error message platform oauth`,
    400,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: tags.ERROR_TYPES.OAUTH_SECRET,
      [tags.TAG_NAMES.ERROR_CATEGORY]: tags.ERROR_CATEGORIES.PLATFORM,
      [tags.TAG_NAMES.IMPLEMENTATION]: tags.IMPLEMENTATIONS.NATIVE
    },
    {}
  );
  //
  const { destination } = event;
  const payload = mappedPayload;
  if (payload.properties && payload.properties.idempotencyKey) {
    delete payload.properties.idempotencyKey;
  }
  const responseBody = {
    ...payload,
    app_id: destination.Config.appId
  };

  return responseBody; // this flows onto the next stage in the yaml
}

module.exports = { commonPostMapper };

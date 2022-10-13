class RudderErrorBase extends Error {
  constructor(message, statusCode, statTags, destResponse, authErrorCategory) {
    super(message);
    this.status = statusCode;
    this.destinationResponse = destResponse;
    this.authErrorCategory = authErrorCategory;
    this.statTags = {
      destType: statTags.destType || statTags.destination,
      stage: statTags.stage,
      scope: statTags.scope,
      meta: statTags.meta
    };
  }

  static getStatTags(statTags, defaults) {
    let finalStatTags = statTags;
    const { defScope, defMeta, destination } = defaults;
    if (!finalStatTags || Array.isArray(finalStatTags)) {
      finalStatTags = {
        scope: defScope,
        meta: defMeta
      };
    }

    const tagNames = Object.keys(finalStatTags);
    if (!tagNames.includes("scope")) {
      finalStatTags = {
        ...finalStatTags,
        scope: defScope
      };
    }

    if (!tagNames.includes("meta")) {
      finalStatTags = {
        ...finalStatTags,
        meta: defMeta
      };
    }

    return { ...finalStatTags, destType: destination };
  }
}

module.exports = { RudderErrorBase };

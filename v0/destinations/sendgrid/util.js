const logger = require("../../../logger");
const { CustomError } = require("../../util");

const isValidBase64 = content => {
  const re = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
  return re.test(String(content));
};

const payloadValidator = payload => {
  const updatedPayload = payload;
  if (payload.personalizations.length < 1) {
    throw new CustomError("personalization field cannot be empty", 400);
  }
  const personalizationsArr = [];
  payload.personalizations.forEach(keys => {
    if (keys.to && keys.to.email && (payload.subject || keys.subject)) {
      personalizationsArr.push(keys);
    }
  });
  if (payload.personalizations.length !== personalizationsArr.length) {
    updatedPayload.personalizations = personalizationsArr;
  }
  if (payload.attachments) {
    if (!payload.attachments.content || !payload.attachments.filename) {
      updatedPayload.attachments = null;
      logger.error("content and filename are required for attachments");
    }
    if (isValidBase64(payload.attachments.content)) {
      updatedPayload.attachments = null;
      logger.error("content should be base64 encoded");
    }
  }
  if (payload.content) {
    payload.content.forEach((content, index) => {
      if (!content.text || !content.value) {
        updatedPayload.content.splice(index, 1);
      }
    });
  }
  if (!payload.from.email) {
    throw new CustomError("email is required inside from object", 400);
  }
  if (payload.categories) {
    payload.categories.forEach((category, index) => {
      if (typeof category !== "string") {
        updatedPayload.categories[index] = String(category);
      }
    });
  }
  return updatedPayload;
};

const eventValidity = (Config, event) => {
  let flag = false;
  Config.eventNamesSettings.forEach(eventName => {
    if (eventName.event && eventName.event.trim().length !== 0) {
      if (eventName.event.trim().toLowerCase() === event) {
        flag = true;
      }
    }
  });
  if (!flag) {
    throw new CustomError(
      "Event not configured on your Rudderstack dashboard",
      400
    );
  }
};

const createList = Config => {
  const asmList = [];
  if (Config.asm.groupsToDisplay.length > 0) {
    Config.asm.groupsToDisplay.forEach(groups => {
      if (groups.groupId.trim()) {
        asmList.push(groups.groupId);
      }
    });
  }
  return asmList;
};

module.exports = { payloadValidator, eventValidity, createList };

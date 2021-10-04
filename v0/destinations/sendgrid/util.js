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
  payload.personalizations.forEach((keys, index) => {
    const personalizationsArr = [];
    if (keys.to && (payload.subject || keys.subject)) {
      keys.to.forEach(keyto => {
        if (keyto.email) {
          personalizationsArr.push(keyto);
        }
      });
    } else {
      logger.error(`item at index ${index} dropped. to field is mandatory`);
    }
    updatedPayload.personalizations[index].to = personalizationsArr;
    if (keys.subject) {
      updatedPayload.personalizations[index].subject = keys.subject;
    }
  });
  if (payload.attachments) {
    if (!payload.attachments.content || !payload.attachments.filename) {
      updatedPayload.attachments = null;
      logger.error("content and filename are required for attachments");
    }
    if (!isValidBase64(payload.attachments.content)) {
      updatedPayload.attachments = null;
      logger.error("content should be base64 encoded");
    }
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
    payload.categories.splice(10);
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
  if (Config.groupsToDisplay && Config.groupsToDisplay.length > 0) {
    Config.groupsToDisplay.forEach(groups => {
      if (
        groups.groupId.trim() &&
        isNaN(Number(groups.groupId)) &&
        Number.isInteger(Number(groups.groupId))
      ) {
        asmList.push(Number(groups.groupId));
      }
    });
  }
  return asmList;
};

const createContent = Config => {
  const contentList = [];
  if (Config.contents && Config.contents.length > 0) {
    Config.contents.forEach((content, index) => {
      if (content.type && content.value) {
        contentList.push(content);
      } else {
        logger.error(
          `item at index ${index} dropped. type and value are required fields`
        );
      }
    });
  }
  return contentList;
};

const createAttachments = Config => {
  const attachmentList = [];
  if (Config.attachments && Config.attachments.length > 0) {
    Config.attachments.forEach((attachment, index) => {
      if (attachment.content && attachment.type) {
        attachmentList.push(attachment);
      } else {
        logger.error(
          `item at index ${index} dropped. content and type are required fields`
        );
      }
    });
  }
  return attachmentList;
};

const constructFields = (iObj, payload) => {
  const updatedPayload = payload;
  if (iObj.from) {
    updatedPayload.from = iObj.from;
  }
  if (iObj.categories) {
    updatedPayload.categories = iObj.categories;
  }
  if (iObj.sendAt) {
    updatedPayload.send_at = iObj.sendAt;
  }
  if (iObj.batchId) {
    updatedPayload.batch_id = iObj.batchId;
  }
  if (iObj.replyToLists) {
    updatedPayload.reply_to_list = iObj.replyToLists;
  }
  if (iObj.attachments) {
    updatedPayload.attachments = iObj.attachments;
  }
  if (iObj.content) {
    updatedPayload.content = iObj.content;
  }
  return updatedPayload;
};

module.exports = {
  payloadValidator,
  eventValidity,
  createList,
  createContent,
  createAttachments,
  constructFields
};

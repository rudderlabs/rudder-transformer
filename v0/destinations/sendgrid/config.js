const ENDPOINT = "https://api.sendgrid.com/v3/mail/send";

const TRACK_EXCLUSION_FIELDS = [
  "personalizations",
  "from",
  "replyTo",
  "replyToList",
  "subject",
  "content",
  "attachments",
  "templateId",
  "headers",
  "categories",
  "sendAt",
  "batchId",
  "asm",
  "IPPoolName",
  "mailSettings",
  "trackingSettings"
];

module.exports = {
  ENDPOINT,
  TRACK_EXCLUSION_FIELDS
};

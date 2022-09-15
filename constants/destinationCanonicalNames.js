const DestHandlerMap = {
  ga360: "ga"
};

const DestCanonicalNames = {
  fb_pixel: [
    "fb_pixel",
    "fb pixel",
    "FacebookPixel",
    "Facebook Pixel",
    "FB Pixel"
  ],
  ometria: ["Ometria", "ometria", "OMETRIA"],
  sendgrid: ["sendgrid", "Sendgrid", "SENDGRID"],
  dcm_floodlight: [
    "dcm floodlight",
    "dcm_floodlight",
    "DCM Floodlight",
    "DCM_Floodlight",
    "DCMFloodlight",
    "dcmfloodlight"
  ],
  new_relic: [
    "new relic",
    "new_relic",
    "New Relic",
    "New_Relic",
    "NewRelic",
    "newrelic"
  ],
  attentive_tag: [
    "attentive tag",
    "attentive_tag",
    "Attentive Tag",
    "Attentive_Tag",
    "AttentiveTag",
    "attentivetag"
  ],
  webhook: ["webhook", "Webhook", "WebHook", "WEBHOOK"],
  mailchimp: ["mailchimp", "MailChimp", "MAILCHIMP"],
  mautic: ["MAUTIC", "mautic", "Mautic"],
  kafka: ["KAFKA", "kafka", "Kafka"],
  vero: ["vero", "Vero", "VERO"],
  pinterest: ["pinterest", "Pinterest", "PINTEREST", "pinterestConversion"],
  rockerbox: ["rockerbox", "ROCKERBOX", "Rockerbox", "RockerBox", "rockerBox"],
  canny: ["canny", "Canny", "CANNY"],
  one_signal: [
    "one signal",
    "one_signal",
    "One Signal",
    "One_Signal",
    "OneSignal",
    "onesignal"
  ],
  wootric: ["wootric", "Wootric", "WOOTRIC"],
  clickup: ["ClickUp", "clickup", "CLICKUP", "clickUp", "Clickup"],
  zapier: ["zapier", "Zapier", "ZAPIER"],
  shynet: ["shynet", "SHYNET", "shyNet", "ShyNet"],
  monday: ["monday", "MONDAY", "monDay", "MonDay"],
  user: ["user", "USER", "User", "User.com", "user.com", "USER.com"],
  woopra: ["WOOPRA", "Woopra", "woopra"]
};

module.exports = { DestHandlerMap, DestCanonicalNames };

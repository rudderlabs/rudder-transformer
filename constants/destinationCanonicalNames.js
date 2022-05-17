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
  ]
};

module.exports = { DestHandlerMap, DestCanonicalNames };

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
  google_adwords_enhanced_conversions: [
    "google_adwords_enhanced_conversions",
    "GOOGLE_ADWORDS_ENHANCED_CONVERSIONS",
    "Google Adwords Enhanced Conversions",
    "googleAdwordsEnhancedConversions"
  ]
};

module.exports = { DestHandlerMap, DestCanonicalNames };

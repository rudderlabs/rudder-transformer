// const trackPricePayload = [
//   { rudderKey: "price", expectedKey: "amount" },
//   { rudderKey: "currency", expectedKey: "currency" }
// ];
// const trackOrderPayload = [{ rudderKey: "order_ID", expectedKey: "value" }];
// const identifyCompanyPayload = [
//   { rudderKey: "id", expectedKey: "company_id" },
//   { rudderKey: "remove", expectedKey: "remove" },
//   { rudderKey: "name", expectedKey: "name" }
// ];
// const identifyMainPayload = [
//   { rudderKey: "anonymousId", expectedKey: "user_id" },
//   { rudderKey: "createdAt", expectedKey: "created_at" },
//   { rudderKey: "firstName", expectedKey: null },
//   { rudderKey: "lastName", expectedKey: null },
//   { rudderKey: "name", expectedKey: "name" },
//   { rudderKey: "email", expectedKey: "email" },
//   { rudderKey: "plan", expectedKey: null }
// ];
// const groupMainPayload = [
//   { rudderKey: "traits", expectedKey: "custom_attributes" },
//   { rudderKey: "company", expectedKey: "company" },
//   { rudderKey: "monthly_spend", expectedKey: "monthly_spend" },
//   { rudderKey: "plan", expectedKey: "plan" },
//   { rudderKey: "name", expectedKey: "name" },
//   { rudderKey: "createdAt", expectedKey: "created_at" }
// ];
// const deviceContextKeys = [
//   { rudderKey: "manufacturer", expectedKey: "device_manufacturer" },
//   { rudderKey: "model", expectedKey: "device_model" },
//   { rudderKey: "name", expectedKey: "device_name" }
// ];
// const osContextkeys = [
//   { rudderKey: "name", expectedKey: "os_name" },
//   { rudderKey: "version", expectedKey: "os_version" }
// ];
// const appContextkeys = [
//   { rudderKey: "name", expectedKey: "app_name" },
//   { rudderKey: "version", expectedKey: "app_version" }
// ];
//
// const mapPayload = {
//   track: {
//     price: trackPricePayload,
//     order: trackOrderPayload
//   },
//   identify: {
//     company: identifyCompanyPayload,
//     main: identifyMainPayload
//   },
//   group: {
//     main: groupMainPayload
//   },
//   collectContext: {
//     device: deviceContextKeys,
//     os: osContextkeys,
//     app: appContextkeys
//   }
// };
//
// module.exports = {
//   mapPayload
// };

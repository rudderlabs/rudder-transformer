////////////////////////////////////////////////////////////////////////////////
// TODO: Need to figure out a way to mock failed requests based on post body
////////////////////////////////////////////////////////////////////////////////
const axios = jest.genMockFromModule("axios");
const acPostRequestHandler = require("./active_campaign.mock");
const {
  klaviyoPostRequestHandler,
  klaviyoGetRequestHandler
} = require("./klaviyo.mock");

const kustomerGetRequestHandler = require("./kustomer.mock");
const trengoGetRequestHandler = require("./trengo.mock");
const gainsightRequestHandler = require("./gainsight.mock");
const mailchimpGetRequestHandler = require("./mailchimp.mock");
const yahooDspPostRequestHandler = require("./yahoo_dsp.mock");
const { gainsightPXGetRequestHandler } = require("./gainsight_px.mock");
const { hsGetRequestHandler, hsPostRequestHandler } = require("./hs.mock");
const { delightedGetRequestHandler } = require("./delighted.mock");
const { dripPostRequestHandler } = require("./drip.mock");
const profitwellGetRequestHandler = require("./profitwell.mock");
const cannyPostRequestHandler = require("./canny.mock");
const custifyPostRequestHandler = require("./custify.mock");
const {
  wootricGetRequestHandler,
  wootricPostRequestHandler
} = require("./wootric.mock");
const { userGetRequestHandler, userPutRequestHandler } = require("./user.mock");
const { mixpanelPostRequestHandler } = require("./mixpanel.mock");
const { clickUpGetRequestHandler } = require("./clickup.mock");
const {
  freshmarketerPostRequestHandler,
  freshmarketerGetRequestHandler
} = require("./freshmarketer.mock");
const { mondayPostRequestHandler } = require("./monday.mock");

const urlDirectoryMap = {
  "api.hubapi.com": "hs",
  "zendesk.com": "zendesk",
  "salesforce.com": "salesforce",
  "mktorest.com": "marketo",
  "active.campaigns.rudder.com": "active_campaigns",
  "api.aptrinsic.com": "gainsight_px",
  "api.profitwell.com": "profitwell",
  "ruddertest2.mautic.net": "mautic"
};

const fs = require("fs");
const path = require("path");

const getParamEncodedUrl = (url, options) => {
  const { params } = options;
  const paramString = Object.keys(params)
    .map(key => `${key}=${params[key]}`)
    .join("&");
  return `${url}?${paramString}`;
};

function getData(url) {
  let directory = "";
  Object.keys(urlDirectoryMap).forEach(key => {
    if (url.includes(key)) {
      directory = urlDirectoryMap[key];
    }
  });
  if (directory) {
    const dataFile = fs.readFileSync(
      path.resolve(__dirname, `./data/${directory}/response.json`)
    );
    const data = JSON.parse(dataFile);
    return data[url];
  }
  return {};
}

function get(url, options) {
  const mockData = getData(url);
  if (url.includes("https://api.kustomerapp.com")) {
    return new Promise((resolve, reject) => {
      resolve(kustomerGetRequestHandler(url));
    });
  }
  if (url.includes("https://app.trengo.com")) {
    return new Promise((resolve, reject) => {
      resolve(trengoGetRequestHandler(url));
    });
  }
  if (url.includes("api.mailchimp.com")) {
    return new Promise((resolve, reject) => {
      resolve(mailchimpGetRequestHandler(url));
    });
  }
  if (url.includes("https://api.aptrinsic.com")) {
    return gainsightPXGetRequestHandler(url, mockData);
  }
  if (url.includes("https://a.klaviyo.com/api/v2/people/search")) {
    return klaviyoGetRequestHandler(getParamEncodedUrl(url, options));
  }
  if (url.includes("https://api.hubapi.com")) {
    return hsGetRequestHandler(url, mockData);
  }
  if (url.includes("https://api.delighted.com/v1/people.json")) {
    return delightedGetRequestHandler(options);
  }
  if (url.includes("https://api.profitwell.com")) {
    return profitwellGetRequestHandler(url, mockData);
  }
  if (
    url.includes(
      "https://api.getdrip.com/v2/1809802/subscribers/identified_user@gmail.com"
    )
  ) {
    return Promise.resolve({ status: 200 });
  }
  if (
    url.includes(
      "https://api.getdrip.com/v2/1809802/subscribers/unidentified_user@gmail.com"
    )
  ) {
    return Promise.reject({ status: 404 });
  }
  if (url.includes("https://api.wootric.com")) {
    return new Promise((resolve, reject) => {
      resolve(wootricGetRequestHandler(url));
    });
  }
  if (url.includes("https://commander.user.com")) {
    return new Promise((resolve, reject) => {
      resolve(userGetRequestHandler(url));
    });
  }
  if (url.includes("https://api.clickup.com")) {
    return Promise.resolve(clickUpGetRequestHandler(url));
  }
  if (url.includes("https://domain-rudder.myfreshworks.com/crm/sales/api")) {
    return {
      sales_activity_types: [
        {
          partial: true,
          id: 70000666879,
          name: "own-calender",
          internal_name: "cappointment",
          show_in_conversation: true,
          position: 1,
          is_default: false,
          is_checkedin: false
        },
        {
          partial: true,
          id: 70000663932,
          name: "fb-support",
          internal_name: "facebook",
          show_in_conversation: true,
          position: 2,
          is_default: false,
          is_checkedin: false
        },
        {
          partial: true,
          id: 70000663746,
          name: "twitter sales",
          internal_name: "twitter",
          show_in_conversation: true,
          position: 3,
          is_default: false,
          is_checkedin: false
        },
        {
          partial: true,
          id: 70000646396,
          name: "linked sales",
          internal_name: "linkedin",
          show_in_conversation: true,
          position: 4,
          is_default: false,
          is_checkedin: false
        },
        {
          partial: true,
          id: 70000642330,
          name: "facebook sales",
          internal_name: "facebook",
          show_in_conversation: true,
          position: 5,
          is_default: false,
          is_checkedin: false
        },
        {
          partial: true,
          id: 70000612897,
          name: "Chat",
          internal_name: "chat",
          show_in_conversation: true,
          position: 6,
          is_default: true,
          is_checkedin: false
        },
        {
          partial: true,
          id: 70000612898,
          name: "Phone",
          internal_name: "phone",
          show_in_conversation: true,
          position: 7,
          is_default: true,
          is_checkedin: false
        },
        {
          partial: true,
          id: 70000612899,
          name: "Meeting",
          internal_name: "appointment",
          show_in_conversation: true,
          position: 8,
          is_default: true,
          is_checkedin: true
        },
        {
          partial: true,
          id: 70000612900,
          name: "Task",
          internal_name: "task",
          show_in_conversation: true,
          position: 9,
          is_default: true,
          is_checkedin: false
        },
        {
          partial: true,
          id: 70000612901,
          name: "Email",
          internal_name: "email",
          show_in_conversation: true,
          position: 10,
          is_default: true,
          is_checkedin: false
        },
        {
          partial: true,
          id: 70000612902,
          name: "SMS Outgoing",
          internal_name: "sms_outgoing",
          show_in_conversation: true,
          position: 11,
          is_default: true,
          is_checkedin: false
        },
        {
          partial: true,
          id: 70000612903,
          name: "Reminder",
          internal_name: "reminder",
          show_in_conversation: false,
          position: 12,
          is_default: true,
          is_checkedin: false
        },
        {
          partial: true,
          id: 70000612904,
          name: "SMS Incoming",
          internal_name: "sms_incoming",
          show_in_conversation: true,
          position: 13,
          is_default: true,
          is_checkedin: false
        }
      ]
    };
  }

  return new Promise((resolve, reject) => {
    if (mockData) {
      resolve({ data: mockData, status: 200 });
    } else {
      resolve({ error: "Request failed" });
    }
  });
}

function post(url, payload) {
  const mockData = getData(url);
  if (url.includes("https://active.campaigns.rudder.com")) {
    return new Promise((resolve, reject) => {
      resolve(acPostRequestHandler(url, payload));
    });
  }
  if (url.includes("https://a.klaviyo.com")) {
    return new Promise((resolve, reject) => {
      resolve(klaviyoPostRequestHandler(url, payload));
    });
  }
  if (url.includes("https://demo-domain.gainsightcloud.com")) {
    return new Promise(resolve => {
      resolve(gainsightRequestHandler(url, payload));
    });
  }
  if (url.includes("https://api.aptrinsic.com")) {
    return new Promise(resolve => {
      resolve({ status: 201 });
    });
  }
  if (url.includes("https://id.b2b.yahooinc.com")) {
    return new Promise((resolve, reject) => {
      resolve(yahooDspPostRequestHandler(url, payload));
    });
  }
  if (url.includes("https://api.getdrip.com/v2/1809802/subscribers")) {
    return dripPostRequestHandler(url, payload);
  }
  if (url.includes("https://canny.io/api/v1/users/retrieve")) {
    return new Promise((resolve, reject) => {
      resolve(cannyPostRequestHandler(url));
    });
  }
  if (url.includes("https://api.hubapi.com")) {
    return hsPostRequestHandler(payload, mockData);
  }
  if (url.includes("https://api.wootric.com")) {
    return new Promise((resolve, reject) => {
      resolve(wootricPostRequestHandler(url, payload));
    });
  }
  if (
    url.includes("https://api.mixpanel.com/engage/") ||
    url.includes("https://api-eu.mixpanel.com/engage/")
  ) {
    return new Promise(resolve => {
      resolve(mixpanelPostRequestHandler(url, payload));
    });
  }
  if (url.includes("https://domain-rudder.myfreshworks.com/crm/sales/api")) {
    return new Promise((resolve, reject) => {
      resolve(freshmarketerPostRequestHandler(url));
    });
  }
  if (
    url.includes("https://api.monday.com") &&
    payload.query.includes("query")
  ) {
    return new Promise((resolve, reject) => {
      resolve(mondayPostRequestHandler(url));
    });
  }
  if (url.includes("https://api.custify.com")) {
    return Promise.resolve(custifyPostRequestHandler(url));
  }
  return new Promise((resolve, reject) => {
    if (mockData) {
      resolve({ data: mockData, status: 200 });
    } else {
      resolve({ error: "Request failed" });
    }
  });
}

function put(url, payload, options) {
  const mockData = getData(url);
  if (url.includes("https://demo-domain.gainsightcloud.com")) {
    return new Promise(resolve => {
      resolve(
        gainsightRequestHandler(getParamEncodedUrl(url, options), payload)
      );
    });
  }
  if (url.includes("https://commander.user.com")) {
    return new Promise((resolve, reject) => {
      resolve(userPutRequestHandler(url));
    });
  }
  if (url.includes("https://api.aptrinsic.com")) {
    return new Promise(resolve => {
      resolve({ status: 204 });
    });
  }
  return new Promise((resolve, reject) => {
    if (mockData) {
      resolve({ data: mockData, status: 200 });
    } else {
      resolve({ error: "Request failed" });
    }
  });
}

axios.get = get;
axios.post = post;
axios.put = put;
module.exports = axios;

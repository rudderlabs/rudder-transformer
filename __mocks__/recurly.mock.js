const itemPubg = {
  id: "ownrilsh7q26",
  object: "item",
  code: "pid-pubg",
  state: "active",
  name: "Testing-5-PubG",
  description: "Free Games",
  external_sku: "193",
  accounting_code: null,
  revenue_schedule_type: "never",
  tax_code: null,
  tax_exempt: true,
  custom_fields: [],
  currencies: [{ currency: "USD", unit_amount: 200 }],
  created_at: "2021-05-21T05:39:25Z",
  updated_at: "2021-05-21T05:39:25Z",
  deleted_at: null
};

const itemClashOfClan = {
  id: "ownrigpqfs69",
  object: "item",
  code: "pid-coc",
  state: "active",
  name: "Testing-5-Clash Of Clan",
  description: "Games",
  external_sku: "G-32",
  accounting_code: null,
  revenue_schedule_type: "never",
  tax_code: null,
  tax_exempt: true,
  custom_fields: [],
  currencies: [{ currency: "USD", unit_amount: 1999 }],
  created_at: "2021-05-21T05:39:24Z",
  updated_at: "2021-05-21T05:39:24Z",
  deleted_at: null
};

const data = {
  name: "Testing-5-HouseOfTheDead",
  code: "pid-hod",
  currencies: { currency: "USD", unit_amount: 20 },
  external_sku: "193",
  description: "EA Games"
};

const itemHouseOfDead = {
  id: "oxaklq580l7o",
  object: "item",
  code: "pid-hod",
  state: "active",
  name: "Testing-5-HouseOfTheDead",
  description: "EA Games",
  external_sku: "193",
  accounting_code: null,
  revenue_schedule_type: "never",
  tax_code: null,
  tax_exempt: true,
  custom_fields: [],
  currencies: [{ currency: "USD", unit_amount: 20 }],
  created_at: "2021-05-24T10:21:38Z",
  updated_at: "2021-05-24T10:21:38Z",
  deleted_at: null
};

const accounts = {
  id: "owmuzigytazj",
  object: "account",
  code: "testing-destination",
  parent_account_id: null,
  bill_to: "self",
  state: "active",
  username: null,
  email: null,
  cc_emails: null,
  preferred_locale: null,
  first_name: null,
  last_name: null,
  company: null,
  vat_number: null,
  tax_exempt: false,
  exemption_certificate: null,
  address: null,
  billing_info: null,
  shipping_addresses: [],
  custom_fields: [],
  has_live_subscription: false,
  has_active_subscription: false,
  has_future_subscription: false,
  has_canceled_subscription: false,
  has_paused_subscription: false,
  has_past_due_invoice: false,
  created_at: "2021-05-21T02:37:05Z",
  updated_at: "2021-05-21T02:37:05Z",
  deleted_at: null
};

const accountTestingPutCall = {
  id: "ownoxd8f80vh",
  object: "account",
  code: "testing-2",
  bill_to: "self",
  state: "active",
  email: "email--704@gmail.com",
  preferred_locale: "en-US",
  first_name: "Shivam",
  last_name: "Uptated To Testing-3",
  company: "Rudder",
  address: {
    street1: "Himnagar",
    street2: null,
    city: "Hooghly",
    region: "West Bengal",
    postal_code: "712310",
    country: "IN",
    phone: "90071967788"
  }
};

const recurlyPayload = {
  accounts: {
    "code-testing-2-put-call": {
      status: 200,
      data: accountTestingPutCall
    },
    "code-testing-destination": {
      status: 200,
      data: accounts
    }
  },
  items: {
    "pid-coc": {
      status: 200,
      data: itemClashOfClan
    },
    "pid-pubg": {
      status: 200,
      data: itemPubg
    }
  }
};

const recurlyPostRequestHandler = (url, payload) => {
  if (
    url === "https://v3.recurly.com/items" &&
    JSON.stringify(data) === JSON.stringify(payload)
  ) {
    return {
      status: 201,
      data: itemHouseOfDead
    };
  }
};

const recurlyGetRequestHandler = url => {
  switch (url) {
    case "https://v3.recurly.com/accounts/code-testing-destination":
      return recurlyPayload.accounts["code-testing-destination"];
    case "https://v3.recurly.com/accounts/code-testing-2-put-call":
      return recurlyPayload.accounts["code-testing-2-put-call"];
    case "https://v3.recurly.com/items/code-pid-coc":
      return recurlyPayload.items["pid-coc"];
    case "https://v3.recurly.com/items/code-pid-pubg":
      return recurlyPayload.items["pid-pubg"];
    default:
      return new Promise((resolve, reject) => {
        resolve({ error: "Request failed", status: 404 });
      });
  }
};

module.exports = { recurlyGetRequestHandler, recurlyPostRequestHandler };

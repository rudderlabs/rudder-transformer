// List of events -
const CommerceEvents = {
  name: [
    "ADD_TO_CART",
    "ADD_TO_WISHLIST",
    "VIEW_CART",
    "INITIATE_PURCHASE",
    "ADD_PAYMENT_INFO",
    "PURCHASE",
    "SPEND_CREDITS"
  ],
  contentItems: []
};
const ContentEvents = ["SEARCH", "VIEW_ITEM", "VIEW_ITEMS", "RATE", "SHARE"];
const UserLifeCycleEvents = {
  name: [
    "SEARCH",
    "VIEW_CONTENT",
    "VIEW_CONTENT_LIST",
    "RATE",
    "SHARE_CONTENT_ITEM"
  ]
};
const SupportedEvents = [
  "ADD_TO_CART",
  "ADD_TO_WISHLIST",
  "VIEW_CART",
  "INITIATE_PURCHASE",
  "ADD_PAYMENT_INFO",
  "PURCHASE",
  "SPEND_CREDITS",
  "SEARCH",
  "VIEW_ITEM",
  "VIEW_ITEMS",
  "RATE",
  "SHARE",
  "VIEW_CONTENT",
  "VIEW_CONTENT_LIST",
  "SHARE_CONTENT_ITEM"
];

const destinationConfigKeys = {
  BRANCH_KEY: "branchKey",
  BRANCH_SECRET: "branchSecret"
};

const baseEndpoint = " https://api2.branch.io";
const endpoints = {
  standardEventUrl: `${baseEndpoint}/v2/event/standard`,
  customEventUrl: `${baseEndpoint}/v2/event/custom`
};

const ConfigCategory = {
  CUSTOM: {
    name: "CustomEventConfig"
  },
  PAYMENT: {
    name: "PaymentRelatedEventConfig"
  },
  PRODUCT: {
    name: "ProductEventConfig"
  },
  TRANSACTION: {
    name: "TransactionEventConfig"
  },
  SHARING: {
    name: "SharingEventConfig"
  },
  ECOM_GENERIC: {
    name: "EComGenericEventConfig"
  }
};

const Event = {
  PRODUCT_ADDED: {
    name: "product added",
    category: ConfigCategory.PRODUCT
  },
  PRODUCT_ADDED_TO_WISHLIST: {
    name: "product added to wishlist",
    category: ConfigCategory.PRODUCT
  },
  CART_VIEWED: {
    name: "cart viewed",
    category: ConfigCategory.ECOM_GENERIC
  },
  PAYMENT_INFO_ENTERED: {
    name: "payment info entered",
    category: ConfigCategory.PAYMENT
  },
  CHECKOUT_STARTED: {
    name: "checkout started",
    category: ConfigCategory.TRANSACTION
  },
  ORDER_COMPLETED: {
    name: "order completed",
    category: ConfigCategory.TRANSACTION
  },
  SPEND_CREDITS: {
    name: "Spend Credits",
    category: ConfigCategory.TRANSACTION
  },
  PRODUCTS_SEARCHED: {
    name: "products searched",
    category: ConfigCategory.ECOM_GENERIC
  },
  PRODUCT_VIEWED: {
    name: "product viewed",
    category: ConfigCategory.PRODUCT
  },
  PRODUCT_LIST_VIEWED: {
    name: "product list viewed",
    category: ConfigCategory.ECOM_GENERIC
  },
  PRODUCT_REVIEWED: {
    name: "product reviewed",
    category: ConfigCategory.PRODUCT
  },
  PRODUCT_SHARED: {
    name: "product shared",
    category: ConfigCategory.SHARING
  },
  COMPLETE_REGISTRATION: {
    name: "Complete Registration",
    category: ConfigCategory
  },
  COMPLETE_TUTORIAL: {
    name: "Complete Tutorial",
    category: ConfigCategory
  },
  ACHIEVE_LEVEL: {
    name: "Achieve Level",
    category: ConfigCategory
  },
  UNLOCK_ACHIEVEMENT: {
    name: "Unlock Achievement",
    category: ConfigCategory
  }
};

module.exports = {
  Event,
  ConfigCategory,
  destinationConfigKeys,
  endpoints
};

const GAConfigCategory = {
  PAGE: "GAPageViewConfig",
  SCREEN: "GAScreenViewConfig",
  NON_ECOM: "GANonEComEventConfig",
  PROMOTION: "GAPromotionEventConfig",
  PAYMENT: "GAPaymentRelatedEventConfig",
  REFUND: "GARefundEventConfig",
  PRODUCT: "GAProductEventConfig",
  PRODUCT_LIST: "GAProductListEventConfig",
  TRANSACTION: "GATransactionEventConfig",
  SHARING: "GASharingEventConfig",
  ECOM_GENERIC: "GAEComGenericEventConfig"
};

const GAEvent = {
  PRODUCT_LIST_VIEWED: {
    name: "product list viewed",
    category: GAConfigCategory.PRODUCT_LIST
  },
  PRODUCT_LIST_FILTERED: {
    name: "product list filtered",
    category: GAConfigCategory.PRODUCT_LIST
  },
  PRODUCT_LIST_CLICKED: {
    name: "product list clicked",
    category: GAConfigCategory.PRODUCT_LIST
  },
  PROMOTION_VIEWED: {
    name: "promotion viewed",
    category: GAConfigCategory.PROMOTION
  },
  PROMOTION_CLICKED: {
    name: "promotion clicked",
    category: GAConfigCategory.PROMOTION
  },
  PRODUCT_CLICKED: {
    name: "product clicked",
    category: GAConfigCategory.PRODUCT
  },
  PRODUCT_VIEWED: {
    name: "product viewed",
    category: GAConfigCategory.PRODUCT
  },
  PRODUCT_ADDED: {
    name: "product added",
    category: GAConfigCategory.PRODUCT
  },
  WISHLIST_PRODUCT_ADDED_TO_CART: {
    name: "wishlist product added to cart",
    category: GAConfigCategory.PRODUCT
  },
  PRODUCT_REMOVED: {
    name: "product removed",
    category: GAConfigCategory.PRODUCT
  },
  PRODUCT_REMOVED_FROM_WISHLIST: {
    name: "product removed from wishlist",
    category: GAConfigCategory.PRODUCT
  },
  PRODUCT_ADDED_TO_WISHLIST: {
    name: "product added to wishlist",
    category: GAConfigCategory.PRODUCT
  },
  CHECKOUT_STARTED: {
    name: "checkout started",
    category: GAConfigCategory.TRANSACTION
  },
  ORDER_UPDATED: {
    name: "order updated",
    category: GAConfigCategory.TRANSACTION
  },
  ORDER_COMPLETED: {
    name: "order completed",
    category: GAConfigCategory.TRANSACTION
  },
  ORDER_CANCELLED: {
    name: "order cancelled",
    category: GAConfigCategory.TRANSACTION
  },
  CHECKOUT_STEP_VIEWED: {
    name: "checkout step viewed",
    category: GAConfigCategory.PAYMENT
  },
  CHECKOUT_STEP_COMPLETED: {
    name: "checkout step completed",
    category: GAConfigCategory.PAYMENT
  },
  PAYMENT_INFO_ENTERED: {
    name: "payment info entered",
    category: GAConfigCategory.PAYMENT
  },
  ORDER_REFUNDED: {
    name: "order refunded",
    category: GAConfigCategory.REFUND
  },
  PRODUCT_SHARED: {
    name: "product shared",
    category: GAConfigCategory.SHARING
  },
  CART_SHARED: {
    name: "cart shared",
    category: GAConfigCategory.SHARING
  },
  CART_VIEWED: {
    name: "cart viewed",
    category: GAConfigCategory.ECOM_GENERIC
  },
  COUPON_ENTERED: {
    name: "coupon entered",
    category: GAConfigCategory.ECOM_GENERIC
  },
  COUPON_APPLIED: {
    name: "coupon applied",
    category: GAConfigCategory.ECOM_GENERIC
  },
  COUPON_DENIED: {
    name: "coupon denied",
    category: GAConfigCategory.ECOM_GENERIC
  },
  COUPON_REMOVED: {
    name: "coupon removed",
    category: GAConfigCategory.ECOM_GENERIC
  },
  PRODUCT_REVIEWED: {
    name: "product reviewed",
    category: GAConfigCategory.ECOM_GENERIC
  },
  PRODUCTS_SEARCHED: {
    name: "products searched",
    category: GAConfigCategory.ECOM_GENERIC
  }
};

const GA_ENDPOINT = "https://www.google-analytics.com/collect";

const mappingConfig = {};
const categories = Object.keys(GAConfigCategory);
categories.forEach(category => {
  mappingConfig[category] = JSON.parse(
    fs.readFileSync(`data/${GAConfigCategory[category]}`)
  );
});

const nameToEventMap = {};
const events = Object.keys(GAEvent);
events.forEach(event => {
  nameToEventMap[event.name] = event;
});

module.exports = {
  GAEvent,
  GA_ENDPOINT,
  GAConfigCategory,
  mappingConfig,
  nameToEventMap
};

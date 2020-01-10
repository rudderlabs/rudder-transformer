const acceptedNames = [
  { rudderValue: "Product Added", expectedValue: "ADD_TO_CART" },
  {
    rudderValue: "Product Added to Wishlist",
    expectedValue: "ADD_TO_WISHLIST"
  },
  { rudderValue: "Cart Viewed", expectedValue: "VIEW_CART" },
  { rudderValue: "Checkout Started", expectedValue: "INITIATE_PURCHASE" },
  { rudderValue: "Payment Info Entered", expectedValue: "ADD_PAYMENT_INFO" },
  { rudderValue: "Order Completed", expectedValue: "PURCHASE" },
  { rudderValue: "SPEND_CREDITS", expectedValue: "SPEND_CREDITS" },
  { rudderValue: "Products Searched", expectedValue: "SEARCH" },
  { rudderValue: "Product Viewed", expectedValue: "VIEW_ITEM" },
  { rudderValue: "Product List Viewed", expectedValue: "VIEW_ITE,MS" },
  { rudderValue: "Product Reviewed", expectedValue: "RATE" },
  { rudderValue: "Product Shared", expectedValue: "SHARE" },
  { rudderKey: "VIEW_CONTENT", expectedKey: "VIEW_CONTENT" },
  { rudderKey: "VIEW_CONTENT_LIST", expectedKey: "VIEW_CONTENT_LIST" },
  { rudderKey: "SHARE_CONTENT_ITEM", expectedKey: "SHARE_CONTENT_ITEM" }
];

const payloadMapping = {
  common: {
    acceptedNames
  }
};

const EComGenericEventConfig = {
  cart_id: "cart_id",
  products: "content_items",
  query: "query",
  list_id: "list_id",
  category: "category"
};

const PaymentRelatedEventConfig = {
  checkout_id: "checkout_id",
  order_id: "order_id",
  step: "step",
  shipping_method: "shipping_method",
  payment_method: "payment_method"
};

const ProductEventConfig = {
  cart_id: "$cart_id",
  product_id: "$product_id",
  review_id: "$review_id",
  sku: "$sku",
  category: "$content_schema",
  name: "$product_name",
  brand: "$product_brand",
  variant: "$product_variant",
  price: "$price",
  quantity: "$quantity",
  coupon: "coupon",
  currency: "currency",
  position: "position",
  value: "value",
  url: "url",
  image_url: "$og_image_url",
  wishlist_id: "wishlist_id",
  wishlist_name: "wishlist_name",
  review_body: "review_body",
  rating: "rating",
  title: "$og_title",
  description: "$og_description",
  canonical_identifier: "$canonical_identifier",
  publicly_indexable: "$publicly_indexable",
  locally_indexable: "$locally_indexable",
  rating_average: "$rating_average",
  rating_count: "$rating_count",
  ratting_max: "$rating_max",
  creating_timestamp: "$creation_timestamp",
  exp_date: "$exp_date",
  keywords: "$keywords",
  address_street: "$address_street",
  address_city: "$address_city",
  address_region: "$address_region",
  address_country: "$address_country",
  address_postal_code: "$address_postal_code",
  latitude: "$latitude",
  longitude: "$longitude",
  image_captions: "$image_captions",
  condition: "$condition"
};

const SharingEventConfig = {
  share_via: "share_via",
  share_message: "share_message",
  recipient: "recipient",
  product_id: "product_id",
  sku: "sku",
  category: "category",
  name: "name",
  brand: "brand",
  variant: "variant",
  price: "price",
  url: "url",
  image_url: "image_url"
};

const TransactionEventConfig = {
  order_id: "order_id",
  checkout_id: "transaction_id",
  affiliation: "affiliation",
  value: "value",
  revenue: "revenue",
  shipping: "shipping",
  tax: "tax",
  discount: "discount",
  coupon: "coupon",
  currency: "currency",
  products: "content_items",
  subtotal: "subtotal",
  total: "total",
  description: "description",
  search_query: "search_query"
};

module.exports = {
  EventConfig: {
    TransactionEventConfig,
    SharingEventConfig,
    ProductEventConfig,
    PaymentRelatedEventConfig,
    EComGenericEventConfig
  },
  payloadMapping
};

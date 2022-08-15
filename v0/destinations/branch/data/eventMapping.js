const product = {
  title: "$og_title",
  description: "$og_description",
  image_url: "$og_image_url",
  canonical_identifier: "$canonical_identifier",
  publicly_indexable: "$publicly_indexable",
  price: "$price",
  locally_indexable: "$locally_indexable",
  quantity: "$quantity",
  sku: "$sku",
  name: "$product_name",
  brand: "$product_brand",
  category: "$product_category",
  variant: "$product_variant",
  rating_average: "$rating_average",
  rating_count: "$rating_count",
  rating_max: "$rating_max",
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

const CommerceEventConfig = {
  name: {
    "Product Added": "ADD_TO_CART",
    "Product Added to Wishlist": "ADD_TO_WISHLIST",
    "Cart Viewed": "VIEW_CART",
    "Checkout Started": "INITIATE_PURCHASE",
    "Payment Info Entered": "ADD_PAYMENT_INFO",
    "Order Completed": "ADD_PAYMENT_INFO",
    "Spend Credits": "SPEND_CREDITS",
    "Promotion Viewed": "VIEW_AD",
    "Promotion Clicked": "CLICK_AD",
    "Checkout Started": "PURCHASE",
    "Order Completed": "PURCHASE",
    Reserve: "RESERVE"
  },
  event_data: [
    "transaction_id",
    "currency",
    "revenue",
    "shipping",
    "tax",
    "coupon",
    "description"
  ],
  content_items: product
};

const ContentEventConfig = {
  name: {
    "Products Searched": "SEARCH",
    "Product Viewed": "VIEW_ITEM",
    "Product List Viewed": "VIEW_ITEMS",
    "Product Reviewed": "RATE",
    "Product Shared": "SHARE",
    "Initiate Stream": "INITIATE_STREAM",
    "Complete Stream": "COMPLETE_STREAM"
  },
  event_data: ["search_query", "description"],
  content_items: product
};

const LifecycleEventConfig = {
  name: {
    "Complete Registration": "COMPLETE_REGISTRATION",
    "Complete Tutorial": "COMPLETE_TUTORIAL",
    "Achieve Level": "ACHIEVE_LEVEL",
    "Unlock Achievement": "UNLOCK_ACHIEVEMENT",
    Invite: "INVITE",
    Login: "LOGIN",
    "Start Trial": "START_TRIAL",
    Subscribe: "SUBSCRIBE"
  },
  event_data: ["description"]
};

const categoriesList = [
  CommerceEventConfig,
  ContentEventConfig,
  LifecycleEventConfig
];

module.exports = {
  categoriesList
};

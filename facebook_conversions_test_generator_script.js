/**
 * Facebook Conversions Test Generator
 * Generates events with random values and comprehensive field variations
 * For Prometheus analysis and Facebook match rate optimization
 */

const axios = require('axios');

// Configuration
const CONFIG = {
  totalEvents: 1000,
  dataPlaneUrl: 'http://localhost:8080',
  apiKey: 'MzBybXJmVTE3NFdZaG9UQkFVOEJqUlRwR0hEOg==',
  delayBetweenRequests: 10000, // milliseconds
};

// Event names from Facebook Conversions API + Custom events
const EVENT_NAMES = [
  // Standard Facebook Events
  'Product Viewed',
  'Product List Viewed',
  'Product Added',
  'Order Completed',
  'Products Searched',
  'Checkout Started',
  'Payment Info Entered',
  'Product Added to Wishlist',
  'Page',
  'Screen',

  // Custom Events (will map to OTHER_EVENT in Prometheus)
  'User Signup',
  'Newsletter Subscription',
];

// Random data generators
function generateRandomUserId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function generateRandomAnonymousId() {
  return 'anon_' + Math.random().toString(36).substring(2, 11);
}

function generateRandomEventId() {
  return 'event_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
}

function generateRandomUserData() {
  const firstNames = [
    'John',
    'Jane',
    'Mike',
    'Sarah',
    'David',
    'Emma',
    'Alex',
    'Lisa',
    'Tom',
    'Anna',
  ];
  const lastNames = [
    'Smith',
    'Johnson',
    'Williams',
    'Brown',
    'Jones',
    'Garcia',
    'Miller',
    'Davis',
    'Wilson',
    'Taylor',
  ];
  const domains = [
    'gmail.com',
    'yahoo.com',
    'outlook.com',
    'company.com',
    'hotmail.com',
    'icloud.com',
  ];
  const cities = [
    'New York',
    'Los Angeles',
    'Chicago',
    'Miami',
    'Seattle',
    'Boston',
    'Denver',
    'Austin',
    'Phoenix',
    'Portland',
  ];
  const states = ['NY', 'CA', 'IL', 'FL', 'WA', 'MA', 'CO', 'TX', 'PA', 'OH', 'GA', 'NC'];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const domain = domains[Math.floor(Math.random() * domains.length)];

  return {
    firstName,
    lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
    phone: `+1-555-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
    city: cities[Math.floor(Math.random() * cities.length)],
    state: states[Math.floor(Math.random() * states.length)],
    zip: Math.floor(Math.random() * 90000 + 10000).toString(),
    gender: Math.random() > 0.5 ? 'm' : 'f',
    birthday: `${1980 + Math.floor(Math.random() * 30)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
  };
}

function generateRandomProduct() {
  const products = [
    { name: 'iPhone 15 Pro', category: 'electronics', price: 999.99 },
    { name: 'Nike Running Shoes', category: 'sports', price: 129.99 },
    { name: 'MacBook Air M2', category: 'electronics', price: 1199.99 },
    { name: 'Adidas T-Shirt', category: 'clothing', price: 29.99 },
    { name: 'Samsung Galaxy S24', category: 'electronics', price: 799.99 },
    { name: 'Yoga Mat', category: 'fitness', price: 25.99 },
    { name: 'Coffee Maker', category: 'home', price: 89.99 },
    { name: 'Wireless Headphones', category: 'electronics', price: 199.99 },
    { name: 'Running Shorts', category: 'sports', price: 35.99 },
    { name: 'Bluetooth Speaker', category: 'electronics', price: 79.99 },
    { name: 'Laptop Stand', category: 'electronics', price: 45.99 },
    { name: 'Water Bottle', category: 'fitness', price: 19.99 },
  ];

  const product = products[Math.floor(Math.random() * products.length)];
  return {
    ...product,
    id: `prod_${Math.random().toString(36).substr(2, 8)}`,
    sku: `SKU_${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
  };
}

function generateRandomDeviceData() {
  const devices = [
    { manufacturer: 'Apple', model: 'iPhone 15', os: 'iOS', version: '17.0' },
    { manufacturer: 'Samsung', model: 'Galaxy S24', os: 'Android', version: '14.0' },
    { manufacturer: 'Google', model: 'Pixel 8', os: 'Android', version: '14.0' },
    { manufacturer: 'Apple', model: 'MacBook Pro', os: 'macOS', version: '14.0' },
    { manufacturer: 'Dell', model: 'XPS 13', os: 'Windows', version: '11.0' },
    { manufacturer: 'Xiaomi', model: 'Redmi Note', os: 'Android', version: '13.0' },
    { manufacturer: 'Apple', model: 'iPad Pro', os: 'iOS', version: '17.0' },
    { manufacturer: 'Samsung', model: 'Galaxy Tab', os: 'Android', version: '14.0' },
  ];

  const device = devices[Math.floor(Math.random() * devices.length)];
  return {
    id: `device_${Math.random().toString(36).substr(2, 8)}`,
    manufacturer: device.manufacturer,
    model: device.model,
    name: `${device.manufacturer} ${device.model}`,
    os: {
      name: device.os.toLowerCase(),
      version: device.version,
    },
  };
}

function generateRandomNetworkData() {
  const carriers = ['Verizon', 'AT&T', 'T-Mobile', 'Sprint', 'Comcast', 'Spectrum'];
  const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge', 'Opera'];
  const screenSizes = ['1920x1080', '1366x768', '1440x900', '375x667', '414x896', '768x1024'];

  return {
    carrier: carriers[Math.floor(Math.random() * carriers.length)],
    browser: browsers[Math.floor(Math.random() * browsers.length)],
    screen: {
      height: Math.floor(Math.random() * 1000 + 400),
      width: Math.floor(Math.random() * 2000 + 800),
      density: Math.floor(Math.random() * 3 + 1) * 2,
    },
    userAgent: `Mozilla/5.0 (${Math.random() > 0.5 ? 'iPhone' : 'Windows NT 10.0'}; ${Math.random() > 0.5 ? 'CPU iPhone OS 17_0' : 'Win64; x64'}) AppleWebKit/537.36 (KHTML, like Gecko) ${browsers[Math.floor(Math.random() * browsers.length)]}/120.0.0.0 Safari/537.36`,
    ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
  };
}

function generateRandomFacebookData() {
  return {
    fbc: `fb.1.${Date.now()}.${Math.random().toString(36).substr(2, 10)}`,
    fbp: `fb.1.${Date.now()}.${Math.random().toString(36).substr(2, 10)}`,
  };
}

function generateTimestamp() {
  const now = new Date();
  // Facebook Conversions API requires events to be within the last 7 days
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Generate a random timestamp between 7 days ago and now
  const randomTime =
    sevenDaysAgo.getTime() + Math.random() * (now.getTime() - sevenDaysAgo.getTime());
  const randomDate = new Date(randomTime);

  return randomDate.toISOString();
}

// Generate comprehensive field variations
function generateFieldVariations() {
  const allFields = [
    // Root level fields
    'userId',
    'anonymousId',
    'event',
    'timestamp',
    'type',
    'channel',
    'context',
    'properties',
    'integrations',

    // Context fields
    'context.traits.email',
    'context.traits.phone',
    'context.traits.firstName',
    'context.traits.lastName',
    'context.traits.gender',
    'context.traits.birthday',
    'context.traits.address',
    'context.traits.name',
    'context.traits.userId',
    'context.traits.id',
    'context.fbc',
    'context.fbp',
    'context.ip',
    'context.userAgent',
    'context.device',
    'context.device.advertisingId', // Maps to Facebook madid
    'context.device.adTrackingEnabled', // Maps to Facebook advertiser_tracking_enabled
    'context.device.type',
    'context.device.model',
    'context.os',
    'context.os.version',
    'context.screen',
    'context.screen.width',
    'context.screen.height',
    'context.screen.density',
    'context.network',
    'context.network.carrier',
    'context.locale',
    'context.timezone',
    'context.abv_timezone',
    'context.cpu_cores',
    'context.ext_storage_size',
    'context.avl_storage_size',
    'context.app',
    'context.app.namespace',
    'context.app.build',
    'context.app.version',
    'context.campaign',
    'context.campaign.name',
    'context.subscription_id',
    'context.lead_id',
    'context.fb_login_id',

    // Properties fields
    'properties.name',
    'properties.product_name',
    'properties.category',
    'properties.revenue',
    'properties.value',
    'properties.price',
    'properties.total',
    'properties.currency',
    'properties.num_items',
    'properties.quantity',
    'properties.search_string',
    'properties.query',
    'properties.product_id',
    'properties.sku',
    'properties.id',
    'properties.event_id',
    'properties.action_source',
    'properties.pageUrl',
    'properties.advertiser_tracking_enabled',
    'properties.application_tracking_enabled',
    'properties.extinfo',
    'properties.data_processing_options',
    'properties.opt_out',
    'properties.products',
    'properties.contents',
    'properties.campaignId',
    'properties.install_referrer',
    'properties.installer_package',
    'properties.url_schemes',
    'properties.windows_attribution_id',
    'properties.anon_id',
  ];

  const variations = [];

  // Complete event (all fields present)
  variations.push({
    name: 'complete_event',
    undefinedFields: [],
    description: 'All fields present',
  });

  // Critical user identification scenarios
  variations.push({
    name: 'no_user_identification',
    undefinedFields: ['userId', 'anonymousId'],
    description: 'No user identification at all',
  });

  variations.push({
    name: 'only_userId',
    undefinedFields: ['anonymousId'],
    description: 'Only userId present, no anonymousId',
  });

  variations.push({
    name: 'only_anonymousId',
    undefinedFields: ['userId'],
    description: 'Only anonymousId present, no userId',
  });

  // Single field undefined scenarios
  allFields.forEach((field) => {
    variations.push({
      name: `undefined_${field.replace(/[.]/g, '_')}`,
      undefinedFields: [field],
      description: `Missing ${field}`,
    });
  });

  // Multiple fields undefined scenarios
  for (let i = 0; i < 30; i++) {
    const randomCount = Math.floor(Math.random() * 8) + 1; // 1-8 fields undefined
    const shuffled = [...allFields].sort(() => 0.5 - Math.random());
    const randomFields = shuffled.slice(0, randomCount);

    variations.push({
      name: `undefined_multiple_${i + 1}`,
      undefinedFields: randomFields,
      description: `Missing ${randomCount} random fields: ${randomFields.join(', ')}`,
    });
  }

  // Category-based undefined scenarios
  const fieldCategories = {
    user_data: [
      'context.traits.email',
      'context.traits.phone',
      'context.traits.firstName',
      'context.traits.lastName',
    ],
    product_data: [
      'properties.name',
      'properties.category',
      'properties.revenue',
      'properties.product_id',
    ],
    event_data: ['properties.event_id', 'properties.action_source', 'properties.pageUrl'],
    app_data: ['properties.advertiser_tracking_enabled', 'properties.extinfo'],
    compliance_data: ['properties.data_processing_options', 'properties.opt_out'],
  };

  Object.entries(fieldCategories).forEach(([category, fields]) => {
    variations.push({
      name: `undefined_${category}`,
      undefinedFields: fields,
      description: `Missing all ${category} fields`,
    });
  });

  return variations;
}

const FIELD_VARIATIONS = generateFieldVariations();

// Helper function to set nested object values
function setNestedValue(obj, path, value) {
  if (!obj) return; // Guard against undefined obj

  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {};
    return current[key];
  }, obj);
  target[lastKey] = value;
}

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateEventData(eventIndex, variation) {
  const randomUser = generateRandomUserData();
  const randomProduct = generateRandomProduct();
  const randomDevice = generateRandomDeviceData();
  const randomNetwork = generateRandomNetworkData();
  const randomFacebook = generateRandomFacebookData();
  const eventName = getRandom(EVENT_NAMES);

  // Start with complete event structure with random values
  const event = {
    userId: generateRandomUserId(),
    anonymousId: generateRandomAnonymousId(),
    event: eventName,
    context: {
      device: {
        ...randomDevice,
        advertisingId: `madid_${Math.random().toString(36).substring(2, 14)}`, // Maps to Facebook madid
        adTrackingEnabled: true, // Maps to Facebook advertiser_tracking_enabled
        type: Math.random() > 0.5 ? 'mobile' : 'desktop',
        model: randomDevice.model,
      },
      network: {
        carrier: randomNetwork.carrier,
      },
      os: {
        ...randomDevice.os,
        version: randomDevice.os.version,
      },
      screen: {
        ...randomNetwork.screen,
        width: randomNetwork.screen.width,
        height: randomNetwork.screen.height,
        density: randomNetwork.screen.density,
      },
      traits: {
        anonymousId: generateRandomAnonymousId(),
        name: `${randomUser.firstName} ${randomUser.lastName}`,
        userId: generateRandomUserId(),
        id: generateRandomUserId(),
      },
      userAgent: randomNetwork.userAgent,
      ip: randomNetwork.ip,
      fbc: randomFacebook.fbc,
      fbp: randomFacebook.fbp,
      locale: 'en_US',
      timezone: 'America/New_York',
      abv_timezone: 'America/New_York',
      cpu_cores: Math.floor(Math.random() * 8) + 1,
      ext_storage_size: Math.floor(Math.random() * 100) + 10,
      avl_storage_size: Math.floor(Math.random() * 50) + 5,
      app: {
        namespace: 'com.example.app',
        build: '1.0.0',
        version: '1.0.0',
      },
      campaign: {
        name: `campaign_${Math.random().toString(36).substring(2, 8)}`,
      },
      subscription_id: `sub_${Math.random().toString(36).substring(2, 8)}`,
      lead_id: `lead_${Math.random().toString(36).substring(2, 8)}`,
      fb_login_id: `fb_${Math.random().toString(36).substring(2, 8)}`,
    },
    properties: {},
    timestamp: generateTimestamp(),
    type: 'track',
    channel: 'web',
    integrations: { All: true },
  };

  // Apply undefined field variations
  variation.undefinedFields.forEach((fieldPath) => {
    setNestedValue(event, fieldPath, undefined);
  });

  // Add user data with random values
  if (!variation.undefinedFields.includes('context.traits.email')) {
    if (!event.context) event.context = {};
    if (!event.context.traits) event.context.traits = {};
    event.context.traits.email = randomUser.email;
  }
  if (!variation.undefinedFields.includes('context.traits.phone')) {
    if (!event.context) event.context = {};
    if (!event.context.traits) event.context.traits = {};
    event.context.traits.phone = randomUser.phone;
  }
  if (!variation.undefinedFields.includes('context.traits.firstName')) {
    if (!event.context) event.context = {};
    if (!event.context.traits) event.context.traits = {};
    event.context.traits.firstName = randomUser.firstName;
  }
  if (!variation.undefinedFields.includes('context.traits.lastName')) {
    if (!event.context) event.context = {};
    if (!event.context.traits) event.context.traits = {};
    event.context.traits.lastName = randomUser.lastName;
  }
  if (!variation.undefinedFields.includes('context.traits.gender')) {
    if (!event.context) event.context = {};
    if (!event.context.traits) event.context.traits = {};
    event.context.traits.gender = randomUser.gender;
  }
  if (!variation.undefinedFields.includes('context.traits.birthday')) {
    if (!event.context) event.context = {};
    if (!event.context.traits) event.context.traits = {};
    event.context.traits.birthday = randomUser.birthday;
  }
  if (!variation.undefinedFields.includes('context.traits.address')) {
    if (!event.context) event.context = {};
    if (!event.context.traits) event.context.traits = {};
    event.context.traits.address = {
      city: randomUser.city,
      state: randomUser.state,
      zip: randomUser.zip,
      country: 'US',
    };
  }

  // Add product data with random values
  if (!variation.undefinedFields.includes('properties.name')) {
    if (!event.properties) event.properties = {};
    event.properties.name = randomProduct.name;
    event.properties.product_name = randomProduct.name;
  }
  if (!variation.undefinedFields.includes('properties.category')) {
    if (!event.properties) event.properties = {};
    event.properties.category = randomProduct.category;
  }
  if (!variation.undefinedFields.includes('properties.revenue')) {
    if (!event.properties) event.properties = {};
    event.properties.revenue = randomProduct.price;
    event.properties.value = randomProduct.price;
    event.properties.price = randomProduct.price;
    event.properties.total = randomProduct.price;
  }
  if (!variation.undefinedFields.includes('properties.product_id')) {
    if (!event.properties) event.properties = {};
    event.properties.product_id = randomProduct.id;
    event.properties.sku = randomProduct.sku;
    event.properties.id = randomProduct.id;
  }
  if (!variation.undefinedFields.includes('properties.currency')) {
    if (!event.properties) event.properties = {};
    event.properties.currency = 'USD';
  }
  if (!variation.undefinedFields.includes('properties.num_items')) {
    if (!event.properties) event.properties = {};
    event.properties.num_items = Math.floor(Math.random() * 3) + 1;
    event.properties.quantity = Math.floor(Math.random() * 3) + 1;
  }
  if (!variation.undefinedFields.includes('properties.search_string')) {
    if (!event.properties) event.properties = {};
    event.properties.search_string = randomProduct.name.toLowerCase().split(' ')[0];
    event.properties.query = randomProduct.name.toLowerCase().split(' ')[0];
  }

  // Add event-specific data
  if (!variation.undefinedFields.includes('properties.event_id')) {
    if (!event.properties) event.properties = {};
    event.properties.event_id = generateRandomEventId();
  }
  if (!variation.undefinedFields.includes('properties.action_source')) {
    if (!event.properties) event.properties = {};
    event.properties.action_source = 'website';
  }
  if (!variation.undefinedFields.includes('properties.pageUrl')) {
    if (!event.properties) event.properties = {};
    event.properties.pageUrl = `https://example.com/product/${randomProduct.id}`;
  }

  // Add app data
  if (!variation.undefinedFields.includes('properties.advertiser_tracking_enabled')) {
    if (!event.properties) event.properties = {};
    event.properties.advertiser_tracking_enabled = true;
  }
  if (!variation.undefinedFields.includes('properties.application_tracking_enabled')) {
    if (!event.properties) event.properties = {};
    event.properties.application_tracking_enabled = true;
  }
  if (!variation.undefinedFields.includes('properties.extinfo')) {
    if (!event.properties) event.properties = {};
    event.properties.extinfo = [
      'mobile',
      'com.example.app',
      '1.0.0',
      'iOS 14.0',
      'iPhone 12',
      'en_US',
      'America/New_York',
      'Verizon',
      '390',
      '844',
      '3.0',
      '8',
      '64GB',
      '32GB',
      'America/New_York',
    ];
  }

  // Add compliance data
  if (!variation.undefinedFields.includes('properties.data_processing_options')) {
    if (!event.properties) event.properties = {};
    event.properties.data_processing_options = ['LDU', 1, 1000];
  }
  if (!variation.undefinedFields.includes('properties.opt_out')) {
    if (!event.properties) event.properties = {};
    event.properties.opt_out = false;
  }
  if (!variation.undefinedFields.includes('properties.anon_id')) {
    if (!event.properties) event.properties = {};
    event.properties.anon_id = `anon_${Math.random().toString(36).substring(2, 8)}`;
  }
  if (!variation.undefinedFields.includes('properties.campaignId')) {
    if (!event.properties) event.properties = {};
    event.properties.campaignId = `campaign_${Math.random().toString(36).substring(2, 8)}`;
  }
  if (!variation.undefinedFields.includes('properties.install_referrer')) {
    if (!event.properties) event.properties = {};
    event.properties.install_referrer = `https://play.google.com/store/apps/details?id=com.example.app&referrer=utm_source%3Dfacebook%26utm_medium%3Dcpc`;
  }
  if (!variation.undefinedFields.includes('properties.installer_package')) {
    if (!event.properties) event.properties = {};
    event.properties.installer_package = 'com.android.vending';
  }
  if (!variation.undefinedFields.includes('properties.url_schemes')) {
    if (!event.properties) event.properties = {};
    event.properties.url_schemes = ['myapp://', 'myapp://open'];
  }
  if (!variation.undefinedFields.includes('properties.windows_attribution_id')) {
    if (!event.properties) event.properties = {};
    event.properties.windows_attribution_id = `windows_${Math.random().toString(36).substring(2, 8)}`;
  }

  return event;
}

async function sendEvent(event, index, variationName) {
  const preview = {
    userId: event.userId,
    event: event.event,
    props: event.properties ? Object.keys(event.properties) : [],
    email: event.context?.traits?.email,
    undefinedFields: variationName,
  };

  console.log('\n---------------------------------------------');
  console.log(`🟡 Event #${index}`);
  console.log(`🧪 Variation: ${variationName}`);
  // console.log('📦 Event:', JSON.stringify(event, null, 2));

  try {
    const start = Date.now();
    const res = await axios.post(
      `${CONFIG.dataPlaneUrl}/v1/batch`,
      { batch: [event] },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${CONFIG.apiKey}`,
        },
      },
    );
    const end = Date.now();
    console.log(`✅ Sent successfully (${res.status}) in ${end - start}ms`);
    return { statusCode: res.status };
  } catch (e) {
    if (e.response) {
      console.log(`❌ Failed (${e.response.status}): ${JSON.stringify(e.response.data)}`);
      return { statusCode: e.response.status };
    } else {
      console.log(`❌ Error: ${e.message}`);
      return { error: e.message };
    }
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log(`🚀 Starting Facebook Conversions Test`);
  console.log(`🔢 Total Events: ${CONFIG.totalEvents}`);
  console.log(`🧪 Field Variations: ${FIELD_VARIATIONS.length}`);
  console.log(`📊 Dataplane URL: ${CONFIG.dataPlaneUrl}\n`);

  let success = 0,
    fail = 0;
  const startTime = Date.now();

  for (let i = 1; i <= CONFIG.totalEvents; i++) {
    const variation = getRandom(FIELD_VARIATIONS);
    const event = generateEventData(i, variation);
    const result = await sendEvent(event, i, variation.name);
    result.statusCode >= 200 && result.statusCode < 300 ? success++ : fail++;
    if (i < CONFIG.totalEvents) await sleep(CONFIG.delayBetweenRequests);
  }

  const endTime = Date.now();
  console.log('\n=== ✅ Test Summary ===');
  console.log(`Total: ${CONFIG.totalEvents}, Success: ${success}, Failed: ${fail}`);
  console.log(`Duration: ${((endTime - startTime) / 1000).toFixed(2)}s`);
  console.log(
    `Rate: ${(CONFIG.totalEvents / ((endTime - startTime) / 1000)).toFixed(2)} events/second`,
  );
  console.log(`Field Variations Tested: ${FIELD_VARIATIONS.length}`);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { generateEventData, sendEvent };

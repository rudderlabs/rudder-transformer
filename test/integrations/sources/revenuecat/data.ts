export const data = [
  {
    name: 'revenuecat',
    description: 'Simple track call',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            api_version: '1.0',
            event: {
              aliases: [
                'f8e14f51-0c76-49ba-8d67-c229f1875dd9',
                '389ad6dd-bb40-4c03-9471-1353da2d55ec',
              ],
              app_user_id: 'f8e14f51-0c76-49ba-8d67-c229f1875dd9',
              commission_percentage: null,
              country_code: 'US',
              currency: null,
              entitlement_id: null,
              entitlement_ids: null,
              environment: 'SANDBOX',
              event_timestamp_ms: 1698617217232,
              expiration_at_ms: 1698624417232,
              id: '8CF0CD6C-CAF3-41FB-968A-661938235AF0',
              is_family_share: null,
              offer_code: null,
              original_app_user_id: 'f8e14f51-0c76-49ba-8d67-c229f1875dd9',
              original_transaction_id: null,
              period_type: 'NORMAL',
              presented_offering_id: null,
              price: null,
              price_in_purchased_currency: null,
              product_id: 'test_product',
              purchased_at_ms: 1698617217232,
              store: 'APP_STORE',
              subscriber_attributes: {
                $displayName: {
                  updated_at_ms: 1698617217232,
                  value: 'Mister Mistoffelees',
                },
                $email: {
                  updated_at_ms: 1698617217232,
                  value: 'tuxedo@revenuecat.com',
                },
                $phoneNumber: {
                  updated_at_ms: 1698617217232,
                  value: '+19795551234',
                },
                my_custom_attribute_1: {
                  updated_at_ms: 1698617217232,
                  value: 'catnip',
                },
              },
              takehome_percentage: null,
              tax_percentage: null,
              transaction_id: null,
              type: 'TEST',
            },
          },
        ],
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              batch: [
                {
                  context: {
                    library: {
                      name: 'unknown',
                      version: 'unknown',
                    },
                    integration: {
                      name: 'RevenueCat',
                    },
                    externalId: [
                      {
                        type: 'revenuecatAppUserId',
                        id: 'f8e14f51-0c76-49ba-8d67-c229f1875dd9',
                      },
                    ],
                  },
                  integrations: {
                    RevenueCat: false,
                  },
                  type: 'track',
                  properties: {
                    aliases: [
                      'f8e14f51-0c76-49ba-8d67-c229f1875dd9',
                      '389ad6dd-bb40-4c03-9471-1353da2d55ec',
                    ],
                    appUserId: 'f8e14f51-0c76-49ba-8d67-c229f1875dd9',
                    commissionPercentage: null,
                    countryCode: 'US',
                    currency: null,
                    entitlementId: null,
                    entitlementIds: null,
                    environment: 'SANDBOX',
                    eventTimestampMs: 1698617217232,
                    expirationAtMs: 1698624417232,
                    id: '8CF0CD6C-CAF3-41FB-968A-661938235AF0',
                    isFamilyShare: null,
                    offerCode: null,
                    originalAppUserId: 'f8e14f51-0c76-49ba-8d67-c229f1875dd9',
                    originalTransactionId: null,
                    periodType: 'NORMAL',
                    presentedOfferingId: null,
                    price: null,
                    priceInPurchasedCurrency: null,
                    productId: 'test_product',
                    purchasedAtMs: 1698617217232,
                    store: 'APP_STORE',
                    subscriberAttributes: {
                      $displayName: {
                        updated_at_ms: 1698617217232,
                        value: 'Mister Mistoffelees',
                      },
                      $email: {
                        updated_at_ms: 1698617217232,
                        value: 'tuxedo@revenuecat.com',
                      },
                      $phoneNumber: {
                        updated_at_ms: 1698617217232,
                        value: '+19795551234',
                      },
                      my_custom_attribute_1: {
                        updated_at_ms: 1698617217232,
                        value: 'catnip',
                      },
                    },
                    takehomePercentage: null,
                    taxPercentage: null,
                    transactionId: null,
                    type: 'TEST',
                  },
                  event: 'TEST',
                  messageId: '8CF0CD6C-CAF3-41FB-968A-661938235AF0',
                  originalTimestamp: '2023-10-29T22:06:57.232Z',
                  sentAt: '2023-10-29T22:06:57.232Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'revenuecat',
    description: 'Initial purchase event',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            api_version: '1.0',
            event: {
              aliases: ['yourCustomerAliasedID', 'yourCustomerAliasedID'],
              app_id: 'yourAppID',
              app_user_id: 'yourCustomerAppUserID',
              commission_percentage: 0.3,
              country_code: 'US',
              currency: 'USD',
              entitlement_id: 'pro_cat',
              entitlement_ids: ['pro_cat'],
              environment: 'PRODUCTION',
              event_timestamp_ms: 1591121855319,
              expiration_at_ms: 1591726653000,
              id: 'UniqueIdentifierOfEvent',
              is_family_share: false,
              offer_code: 'free_month',
              original_app_user_id: 'OriginalAppUserID',
              original_transaction_id: '1530648507000',
              period_type: 'NORMAL',
              presented_offering_id: 'OfferingID',
              price: 2.49,
              price_in_purchased_currency: 2.49,
              product_id: 'onemonth_no_trial',
              purchased_at_ms: 1591121853000,
              store: 'APP_STORE',
              subscriber_attributes: {
                '$Favorite Cat': {
                  updated_at_ms: 1581121853000,
                  value: 'Garfield',
                },
              },
              takehome_percentage: 0.7,
              tax_percentage: 0.3,
              transaction_id: '170000869511114',
              type: 'INITIAL_PURCHASE',
            },
          },
        ],
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              batch: [
                {
                  context: {
                    library: {
                      name: 'unknown',
                      version: 'unknown',
                    },
                    integration: {
                      name: 'RevenueCat',
                    },
                    externalId: [
                      {
                        type: 'revenuecatAppUserId',
                        id: 'yourCustomerAppUserID',
                      },
                    ],
                  },
                  integrations: {
                    RevenueCat: false,
                  },
                  type: 'track',
                  properties: {
                    aliases: ['yourCustomerAliasedID', 'yourCustomerAliasedID'],
                    appId: 'yourAppID',
                    appUserId: 'yourCustomerAppUserID',
                    commissionPercentage: 0.3,
                    countryCode: 'US',
                    currency: 'USD',
                    entitlementId: 'pro_cat',
                    entitlementIds: ['pro_cat'],
                    environment: 'PRODUCTION',
                    eventTimestampMs: 1591121855319,
                    expirationAtMs: 1591726653000,
                    id: 'UniqueIdentifierOfEvent',
                    isFamilyShare: false,
                    offerCode: 'free_month',
                    originalAppUserId: 'OriginalAppUserID',
                    originalTransactionId: '1530648507000',
                    periodType: 'NORMAL',
                    presentedOfferingId: 'OfferingID',
                    price: 2.49,
                    priceInPurchasedCurrency: 2.49,
                    productId: 'onemonth_no_trial',
                    purchasedAtMs: 1591121853000,
                    store: 'APP_STORE',
                    subscriberAttributes: {
                      '$Favorite Cat': {
                        updated_at_ms: 1581121853000,
                        value: 'Garfield',
                      },
                    },
                    takehomePercentage: 0.7,
                    taxPercentage: 0.3,
                    transactionId: '170000869511114',
                    type: 'INITIAL_PURCHASE',
                  },
                  event: 'INITIAL_PURCHASE',
                  messageId: 'UniqueIdentifierOfEvent',
                  originalTimestamp: '2020-06-02T18:17:35.319Z',
                  sentAt: '2020-06-02T18:17:35.319Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
];

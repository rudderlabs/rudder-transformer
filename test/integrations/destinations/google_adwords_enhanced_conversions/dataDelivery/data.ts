export const data = [
  {
    name: 'google_adwords_enhanced_conversions',
    description: 'Test 0',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          version: '1',
          type: 'REST',
          method: 'POST',
          endpoint:
            'https://googleads.googleapis.com/v15/customers/1234567890:uploadConversionAdjustments',
          headers: {
            Authorization: 'Bearer abcd1234',
            'Content-Type': 'application/json',
            'developer-token': 'ijkl91011',
            'login-customer-id': '0987654321',
          },
          params: {
            event: 'Product Added',
            customerId: '1234567890',
            destination: 'google_adwords_enhanced_conversions',
          },
          body: {
            JSON: {
              partialFailure: true,
              conversionAdjustments: [
                {
                  gclidDateTimePair: {
                    gclid: 'gclid1234',
                    conversionDateTime: '2022-01-01 12:32:45-08:00',
                  },
                  restatementValue: {
                    adjustedValue: 10,
                    currency: 'INR',
                  },
                  order_id: '10000',
                  adjustmentDateTime: '2022-01-01 12:32:45-08:00',
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  userIdentifiers: [
                    {
                      addressInfo: {
                        hashedFirstName:
                          'a8cfcd74832004951b4408cdb0a5dbcd8c7e52d43f7fe244bf720582e05241da',
                        hashedLastName:
                          '1c574b17eefa532b6d61c963550a82d2d3dfca4a7fb69e183374cfafd5328ee4',
                        state: 'UK',
                        city: 'London',
                        hashedStreetAddress:
                          '9a4d2e50828448f137f119a3ebdbbbab8d6731234a67595fdbfeb2a2315dd550',
                      },
                    },
                  ],
                  adjustmentType: 'ENHANCEMENT',
                },
              ],
            },
            JSON_ARRAY: {},
            XML: {},
            FORM: {},
          },
          files: {},
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 401,
        body: {
          output: {
            message:
              '""Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project." during Google_adwords_enhanced_conversions response transformation"',
            authErrorCategory: 'REFRESH_TOKEN',
            destinationResponse: [
              {
                error: {
                  code: 401,
                  message:
                    'Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project.',
                  status: 'UNAUTHENTICATED',
                },
              },
            ],
            statTags: {
              destType: 'GOOGLE_ADWORDS_ENHANCED_CONVERSIONS',
              errorCategory: 'network',
              destinationId: 'Non-determininable',
              workspaceId: 'Non-determininable',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
            },
            status: 401,
          },
        },
      },
    },
  },
  {
    name: 'google_adwords_enhanced_conversions',
    description: 'Test 1',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          version: '1',
          type: 'REST',
          method: 'POST',
          endpoint:
            'https://googleads.googleapis.com/v15/customers/1234567899:uploadConversionAdjustments',
          headers: {
            Authorization: 'Bearer abcd1234',
            'Content-Type': 'application/json',
            'developer-token': 'ijkl91011',
            'login-customer-id': '0987654321',
          },
          params: {
            event: 'Product Added',
            customerId: '1234567899',
            destination: 'google_adwords_enhanced_conversions',
          },
          body: {
            JSON: {
              partialFailure: true,
              conversionAdjustments: [
                {
                  gclidDateTimePair: {
                    gclid: 'gclid1234',
                    conversionDateTime: '2022-01-01 12:32:45-08:00',
                  },
                  restatementValue: {
                    adjustedValue: 10,
                    currency: 'INR',
                  },
                  order_id: '10000',
                  adjustmentDateTime: '2022-01-01 12:32:45-08:00',
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  userIdentifiers: [
                    {
                      addressInfo: {
                        hashedFirstName:
                          'a8cfcd74832004951b4408cdb0a5dbcd8c7e52d43f7fe244bf720582e05241da',
                        hashedLastName:
                          '1c574b17eefa532b6d61c963550a82d2d3dfca4a7fb69e183374cfafd5328ee4',
                        state: 'UK',
                        city: 'London',
                        hashedStreetAddress:
                          '9a4d2e50828448f137f119a3ebdbbbab8d6731234a67595fdbfeb2a2315dd550',
                      },
                    },
                  ],
                  adjustmentType: 'ENHANCEMENT',
                },
              ],
            },
            JSON_ARRAY: {},
            XML: {},
            FORM: {},
          },
          files: {},
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: {
            destinationResponse: {
              response: [
                {
                  results: [
                    {
                      adjustmentDateTime: '2021-01-01 12:32:45-08:00',
                      adjustmentType: 'ENHANCEMENT',
                      conversionAction: 'customers/7693729833/conversionActions/874224905',
                      gclidDateTimePair: {
                        conversionDateTime: '2021-01-01 12:32:45-08:00',
                        gclid: '1234',
                      },
                      orderId: '12345',
                    },
                  ],
                },
              ],
              status: 200,
            },
            message: 'Request Processed Successfully',
            status: 200,
          },
        },
      },
    },
  },
  {
    name: 'google_adwords_enhanced_conversions',
    description: 'Test 2',
    feature: 'dataDelivery',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          version: '1',
          type: 'REST',
          method: 'POST',
          endpoint:
            'https://googleads.googleapis.com/v15/customers/1234567891:uploadConversionAdjustments',
          headers: {
            Authorization: 'Bearer abcd1234',
            'Content-Type': 'application/json',
            'developer-token': 'ijkl91011',
            'login-customer-id': '0987654321',
          },
          params: {
            event: 'Product Added',
            customerId: '1234567891',
            destination: 'google_adwords_enhanced_conversions',
          },
          body: {
            JSON: {
              partialFailure: true,
              conversionAdjustments: [
                {
                  gclidDateTimePair: {
                    gclid: 'gclid1234',
                    conversionDateTime: '2022-01-01 12:32:45-08:00',
                  },
                  restatementValue: {
                    adjustedValue: 10,
                    currency: 'INR',
                  },
                  order_id: '10000',
                  adjustmentDateTime: '2022-01-01 12:32:45-08:00',
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  userIdentifiers: [
                    {
                      addressInfo: {
                        hashedFirstName:
                          'a8cfcd74832004951b4408cdb0a5dbcd8c7e52d43f7fe244bf720582e05241da',
                        hashedLastName:
                          '1c574b17eefa532b6d61c963550a82d2d3dfca4a7fb69e183374cfafd5328ee4',
                        state: 'UK',
                        city: 'London',
                        hashedStreetAddress:
                          '9a4d2e50828448f137f119a3ebdbbbab8d6731234a67595fdbfeb2a2315dd550',
                      },
                    },
                  ],
                  adjustmentType: 'ENHANCEMENT',
                },
              ],
            },
            JSON_ARRAY: {},
            XML: {},
            FORM: {},
          },
          files: {},
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 400,
        body: {
          output: {
            destinationResponse: [
              {
                results: [
                  {
                    conversionAction: {
                      id: 123434342,
                    },
                  },
                ],
              },
            ],
            message: '" during Google_adwords_enhanced_conversions response transformation',
            statTags: {
              destType: 'GOOGLE_ADWORDS_ENHANCED_CONVERSIONS',
              destinationId: 'Non-determininable',
              errorCategory: 'network',
              errorType: 'aborted',
              feature: 'dataDelivery',
              implementation: 'native',
              module: 'destination',
              workspaceId: 'Non-determininable',
            },
            status: 400,
          },
        },
      },
    },
  },
];

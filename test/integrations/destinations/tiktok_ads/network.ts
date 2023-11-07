export const networkCallsData = [
  {
    httpReq: {
      url: 'https://business-api.tiktok.com/open_api/v1.2/pixel/batch/',
      data: {
        pixel_code: 'A1T8T4UYGVIQA8ORZMX9',
        partner_name: 'RudderStack',
        event: 'CompletePayment',
        event_id: '1616318632825_357',
        timestamp: '2020-09-17T19:49:27Z',
        properties: {
          contents: [
            { price: 8, quantity: 2, content_type: 'socks', content_id: '1077218' },
            { price: 30, quantity: 1, content_type: 'dress', content_id: '1197218' },
          ],
          currency: 'USD',
          value: 46,
        },
        context: {
          ad: { callback: '123ATXSfe' },
          page: {
            url: 'http://demo.mywebsite.com/purchase',
            referrer: 'http://demo.mywebsite.com',
          },
          user: {
            external_id: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
            phone_number: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
            email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
          },
          ip: '13.57.97.131',
          user_agent:
            'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
        },
      },
      params: { destination: 'tiktok_ads' },
      headers: {
        'Access-Token': 'dummyAccessToken',
        'Content-Type': 'application/json',
        'test-dest-response-key': 'successResponse',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: { data: { code: 0, message: 'OK' }, status: 200 },
  },
  {
    httpReq: {
      url: 'https://business-api.tiktok.com/open_api/v1.2/pixel/batch/',
      data: {
        pixel_code: 'A1T8T4UYGVIQA8ORZMX9',
        partner_name: 'RudderStack',
        event: 'CompletePayment',
        event_id: '1616318632825_357',
        timestamp: '2020-09-17T19:49:27Z',
        properties: {
          contents: [
            { price: 8, quantity: 2, content_type: 'socks', content_id: 1077218 },
            { price: 30, quantity: 1, content_type: 'dress', content_id: 1197218 },
          ],
          currency: 'USD',
          value: 46,
        },
        context: {
          ad: { callback: '123ATXSfe' },
          page: {
            url: 'http://demo.mywebsite.com/purchase',
            referrer: 'http://demo.mywebsite.com',
          },
          user: {
            external_id: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
            phone_number: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
            email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
          },
          ip: '13.57.97.131',
          user_agent:
            'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
        },
      },
      params: { destination: 'tiktok_ads' },
      headers: {
        'Access-Token': 'dummyAccessToken',
        'Content-Type': 'application/json',
        'test-dest-response-key': 'invalidDataTypeResponse',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        code: 40002,
        message: 'Batch.0.properties.contents.0.content_id: Not a valid string',
      },
      status: 200,
    },
  },
  {
    httpReq: {
      url: 'https://business-api.tiktok.com/open_api/v1.2/pixel/batch/',
      data: {
        pixel_code: 'A1T8T4UYGVIQA8ORZMX9',
        partner_name: 'RudderStack',
        event: 'CompletePayment',
        event_id: '1616318632825_357',
        timestamp: '2020-09-17T19:49:27Z',
        properties: {
          contents: [
            { price: 8, quantity: 2, content_type: 'socks', content_id: 1077218 },
            { price: 30, quantity: 1, content_type: 'dress', content_id: 1197218 },
          ],
          currency: 'USD',
          value: 46,
        },
        context: {
          ad: { callback: '123ATXSfe' },
          page: {
            url: 'http://demo.mywebsite.com/purchase',
            referrer: 'http://demo.mywebsite.com',
          },
          user: {
            external_id: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
            phone_number: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
            email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
          },
          ip: '13.57.97.131',
          user_agent:
            'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
        },
      },
      params: { destination: 'tiktok_ads' },
      headers: {
        'Access-Token': 'dummyAccessToken',
        'Content-Type': 'application/json',
        'test-dest-response-key': 'invalidPermissionsResponse',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        code: 40001,
        message:
          'No permission to operate pixel code: BU35TSQHT2A1QT375OMG. You must be an admin or operator of this advertiser account.',
      },
      status: 200,
    },
  },
  {
    httpReq: {
      url: 'https://business-api.tiktok.com/open_api/v1.2/pixel/batch/',
      data: {
        pixel_code: 'A1T8T4UYGVIQA8ORZMX9',
        partner_name: 'RudderStack',
        event: 'CompletePayment',
        event_id: '1616318632825_357',
        timestamp: '2020-09-17T19:49:27Z',
        properties: {
          contents: [
            { price: 8, quantity: 2, content_type: 'socks', content_id: 1077218 },
            { price: 30, quantity: 1, content_type: 'dress', content_id: 1197218 },
          ],
          currency: 'USD',
          value: 46,
        },
        context: {
          ad: { callback: '123ATXSfe' },
          page: {
            url: 'http://demo.mywebsite.com/purchase',
            referrer: 'http://demo.mywebsite.com',
          },
          user: {
            external_id: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
            phone_number: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
            email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
          },
          ip: '13.57.97.131',
          user_agent:
            'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
        },
      },
      params: { destination: 'tiktok_ads' },
      headers: {
        'Access-Token': 'dummyAccessToken',
        'Content-Type': 'application/json',
        'test-dest-response-key': 'tooManyRequests',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: {
      data: { code: 40100, message: 'Too many requests. Please retry in some time.' },
      status: 200,
    },
  },
  {
    httpReq: {
      url: 'https://business-api.tiktok.com/open_api/v1.2/pixel/batch/',
      data: {
        pixel_code: 'A1T8T4UYGVIQA8ORZMX9',
        partner_name: 'RudderStack',
        event: 'CompletePayment',
        event_id: '1616318632825_357',
        timestamp: '2020-09-17T19:49:27Z',
        properties: {
          contents: [
            { price: 8, quantity: 2, content_type: 'socks', content_id: 1077218 },
            { price: 30, quantity: 1, content_type: 'dress', content_id: 1197218 },
          ],
          currency: 'USD',
          value: 46,
        },
        context: {
          ad: { callback: '123ATXSfe' },
          page: {
            url: 'http://demo.mywebsite.com/purchase',
            referrer: 'http://demo.mywebsite.com',
          },
          user: {
            external_id: 'f0e388f53921a51f0bb0fc8a2944109ec188b59172935d8f23020b1614cc44bc',
            phone_number: '2f9d2b4df907e5c9a7b3434351b55700167b998a83dc479b825096486ffcf4ea',
            email: 'dd6ff77f54e2106661089bae4d40cdb600979bf7edc9eb65c0942ba55c7c2d7f',
          },
          ip: '13.57.97.131',
          user_agent:
            'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
        },
      },
      params: { destination: 'tiktok_ads' },
      headers: {
        'Access-Token': 'dummyAccessToken',
        'Content-Type': 'application/json',
        'test-dest-response-key': '502-BadGateway',
        'User-Agent': 'RudderLabs',
      },
      method: 'POST',
    },
    httpRes: {
      data: '<html>\r\n<head><title>502 Bad Gateway</title></head>\r\n<body bgcolor="white">\r\n<center><h1>502 Bad Gateway</h1></center>\r\n<hr><center>nginx</center>\r\n</body>\r\n</html>\r\n',
      status: 502,
    },
  },
];

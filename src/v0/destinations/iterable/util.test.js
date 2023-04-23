const {
    identifyDeviceAction, 
    identifyBrowserAction, 
    identifyAction, 
    pageAction, 
    screenAction, 
    trackAction, 
    trackPurchaseAction, 
    updateCartAction
} = require('./util');

const {ConfigCategory} = require('./config');

const getTestMessage = () => {
    let message = {
      event: "testEventName",
      anonymousId: "anonId",
      traits: {
        email: 'abc@test.com',
        name: "rudder",
        address: {
            "city": "kolkata",
            "country": "India"
        },
        createdAt: "2014-05-21T15:54:20Z",
        timestamp: "2014-05-21T15:54:20Z"
      },
      properties: {
        "category": "test",
        "email": "test@test.com",
        "templateId": 1234,
        "campaignId": 5678,
        "name": "pageName"
      },
      context: {
        device: {
            token: 1234
        },
        os: {
            token: 5678
        },
        mappedToDestination: false,
        "externalId": [
            {
              "id": "12345",
              "identifierType": "test_identifier",
            }
          ],
      }
    };
    return message;
  };


  const getTestEcommMessage = () => {
    let message = {
      event: "testEventName",
      anonymousId: "anonId",
      traits: {
        userId: "userId",
        email: 'abc@test.com',
        name: "rudder",
        address: {
            "city": "kolkata",
            "country": "India"
        },
        createdAt: "2014-05-21T15:54:20Z",
        timestamp: "2014-05-21T15:54:20Z"
      },
      properties: {
        "product_id": 1234,
        "sku": "abcd",
        "name": "no product array present",
        "category": "categoryTest1, categoryTest2",
        "price": "10",
        "quantity": "2",
        "total": "20",
        "campaignId": "1111",
        "templateId": "2222"

      },
      context: {
        device: {
            token: 1234
        },
        os: {
            token: 5678
        },
        mappedToDestination: false,
        "externalId": [
            {
              "id": "12345",
              "identifierType": "test_identifier",
            }
          ],
      }
    };
    return message;
  };

describe('iterable utils test', () => {
    describe('Unit test cases for iterable identifyDeviceAction', () => {

        it('for no device type', async () => {
          expectedOutput = {"device": {"dataFields": {"campaignId": 5678, "category": "test", "email": "test@test.com", "name": "pageName", "templateId": 1234}, "platform": "GCM", "token": 1234}, "email": "abc@test.com", "preferUserId": true, "userId": "anonId"}
          expect(identifyDeviceAction(getTestMessage())).toEqual(expectedOutput);
        });
        it('For apple family device type', async () => {
            const fittingPayload = {...getTestMessage()};
            fittingPayload.context.device.type = 'ios';
            expectedOutput = {"device": {"dataFields": {"campaignId": 5678, "category": "test", "email": "test@test.com", "name": "pageName", "templateId": 1234}, "platform": "APNS", "token": 1234}, "email": "abc@test.com", "preferUserId": true, "userId": "anonId"}
            expect(identifyDeviceAction(fittingPayload)).toEqual(expectedOutput);
         });
    
         it('For non apple family device type', async () => {
            const fittingPayload = {...getTestMessage()};
            fittingPayload.context.device.type = 'android';
            expectedOutput = {"device": {"dataFields": {"campaignId": 5678, "category": "test", "email": "test@test.com", "name": "pageName", "templateId": 1234}, "platform": "GCM", "token": 1234}, "email": "abc@test.com", "preferUserId": true, "userId": "anonId"}
            expect(identifyDeviceAction(fittingPayload)).toEqual(expectedOutput);
         });
      });
    describe('Unit test cases for iterable identifyBrowserAction', () => {
    it('flow check', async () => {
        expectedOutput =  {"browserToken": 5678, "email": "abc@test.com", "userId": "anonId"}
        expect(identifyBrowserAction(getTestMessage())).toEqual(expectedOutput);
    });
    });
    describe('Unit test cases for iterable identifyAction', () => {
        it('flow check without externalId', async () => {
            expectedOutput = {"dataFields": {"address": {"city": "kolkata", "country": "India"}, "createdAt": "2014-05-21T15:54:20Z", "email": "abc@test.com", "name": "rudder", "timestamp": "2014-05-21T15:54:20Z"}, "email": "abc@test.com", "mergeNestedObjects": true, "preferUserId": true, "userId": "anonId"}
            expect(identifyAction(getTestMessage(), ConfigCategory.IDENTIFY)).toEqual(expectedOutput);
        });
    
        it('flow check with externalId', async () => {
            let fittingPayload = {...getTestMessage()};
            fittingPayload.context.mappedToDestination = true;
            expectedOutput = {"dataFields": {"address": {"city": "kolkata", "country": "India"}, "createdAt": "2014-05-21T15:54:20Z", "email": "abc@test.com", "name": "rudder", "test_identifier": "12345","timestamp": "2014-05-21T15:54:20Z"}, "email": "abc@test.com", "mergeNestedObjects": true, "preferUserId": true, "userId": "anonId"}
            expect(identifyAction(fittingPayload, ConfigCategory.IDENTIFY)).toEqual(expectedOutput);
        });
    
    });
    describe('Unit test cases for iterbale pageAction', () => {
        it('For trackAllPages', async () => {
            destination = {
                "Config": {
                  "apiKey": "12345",
                  "mapToSingleEvent": false,
                  "trackAllPages": true,
                  "trackCategorisedPages": false,
                  "trackNamedPages": false
                },
                "Enabled": true
              }
            expectedOutput = {"campaignId": 5678, "createdAt": NaN, "dataFields": {"campaignId": 5678, "category": "test", "email": "test@test.com", "name": "pageName", "templateId": 1234}, "email": "test@test.com", "eventName": "pageName page", "templateId": 1234, "userId": "anonId"}
            expect(pageAction(getTestMessage(), destination, ConfigCategory.PAGE)).toEqual(expectedOutput);
        });
    
        it('For trackCategorisedPages', async () => {
            destination = {
                "Config": {
                  "apiKey": "12345",
                  "mapToSingleEvent": false,
                  "trackAllPages": false,
                  "trackCategorisedPages": true,
                  "trackNamedPages": false
                },
                "Enabled": true
              }
            expectedOutput =  {"campaignId": 5678, "createdAt": NaN, "dataFields": {"campaignId": 5678, "category": "test", "email": "test@test.com", "name": "pageName", "templateId": 1234}, "email": "test@test.com", "eventName": "pageName page", "templateId": 1234, "userId": "anonId"}
            expect(pageAction(getTestMessage(), destination, ConfigCategory.PAGE)).toEqual(expectedOutput);
        });
    
        it('For trackNamedPages', async () => {
            destination = {
                "Config": {
                  "apiKey": "12345",
                  "mapToSingleEvent": false,
                  "trackAllPages": false,
                  "trackCategorisedPages": false,
                  "trackNamedPages": true
                },
                "Enabled": true
              }
            expectedOutput = {"campaignId": 5678, "createdAt": NaN, "dataFields": {"campaignId": 5678, "category": "test", "email": "test@test.com", "name": "pageName", "templateId": 1234}, "email": "test@test.com", "eventName": "pageName page", "templateId": 1234, "userId": "anonId"}
            expect(pageAction(getTestMessage(), destination, ConfigCategory.PAGE)).toEqual(expectedOutput);
        });
    
        it('For mapToSingleEvent', async () => {
            destination = {
                "Config": {
                  "apiKey": "12345",
                  "mapToSingleEvent": false,
                  "trackAllPages": false,
                  "trackCategorisedPages": false,
                  "trackNamedPages": true,
                  "mapToSingleEvent": true
                },
                "Enabled": true
              }
            expectedOutput = {"campaignId": 5678, "createdAt": NaN, "dataFields": {"campaignId": 5678, "category": "test", "email": "test@test.com", "name": "pageName", "templateId": 1234}, "email": "test@test.com", "eventName": "Loaded a Page", "templateId": 1234, "userId": "anonId"}
            expect(pageAction(getTestMessage(), destination, ConfigCategory.PAGE)).toEqual(expectedOutput);
        });
    
        it('For non-mapToSingleEvent', async () => {
            destination = {
                "Config": {
                  "apiKey": "12345",
                  "mapToSingleEvent": false,
                  "trackAllPages": false,
                  "trackCategorisedPages": false,
                  "trackNamedPages": true,
                  "mapToSingleEvent": false
                },
                "Enabled": true
              }
            expectedOutput = {"campaignId": 5678, "createdAt": NaN, "dataFields": {"campaignId": 5678, "category": "test", "email": "test@test.com", "name": "pageName", "templateId": 1234}, "email": "test@test.com", "eventName": "pageName page", "templateId": 1234, "userId": "anonId"}
            expect(pageAction(getTestMessage(), destination, ConfigCategory.PAGE)).toEqual(expectedOutput);
        });
    });
    describe('Unit test cases for iterbale screenAction', () => {
        it('For trackAllPages', async () => {
            destination = {
                "Config": {
                  "apiKey": "12345",
                  "mapToSingleEvent": false,
                  "trackAllPages": true,
                  "trackCategorisedPages": false,
                  "trackNamedPages": false
                },
                "Enabled": true
              }
            expectedOutput = {"campaignId": 5678, "createdAt": NaN, "dataFields": {"campaignId": 5678, "category": "test", "email": "test@test.com", "name": "pageName", "templateId": 1234}, "email": "test@test.com", "eventName": "pageName screen", "templateId": 1234, "userId": "anonId"}
            expect(screenAction(getTestMessage(), destination, ConfigCategory.SCREEN)).toEqual(expectedOutput);
        });
    
        it('For trackCategorisedPages', async () => {
            destination = {
                "Config": {
                  "apiKey": "12345",
                  "mapToSingleEvent": false,
                  "trackAllPages": false,
                  "trackCategorisedPages": true,
                  "trackNamedPages": false
                },
                "Enabled": true
              }
            expectedOutput =  {"campaignId": 5678, "createdAt": NaN, "dataFields": {"campaignId": 5678, "category": "test", "email": "test@test.com", "name": "pageName", "templateId": 1234}, "email": "test@test.com", "eventName": "pageName screen", "templateId": 1234, "userId": "anonId"}
            expect(screenAction(getTestMessage(), destination, ConfigCategory.SCREEN)).toEqual(expectedOutput);
        });
    
        it('For trackNamedPages', async () => {
            destination = {
                "Config": {
                  "apiKey": "12345",
                  "mapToSingleEvent": false,
                  "trackAllPages": false,
                  "trackCategorisedPages": false,
                  "trackNamedPages": true
                },
                "Enabled": true
              }
            expectedOutput = {"campaignId": 5678, "createdAt": NaN, "dataFields": {"campaignId": 5678, "category": "test", "email": "test@test.com", "name": "pageName", "templateId": 1234}, "email": "test@test.com", "eventName": "pageName screen", "templateId": 1234, "userId": "anonId"}
            expect(screenAction(getTestMessage(), destination, ConfigCategory.SCREEN)).toEqual(expectedOutput);
        });
    
        it('For mapToSingleEvent', async () => {
            destination = {
                "Config": {
                  "apiKey": "12345",
                  "mapToSingleEvent": false,
                  "trackAllPages": false,
                  "trackCategorisedPages": false,
                  "trackNamedPages": true,
                  "mapToSingleEvent": true
                },
                "Enabled": true
              }
            expectedOutput = {"campaignId": 5678, "createdAt": NaN, "dataFields": {"campaignId": 5678, "category": "test", "email": "test@test.com", "name": "pageName", "templateId": 1234}, "email": "test@test.com", "eventName": "Loaded a Screen", "templateId": 1234, "userId": "anonId"}
            expect(screenAction(getTestMessage(), destination, ConfigCategory.SCREEN)).toEqual(expectedOutput);
        });
    
        it('For non-mapToSingleEvent', async () => {
            destination = {
                "Config": {
                  "apiKey": "12345",
                  "mapToSingleEvent": false,
                  "trackAllPages": false,
                  "trackCategorisedPages": false,
                  "trackNamedPages": true,
                  "mapToSingleEvent": false
                },
                "Enabled": true
              }
            expectedOutput = {"campaignId": 5678, "createdAt": NaN, "dataFields": {"campaignId": 5678, "category": "test", "email": "test@test.com", "name": "pageName", "templateId": 1234}, "email": "test@test.com", "eventName": "pageName screen", "templateId": 1234, "userId": "anonId"}
            expect(screenAction(getTestMessage(), destination, ConfigCategory.SCREEN)).toEqual(expectedOutput);
        });
    });
    describe('Unit test cases for iterable trackAction', () => {
        it('flow check', async () => {
            expectedOutput =  {"campaignId": 5678, "createdAt": NaN, "dataFields": {"campaignId": 5678, "category": "test", "email": "test@test.com", "name": "pageName", "templateId": 1234}, "email": "test@test.com", "eventName": "testEventName", "templateId": 1234, "userId": "anonId"}
            expect(trackAction(getTestMessage(), ConfigCategory.TRACK)).toEqual(expectedOutput);
        });
    });
    describe('Unit test cases for iterable trackPurchaseAction', () => {
        it('flow check without product array', async () => {
            expectedOutput = {"campaignId": 1111, "createdAt": NaN, "dataFields": {"campaignId": "1111", "category": "categoryTest1, categoryTest2", "name": "no product array present", "price": "10", "product_id": 1234, "quantity": "2", "sku": "abcd", "templateId": "2222", "total": "20"}, "items": [{"categories": ["categoryTest1", " categoryTest2"], "id": 1234, "name": "no product array present", "price": 10, "quantity": 2, "sku": "abcd"}], "templateId": 2222, "total": 20, "user": {"dataFields": {"address": {"city": "kolkata", "country": "India"}, "createdAt": "2014-05-21T15:54:20Z", "email": "abc@test.com", "name": "rudder", "timestamp": "2014-05-21T15:54:20Z", "userId": "userId"}, "email": "abc@test.com", "mergeNestedObjects": true, "preferUserId": true, "userId": "userId"}}
            expect(trackPurchaseAction(getTestEcommMessage(), ConfigCategory.TRACK_PURCHASE)).toEqual(expectedOutput);
        });
    
        it('flow check with product array', async () => {
            fittingPayload = {...getTestEcommMessage()};
            fittingPayload.properties.products = [{  "product_id": 1234,"sku": "abcd", "name": "no product array present","category": "categoryTest1, categoryTest2", "price": "10","quantity": "2", "total": "20",}]
            expectedOutput = {"campaignId": 1111, "createdAt": NaN, "dataFields": {"campaignId": "1111", "category": "categoryTest1, categoryTest2", "name": "no product array present", "price": "10", "product_id": 1234, "products": [{"category": "categoryTest1, categoryTest2", "name": "no product array present", "price": "10", "product_id": 1234, "quantity": "2", "sku": "abcd", "total": "20"}], "quantity": "2", "sku": "abcd", "templateId": "2222", "total": "20"}, "items": [{"categories": ["categoryTest1", " categoryTest2"], "id": 1234, "name": "no product array present", "price": 10, "quantity": 2, "sku": "abcd"}], "templateId": 2222, "total": 20, "user": {"dataFields": {"address": {"city": "kolkata", "country": "India"}, "createdAt": "2014-05-21T15:54:20Z", "email": "abc@test.com", "name": "rudder", "timestamp": "2014-05-21T15:54:20Z", "userId": "userId"}, "email": "abc@test.com", "mergeNestedObjects": true, "preferUserId": true, "userId": "userId"}}
            expect(trackPurchaseAction(fittingPayload, ConfigCategory.TRACK_PURCHASE)).toEqual(expectedOutput);
        });
    });
    describe('Unit test cases for iterable updateCartAction', () => {
        it('flow check without product array', async () => {
            expectedOutput =  {"items": [{"categories": ["categoryTest1", " categoryTest2"], "id": 1234, "name": "no product array present", "price": 10, "quantity": 2, "sku": "abcd"}], "user": {"dataFields": {"address": {"city": "kolkata", "country": "India"}, "createdAt": "2014-05-21T15:54:20Z", "email": "abc@test.com", "name": "rudder", "timestamp": "2014-05-21T15:54:20Z", "userId": "userId"}, "email": "abc@test.com", "mergeNestedObjects": true, "preferUserId": true, "userId": "userId"}}
            expect(updateCartAction(getTestEcommMessage(), ConfigCategory.UPDATE_CART)).toEqual(expectedOutput);
        });
    
        it('flow check with product array', async () => {
            fittingPayload = {...getTestEcommMessage()};
            fittingPayload.properties.products = [{  "product_id": 1234,"sku": "abcd", "name": "no product array present","category": "categoryTest1, categoryTest2", "price": "10","quantity": "2", "total": "20",}]
            expectedOutput = {"items": [{"categories": ["categoryTest1", " categoryTest2"], "id": 1234, "name": "no product array present", "price": 10, "quantity": 2, "sku": "abcd"}], "user": {"dataFields": {"address": {"city": "kolkata", "country": "India"}, "createdAt": "2014-05-21T15:54:20Z", "email": "abc@test.com", "name": "rudder", "timestamp": "2014-05-21T15:54:20Z", "userId": "userId"}, "email": "abc@test.com", "mergeNestedObjects": true, "preferUserId": true, "userId": "userId"}}
            expect(updateCartAction(fittingPayload, ConfigCategory.UPDATE_CART)).toEqual(expectedOutput);
        });
    });
});
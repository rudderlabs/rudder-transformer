const {handleSearch} = require('../../../../src/v0/destinations/facebook_pixel/transform');

describe("Unit test cases for facebook_pixel handle search", () => {
    let message = {
            "properties": {
                "currency": "CAD",
                "quantity": 1,
                "price": 24.75,
                "value": 30,
                "name": "my product 1",
                "category": "clothing",
                "sku": "p-298",
                "testDimension": true,
                "testMetric": true,
                "position": 4.5,
                "query": "HDMI Cable"
            }
    };
  
    it("should return content with all fields not null", async () => {
      const expectedOutput = {
        "content_ids": [
          "p-298"
        ],
        "content_category": "clothing",
        "value": 30,
        "search_string": "HDMI Cable",
        "contents": [
          {
            "id": "p-298",
            "quantity": 1,
            "item_price": 24.75
          }
        ]
      };
      await expect(
        handleSearch(message)
      ).toEqual(expectedOutput);
    });
  
  });
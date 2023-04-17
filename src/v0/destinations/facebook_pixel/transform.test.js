const { handleSearch } = require('../../../../src/v0/destinations/facebook_pixel/transform');

const getTestMessage = () => {
  let message = {
    properties: {
      currency: 'CAD',
      quantity: 1,
      price: 24.75,
      value: 30,
      name: 'my product 1',
      category: 'clothing',
      sku: 'p-298',
      testDimension: true,
      testMetric: true,
      position: 4.5,
      query: 'HDMI Cable',
    },
  };
  return message;
};

describe('Unit test cases for facebook_pixel handle search', () => {
  it('should return content with all fields not null', async () => {
    const expectedOutput = {
      content_ids: ['p-298'],
      content_category: 'clothing',
      value: 30,
      search_string: 'HDMI Cable',
      contents: [
        {
          id: 'p-298',
          quantity: 1,
          item_price: 24.75,
        },
      ],
    };
    expect(handleSearch(getTestMessage())).toEqual(expectedOutput);
  });

  it("mapping 'product_id' with contentId", async () => {
    let message = getTestMessage();
    message.properties.product_id = 'prd-123';

    const expectedOutput = {
      content_ids: ['prd-123'],
      content_category: 'clothing',
      value: 30,
      search_string: 'HDMI Cable',
      contents: [
        {
          id: 'prd-123',
          quantity: 1,
          item_price: 24.75,
        },
      ],
    };
    expect(handleSearch(message)).toEqual(expectedOutput);
  });

  it("null/undefined 'properties'", async () => {
    let message = getTestMessage();
    message.properties = null;

    const expectedOutput = {
      content_category: '',
      content_ids: [],
      contents: [],
      search_string: undefined,
      value: 0,
    };
    expect(handleSearch(message)).toEqual(expectedOutput);
  });
});

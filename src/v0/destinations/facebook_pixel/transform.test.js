const {
  handleSearch,
  handleProductListViewed,
  handleProduct,
  handleOrder,
} = require('../../../../src/v0/destinations/facebook_pixel/transform');

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

const getTestCategoryToContent = () => {
  let categoryToContent = [
    {
      from: 'spin_result',
      to: 'Schedule',
    },
  ];
  return categoryToContent;
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

describe('Unit test cases for facebook_pixel handleProductListViewed', () => {
  it('without product array', () => {
    let expectedOutput = {
      content_category: 'clothing',
      content_ids: ['clothing'],
      content_name: undefined,
      content_type: 'product_group',
      contents: [{ id: 'clothing', quantity: 1 }],
      value: 30,
    };
    expect(handleProductListViewed(getTestMessage(), getTestCategoryToContent())).toEqual(
      expectedOutput,
    );
  });

  it('with product array', () => {
    let fittingPayload = { ...getTestMessage() };
    fittingPayload.properties.products = [{ id: 'clothing', quantity: 2 }];
    let expectedOutput = {
      content_category: 'clothing',
      content_ids: ['clothing'],
      content_name: undefined,
      content_type: 'product',
      contents: [{ id: 'clothing', item_price: undefined, quantity: 2 }],
      value: 30,
    };
    expect(handleProductListViewed(fittingPayload, getTestCategoryToContent())).toEqual(
      expectedOutput,
    );
  });
});

describe('Unit test cases for facebook_pixel handleProduct', () => {
  it('with valueFieldIdentifier properties.value', () => {
    let expectedOutput = {
      content_category: 'clothing',
      content_ids: ['p-298'],
      content_name: 'my product 1',
      content_type: 'product',
      contents: [{ id: 'p-298', item_price: 24.75, quantity: 1 }],
      currency: 'CAD',
      value: 30,
    };
    expect(handleProduct(getTestMessage(), getTestCategoryToContent(), 'properties.value')).toEqual(
      expectedOutput,
    );
  });

  it('with valueFieldIdentifier properties.price', () => {
    let expectedOutput = {
      content_category: 'clothing',
      content_ids: ['p-298'],
      content_name: 'my product 1',
      content_type: 'product',
      contents: [{ id: 'p-298', item_price: 24.75, quantity: 1 }],
      currency: 'CAD',
      value: 24.75,
    };
    expect(handleProduct(getTestMessage(), getTestCategoryToContent(), 'properties.price')).toEqual(
      expectedOutput,
    );
  });
});

describe('Unit test cases for facebook_pixel handleOrder', () => {
  it('without product array', () => {
    let expectedOutput = {
      content_category: 'clothing',
      content_ids: [],
      content_name: undefined,
      content_type: 'product',
      contents: [],
      currency: 'CAD',
      num_items: 0,
      value: 0,
    };
    expect(handleOrder(getTestMessage(), getTestCategoryToContent())).toEqual(expectedOutput);
  });

  it('with product array without revenue', () => {
    let fittingPayload = { ...getTestMessage() };
    fittingPayload.properties.products = [{ id: 'clothing', quantity: 2 }];
    let expectedOutput = {
      content_category: 'clothing',
      content_ids: ['clothing'],
      content_name: undefined,
      content_type: 'product',
      contents: [{ id: 'clothing', item_price: 24.75, quantity: 2 }],
      currency: 'CAD',
      num_items: 1,
      value: 0,
    };
    expect(handleOrder(fittingPayload, getTestCategoryToContent())).toEqual(expectedOutput);
  });

  it('with product array with revenue', () => {
    let fittingPayload = { ...getTestMessage() };
    fittingPayload.properties.products = [{ id: 'clothing', quantity: 2 }];
    fittingPayload.properties.revenue = 124;
    let expectedOutput = {
      content_category: 'clothing',
      content_ids: ['clothing'],
      content_name: undefined,
      content_type: 'product',
      contents: [{ id: 'clothing', item_price: 24.75, quantity: 2 }],
      currency: 'CAD',
      num_items: 1,
      value: 124,
    };
    expect(handleOrder(fittingPayload, getTestCategoryToContent())).toEqual(expectedOutput);
  });
});

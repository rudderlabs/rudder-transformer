const {
  getProductsFromLineItems,
  createPropertiesForEcomEventFromWebhook,
  getAnonymousIdFromAttributes,
} = require('./serverSideUtlis');

const { constructPayload } = require('../../../../v0/util');

const {
  lineItemsMappingJSON,
  productMappingJSON,
} = require('../../../../v0/sources/shopify/config');
const Message = require('../../../../v0/sources/message');
jest.mock('../../../../v0/sources/message');

const LINEITEMS = [
  {
    id: '41327142600817',
    grams: 0,
    presentment_title: 'The Collection Snowboard: Hydrogen',
    product_id: 7234590408818,
    quantity: 1,
    sku: '',
    taxable: true,
    title: 'The Collection Snowboard: Hydrogen',
    variant_id: 41327142600817,
    variant_title: '',
    variant_price: '600.00',
    vendor: 'Hydrogen Vendor',
    line_price: '600.00',
    price: '600.00',
    applied_discounts: [],
    properties: {},
  },
  {
    id: 14234727743601,
    gift_card: false,
    grams: 0,
    name: 'The Collection Snowboard: Nitrogen',
    price: '600.00',
    product_exists: true,
    product_id: 7234590408817,
    properties: [],
    quantity: 1,
    sku: '',
    title: 'The Collection Snowboard: Nitrogen',
    total_discount: '0.00',
    variant_id: 41327142600817,
    vendor: 'Hydrogen Vendor',
  },
];

describe('serverSideUtils.js', () => {
  beforeEach(() => {
    Message.mockClear();
  });

  describe('Test getProductsFromLineItems function', () => {
    it('should return empty array if lineItems is empty', () => {
      const lineItems = [];
      const result = getProductsFromLineItems(lineItems, lineItemsMappingJSON);
      expect(result).toEqual([]);
    });

    it('should return array of products', () => {
      const mapping = {};
      const result = getProductsFromLineItems(LINEITEMS, lineItemsMappingJSON);
      expect(result).toEqual([
        { brand: 'Hydrogen Vendor', price: '600.00', product_id: 7234590408818, quantity: 1 },
        {
          brand: 'Hydrogen Vendor',
          price: '600.00',
          product_id: 7234590408817,
          quantity: 1,
          title: 'The Collection Snowboard: Nitrogen',
        },
      ]);
    });
  });

  describe('Test createPropertiesForEcomEventFromWebhook function', () => {
    it('should return empty array if lineItems is empty', () => {
      const message = {
        line_items: [],
        type: 'track',
        event: 'checkout created',
      };
      const result = createPropertiesForEcomEventFromWebhook(message);
      expect(result).toEqual([]);
    });

    it('should return array of products', () => {
      const message = {
        line_items: LINEITEMS,
        type: 'track',
        event: 'checkout updated',
      };
      const result = createPropertiesForEcomEventFromWebhook(message);
      expect(result).toEqual({
        products: [
          { brand: 'Hydrogen Vendor', price: '600.00', product_id: 7234590408818, quantity: 1 },
          {
            brand: 'Hydrogen Vendor',
            price: '600.00',
            product_id: 7234590408817,
            quantity: 1,
            title: 'The Collection Snowboard: Nitrogen',
          },
        ],
      });
    });
  });

  describe('getAnonymousIdFromAttributes', () => {
    // Handles empty note_attributes array gracefully
    it('should return null when note_attributes is an empty array', async () => {
      const event = { note_attributes: [] };
      const result = await getAnonymousIdFromAttributes(event);
      expect(result).toBeNull();
    });

    it('get anonymousId from noteAttributes', async () => {
      const event = {
        note_attributes: [{ name: 'rudderAnonymousId', value: '123456' }],
      };
      const result = await getAnonymousIdFromAttributes(event);
      expect(result).toEqual('123456');
    });
  });
});

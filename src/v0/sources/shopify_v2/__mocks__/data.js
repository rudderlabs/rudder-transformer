const lineItems = [
  {
    product_id: 'prd1',
    sku: '',
    name: 'Shirt 1 - LARGE',
    title: 'Shirt 1',
    price: 5,
    vendor: 'vendor1',
    quantity: 2,
    variant_title: 'LARGE',
    extra_property1: 'extra value1',
  },
  {
    product_id: 'prd2',
    sku: '',
    name: 'Shirt 2 - SMALL',
    title: 'Shirt 2',
    price: 4,
    vendor: 'vendor2',
    quantity: 1,
    variant_title: 'SMALL',
    extra_property2: 'extra value2',
  },
];

const products = [
  {
    product_id: 'prd1',
    variant_name: 'Shirt 1 - LARGE',
    name: 'Shirt 1',
    price: 5,
    brand: 'vendor1',
    quantity: 2,
    variant: 'LARGE',
    extra_property1: 'extra value1',
  },
  {
    product_id: 'prd2',
    variant_name: 'Shirt 2 - SMALL',
    name: 'Shirt 2',
    price: 4,
    brand: 'vendor2',
    quantity: 1,
    variant: 'SMALL',
    extra_property2: 'extra value2',
  },
];

const checkoutsCreateWebhook = {
  id: 1234,
  total_price: '100',
  subtotal_price: '70',
  shipping_lines: [
    { id: 1, price: 7 },
    { id: 2, price: 3.2 },
  ],
  total_tax: 30,
  total_discounts: 5,
  discount_codes: [{ code: 'code1' }, { code: 'code2' }],
  currency: 'USD',
  extra_property: 'extra value',
  line_items: lineItems,
};

const checkoutsUpdateWebhook = {
  checkout_step_viewed: {
    id: 1234,
    total_price: '100',
    subtotal_price: '70',
    shipping_lines: [{ id: 1, price: 7, title: 'Standard' }],
    total_tax: 30,
    total_discounts: 5,
    discount_codes: [{ code: 'code1' }, { code: 'code2' }],
    currency: 'USD',
    extra_property: 'extra value',
    line_items: lineItems,
  },
  checkout_step_completed: {
    id: 1234,
    total_price: '100',
    subtotal_price: '70',
    shipping_lines: [{ id: 1, price: 7, title: 'Standard' }],
    total_tax: 30,
    total_discounts: 5,
    discount_codes: [{ code: 'code1' }, { code: 'code2' }],
    currency: 'USD',
    gateway: 'cash',
    completed_at: '2023-06-28T11:08:14+00:00',
    extra_property: 'extra value',
    line_items: lineItems,
  },
  payment_info_entered: {
    id: 1234,
    total_price: '100',
    subtotal_price: '70',
    shipping_lines: [{ id: 1, price: 7, title: 'Standard' }],
    total_tax: 30,
    total_discounts: 5,
    discount_codes: [{ code: 'code1' }, { code: 'code2' }],
    currency: 'USD',
    gateway: 'cash',
    extra_property: 'extra value',
    line_items: lineItems,
  },
};

const ordersUpdatedWebhook = {
  checkout_id: 1234,
  id: 3456,
  total_price: '100',
  subtotal_price: '70',
  shipping_lines: [
    { id: 1, price: 7 },
    { id: 2, price: 3.2 },
  ],
  total_tax: 30,
  total_discounts: 5,
  discount_codes: [{ code: 'code1' }, { code: 'code2' }],
  currency: 'USD',
  extra_property: 'extra value',
  line_items: lineItems,
};

const ordersPaidWebhook = {
  checkout_id: 1234,
  id: 3456,
  total_price: '100',
  subtotal_price: '70',
  shipping_lines: [
    { id: 1, price: 7 },
    { id: 2, price: 3.2 },
  ],
  total_tax: 30,
  total_discounts: 5,
  discount_codes: [{ code: 'code1' }, { code: 'code2' }],
  currency: 'USD',
  extra_property: 'extra value',
  line_items: lineItems,
};

const ordersCancelledWebhook = {
  checkout_id: 1234,
  id: 3456,
  total_price: '100',
  subtotal_price: '70',
  shipping_lines: [
    { id: 1, price: 7 },
    { id: 2, price: 3.2 },
  ],
  total_tax: 30,
  total_discounts: 5,
  discount_codes: [{ code: 'code1' }, { code: 'code2' }],
  currency: 'USD',
  extra_property: 'extra value',
  line_items: lineItems,
};

module.exports = {
  lineItems,
  products,
  checkoutsCreateWebhook,
  checkoutsUpdateWebhook,
  ordersUpdatedWebhook,
  ordersPaidWebhook,
  ordersCancelledWebhook,
};

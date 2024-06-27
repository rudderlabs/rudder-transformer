export const destination = {
  Config: {
    appId: 'random-818c-4a28-b98e-6cd8a994eb22',
    emailDeviceType: true,
    smsDeviceType: true,
    eventAsTags: false,
    allowedProperties: [
      { propertyName: 'brand' },
      { propertyName: 'firstName' },
      { propertyName: 'price' },
    ],
    version: 'V2',
  },
};

export const endpoint = 'https://api.onesignal.com/apps/random-818c-4a28-b98e-6cd8a994eb22/users';

export const headers = { Accept: 'application/json', 'Content-Type': 'application/json' };

export const commonTraits = {
  brand: 'John Players',
  price: '15000',
  firstName: 'Test',
};
export const commonTags = {
  brand: 'John Players',
  price: '15000',
  firstName: 'Test',
  anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
};

export const commonProperties = {
  products: [
    {
      sku: 3,
      iso: 'iso',
      quantity: 2,
      amount: 100,
    },
  ],
  brand: 'John Players',
  price: '15000',
  firstName: 'Test',
  customKey: 'customVal',
};

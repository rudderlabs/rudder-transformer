export const context = {
  device: {
    id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
    manufacturer: 'Xiaomi',
    model: 'Redmi 6',
    name: 'xiaomi',
  },
  network: { carrier: 'Banglalink' },
  os: { name: 'android', version: '8.1.0' },
  traits: {
    address: { city: 'Dhaka', country: 'Bangladesh' },
    anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
  },
};

export const destination = {
  Config: {
    webhookUrl: 'http://6b0e6a60.ngrok.io',
    headers: [
      { from: '', to: '' },
      { from: 'test2', to: 'value2' },
    ],
  },
  DestinationDefinition: { Config: { cdkV2Enabled: true } },
};

export const destinationWithoutHeaders = {
  Config: {
    webhookUrl: 'http://6b0e6a60.ngrok.io',
  },
  DestinationDefinition: { Config: { cdkV2Enabled: true } },
};

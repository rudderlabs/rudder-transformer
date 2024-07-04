export const destination = {
  Config: {
    accessToken: 'dummy-access-token',
    hubID: 'dummy-hubId',
    authorizationType: 'newPrivateAppApi',
    apiVersion: 'newApi',
    lookupField: 'email',
    hubspotEvents: [
      {
        rsEventName: 'Purchase',
        hubspotEventName: 'pedummy-hubId_rs_hub_test',
        eventProperties: [
          {
            from: 'Revenue',
            to: 'value',
          },
          {
            from: 'Price',
            to: 'cost',
          },
        ],
      },
      {
        rsEventName: 'Purchase2',
        hubspotEventName: 'pedummy-hubId_rs_hub_test',
        eventProperties: [
          {
            from: 'Revenue',
            to: 'value',
          },
          {
            from: 'Price',
            to: 'cost',
          },
        ],
      },
      {
        rsEventName: 'Order Complete',
        hubspotEventName: 'pedummy-hubId_rs_hub_chair',
        eventProperties: [
          {
            from: 'firstName',
            to: 'first_name',
          },
          {
            from: 'lastName',
            to: 'last_name',
          },
        ],
      },
    ],
  },
  destinationDefinition: {
    id: '1aIXqM806xAVm92nx07YwKbRrO9',
  },
  transformations: [],
};

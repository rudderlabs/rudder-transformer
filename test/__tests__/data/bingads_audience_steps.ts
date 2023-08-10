export const data = [
  {
    description: 'unhashed email available with hashEmail as true in config',
    stepName: 'prepareIdentifiersList',
    input: {
      message: {
        userId: 'user 1',
        type: 'audiencelist',
        properties: {
          listData: {
            add: [
              {
                email: 'alex@email.com',
              },
              {
                email: 'amy@abc.com',
              },
              {
                email: 'van@abc.com',
              },
            ],
          },
        },
        context: {
          ip: '14.5.67.21',
          library: {
            name: 'http',
          },
        },
        timestamp: '2020-02-02T00:23:09.544Z',
      },
      destination: {
        Config: {
          customerAccountId: '89236978',
          customerId: '78678678',
          audienceId: '564567',
          hashEmail: true,
        },
      },
    },
    output: [
      {
        list: [
          {
            hashedEmail: 'ac0f1baec38a9ef3cfcb56db981df7d9bab2568c7f53ef3776d1c059ec58e72b',
            email: 'alex@email.com',
          },
          {
            hashedEmail: '49eaeca26c878f268ad33af8cfa8194ca5b8b8e448b1c775bf9153a2de734579',
            email: 'amy@abc.com',
          },
          {
            hashedEmail: '2048acfa84a01121060ca2fc8a673a76d427176dc37224d4408c21973bd90e5c',
            email: 'van@abc.com',
          },
        ],
        action: 'Add',
      },
    ],
  },
  {
    description: 'hashed email available with hashEmail as false in config',
    stepName: 'prepareIdentifiersList',
    bindings: undefined,
    input: {
      message: {
        userId: 'user 1',
        type: 'audiencelist',
        properties: {
          listData: {
            update: [
              {
                email: 'ac0f1baec38a9ef3cfcb56db981df7d9bab2568c7f53ef3776d1c059ec58e72b',
              },
              {
                email: '49eaeca26c878f268ad33af8cfa8194ca5b8b8e448b1c775bf9153a2de734579',
              },
            ],
            remove: [
              {
                email: '2048acfa84a01121060ca2fc8a673a76d427176dc37224d4408c21973bd90e5c',
              },
            ],
          },
        },
        context: {
          ip: '14.5.67.21',
          library: {
            name: 'http',
          },
        },
        timestamp: '2020-02-02T00:23:09.544Z',
      },
      destination: {
        Config: {
          customerAccountId: '89236978',
          customerId: '78678678',
          audienceId: '564567',
          hashEmail: false,
        },
      },
    },
    output: [
      {
        list: [
          {
            hashedEmail: 'ac0f1baec38a9ef3cfcb56db981df7d9bab2568c7f53ef3776d1c059ec58e72b',
            email: 'ac0f1baec38a9ef3cfcb56db981df7d9bab2568c7f53ef3776d1c059ec58e72b',
          },
          {
            hashedEmail: '49eaeca26c878f268ad33af8cfa8194ca5b8b8e448b1c775bf9153a2de734579',
            email: '49eaeca26c878f268ad33af8cfa8194ca5b8b8e448b1c775bf9153a2de734579',
          },
        ],
        action: 'Replace',
      },
      {
        list: [
          {
            hashedEmail: '2048acfa84a01121060ca2fc8a673a76d427176dc37224d4408c21973bd90e5c',
            email: '2048acfa84a01121060ca2fc8a673a76d427176dc37224d4408c21973bd90e5c',
          },
        ],
        action: 'Remove',
      },
    ],
  },
  {
    description: 'validateInput should fail when properties are missing',
    stepName: 'validateInput',
    bindings: undefined,
    input: {
      message: {
        userId: 'user 1',
        type: 'audiencelist',
        context: {
          ip: '14.5.67.21',
          library: {
            name: 'http',
          },
        },
        timestamp: '2020-02-02T00:23:09.544Z',
      },
      destination: {
        Config: {
          customerAccountId: '89236978',
          customerId: '78678678',
          audienceId: '564567',
          hashEmail: false,
        },
      },
    },
    error: 'Message properties is not present. Aborting message.',
  },
];

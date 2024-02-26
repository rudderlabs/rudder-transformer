const { groupUserDataBasedOnConsentLevel } = require('./utils');

describe('groupUserDataBasedOnConsentLevel', () => {
  // Should group user data based on their consent level and return an array of objects
  it('should group user data based on their consent level and return an array of objects when input object is not empty', () => {
    const input = {
      properties: {
        listData: {
          add: [
            {
              email: 'user1@example.com',
              rs_garl_adUserData: 'UNSPECIFIED',
              rs_garl_adPersonalization: 'GRANTED',
            },
            {
              email: 'user2@example.com',
              rs_garl_adUserData: 'DENIED',
              rs_garl_adPersonalization: 'DENIED',
            },
          ],
          remove: [
            {
              email: 'user3@example.com',
              rs_garl_adUserData: 'UNSPECIFIED',
              rs_garl_adPersonalization: 'GRANTED',
            },
          ],
        },
      },
    };

    const expectedOutput = [
      {
        consent: { adUserData: 'UNSPECIFIED', adPersonalization: 'GRANTED' },
        add: [
          {
            email: 'user1@example.com',
          },
        ],
      },
      {
        consent: { adUserData: 'DENIED', adPersonalization: 'DENIED' },
        add: [
          {
            email: 'user2@example.com',
          },
        ],
      },
      {
        consent: { adUserData: 'UNSPECIFIED', adPersonalization: 'GRANTED' },
        remove: [
          {
            email: 'user3@example.com',
          },
        ],
      },
    ];

    const result = groupUserDataBasedOnConsentLevel(input);

    expect(result).toEqual(expectedOutput);
  });

  // Should return an empty array if the input object is empty
  it('should return an empty array when input object is empty', () => {
    const input = {
      properties: {
        listData: {
          add: [],
          remove: [],
        },
      },
    };

    const expectedOutput = [];

    const result = groupUserDataBasedOnConsentLevel(input);

    expect(result).toEqual(expectedOutput);
  });

  // Should transform and group user details by consent, filling 'UNSPECIFIED' for undefined values
  it("should transform and group user details by consent, filling 'UNSPECIFIED' for undefined values when input object is not empty", () => {
    const input = {
      properties: {
        listData: {
          add: [
            {
              email: 'user1@example.com',
              rs_garl_adUserData: 'UNSPECIFIED',
              rs_garl_adPersonalization: 'GRANTED',
            },
            {
              email: 'user2@example.com',
              rs_garl_adUserData: 'DENIED',
              rs_garl_adPersonalization: 'DENIED',
            },
          ],
          remove: [{ email: 'user3@example.com', rs_garl_adPersonalization: 'GRANTED' }],
        },
      },
    };

    const expectedOutput = [
      {
        consent: { adUserData: 'UNSPECIFIED', adPersonalization: 'GRANTED' },
        add: [
          {
            email: 'user1@example.com',
          },
        ],
      },
      {
        consent: { adUserData: 'DENIED', adPersonalization: 'DENIED' },
        add: [
          {
            email: 'user2@example.com',
          },
        ],
      },
      {
        consent: { adUserData: 'UNSPECIFIED', adPersonalization: 'GRANTED' },
        remove: [
          {
            email: 'user3@example.com',
          },
        ],
      },
    ];

    const result = groupUserDataBasedOnConsentLevel(input);

    expect(result).toEqual(expectedOutput);
  });
});

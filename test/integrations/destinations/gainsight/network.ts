export const networkCallsData = [
  {
    httpReq: {
      url: 'https://demo-domain.gainsightcloud.com/v1/data/objects/query/Company',
      method: 'POST',
      data: {
        select: ['Name'],
        where: {
          conditions: [
            {
              name: 'Name',
              alias: 'A',
              value: ['Kramerica Industries'],
              operator: 'EQ',
            },
          ],
          expression: 'A',
        },
      },
    },
    httpRes: {
      data: {
        result: true,
        errorCode: null,
        errorDesc: null,
        requestId: '47d9c8be-4912-4610-806c-0eec22b73236',
        data: {
          records: [],
        },
        message: null,
      },
      status: 200,
    },
  },
  {
    httpReq: {
      url: 'https://demo-domain.gainsightcloud.com/v1/data/objects/query/Company',
      method: 'POST',
      data: {
        select: ['Name'],
        where: {
          conditions: [
            {
              name: 'Name',
              alias: 'A',
              value: ['Seinfeld Corps'],
              operator: 'EQ',
            },
          ],
          expression: 'A',
        },
      },
    },
    httpRes: {
      data: {
        result: true,
        errorCode: null,
        errorDesc: null,
        requestId: '47d9c8be-4912-4610-806c-0eec22b73236',
        data: {
          records: [],
        },
        message: null,
      },
      status: 200,
    },
  },
  {
    httpReq: {
      url: 'https://demo-domain.gainsightcloud.com/v1/data/objects/query/Company',
      method: 'POST',
      data: {
        select: ['Name'],
        where: {
          conditions: [{ name: 'Name', alias: 'A', value: ['Rudderstack'], operator: 'EQ' }],
          expression: 'A',
        },
      },
    },
    httpRes: {
      data: {
        result: false,
        errorCode: 'GU_2400',
        errorDesc: 'Too many request',
        requestId: 'request-2',
        data: null,
        message: null,
      },
      status: 429,
    },
  },
  {
    httpReq: {
      url: 'https://demo-domain.gainsightcloud.com/v1/data/objects/query/Company',
      method: 'POST',
      data: {
        select: ['Name'],
        where: {
          conditions: [{ name: 'Name', alias: 'A', value: ['Rudderlabs'], operator: 'EQ' }],
          expression: 'A',
        },
      },
    },
    httpRes: {
      data: {
        result: false,
        errorCode: 'GU_1101',
        errorDesc: 'Oops, something went wrong.',
        requestId: 'request-3',
        data: null,
        message: null,
      },
      status: 500,
    },
  },
  {
    httpReq: {
      url: 'https://demo-domain.gainsightcloud.com/v1/data/objects/Company',
      method: 'POST',
    },
    httpRes: {
      data: {
        result: true,
        errorCode: null,
        errorDesc: null,
        requestId: '3ce46d4a-6a83-4a92-97b3-d9788a296af8',
        data: {
          count: 1,
          errors: null,
          records: [
            {
              Gsid: '1P0203VCESP7AUQMV9E953G',
            },
          ],
        },
        message: null,
      },
      status: 200,
    },
  },
  {
    httpReq: {
      url: 'https://demo-domain.gainsightcloud.com/v1/data/objects/Company?keys=Name',
      method: 'GET',
    },
    httpRes: {
      data: {
        result: true,
        errorCode: null,
        errorDesc: null,
        requestId: '30630809-40a7-45d2-9673-ac2e80d06f33',
        data: {
          count: 1,
          errors: null,
          records: [
            {
              Gsid: '1P0203VCESP7AUQMV9E953G',
            },
          ],
        },
        message: null,
      },
      status: 200,
    },
  },
  {
    httpReq: {
      url: 'https://demo-domain.gainsightcloud.com/v1/data/objects/query/Company',
      headers: {
        Accesskey: 'valid-access-key-for-update-group',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    },
    httpRes: {
      data: {
        result: true,
        errorCode: null,
        errorDesc: null,
        requestId: '8863e73c-a465-4fc6-a385-f7b3200720dc',
        data: {
          records: [
            {
              Name: 'Heroku',
              Renewal_Date: 1521743018667,
              Status: '1P01OI3OHC9S79J7VN8GQLUQDH0Y52CYFMXW',
              Stage: '1I0054U9FAKXZ0H26HO92M3F1G5SPWVQDNF3',
              Customer_Lifetime_in_Months: 22,
              'csm__gr.email': 'jnash@heroku.com',
            },
            {
              Name: 'ABC Inc.',
              Renewal_Date: 1521743018667,
              Status: '1P01OI3OHC9S79J7VN8GQLUQDH0Y52CYFMXW',
              Stage: '1I0054U9FAKXZ0H26HO92M3F1G5SPWVQDNF3',
              Customer_Lifetime_in_Months: 15,
              'csm__gr.email': 'cbrown@abc.com',
            },
            {
              Name: 'XYZ Inc.',
              Renewal_Date: 1521743018667,
              Status: '1P01OI3OHC9S79J7VN8GQLUQDH0Y52CYFMXW',
              Stage: '1I0054U9FAKXZ0H26HO92M3F1G5SPWVQDNF3',
              Customer_Lifetime_in_Months: 6,
              'csm__gr.email': 'dbess@xyz.com',
            },
          ],
        },
        message: null,
      },
      status: 200,
    },
  },
  {
    httpReq: {
      url: 'https://demo-domain.gainsightcloud.com/v1/data/objects/Company',
      headers: {
        Accesskey: 'valid-access-key-for-update-group',
        'Content-Type': 'application/json',
      },
      data: {
        records: [
          {
            Name: 'Testing company',
            Employees: 100,
            CompanyType: 'spoof',
            Industry: 'Sitcom',
            Status: 'complete',
          },
        ],
      },
      method: 'PUT',
    },
    httpRes: {
      data: {
        result: true,
        errorCode: null,
        errorDesc: null,
        requestId: 'eaa1520f-0b27-4468-86b0-17b4e94f1786',
        data: {
          count: 2,
          errors: null,
          records: [
            {
              CompanyType: 'spoof',
              Employees: 100,
              Industry: 'Sitcom',
              Name: 'Testing company',
              Status: 'complete',
              Gsid: '12345',
            },
          ],
        },
        message: null,
      },
      status: 200,
    },
  },
  {
    httpReq: {
      url: 'https://demo-domain.gainsightcloud.com/v1/data/objects/Company',
      headers: {
        Accesskey: 'valid-access-key-for-update-group',
        'Content-Type': 'application/json',
      },
      data: {
        records: [
          {
            Name: 'Testing company with failed update',
            Employees: 100,
            CompanyType: 'spoof',
            Industry: 'Sitcom',
            Status: 'complete',
          },
        ],
      },
      method: 'PUT',
    },
    httpRes: {
      data: {
        result: false,
        errorCode: 'GSOBJ_1006',
        errorDesc: 'Invalid dateTimes format (OriginalContractDate = 210318).',
        requestId: '7cba3c98-b04b-4e21-9e57-44807fa52b8a',
        data: {
          count: 0,
          errors: [
            [
              {
                success: false,
                parsedValue: 210318,
                errors: [
                  {
                    errorMessage: 'Invalid dateTime format',
                    errorCode: 'GSOBJ_1006',
                    fieldName: 'OriginalContractDate',
                    invalidValue: 210318,
                  },
                ],
              },
            ],
          ],
          records: null,
        },
        message: null,
      },
      status: 400,
    },
  },
];

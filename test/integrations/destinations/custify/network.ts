import { authHeader1 } from './maskedSecrets';
export const networkCallsData = [
  {
    httpReq: {
      url: 'https://api.custify.com/company',
      method: 'POST',
    },
    httpRes: {
      data: {
        company_id: '6',
        name: 'Pizzeria Presto',
        signed_up_at: '2019-05-30T12:00:00.000Z',
        size: 15,
        website: 'www.pizzeriapresto.com',
        industry: 'Restaurant',
        plan: 'Platinum',
        monthly_revenue: 1234567,
        churned: false,
        owners_csm: 'john.doe@mail.com',
        owners_account: 'john.doe@mail.com',
        parent_companies: [
          {
            id: '5ec50c9829d3c17c7cf455f2',
          },
          {
            id: '5ec50c9829d3c17c7cf457f2',
          },
        ],
        custom_attributes: {
          restaurants: 5,
          custom: 'template',
        },
      },
      status: 200,
    },
  },

  {
    httpReq: {
      method: 'delete',
      url: 'https://api.custify.com/people?user_id=rudder1',
      headers: {
        Authorization: authHeader1,
      },
    },
    httpRes: {
      data: {
        msg: 'All users associated with rudder1 were successfully deleted',
        code: 'Success',
        params: null,
      },
      status: 200,
    },
  },
  {
    httpReq: {
      method: 'delete',
      url: 'https://api.custify.com/people?user_id=rudder2',
      headers: {
        Authorization: authHeader1,
      },
    },
    httpRes: {
      data: {
        error: 'User: rudder2 not found',
      },
      status: 404,
    },
  },

  {
    httpReq: {
      method: 'delete',
      url: 'https://api.custify.com/people?user_id=rudder3',
      headers: {
        Authorization: authHeader1,
      },
    },
    httpRes: {
      data: {
        error: 'User: rudder3 has a problem',
      },
      status: 400,
    },
  },
];

export const networkCallsData = [
    {
        httpReq: {
            url: 'https://api.custify.com/company',
            method: 'POST',
        },
        httpRes: {
            data: {
                "company_id": "6",
                "name": "Pizzeria Presto",
                "signed_up_at": "2019-05-30T12:00:00.000Z",
                "size": 15,
                "website": "www.pizzeriapresto.com",
                "industry": "Restaurant",
                "plan": "Platinum",
                "monthly_revenue": 1234567,
                "churned": false,
                "owners_csm": "john.doe@mail.com",
                "owners_account": "john.doe@mail.com",
                "parent_companies": [
                    {
                        "id": "5ec50c9829d3c17c7cf455f2"
                    },
                    {
                        "id": "5ec50c9829d3c17c7cf457f2"
                    }
                ],
                "custom_attributes": {
                    "restaurants": 5,
                    "custom": "template"
                }
            },
            status: 200
        },
    }
];

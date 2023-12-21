export const networkCallsData = [
    {
        httpReq: {
            url: 'https://api.delighted.com/v1/people.json',
            method: 'GET',
            headers: { Authorization: `Basic ZHVtbXlBcGlLZXk=` },
            params: {
                email: "identified_user@email.com"
            }
        },
        httpRes: {
            data: ["user data"],
            status: 200
        },
    },
    {
        httpReq: {
            url: 'https://api.delighted.com/v1/people.json',
            method: 'GET',
            headers: { Authorization: `Basic ZHVtbXlBcGlLZXlmb3JmYWlsdXJl` },
            params: {
                email: "unidentified_user@email.com"
            }
        },
        httpRes: {
            data: [],
            status: 200
        },
    }
];

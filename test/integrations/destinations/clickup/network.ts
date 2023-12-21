export const networkCallsData = [
    {
        httpReq: {
            url: 'https://api.clickup.com/api/v2/list/correctListId123/field',
            method: 'GET',
        },
        httpRes: {
            data: {
                "fields": [
                    {
                        "id": "19d3ac4e-2b1e-4569-b33e-ff86c7d94d6e",
                        "name": "Labels",
                        "type": "labels",
                        "type_config": {
                            "options": [
                                {
                                    "id": "32c81c1c-cf53-4829-92f5-0f0270d27a45",
                                    "label": "Option 1",
                                    "color": {}
                                },
                                {
                                    "id": "7e24f329-9dd9-4e68-b426-2c70af6f9347",
                                    "label": "Option 2",
                                    "color": {}
                                }
                            ]
                        },
                        "date_created": "1661964865880",
                        "hide_from_guests": false,
                        "required": false
                    },
                    {
                        "id": "22eaffee-ffec-4c3b-bdae-56e69d55eecd",
                        "name": "Payment Status",
                        "type": "drop_down",
                        "type_config": {
                            "default": 0,
                            "placeholder": {},
                            "new_drop_down": true,
                            "options": [
                                {
                                    "id": "e109e36b-a052-4a31-af16-25da7324990f",
                                    "name": "Sent Request",
                                    "color": "#FF7FAB",
                                    "orderindex": 0
                                },
                                {
                                    "id": "3a3b4512-2896-44f7-8075-2ff37777fe24",
                                    "name": "Quote sent",
                                    "color": "#EA80FC",
                                    "orderindex": 1
                                },
                                {
                                    "id": "7afcb6fb-cec8-41d8-bf0c-039a9db28460",
                                    "name": "Pending",
                                    "color": "#ff7800",
                                    "orderindex": 2
                                },
                                {
                                    "id": "890ecf28-bdd4-4f53-92cc-bc4edb696fcd",
                                    "name": "Payment Recieved",
                                    "color": "#2ecd6f",
                                    "orderindex": 3
                                },
                                {
                                    "id": "e89f7dd7-fd24-4b32-ac4d-f174d8ca914f",
                                    "name": "n/a",
                                    "color": "#b5bcc2",
                                    "orderindex": 4
                                }
                            ]
                        },
                        "date_created": "1660124553414",
                        "hide_from_guests": false,
                        "required": {}
                    },
                    {
                        "id": "4b7a29be-e261-4340-8f3f-e6de838473e5",
                        "name": "Plan",
                        "type": "drop_down",
                        "type_config": {
                            "default": 0,
                            "placeholder": {},
                            "new_drop_down": true,
                            "options": [
                                {
                                    "id": "4b9366a7-2592-4b7a-909a-ed4af705e27c",
                                    "name": "Unlimited",
                                    "color": "#02BCD4",
                                    "orderindex": 0
                                },
                                {
                                    "id": "c5032049-8c05-44e9-a000-3a071d457b8f",
                                    "name": "Business",
                                    "color": "#1bbc9c",
                                    "orderindex": 1
                                },
                                {
                                    "id": "9fb08801-1130-4650-8e2e-28578344ff3c",
                                    "name": "Enterprise",
                                    "color": "#2ecd6f",
                                    "orderindex": 2
                                }
                            ]
                        },
                        "date_created": "1660124553414",
                        "hide_from_guests": false,
                        "required": {}
                    },
                    {
                        "id": "4bfebc00-9d4a-40d1-aef8-5a87b610186c",
                        "name": "Contact Title",
                        "type": "text",
                        "type_config": {},
                        "date_created": "1660124553414",
                        "hide_from_guests": false,
                        "required": {}
                    },
                    {
                        "id": "666f74bf-6d87-41f3-8735-ccf0efe066dd",
                        "name": "Date",
                        "type": "date",
                        "type_config": {},
                        "date_created": "1662379321069",
                        "hide_from_guests": false,
                        "required": false
                    },
                    {
                        "id": "a5f5044a-cbad-4caf-bcbb-4cd32bd8db7c",
                        "name": "Industry",
                        "type": "drop_down",
                        "type_config": {
                            "default": 0,
                            "placeholder": {},
                            "options": [
                                {
                                    "id": "75173398-257f-42b6-8bae-4cf767fa99ab",
                                    "name": "Engineering",
                                    "color": "#04A9F4",
                                    "orderindex": 0
                                },
                                {
                                    "id": "c7f9b6f5-cd98-4609-af10-68a8710cc1bf",
                                    "name": "Retail",
                                    "color": "#ff7800",
                                    "orderindex": 1
                                },
                                {
                                    "id": "dbe84940-b4e8-4a29-8491-e1aa5f2be4e2",
                                    "name": "Hospitality",
                                    "color": "#2ecd6f",
                                    "orderindex": 2
                                }
                            ]
                        },
                        "date_created": "1660124553414",
                        "hide_from_guests": false,
                        "required": {}
                    },
                    {
                        "id": "b01b32fd-94d3-43e6-9f31-2c855ff169cd",
                        "name": "Url",
                        "type": "url",
                        "type_config": {},
                        "date_created": "1661970432587",
                        "hide_from_guests": false,
                        "required": false
                    },
                    {
                        "id": "c9b83d91-b979-4b34-b4bd-88bf9cf2b9a6",
                        "name": "Phone Number",
                        "type": "phone",
                        "type_config": {},
                        "date_created": "1661970795061",
                        "hide_from_guests": false,
                        "required": false
                    },
                    {
                        "id": "d0201829-ddcd-4b97-b71f-0f9e672488f2",
                        "name": "Account Size",
                        "type": "number",
                        "type_config": {},
                        "date_created": "1660124553414",
                        "hide_from_guests": false,
                        "required": {}
                    },
                    {
                        "id": "ea6c1e48-2abf-4328-b228-79c213e147c8",
                        "name": "Location",
                        "type": "location",
                        "type_config": {},
                        "date_created": "1662229589329",
                        "hide_from_guests": false,
                        "required": false
                    },
                    {
                        "id": "ebe825fb-92de-41ce-a29c-25018da039b4",
                        "name": "Email",
                        "type": "email",
                        "type_config": {},
                        "date_created": "1660124553414",
                        "hide_from_guests": false,
                        "required": {}
                    },
                    {
                        "id": "f431cda3-a575-4a05-ba8d-583d9b6cb2df",
                        "name": "Rating",
                        "type": "emoji",
                        "type_config": {
                            "count": 5,
                            "code_point": "2b50"
                        },
                        "date_created": "1661963909454",
                        "hide_from_guests": false,
                        "required": false
                    },
                    {
                        "id": "ffbe4f03-cbc3-4077-8fea-9e5d08b4dceb",
                        "name": "Money In INR",
                        "type": "currency",
                        "type_config": {
                            "default": {},
                            "precision": 2,
                            "currency_type": "INR"
                        },
                        "date_created": "1661428276019",
                        "hide_from_guests": false,
                        "required": false
                    }
                ]
            },
            status: 200
        },
    },
    {
        httpReq: {
            url: 'https://api.clickup.com/api/v2/list/correctListId456/field',
            method: 'GET',
        },
        httpRes: {
            data: {
                "fields": []
            },
            status: 200
        },
    }
];

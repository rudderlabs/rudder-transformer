const event = {
    "request": {
        "query": {
            "whSchemaVersion": "v1"
        }
    },
    "message": {
        "context": {
            "shopifyDetails": {
                "id": 5778367414385,
                "current_total_tax": "10.00",
                "current_total_tax_set": {
                    "shop_money": {
                        "amount": "10.00",
                        "currency_code": "USD"
                    },
                },
                "name": "#1017",
                "phone": null,
            }
        },
        "integrations": {
            "SHOPIFY": true,
            "DATA_WAREHOUSE": {
                "options": {
                    "jsonPaths": [
                        "track.context.shopifyDetails"
                    ]
                }
            }
        },
        "type": "track",
        "event": "Order Updated",
        "properties": {
            "order_id": "5778367414385",
            "currency": "USD",
            "products": [
                {
                    "product_id": "7234590408817",
                    "price": 600,
                    "quantity": 1
                }
            ]
        },
        "userId": "123321",
        "traits": {},
        "timestamp": "2024-01-01T01:23:45.678Z",
    },
    "destination": {
        "Config": {},
    }
};

/* 
    Test for warehouse agnostic DATA_WAREHOUSE JSON column support for Shopify source
*/
describe('DATA_WAREHOUSE integrations', () => {
    it('should process event and return responses for common providers for agnostic support', () => {
        const responses = require('../../src/v0/destinations/snowflake/transform').process(event);
        expect(responses).toHaveLength(2);
        expect(responses[0].metadata.table).toBe('TRACKS');
        expect(responses[1].metadata.table).toBe('ORDER_UPDATED');

        expect(responses[0].metadata.columns.CONTEXT_SHOPIFY_DETAILS).toBe('json');
        expect(responses[0].data.CONTEXT_SHOPIFY_DETAILS).toBe(JSON.stringify({"id":5778367414385,"current_total_tax":"10.00","current_total_tax_set":{"shop_money":{"amount":"10.00","currency_code":"USD"}},"name":"#1017","phone":null}));

        expect(responses[1].metadata.columns.CONTEXT_SHOPIFY_DETAILS).toBe('json');
        expect(responses[1].data.CONTEXT_SHOPIFY_DETAILS).toBe(JSON.stringify({"id":5778367414385,"current_total_tax":"10.00","current_total_tax_set":{"shop_money":{"amount":"10.00","currency_code":"USD"}},"name":"#1017","phone":null}));
    });

    it('should process event and return response for other providers like mssql', () => {
        const responses = require('../../src/v0/destinations/mssql/transform').process(event);
        expect(responses).toHaveLength(2);
        expect(responses[0].metadata.table).toBe('tracks');
        expect(responses[1].metadata.table).toBe('order_updated');

        expect(responses[0].metadata.columns.context_shopify_details).toBe(undefined);
        expect(responses[0].metadata.columns.context_shopify_details_id).toBe('int');
        expect(responses[0].metadata.columns.context_shopify_details_current_total_tax).toBe('string');
        expect(responses[0].metadata.columns.context_shopify_details_current_total_tax_set_shop_money_amount).toBe('string');
        expect(responses[0].metadata.columns.context_shopify_details_current_total_tax_set_shop_money_currency_code).toBe('string');
        expect(responses[0].metadata.columns.context_shopify_details_name).toBe('string');
        expect(responses[0].data.context_shopify_details).toBe(undefined);
        expect(responses[0].data.context_shopify_details_id).toBe(5778367414385);
        expect(responses[0].data.context_shopify_details_current_total_tax).toBe('10.00');
        expect(responses[0].data.context_shopify_details_current_total_tax_set_shop_money_amount).toBe('10.00');
        expect(responses[0].data.context_shopify_details_current_total_tax_set_shop_money_currency_code).toBe('USD');
        expect(responses[0].data.context_shopify_details_name).toBe('#1017');

        expect(responses[1].metadata.columns.context_shopify_details).toBe(undefined);
        expect(responses[1].metadata.columns.context_shopify_details_id).toBe('int');
        expect(responses[1].metadata.columns.context_shopify_details_current_total_tax).toBe('string');
        expect(responses[1].metadata.columns.context_shopify_details_current_total_tax_set_shop_money_amount).toBe('string');
        expect(responses[1].metadata.columns.context_shopify_details_current_total_tax_set_shop_money_currency_code).toBe('string');
        expect(responses[1].metadata.columns.context_shopify_details_name).toBe('string');
        expect(responses[1].data.context_shopify_details).toBe(undefined);
        expect(responses[1].data.context_shopify_details_id).toBe(5778367414385);
        expect(responses[1].data.context_shopify_details_current_total_tax).toBe('10.00');
        expect(responses[1].data.context_shopify_details_current_total_tax_set_shop_money_amount).toBe('10.00');
        expect(responses[1].data.context_shopify_details_current_total_tax_set_shop_money_currency_code).toBe('USD');
        expect(responses[1].data.context_shopify_details_name).toBe('#1017');
    });
});
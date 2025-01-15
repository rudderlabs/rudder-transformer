const { processWarehouseMessage } = require('../../src/warehouse/index');

const message = {
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
};
/* 
    Test for warehouse agnostic DATA_WAREHOUSE JSON column support for Shopify source
*/
describe('processWarehouseMessage', () => {
    it('should process event and return responses for common providers for agnostic support', () => {
        const options = {
            metadata: undefined,
            provider: "snowflake",
            sourceCategory: null,
            destJsonPaths: "",
            destConfig: {
                rudderAccountId: "dummy-account-id",
                projectId: "dummy-project-id",
                datasetId: "dummy_dataset",
                tableId: "dummy_table",
            },
        };
        const responses = processWarehouseMessage(message, options);

        expect(responses).toHaveLength(2);
        expect(responses[0].metadata.table).toBe('TRACKS');
        expect(responses[1].metadata.table).toBe('ORDER_UPDATED');
        expect(typeof (responses[0].data.CONTEXT_SHOPIFY_DETAILS)).toBe('string');
        expect(Object.keys(responses[1].data).length).toBe(10);
    });
    it ('should process event and return response for other providers like mssql', () => {
        const options = {
            provider: "mssql",
            destConfig: {
                "host": "test-host",
                "database": "test-database",
                "user": "test-user",
                "password": "test-password",
                "port": "0000",
              },
        };
        const responses = processWarehouseMessage(message, options);
        expect(typeof (responses[0].data.context_shopify_details)).toBe("undefined");
    });
});
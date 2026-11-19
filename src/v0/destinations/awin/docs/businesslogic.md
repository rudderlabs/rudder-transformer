# Awin Business Logic

## Endpoint

`POST https://www.awin1.com/sread.php` with all data in query parameters and an empty body. The code uses `defaultRequestConfig()` (method POST); Awin's S2S examples use GET. **NEEDS REVIEW**: confirm POST is accepted.

## Flow

1. `Config.advertiserId` and `message.type` are required; only `track` is accepted.
2. Build `params` from `data/trackConfig.json`.
3. If `eventsToTrack` is an array:
   - event not in the list → `FilteredEventsError` (298).
   - event in the list → `getParams` adds defaults and `parts`, `trackProduct` adds `bd[n]`, `populateCustomTransactionProperties` adds `pN`.
4. If `eventsToTrack` is not an array, `finalParams` stays `{}` and a request with no parameters is sent. **NEEDS REVIEW**.

## Parameter Mapping

| Awin param  | Source                                                                     | Default            |
| ----------- | -------------------------------------------------------------------------- | ------------------ |
| `tt`        | constant                                                                   | `ss`               |
| `tv`        | constant                                                                   | `2`                |
| `merchant`  | `Config.advertiserId`                                                      |                    |
| `ch`        | constant                                                                   | `aw`               |
| `amount`    | `properties.amount` / `revenue` / `total` / `totalAmount` / `total_amount` |                    |
| `parts`     | `<commissionGroup>:<amount>` (only if amount present)                      | `DEFAULT:<amount>` |
| `vc`        | `properties.voucherCode` / `voucher_code`                                  |                    |
| `cr`        | `properties.currency` / `currencyCode` / `currency_code`                   |                    |
| `ref`       | `properties.order_id` / `orderId` / `orderReference` / `order_reference`   |                    |
| `testmode`  | `properties.testMode` / `test_mode` / `isTest` / `is_test`                 | `0`                |
| `cks`       | `properties.cks` / `properties.awc`                                        |                    |
| `bd[n]`     | `properties.products[]` (PLT)                                              |                    |
| `p1`, `p2`… | `customFieldMap`                                                           |                    |

`commissionGroup` comes from `properties.commissionGroup` / `commission_group` and is removed from the output after building `parts`.

## Product Level Tracking

Each product becomes:

```
AW:P|{advertiserId}|{orderReference}|{productId}|{name}|{price}|{quantity}|{sku}|{commissionGroupCode}|{category}
```

Values are URL-encoded. Product id is `product_id` or `productId`; `sku` and `category` default to `''`. Products with any undefined required value are skipped and indices stay contiguous.

## Example

Input:

```json
{
  "type": "track",
  "event": "Order Completed",
  "properties": {
    "order_id": "QW123",
    "revenue": 500,
    "commissionGroup": "sales",
    "currency": "GBP",
    "awc": "1234_abc",
    "products": [
      {
        "product_id": "123",
        "name": "Product 1",
        "price": 10,
        "quantity": 1,
        "category": "Category 1"
      }
    ]
  }
}
```

Output params (with `eventsToTrack: [{ "eventName": "Order Completed" }]`, `advertiserId: 1234`):

```json
{
  "amount": 500,
  "cr": "GBP",
  "ref": "QW123",
  "cks": "1234_abc",
  "tt": "ss",
  "tv": "2",
  "merchant": "1234",
  "ch": "aw",
  "parts": "sales:500",
  "testmode": "0",
  "bd[0]": "AW:P|1234|QW123|123|Product%201|10|1||sales%3A500|Category%201"
}
```

## Error Handling

- Filtered events: status 298.
- Missing config/type, unsupported type: 400 errors.
- Delivery errors use the server's default handling.

## Known Issues (NEEDS REVIEW)

- **Commission group in `bd[n]` is wrong**: `trackProduct` receives `params.parts` (`sales:500`) and puts it in the commission group code slot, producing `sales%3A500`. Awin expects only the code (for example `sales` or `DEFAULT`) there, and `:` is not an allowed character in codes. Product-level commission attribution is likely broken. The component tests encode this behaviour.
- `eventsToTrack` match is case-sensitive, unlike most allowlists in other destinations.

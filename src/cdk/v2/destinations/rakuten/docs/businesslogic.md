# Rakuten Business Logic

## Track

**Request:** `GET https://track.linksynergy.com/ep` with all data as query params.

Flow (`procWorkflow.yaml`):

1. Validate type is `track` and `mid` is set.
2. Map order-level fields from `data/propertiesMapping.json`.
3. Build pipe-joined line-item lists from `properties.products` (`constructLineItems`).
4. Add `xml=1`, `source=rudderstack`, `mid=<Config.mid>`. Drop null/undefined values.

### Order-level Mapping (`propertiesMapping.json`)

| Param                                      | Source (`properties.*` unless noted)                             | Notes         |
| ------------------------------------------ | ---------------------------------------------------------------- | ------------- |
| `ord`                                      | `order_id`, `orderId`                                            | required      |
| `land`                                     | `land`, `land_time`, `landTime`                                  | required      |
| `tr`                                       | `tr`, `ran_site_id`, `ranSiteID`                                 | default `" "` |
| `date`                                     | `date`, `order_completed_time`, `orderCompletedTime`             |               |
| `altord`                                   | `alt_ord`, `altord`, `alter_order_id`, `alterOrderId`            |               |
| `cur`                                      | `currency`                                                       |               |
| `cc`                                       | `credit_card_type`, `creditCardType`                             |               |
| `commreason`                               | `comm_reason`, `commReason`                                      |               |
| `iscomm`                                   | `is_comm`, `isComm`                                              |               |
| `consumed`, `coupon`, `segment`, `shipped` | same names                                                       |               |
| `custid`                                   | `cust_id`, `custId`, `customer_id`, `customerId`, `userId`       |               |
| `custscore`                                | `cust_score`, `custScore`, `customer_score`, `customerScore`     |               |
| `custstatus`                               | `cust_status`, `custStatus`, `customer_status`, `customerStatus` |               |
| `did`                                      | `dId`, `advertising_id`, `advertisingId`                         |               |
| `disamt`                                   | `disamt`, `discount_amount`, `discountAmount`                    |               |
| `ordstatus`                                | `ord_status`, `ordStatus`, `order_status`, `orderStatus`         |               |
| `shipcountry`                              | `ship_country`, `shipcountry`                                    |               |
| `sitename`                                 | `site_name`, `sitename`, `url`, `context.page.url`               |               |
| `storeid`                                  | `store_id`, `storeId`                                            |               |
| `storecat`                                 | `store_cat`, `storecat`, `store_category`, `storeCategory`       |               |

### Line-item Mapping (`config.js` `productProperties`)

Each list is the per-product values joined with `|`. A list is sent only if at least one product has a value; missing values become empty strings.

| Param                                                       | Product field                                                      | Required              |
| ----------------------------------------------------------- | ------------------------------------------------------------------ | --------------------- |
| `skulist`                                                   | `sku`                                                              | yes                   |
| `qlist`                                                     | `quantity`                                                         | yes                   |
| `namelist`                                                  | `name`                                                             | yes                   |
| `amtlist`                                                   | `amount * 100`, else `quantity (default 1) * price * 100`, rounded | yes (amount or price) |
| `brandlist`, `couponlist`, `catidlist`, `catlist`           | `brand`, `coupon`, `categoryId`, `category`                        | no                    |
| `disamtlist`, `distypelist`                                 | `discountAmount`, `discountType`                                   | no                    |
| `isclearancelist`, `ismarketplacelist`, `issalelist`        | `isClearance`, `isMarketPlace`, `isSale`                           | no                    |
| `itmstatuslist`, `marginlist`, `markdownlist`               | `itmStatus`, `margin`, `markdown`                                  | no                    |
| `shipidlist`, `shipbylist`, `taxexemptlist`, `sequencelist` | `shipId`, `shipBy`, `taxExempt`, `sequence`                        | no                    |

Amounts are in minor units (cents).

### Example

Input:

```json
{
  "type": "track",
  "event": "Order Completed",
  "properties": {
    "orderId": "ord-1",
    "landTime": "20240101_1200",
    "currency": "USD",
    "products": [
      { "sku": "A1", "name": "Shirt", "quantity": 2, "price": 10 },
      { "sku": "B2", "name": "Hat", "quantity": 1, "amount": 5.5 }
    ]
  }
}
```

Output params:

```json
{
  "ord": "ord-1",
  "tr": " ",
  "land": "20240101_1200",
  "cur": "USD",
  "skulist": "A1|B2",
  "qlist": "2|1",
  "namelist": "Shirt|Hat",
  "amtlist": "2000|550",
  "xml": 1,
  "source": "rudderstack",
  "mid": "<mid>"
}
```

## Response Handling

Done in `src/v0/destinations/rakuten/networkHandler.js` (proxy). Rakuten returns XML such as `<response><good>1</good><bad>0</bad></response>`. See the README table for how `<error>`, `<bad>` and status codes are mapped.

## Error Handling

- Validation failures: `InstrumentationError` / `ConfigurationError` (aborted).
- Delivery: see proxy response handling.

## Use Cases

- Server-side conversion tracking for Rakuten Advertising affiliate programs, so orders are attributed without relying on the browser pixel.

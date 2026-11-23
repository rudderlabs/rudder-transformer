# DCM Floodlight Business Logic and Mappings

## Request

- Method: `GET`
- Endpoint: `https://ad.doubleclick.net/ddm/activity/` followed by `key=value` pairs joined with `;`
- Headers: `User-Agent: <context.userAgent>`

Values (other than custom variables) are not URL-encoded.

## Base Mapping

| Source                                       | Floodlight param   |
| -------------------------------------------- | ------------------ |
| `Config.advertiserId`                        | `src`              |
| `Config.activityTag` (overridable per event) | `cat`              |
| `Config.groupTag` (overridable per event)    | `type`             |
| `context.device.advertisingId` (required)    | `dc_rdid`          |
| `properties.orderId` / `properties.order_id` | `ord` (sales tag)  |
| `properties.quantity`                        | `qty` (sales tag)  |
| `properties.revenue`                         | `cost` (sales tag) |
| `context.device.adTrackingEnabled`           | `dc_lat`           |

## Event Name

- `track`: `event`.
- `page`: `Viewed [properties.category] [name or properties.name] Page`.

The name is trimmed and lower-cased, then matched against `conversionEvents[].eventName` (also trimmed and lower-cased). No match → error.

## Conversion Event Handling

For the matched row:

- `floodlightActivityTag` → `cat`, `floodlightGroupTag` → `type` (if non-empty).
- `customVariables` (`from` → `to`): the value of `from` is looked up in properties, then traits; written to `u<N>` (any `u` in `to` is stripped, so `u1` and `1` both give `u1`). Values are URL-encoded; null, boolean, or strings containing `"`, `<`, `>`, `#` are skipped.
- **Sales tag** (`salesTag: true`): if `properties.products` exists, `qty` = sum of `products[].quantity`. `ord` and `cost` stay from the base mapping.
- **Counter tag** (`salesTag` false): `ord` = `messageId`; `qty` and `cost` removed.

## Privacy Flags (integrations object)

| Integrations key | Floodlight param                   |
| ---------------- | ---------------------------------- |
| `COPPA`          | `tag_for_child_directed_treatment` |
| `GDPR`           | `tfua`                             |
| `npa`            | `npa`                              |

Values `true`/`1` → `1`, `false`/`0` → `0`; anything else throws.

## Notes and Possible Issues

- **`dc_lat` is inverted.** `dc_lat` is Google's "limit ad tracking" flag (`1` = user limited tracking). The code maps `adTrackingEnabled: true` → `dc_lat=1` (tests confirm this), which tells Google the user opted out when tracking is enabled. Likely bug.
- **`dc_lat` when tracking is disabled.** The `.dc_lat ? mapFlagValue(...)` step only runs for truthy values. `adTrackingEnabled: false` skips it, and `removeUndefinedAndNullValues` keeps `false`, so the URL contains `dc_lat=false`. Likely bug.
- `tag_for_child_directed_treatment` is only sent when `COPPA` is set; Google lists it as required for in-app tags.
- Sales-tag `qty` sums `products[].quantity` but `cost` is not derived from products.

## Example

```text
GET https://ad.doubleclick.net/ddm/activity/src=12649566;cat=check0;type=conv00;dc_rdid=T0T0T072-5e28-45a1-9eda-ce22a3e36d1a;ord=111;qty=2;cost=800;dc_lat=1;tag_for_child_directed_treatment=0;tfua=1;npa=1
User-Agent: Mozilla/5.0 ...
```

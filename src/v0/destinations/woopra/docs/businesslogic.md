# Woopra Business Logic and Mappings

## Overview

Each event becomes one `GET` request. The payload is placed in `params` (query string). Every request gets `Project` (from `integrations.woopra.projectName` or `Config.projectName`) and `timestamp` (stringified epoch ms).

## Endpoints

| Message type | Endpoint                                | Method |
| ------------ | --------------------------------------- | ------ |
| identify     | `https://www.woopra.com/track/identify` | GET    |
| track        | `https://www.woopra.com/track/ce`       | GET    |
| page         | `https://www.woopra.com/track/ce`       | GET    |

## Common Mappings (all message types, `WoopraConfig.json`)

| RudderStack field                                                                                                            | Woopra param                                   |
| ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `traits.email` / `context.traits.email`                                                                                      | `cv_email`                                     |
| generic `title`, `birthday`, `firstName`, `lastName`, `middleName`, `name`, `city`, `website`, `state`, `zipcode`, `country` | `cv_<field>` (lower-case, e.g. `cv_firstname`) |
| `traits.age` / `context.traits.age`                                                                                          | `cv_age`                                       |
| `userId` (generic `userIdOnly`)                                                                                              | `cv_id`                                        |
| `timestamp` / `originalTimestamp`                                                                                            | `timestamp`                                    |
| `context.ip`                                                                                                                 | `cv_ip`                                        |
| `context.device.type`                                                                                                        | `device`                                       |
| `context.app.name`                                                                                                           | `app`                                          |
| `context.os.name`                                                                                                            | `os`                                           |

Additional fields built in `utils.js`:

- `cookie`: `context.externalId` of type `woopraId`, falling back to `anonymousId`.
- `browser`: browser name + version parsed from `context.userAgent`, concatenated without a separator (e.g. `Chrome110.0`).
- All other traits (from `traits` / `context.traits`) are sent as `cv_<key>`, excluding the common generic fields in `config.js` (`commomGenericFields`).
- All `properties` are sent as `ce_<key>`. For `page`, `search`, `title`, `referrer`, `url` are excluded here because they are mapped explicitly.

## Identify

Common mapping only, sent to `/track/identify`.

## Track

`event` is required and sent as `event`. Properties become `ce_*`.

## Page

Common mapping plus `WoopraPageConfig.json`:

| RudderStack field                       | Woopra param                                            |
| --------------------------------------- | ------------------------------------------------------- |
| `context.page.path`                     | `ce_pagepath`                                           |
| `context.page.initial_referring_domain` | `ce_page_initial_referring_domain`                      |
| `context.page.initial_referrer`         | `ce_page_intial_referrer` (typo kept for compatibility) |
| `context.page.referring_domain`         | `ce_page_referring_domain`                              |
| generic `GApageRef`                     | `ce_referrer`                                           |
| generic `GApageSearch`                  | `ce_search`                                             |
| generic `pageTitle`                     | `ce_title`                                              |
| generic `pageUrl`                       | `ce_url`                                                |

Event name (`getEvent`): `Viewed a Page`, `Viewed <category> Page`, `Viewed <name> Page` or `Viewed <category> <name> Page`. Note that `category` here is `message.category`, not `properties.category`.

## Notes and Possible Issues

- Woopra docs name the project parameter `project` (also accepting `domain`, `website`, `host`, `alias`). The code sends `Project` with a capital P. `NEEDS REVIEW`: confirm Woopra treats parameter names case-insensitively.
- `ce_page_intial_referrer` is misspelled. Changing it would rename a property already stored in customers' Woopra projects.

## Example

```json
{
  "method": "GET",
  "endpoint": "https://www.woopra.com/track/ce",
  "params": {
    "Project": "abc.com",
    "event": "Product Viewed",
    "timestamp": "1676886800000",
    "cookie": "anon-123",
    "cv_email": "jane@example.com",
    "ce_price": 10
  }
}
```

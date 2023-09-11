# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.41.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.40.2...v1.41.0) (2023-09-11)


### Features

* add support for updating profile properties through track call ([#2581](https://github.com/rudderlabs/rudder-transformer/issues/2581)) ([f0f20d6](https://github.com/rudderlabs/rudder-transformer/commit/f0f20d654ec5ee8eb078ce7f5610a4666d73fd8c))
* **INT-580:** messageId to event_id mapping support ([#2570](https://github.com/rudderlabs/rudder-transformer/issues/2570)) ([b38843b](https://github.com/rudderlabs/rudder-transformer/commit/b38843bce9bc02d73dceedc6f751f402251fd23a))
* **tiktok_ads:** messageId to event_id mapping support ([72f87bf](https://github.com/rudderlabs/rudder-transformer/commit/72f87bfa381ed7a5b74fb5907f932b78d0257ab9))


### Bug Fixes

* **bugsnag:** alerts ([266514b](https://github.com/rudderlabs/rudder-transformer/commit/266514bd56c150d6c88c1db0733a1da0a4367c02))
* **bugsnag:** alerts ([#2580](https://github.com/rudderlabs/rudder-transformer/issues/2580)) ([9e9eeac](https://github.com/rudderlabs/rudder-transformer/commit/9e9eeacdf79cf8175f87f302242542060f668db8))
* json paths for non tracks events for warehouse ([#2571](https://github.com/rudderlabs/rudder-transformer/issues/2571)) ([e455368](https://github.com/rudderlabs/rudder-transformer/commit/e45536805cf9545b73f4d5bf1be5fad1565ab075))

### [1.40.2](https://github.com/rudderlabs/rudder-transformer/compare/v1.40.1...v1.40.2) (2023-09-06)


### Bug Fixes

* marketo bulk upload import issue ([#2559](https://github.com/rudderlabs/rudder-transformer/issues/2559)) ([752f351](https://github.com/rudderlabs/rudder-transformer/commit/752f351f02b7f7611c702d7dbcb4804972bb0970))

### [1.40.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.40.0...v1.40.1) (2023-09-06)


### Bug Fixes

* **google_ads_offline_conversions:** partial failure status code issue ([abfce44](https://github.com/rudderlabs/rudder-transformer/commit/abfce44067dbcefe7f2db90a5bd8e2895fd49ea9))
* **google_ads_offline_conversions:** partial failure status code issue ([#2552](https://github.com/rudderlabs/rudder-transformer/issues/2552)) ([ae90087](https://github.com/rudderlabs/rudder-transformer/commit/ae900872680fd258dbb7cf10d5bfe6f02def94a5))
* type issue in lookup via externalid, row lock error as retryable ([#2553](https://github.com/rudderlabs/rudder-transformer/issues/2553)) ([319ff90](https://github.com/rudderlabs/rudder-transformer/commit/319ff903059f21f8b11df3e984547a82f35e7ceb))
* update datafile lookup error message ([#2555](https://github.com/rudderlabs/rudder-transformer/issues/2555)) ([c4aff36](https://github.com/rudderlabs/rudder-transformer/commit/c4aff3626a1f75059bd6a09edff1e38b4e6fc4e4))

## [1.40.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.39.1...v1.40.0) (2023-09-04)


### Features

* add eu instance support to kustomer destination ([#2513](https://github.com/rudderlabs/rudder-transformer/issues/2513)) ([34dbabf](https://github.com/rudderlabs/rudder-transformer/commit/34dbabfcec610b87a0a1512743528bef2e4b69ae))
* blank audience support in google ads ([#2526](https://github.com/rudderlabs/rudder-transformer/issues/2526)) ([54d3704](https://github.com/rudderlabs/rudder-transformer/commit/54d3704a9dea612b98735f7191351e8195af205a))
* eloqua new destination cdkv2 ([#2501](https://github.com/rudderlabs/rudder-transformer/issues/2501)) ([1db0573](https://github.com/rudderlabs/rudder-transformer/commit/1db0573eff0a0091248ffa2107fd8064a03ce2dd))
* **ga4:** added support of campaign_details event ([#2542](https://github.com/rudderlabs/rudder-transformer/issues/2542)) ([95920b8](https://github.com/rudderlabs/rudder-transformer/commit/95920b8a851e1e78a7154dae222033c7f34b3c09))
* **posthog:** support timestamp mapping from properties ([#2507](https://github.com/rudderlabs/rudder-transformer/issues/2507)) ([88392d7](https://github.com/rudderlabs/rudder-transformer/commit/88392d70b73525a15933e5a83a25df7d6c9417ee))
* retl audience support google ads ([#2530](https://github.com/rudderlabs/rudder-transformer/issues/2530)) ([804aa79](https://github.com/rudderlabs/rudder-transformer/commit/804aa79113ed628d4c4dc92ad5dd4aa347aabe5a))
* support for profiles event in redis ([#2497](https://github.com/rudderlabs/rudder-transformer/issues/2497)) ([f0c0a21](https://github.com/rudderlabs/rudder-transformer/commit/f0c0a211d167be2393c92db0a37dd517b1dbd1c4))


### Bug Fixes

* **braze:** enable merge behaviour to stitch user data ([#2508](https://github.com/rudderlabs/rudder-transformer/issues/2508)) ([8a2cf93](https://github.com/rudderlabs/rudder-transformer/commit/8a2cf93d9e83954edf1878390c254fb88a6c83c7))
* **gaoc:** custom variables issue ([#2545](https://github.com/rudderlabs/rudder-transformer/issues/2545)) ([3afee53](https://github.com/rudderlabs/rudder-transformer/commit/3afee53759e19765c4a284910cfd86e774dc0a24))
* **INT-512:** removed personal information from test cases ([#2517](https://github.com/rudderlabs/rudder-transformer/issues/2517)) ([9582e31](https://github.com/rudderlabs/rudder-transformer/commit/9582e31b9398f8d9bb01c431fd573fc54dbf7b3d))
* **iterable:** squadcast alert ([#2535](https://github.com/rudderlabs/rudder-transformer/issues/2535)) ([5a2194b](https://github.com/rudderlabs/rudder-transformer/commit/5a2194baa2c07d5b0fbe7bd7f4cfdec9117661ba))
* missing type for page and group calls ([#2512](https://github.com/rudderlabs/rudder-transformer/issues/2512)) ([bf08b9e](https://github.com/rudderlabs/rudder-transformer/commit/bf08b9e7177dbe7920e50e014484189a0c336b75))
* remove secure environment for datafile call ([#2544](https://github.com/rudderlabs/rudder-transformer/issues/2544)) ([b069e26](https://github.com/rudderlabs/rudder-transformer/commit/b069e262e9864a60611ee1b1e8e6c91dad76b7f4))
* fix: marketo bulk upload bugs and refactor ([#2414](https://github.com/rudderlabs/rudder-transformer/issues/2414)) ([9e3ace1](https://github.com/rudderlabs/rudder-transformer/pull/2546/commits/9e3ace17012f8fae3db35608367d98840037d1c0))

### [1.39.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.39.0...v1.39.1) (2023-08-28)


### Bug Fixes

* faas pods creation failure due to caching ([9b88c30](https://github.com/rudderlabs/rudder-transformer/commit/9b88c309856698e479858cfe78a0c0166a312f47))

## [1.39.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.38.0...v1.39.0) (2023-08-20)


### Features

* add remove empty values at all level utility ([#2459](https://github.com/rudderlabs/rudder-transformer/issues/2459)) ([39e5ef9](https://github.com/rudderlabs/rudder-transformer/commit/39e5ef995e53af7b60f51223e5c423548bc5140c))
* add support for test events for Pinterest tag ([#2460](https://github.com/rudderlabs/rudder-transformer/issues/2460)) ([a975eeb](https://github.com/rudderlabs/rudder-transformer/commit/a975eeb9573b88454fb2dba32225601d218c9e40))
* **INT-162:** adding email as fallback to userId ([#2487](https://github.com/rudderlabs/rudder-transformer/issues/2487)) ([9dc8ecb](https://github.com/rudderlabs/rudder-transformer/commit/9dc8ecbdd4d359a1dbd5c0f37c5bdf469ed1f96a))
* **INT-262:** added page call support ([#2446](https://github.com/rudderlabs/rudder-transformer/issues/2446)) ([b774172](https://github.com/rudderlabs/rudder-transformer/commit/b774172e781707e52498e2c384010500db4f7486))
* **INT-319:** update deletion support to v2 token authorization ([#2486](https://github.com/rudderlabs/rudder-transformer/issues/2486)) ([34661b9](https://github.com/rudderlabs/rudder-transformer/commit/34661b9a74ca1e29112afb3fd2b0d3111f509fe5))
* **iterable:** refactored destination code ([#2390](https://github.com/rudderlabs/rudder-transformer/issues/2390)) ([1ca6602](https://github.com/rudderlabs/rudder-transformer/commit/1ca66021cd9a48d987bc3ddb56e35cc7093222f3)), closes [#2424](https://github.com/rudderlabs/rudder-transformer/issues/2424) [#2477](https://github.com/rudderlabs/rudder-transformer/issues/2477)
* onboard batching support for clevertap ([#2418](https://github.com/rudderlabs/rudder-transformer/issues/2418)) ([27af06f](https://github.com/rudderlabs/rudder-transformer/commit/27af06fb4710058bf4ecbfebe7420c8121e36fe1))
* **optimizely:** add event name as fallback ([#2490](https://github.com/rudderlabs/rudder-transformer/issues/2490)) ([999595e](https://github.com/rudderlabs/rudder-transformer/commit/999595eaa0c255ce69dc0becea7b85e4aebc68ee))
* **zendesk:** add source field mapping ([#2455](https://github.com/rudderlabs/rudder-transformer/issues/2455)) ([0fcc00a](https://github.com/rudderlabs/rudder-transformer/commit/0fcc00aa82677a62eccea7cbd23661c370c87f28))


### Bug Fixes

* add error notifier ([6a99e61](https://github.com/rudderlabs/rudder-transformer/commit/6a99e61bfc9a3b78bf142b57dd344d1643ae6d3e))
* add error notifier ([a84755a](https://github.com/rudderlabs/rudder-transformer/commit/a84755a62c3fd61421e3e0f10689c9e1848a8a66))
* add mock for test ([dd9b2d4](https://github.com/rudderlabs/rudder-transformer/commit/dd9b2d497c8371821eef0a56e876c0aa03df9a86))
* add optional chaining and refactor get externalId util ([#2454](https://github.com/rudderlabs/rudder-transformer/issues/2454)) ([d4a8501](https://github.com/rudderlabs/rudder-transformer/commit/d4a8501f1d325a83abeb516bc3158be0988f6f9f))
* add response handling and simplify code ([8728c30](https://github.com/rudderlabs/rudder-transformer/commit/8728c307cec8689eb65b68e986dd386cefd5bffc))
* **intercom:** group call ([#2484](https://github.com/rudderlabs/rudder-transformer/issues/2484)) ([1f9bda7](https://github.com/rudderlabs/rudder-transformer/commit/1f9bda7cb4f425c40112a1bfb847d93f0e64f724))
* klaviyo error handling ([3db6305](https://github.com/rudderlabs/rudder-transformer/commit/3db630585f112a36f1163c5e7922135cae48b019))
* klaviyo error handling ([#2466](https://github.com/rudderlabs/rudder-transformer/issues/2466)) ([1c8ee9f](https://github.com/rudderlabs/rudder-transformer/commit/1c8ee9fe5010982468f6af232b411d60856f63c0))
* **klaviyo:** flatten properties if flattenProperties setting enabled from UI ([#2491](https://github.com/rudderlabs/rudder-transformer/issues/2491)) ([1091981](https://github.com/rudderlabs/rudder-transformer/commit/1091981ee0fdd5d8bc26f2a0eb4811d6d4ba9de5))
* **marketo:** add check for rETL events during getting leadId ([#2457](https://github.com/rudderlabs/rudder-transformer/issues/2457)) ([a416405](https://github.com/rudderlabs/rudder-transformer/commit/a41640599c648b84a545f3845625a3668c844bc6))
* optimizely get datafile call ([#2469](https://github.com/rudderlabs/rudder-transformer/issues/2469)) ([3f4a811](https://github.com/rudderlabs/rudder-transformer/commit/3f4a811d3cc932598ba8843feece95b1f22f78fb))
* parameterizedSearch to return the exact match ([#2428](https://github.com/rudderlabs/rudder-transformer/issues/2428)) ([183b7b6](https://github.com/rudderlabs/rudder-transformer/commit/183b7b61ae6595bae1c1a67c263a5f8fefc78631))
* pr conflicts ([#2483](https://github.com/rudderlabs/rudder-transformer/issues/2483)) ([9837b51](https://github.com/rudderlabs/rudder-transformer/commit/9837b51a931dd9b82e8290ac6a3c6f8d2699db14))
* prioritize timestamp over original timestamp ([#2462](https://github.com/rudderlabs/rudder-transformer/issues/2462)) ([49dc36a](https://github.com/rudderlabs/rudder-transformer/commit/49dc36a8bd459dcb8a923d5cd4b46d2e4d090749))
* remove unnecessary condition ([9407d27](https://github.com/rudderlabs/rudder-transformer/commit/9407d279c413a2eb5b614d1b5cce870c2b869bed))
* salesforce upsert when identifier is not present ([#2468](https://github.com/rudderlabs/rudder-transformer/issues/2468)) ([8a18de4](https://github.com/rudderlabs/rudder-transformer/commit/8a18de42a174b8939377e4a738510c04044600d6))
* **splitio:** remove empty objects/ array properties ([#2488](https://github.com/rudderlabs/rudder-transformer/issues/2488)) ([378854f](https://github.com/rudderlabs/rudder-transformer/commit/378854f3b0f86383db016359e324e52ff37c49fe))

## [1.38.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.37.0...v1.38.0) (2023-08-14)


### Features

* **june:** added page call support ([#2476](https://github.com/rudderlabs/rudder-transformer/issues/2476)) ([c7d086b](https://github.com/rudderlabs/rudder-transformer/commit/c7d086b427931639bcc85fb723e0c63486d5acc0))
* **zendesk:** add source field mapping ([#2455](https://github.com/rudderlabs/rudder-transformer/issues/2455)) ([#2475](https://github.com/rudderlabs/rudder-transformer/issues/2475)) ([a94bf1a](https://github.com/rudderlabs/rudder-transformer/commit/a94bf1a0b65fa5bd00fce752943e9b91f757fbbb))


### Bug Fixes

* **INT-296:** add destType labels for proxy destinations ([#2456](https://github.com/rudderlabs/rudder-transformer/issues/2456)) ([da80ce7](https://github.com/rudderlabs/rudder-transformer/commit/da80ce7696dfaf78fcd4ce4c245efdf305484e99))
* **intercom:** flatten metadata and custom attributes ([#2474](https://github.com/rudderlabs/rudder-transformer/issues/2474)) ([ec60141](https://github.com/rudderlabs/rudder-transformer/commit/ec601411b3b218ce32261369627653f66f393893))
* valid cart_update event extra check ([#2448](https://github.com/rudderlabs/rudder-transformer/issues/2448)) ([ec80855](https://github.com/rudderlabs/rudder-transformer/commit/ec808555ab82aa83957190e551c8106b570b3e3b))

## [1.37.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.36.1...v1.37.0) (2023-08-04)


### Features

* return relevant stack trace as error from ivm ([#2314](https://github.com/rudderlabs/rudder-transformer/issues/2314)) ([c908fc9](https://github.com/rudderlabs/rudder-transformer/commit/c908fc9ae904089749270267a842c9a6933d922c))
* sessionId stitching ([#2204](https://github.com/rudderlabs/rudder-transformer/issues/2204)) ([40105f5](https://github.com/rudderlabs/rudder-transformer/commit/40105f504414fb6a832d953a6faedb2f283aa09b))


### Bug Fixes

*  stat labels ([#2412](https://github.com/rudderlabs/rudder-transformer/issues/2412)) ([4d87931](https://github.com/rudderlabs/rudder-transformer/commit/4d879314766728a158445dfc6ceccd01972c289f))
* continue on git action failure to next steps ([#2429](https://github.com/rudderlabs/rudder-transformer/issues/2429)) ([d9ecf29](https://github.com/rudderlabs/rudder-transformer/commit/d9ecf2958a524a862eb7cecb06d5f02372a1bbde))
* customerIO source bugsnag issue for invalid timestamp ([#2413](https://github.com/rudderlabs/rudder-transformer/issues/2413)) ([d543f22](https://github.com/rudderlabs/rudder-transformer/commit/d543f220559ee5068c89f661f9096291256b0c2c))
* handle marketo auth token response when expires_in is 0 sec  ([#2432](https://github.com/rudderlabs/rudder-transformer/issues/2432)) ([a4d4367](https://github.com/rudderlabs/rudder-transformer/commit/a4d4367eba0b63a0c13b3267bbfc12ba66b19be4))
* **INT-256:** handling non float price input for braze purchase events ([#2431](https://github.com/rudderlabs/rudder-transformer/issues/2431)) ([f65ef89](https://github.com/rudderlabs/rudder-transformer/commit/f65ef8922387bee427f27ab7f82bafe10bc68a06))
* rETL timestamp order ([#2343](https://github.com/rudderlabs/rudder-transformer/issues/2343)) ([d949664](https://github.com/rudderlabs/rudder-transformer/commit/d9496648fdda324351fae36c9b44d7cef69f346a))
* **tiktok_ads:** format productId to string data type ([#2434](https://github.com/rudderlabs/rudder-transformer/issues/2434)) ([792a2aa](https://github.com/rudderlabs/rudder-transformer/commit/792a2aab0678ffce1809ef11d7a1de0d6b7864be))
* **transformation:** return retryable error when faas service exists … ([#2427](https://github.com/rudderlabs/rudder-transformer/issues/2427)) ([3b536d9](https://github.com/rudderlabs/rudder-transformer/commit/3b536d972d93261f20b9b43228d79ade5858c2f3))
* update images to fix integration tests ([#2417](https://github.com/rudderlabs/rudder-transformer/issues/2417)) ([e3df6dc](https://github.com/rudderlabs/rudder-transformer/commit/e3df6dc878455b320a78fae5e52d39a66f236e98))
* heap timestamp mapping ([#2451](https://github.com/rudderlabs/rudder-transformer/pull/2451)) ([713fcc2](https://github.com/rudderlabs/rudder-transformer/commit/713fcc22e20608b719aac2861323049511788398))
* **tiktok_ads:** format products array product ids to string ([#2445](https://github.com/rudderlabs/rudder-transformer/pull/2445)) ([4524547](https://github.com/rudderlabs/rudder-transformer/commit/4524547ed8328bf3099a8b907003313c7dc14659))

### [1.36.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.36.0...v1.36.1) (2023-07-26)


### Bug Fixes

* add changes for braze app id ([#2407](https://github.com/rudderlabs/rudder-transformer/issues/2407)) ([d37d9a1](https://github.com/rudderlabs/rudder-transformer/commit/d37d9a1599e2be9e2b864944e506dcc3eed5cd12))
* facebook pixel parity with device mode ([#2406](https://github.com/rudderlabs/rudder-transformer/issues/2406)) ([b30dcc6](https://github.com/rudderlabs/rudder-transformer/commit/b30dcc6d68aa28a75587b67a049e1b35085f77e0))
* for group call send email as identifier when userId is in email format ([#2404](https://github.com/rudderlabs/rudder-transformer/issues/2404)) ([91ccca2](https://github.com/rudderlabs/rudder-transformer/commit/91ccca2642a3db816c1483ca6ace619d1d458609))
* keen bugsnag issue for null context passed ([#2405](https://github.com/rudderlabs/rudder-transformer/issues/2405)) ([c80bd2a](https://github.com/rudderlabs/rudder-transformer/commit/c80bd2acce54bb20c1ba5f265bc81994fcf0e24f))

## [1.36.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.35.3...v1.36.0) (2023-07-21)


### Features

* add overridePageView support, separate link and page values ([#2370](https://github.com/rudderlabs/rudder-transformer/issues/2370)) ([99b3c87](https://github.com/rudderlabs/rudder-transformer/commit/99b3c878ceac946d68a30d76f56ed3f0dddf8b15))
* **adobe:** listMapping, customPropsMapping fields got updated. Made changes to reflect the same ([#2385](https://github.com/rudderlabs/rudder-transformer/issues/2385)) ([a2723ed](https://github.com/rudderlabs/rudder-transformer/commit/a2723edfcb26f9b38165cef59ddf90647aacc3cc))
* **intercom:** add config in dashboard to updateLastRequestAt ([#2379](https://github.com/rudderlabs/rudder-transformer/issues/2379)) ([068a38c](https://github.com/rudderlabs/rudder-transformer/commit/068a38c8d63011d1b358ab5fb7d42d791aff2c0b))
* **mixpanel:** batching ([#2341](https://github.com/rudderlabs/rudder-transformer/issues/2341)) ([9a7d08c](https://github.com/rudderlabs/rudder-transformer/commit/9a7d08c76d0c3151b77f7e5012e2d0f3917f2dce)), closes [#2351](https://github.com/rudderlabs/rudder-transformer/issues/2351) [#2378](https://github.com/rudderlabs/rudder-transformer/issues/2378)
* **mixpanel:** update alias mapping and add validation ([#2395](https://github.com/rudderlabs/rudder-transformer/issues/2395)) ([b6df9b0](https://github.com/rudderlabs/rudder-transformer/commit/b6df9b0edccfd704b3e952ea2b439e09b72ab2ea))
* **new integration:** stormly cloud mode destination ([#2148](https://github.com/rudderlabs/rudder-transformer/issues/2148)) ([#2361](https://github.com/rudderlabs/rudder-transformer/issues/2361)) ([d84ece5](https://github.com/rudderlabs/rudder-transformer/commit/d84ece5c23219122abe3ecf74972a5c0c7f900b6))
* onboard routes on swagger ([#2265](https://github.com/rudderlabs/rudder-transformer/issues/2265)) ([707cff0](https://github.com/rudderlabs/rudder-transformer/commit/707cff0f7bf575329b55951a33c0f666406e1a13))


### Bug Fixes

*  active campaign: message.context not sent and tags sent in non array format ([#2389](https://github.com/rudderlabs/rudder-transformer/issues/2389)) ([8bc9589](https://github.com/rudderlabs/rudder-transformer/commit/8bc9589c80cde6e3e2aa417904ce73106413b1a2))
* correct path for staging PR deployment ([#2392](https://github.com/rudderlabs/rudder-transformer/issues/2392)) ([2e67625](https://github.com/rudderlabs/rudder-transformer/commit/2e67625b69e57b54c8f62f1f9a2db51110fd7f1b))
* **ga4:** add validation for empty object, arrays, and string values from params ([#2315](https://github.com/rudderlabs/rudder-transformer/issues/2315)) ([a66810a](https://github.com/rudderlabs/rudder-transformer/commit/a66810af5e195648f5c27ff7162431dd4d191ec5))
* **intercom:** add validation on customAttributes ([bd4f2cb](https://github.com/rudderlabs/rudder-transformer/commit/bd4f2cbd89f54d263c945e4da1533ff9a33a67aa))
* **intercom:** add validation on customAttributes ([#2364](https://github.com/rudderlabs/rudder-transformer/issues/2364)) ([ddeae85](https://github.com/rudderlabs/rudder-transformer/commit/ddeae853fbb46a44c040eee30cb58a1ecf20bcb6))
* padding added in gender field in fb destination ([#2380](https://github.com/rudderlabs/rudder-transformer/issues/2380)) ([c2617a7](https://github.com/rudderlabs/rudder-transformer/commit/c2617a7801684ea6c6728321fb04a4dc4f6b8bf2))
* reject localhost requests from user transformer fetch calls ([#2298](https://github.com/rudderlabs/rudder-transformer/issues/2298)) ([6708c6c](https://github.com/rudderlabs/rudder-transformer/commit/6708c6c69e122e5fdfc16c4ed59a120be7a8b1e4))
* remove potential active secrets ([#2387](https://github.com/rudderlabs/rudder-transformer/issues/2387)) ([38d6803](https://github.com/rudderlabs/rudder-transformer/commit/38d680369fcef0312a678fc0b39e9577d8fba6a7))

### [1.35.3](https://github.com/rudderlabs/rudder-transformer/compare/v1.35.2...v1.35.3) (2023-07-21)


### Bug Fixes

* upgrade cdkv1 to 1.4.10 ([#2386](https://github.com/rudderlabs/rudder-transformer/issues/2386)) ([5e3d497](https://github.com/rudderlabs/rudder-transformer/commit/5e3d4975bd376232d2b22cfa37bd5ad8ae68d7a3))

### [1.35.2](https://github.com/rudderlabs/rudder-transformer/compare/v1.35.1...v1.35.2) (2023-07-17)

### [1.35.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.35.0...v1.35.1) (2023-07-12)


### Bug Fixes

* **iterable:** add dashboard config ([47c8631](https://github.com/rudderlabs/rudder-transformer/commit/47c863106f3fdec5c58d41980c653f44b5dac240))
* **iterable:** address comment ([8b83de6](https://github.com/rudderlabs/rudder-transformer/commit/8b83de6da6fd4373cc138f7db130514b676f982f))

## [1.35.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.34.1...v1.35.0) (2023-07-07)


### Features

* custom page event name amplitude ([#2284](https://github.com/rudderlabs/rudder-transformer/issues/2284)) ([01e5bf2](https://github.com/rudderlabs/rudder-transformer/commit/01e5bf24301c988b57ab456d2ad624686f20c05d))
* factorsAI page and group call support ([#2289](https://github.com/rudderlabs/rudder-transformer/issues/2289)) ([51f9009](https://github.com/rudderlabs/rudder-transformer/commit/51f9009270c38dbe6bec76056bdae43f9921de93))


### Bug Fixes

* convert epoch timestamp into gaoc accepted format ([#2344](https://github.com/rudderlabs/rudder-transformer/issues/2344)) ([4247c74](https://github.com/rudderlabs/rudder-transformer/commit/4247c742d96c8fd91d593d9558974000f25dd3e2))
* **facebook_pixel:** name conversion to string ([#2338](https://github.com/rudderlabs/rudder-transformer/issues/2338)) ([5530990](https://github.com/rudderlabs/rudder-transformer/commit/553099068835d3af24f28b983d58f9d8dacb80d2))
* incorrect usage of histogram as counter ([#2335](https://github.com/rudderlabs/rudder-transformer/issues/2335)) ([654f0ad](https://github.com/rudderlabs/rudder-transformer/commit/654f0adca54357cedaa07235b3f18cebf9e403c3))
* **iterable:** update addition of default value for some fields ([#2310](https://github.com/rudderlabs/rudder-transformer/issues/2310)) ([0f1ebba](https://github.com/rudderlabs/rudder-transformer/commit/0f1ebba73bbe760ae4d9d66f9f46fffb96ca27fc))


### [1.34.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.34.0...v1.34.1) (2023-07-07)


### Bug Fixes

* **iterable:** fix metadata format while batching ([#2345](https://github.com/rudderlabs/rudder-transformer/issues/2345)) ([256cb7e](https://github.com/rudderlabs/rudder-transformer/commit/256cb7ea042678443a6243d93d28c8bbaccacf32))

## [1.34.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.33.0...v1.34.0) (2023-06-30)


### Features

* **iterable:** update addition of default value for some fields ([#2319](https://github.com/rudderlabs/rudder-transformer/issues/2319)) ([0dfb7b6](https://github.com/rudderlabs/rudder-transformer/commit/0dfb7b68388b3169a2cf054614e83c7411324157))


### Bug Fixes

* mixpanel group call ([#2318](https://github.com/rudderlabs/rudder-transformer/issues/2318)) ([2f78436](https://github.com/rudderlabs/rudder-transformer/commit/2f78436a7633a84020c66b53eca3770186458683))

## [1.33.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.32.3...v1.33.0) (2023-06-23)


### Features

* braze router batching update ([#2273](https://github.com/rudderlabs/rudder-transformer/issues/2273)) ([772254d](https://github.com/rudderlabs/rudder-transformer/commit/772254d8bc21825741211b2cc0be29e95fe08eab))
* capture router success/failure metrics ([#2279](https://github.com/rudderlabs/rudder-transformer/issues/2279)) ([7d4a9b2](https://github.com/rudderlabs/rudder-transformer/commit/7d4a9b2782ab69bef8627717b95605887c0340a1))
* **ga4:** added validation for event name ([#2222](https://github.com/rudderlabs/rudder-transformer/issues/2222)) ([9dbd0f5](https://github.com/rudderlabs/rudder-transformer/commit/9dbd0f56050eddc913004faf546135efc8dd1f95))
* move hosted prod to githubactions ([#2280](https://github.com/rudderlabs/rudder-transformer/issues/2280)) ([003f0b6](https://github.com/rudderlabs/rudder-transformer/commit/003f0b625dd7abaabfdd528d15b1c0c73ffea4cf))
* **optimizely_fullstack:** update implmentation with log endpoint and onboarded on cdk v2 ([#2248](https://github.com/rudderlabs/rudder-transformer/issues/2248)) ([4c1bf54](https://github.com/rudderlabs/rudder-transformer/commit/4c1bf5449cb826cbddc439a95ce2db9d9b203840))
* **optimzely_fullstack:** removed empty values from common payload ([#2299](https://github.com/rudderlabs/rudder-transformer/issues/2299)) ([8ce7ce4](https://github.com/rudderlabs/rudder-transformer/commit/8ce7ce4337c0e41856c80267b4fcffb7816d25b5))
* shopify enhancements ([#2300](https://github.com/rudderlabs/rudder-transformer/issues/2300)) ([98decef](https://github.com/rudderlabs/rudder-transformer/commit/98decef91f1afc95369c37df9efd73687fe379ef))
* twitter web conversions ([#2220](https://github.com/rudderlabs/rudder-transformer/issues/2220)) ([3791dd4](https://github.com/rudderlabs/rudder-transformer/commit/3791dd47c4c2a90f396e28d6ce60715bbc8555c9))


### Bug Fixes

* add ip mapping for mix-panel group call ([#2281](https://github.com/rudderlabs/rudder-transformer/issues/2281)) ([4b2e961](https://github.com/rudderlabs/rudder-transformer/commit/4b2e9619ae34c170c1b4221ad395e5c9941b37b5))
* add support for array of string values for userFields ([#2282](https://github.com/rudderlabs/rudder-transformer/issues/2282)) ([6810493](https://github.com/rudderlabs/rudder-transformer/commit/6810493f8205b20517fe7402ca59594a7aaec8f6))
* add twitter ads in features.json ([#2278](https://github.com/rudderlabs/rudder-transformer/issues/2278)) ([b8b2ae7](https://github.com/rudderlabs/rudder-transformer/commit/b8b2ae7a63d07625c3057576ddb5915fe34ea926))
* bingads audience list data retuns array for single user ([#2303](https://github.com/rudderlabs/rudder-transformer/issues/2303)) ([b9f8a3b](https://github.com/rudderlabs/rudder-transformer/commit/b9f8a3b92baad26df443b5e25d35ef5cb2a968af))
* braze source transform timestamp conversion issue ([#2301](https://github.com/rudderlabs/rudder-transformer/issues/2301)) ([63f9875](https://github.com/rudderlabs/rudder-transformer/commit/63f9875df45ef6de608c5aa8b968a15b06169198))
* correct mapping for properties object for identify call ([#2283](https://github.com/rudderlabs/rudder-transformer/issues/2283)) ([6d599b1](https://github.com/rudderlabs/rudder-transformer/commit/6d599b1a25975ba995ff518b7734978015a6a09a))
* **customerio:** add missing webhook event types ([#2217](https://github.com/rudderlabs/rudder-transformer/issues/2217)) ([7deb41c](https://github.com/rudderlabs/rudder-transformer/commit/7deb41c0e586c4ac90bf654261e4de5436f94a50))
* destination response in error message ([#2275](https://github.com/rudderlabs/rudder-transformer/issues/2275)) ([432a130](https://github.com/rudderlabs/rudder-transformer/commit/432a1306a7d1247f3bfbf4e624b5dd0191392dd9))
* error handling for valid timestamp ([#2266](https://github.com/rudderlabs/rudder-transformer/issues/2266)) ([bf029ee](https://github.com/rudderlabs/rudder-transformer/commit/bf029ee505e0fedea4ae1cae1a05e7935dfa70bd))
* **ga4:** added validation and extended support for context.traits for user_properties ([#2178](https://github.com/rudderlabs/rudder-transformer/issues/2178)) ([c6f62e2](https://github.com/rudderlabs/rudder-transformer/commit/c6f62e2e0658b694ddd9f64e52ea6fd88f8a2269))
* gainsight_px null value ([#2240](https://github.com/rudderlabs/rudder-transformer/issues/2240)) ([a45dbaa](https://github.com/rudderlabs/rudder-transformer/commit/a45dbaad4115dd780a6b86fff2c9bf2509c78366))
* handle nested response for marketo ([#2219](https://github.com/rudderlabs/rudder-transformer/issues/2219)) ([8572817](https://github.com/rudderlabs/rudder-transformer/commit/85728176e9cc59e567b0f9ac8d9ed66c0742816e))
* marketo static list test cases ([#2277](https://github.com/rudderlabs/rudder-transformer/issues/2277)) ([2f9c7c9](https://github.com/rudderlabs/rudder-transformer/commit/2f9c7c9a804c49a72368e5fe4722c0dce73131ed))
* **optimizely:** remove empty attributes array for identify call ([#2302](https://github.com/rudderlabs/rudder-transformer/issues/2302)) ([2361679](https://github.com/rudderlabs/rudder-transformer/commit/23616796ac3e987df7a7203f91b220467cfa86e1))
* sonar cloud Issues ([#2270](https://github.com/rudderlabs/rudder-transformer/issues/2270)) ([b7abd1e](https://github.com/rudderlabs/rudder-transformer/commit/b7abd1ee40bfc2a40863a153745e630b82cd34fa))
* **algolia:** objectIds not getting mapped properly during transformation using cdkv2 ([#2306](https://github.com/rudderlabs/rudder-transformer/issues/2306)) ([3e98cdd](https://github.com/rudderlabs/rudder-transformer/commit/3e98cdd8d6dd53a79009221242dd777c69208a0b))

### [1.32.3](https://github.com/rudderlabs/rudder-transformer/compare/v1.32.2...v1.32.3) (2023-06-20)


### Bug Fixes

* add ip mapping for mix-panel group call ([#2281](https://github.com/rudderlabs/rudder-transformer/issues/2281)) ([607bb0e](https://github.com/rudderlabs/rudder-transformer/commit/607bb0ecb3f52383d906e546f6c3ff1c2081ea43))
* add support for array of string values for userFields ([#2282](https://github.com/rudderlabs/rudder-transformer/issues/2282)) ([2d79801](https://github.com/rudderlabs/rudder-transformer/commit/2d798014c1242249590697b9b6e453816e64ff22))
* correct mapping for properties object for identify call ([#2283](https://github.com/rudderlabs/rudder-transformer/issues/2283)) ([d046cd2](https://github.com/rudderlabs/rudder-transformer/commit/d046cd2b1d4b94f531d819bef8809e776a1885f6))
* pinterest, mixpanel, klaviyo updates ([#2288](https://github.com/rudderlabs/rudder-transformer/issues/2288)) ([8a18b90](https://github.com/rudderlabs/rudder-transformer/commit/8a18b903e0ae76133a800e421dd731493219b410))

### [1.32.2](https://github.com/rudderlabs/rudder-transformer/compare/v1.32.1...v1.32.2) (2023-06-15)


### Bug Fixes

* **trackingplan:** correct drop event status for tracking plan events ([#2272](https://github.com/rudderlabs/rudder-transformer/issues/2272)) ([fd5ebb0](https://github.com/rudderlabs/rudder-transformer/commit/fd5ebb0767460a234dc74c354e95a0560a6dac75))

### [1.32.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.32.0...v1.32.1) (2023-06-14)


### Bug Fixes

* add support for external_id in track call and use processedResponse for axios calls ([377b240](https://github.com/rudderlabs/rudder-transformer/commit/377b240e53264c9503aa82d6d38787f42ce7e6e4))

## [1.32.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.31.2...v1.32.0) (2023-06-12)


### Features

* update klaviyo api version ([#1981](https://github.com/rudderlabs/rudder-transformer/issues/1981)) ([dd69dbc](https://github.com/rudderlabs/rudder-transformer/commit/dd69dbc6cb55e2e1de9f8c762bb1d8907e347a8d))

### Bug Fixes

* add check for listId for subscribe ([#2263](https://github.com/rudderlabs/rudder-transformer/issues/2263)) ([36a6cad](https://github.com/rudderlabs/rudder-transformer/commit/36a6cad32b98a75c46ecc750c2e9bdac7bda9a2e))


### [1.31.2](https://github.com/rudderlabs/rudder-transformer/compare/v1.31.1...v1.31.2) (2023-06-08)


### Bug Fixes

* remove tls object ([67468b4](https://github.com/rudderlabs/rudder-transformer/commit/67468b4735aad9d603505ceadaa97798a86e67a3))

### [1.31.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.31.0...v1.31.1) (2023-06-07)


### Bug Fixes

* **transformer:** test cases migration ([#2190](https://github.com/rudderlabs/rudder-transformer/issues/2190)) ([52019ac](https://github.com/rudderlabs/rudder-transformer/commit/52019acf6533931fc36ed7ae93ce79d71671bd2e))

## [1.31.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.30.1...v1.31.0) (2023-06-05)


### Features

* add stats for bad events in fb_custom_audience ([#2192](https://github.com/rudderlabs/rudder-transformer/issues/2192)) ([8176874](https://github.com/rudderlabs/rudder-transformer/commit/8176874bd599c999a70a382577c7605a1d3b3695))
* error enrichment to get clear error messages for facebook pixel ([#2018](https://github.com/rudderlabs/rudder-transformer/issues/2018)) ([0ee7c73](https://github.com/rudderlabs/rudder-transformer/commit/0ee7c7348e363ec542c5e8b63d43854f8c8672c2)), closes [#2233](https://github.com/rudderlabs/rudder-transformer/issues/2233)


### Bug Fixes

* **cdkv1:** error handling for cdkv1 destinations ([#2227](https://github.com/rudderlabs/rudder-transformer/issues/2227)) ([c3aedbf](https://github.com/rudderlabs/rudder-transformer/commit/c3aedbfe41c176c9791770cc52b1a4cb1dddbefe))
* **customerio destination:** added fix for unhandled exception for pr… ([#2226](https://github.com/rudderlabs/rudder-transformer/issues/2226)) ([fde530f](https://github.com/rudderlabs/rudder-transformer/commit/fde530f542b4229220f93c09a5ac0bd2ef563507))
* **hubspot  destination:** added fix for handling error when  hubspotPropertyMapResponse not present ([d1613b6](https://github.com/rudderlabs/rudder-transformer/commit/d1613b6ae275d7e884b21eccbf2a9391040d3ef1))
* hubspot bugsnag error ([#2235](https://github.com/rudderlabs/rudder-transformer/issues/2235)) ([1d4df3a](https://github.com/rudderlabs/rudder-transformer/commit/1d4df3ab8f7deb89eaaec154500bd4c94350c551))
* **hubspot destination:** add fix for handling  error case when properties are not sent in hubspot ([0225a28](https://github.com/rudderlabs/rudder-transformer/commit/0225a280f1efd051d2d732d633d1cbab7b0f37ea))
* iterable bugsnag error ([#2234](https://github.com/rudderlabs/rudder-transformer/issues/2234)) ([b2b3b19](https://github.com/rudderlabs/rudder-transformer/commit/b2b3b1973ddd2e298befdcc30ac2b1be44023736))
* sonarCloud code smells ([#2187](https://github.com/rudderlabs/rudder-transformer/issues/2187)) ([6646257](https://github.com/rudderlabs/rudder-transformer/commit/66462570823a08c21d55a519f59fbf19af0a54b9))

### [1.30.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.30.0...v1.30.1) (2023-05-31)

## [1.30.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.29.2...v1.30.0) (2023-05-30)


### Features

* add cdk stats ([#2131](https://github.com/rudderlabs/rudder-transformer/issues/2131)) ([3fe837b](https://github.com/rudderlabs/rudder-transformer/commit/3fe837b1b561da1563042b2128420214b1103b2a))
* auto register missing metrics ([#2170](https://github.com/rudderlabs/rudder-transformer/issues/2170)) ([0bbe371](https://github.com/rudderlabs/rudder-transformer/commit/0bbe371246f750b9b92595b5e8d00212366742c7))
* mixpanel deletion api  ([#2206](https://github.com/rudderlabs/rudder-transformer/issues/2206)) ([19e20eb](https://github.com/rudderlabs/rudder-transformer/commit/19e20eb16def7296d88e67a7c325b123881042f9)), closes [#2200](https://github.com/rudderlabs/rudder-transformer/issues/2200)
* onboard bingads audience destination (CDK) ([#2214](https://github.com/rudderlabs/rudder-transformer/issues/2214)) ([411c2c9](https://github.com/rudderlabs/rudder-transformer/commit/411c2c9fcd7c8892ce994ad18831f1accc632dab))
* onboard dynamic yield ([#2177](https://github.com/rudderlabs/rudder-transformer/issues/2177)) ([fc4c007](https://github.com/rudderlabs/rudder-transformer/commit/fc4c00716a4e45852e9aef20682ab4388cc8e890))
* remove custom property dependency for fb pixel ([#2215](https://github.com/rudderlabs/rudder-transformer/issues/2215)) ([e22b2ac](https://github.com/rudderlabs/rudder-transformer/commit/e22b2ac62d5c442f78862201acbb611c5e6f7c63))
* **transformation:** adding geo location function support ([#2165](https://github.com/rudderlabs/rudder-transformer/issues/2165)) ([7a153a5](https://github.com/rudderlabs/rudder-transformer/commit/7a153a58a93fb7dde44abdd26a5d3a6fff20b77e))


### Bug Fixes

* add async/await in af,clevertap, engage and sendgird ([#2183](https://github.com/rudderlabs/rudder-transformer/issues/2183)) ([20846ab](https://github.com/rudderlabs/rudder-transformer/commit/20846ab102abd41bc75eb4c164f096638e822d73))
* **gaoc:** adding batching support ([#2201](https://github.com/rudderlabs/rudder-transformer/issues/2201)) ([5865f50](https://github.com/rudderlabs/rudder-transformer/commit/5865f508d98c8bb8eed809636b14d3cf2eb213be))
* handling proxy responses for tiktok_ads, snapchat_custom_audience ([#2169](https://github.com/rudderlabs/rudder-transformer/issues/2169)) ([906d799](https://github.com/rudderlabs/rudder-transformer/commit/906d79985d6162f7ebc3ab5b57b72ada72b988fa))
* pinterest ge parameter ([#2210](https://github.com/rudderlabs/rudder-transformer/issues/2210)) ([f64e30d](https://github.com/rudderlabs/rudder-transformer/commit/f64e30df851366207e8464a9073a5d5e628923e5))

### [1.29.2](https://github.com/rudderlabs/rudder-transformer/compare/v1.29.1...v1.29.2) (2023-05-26)


### Bug Fixes

* braze dedup ([#2211](https://github.com/rudderlabs/rudder-transformer/issues/2211)) ([86a9d25](https://github.com/rudderlabs/rudder-transformer/commit/86a9d255f16409902e4d881ded7c876782d3311b))

### [1.29.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.29.0...v1.29.1) (2023-05-25)


### Bug Fixes

* shopify idenity stitch ([#2207](https://github.com/rudderlabs/rudder-transformer/issues/2207)) ([b78e690](https://github.com/rudderlabs/rudder-transformer/commit/b78e69081e8db768de80bd560f23d1eeecbc40ab))

## [1.29.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.28.1...v1.29.0) (2023-05-23)


### Features

* **ga4:** added validation for event name ([#2186](https://github.com/rudderlabs/rudder-transformer/issues/2186)) ([6e6a8e9](https://github.com/rudderlabs/rudder-transformer/commit/6e6a8e98569375bb5465eb36f94f4524bbd450e3))
* mixpanel deletion api ([#2152](https://github.com/rudderlabs/rudder-transformer/issues/2152)) ([a9dcbdc](https://github.com/rudderlabs/rudder-transformer/commit/a9dcbdc2e837c0a2a732a0938c1677eb6e3454e6))
* onboard swagger ([#2175](https://github.com/rudderlabs/rudder-transformer/issues/2175)) ([9817f2e](https://github.com/rudderlabs/rudder-transformer/commit/9817f2e6c85bc9cc4843c16e590d4ae66fda433a))


### Bug Fixes

* mailchip track event name length ([#2198](https://github.com/rudderlabs/rudder-transformer/issues/2198)) ([bb5882c](https://github.com/rudderlabs/rudder-transformer/commit/bb5882c8721a36b4d03383d032a86e2a9b5e9d9f))
* redis connect with promise race ([#2107](https://github.com/rudderlabs/rudder-transformer/issues/2107)) ([d439485](https://github.com/rudderlabs/rudder-transformer/commit/d4394854d2826f62aa69f9b1a10a900d1c7de486)), closes [#2091](https://github.com/rudderlabs/rudder-transformer/issues/2091)

### [1.28.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.28.0...v1.28.1) (2023-05-16)


### Bug Fixes

* batch logic to handle empty json in input ([e0f5c52](https://github.com/rudderlabs/rudder-transformer/commit/e0f5c52bb8c9ebd85308b1d7e8543bfde6e637be))
* batch metatdata count ([addb183](https://github.com/rudderlabs/rudder-transformer/commit/addb18300d8372bda02bd4439e0935d10cd9c700))
* batch metatdata count ([#2182](https://github.com/rudderlabs/rudder-transformer/issues/2182)) ([cb335f2](https://github.com/rudderlabs/rudder-transformer/commit/cb335f2bcacf88d3bdd8d8d4c0eb9ce454fadbd0))

## [1.28.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.27.1...v1.28.0) (2023-05-15)


### Features

* braze merge users ([#2135](https://github.com/rudderlabs/rudder-transformer/issues/2135)) ([a0f9ae9](https://github.com/rudderlabs/rudder-transformer/commit/a0f9ae9008308cbfd6270522bf37f8e3f8531a23))
* braze merge users ([#2135](https://github.com/rudderlabs/rudder-transformer/issues/2135)) ([58f69d2](https://github.com/rudderlabs/rudder-transformer/commit/58f69d2778e822716e7f9f10f1f899b00b2d8785))
* checkout code for generating tags ([#2153](https://github.com/rudderlabs/rudder-transformer/issues/2153)) ([76f36e1](https://github.com/rudderlabs/rudder-transformer/commit/76f36e122c2a510ccb07970d6a55a72efa3edabd))
* **fb_pixel:** add validation ([#2159](https://github.com/rudderlabs/rudder-transformer/issues/2159)) ([64a05cb](https://github.com/rudderlabs/rudder-transformer/commit/64a05cbf6844bc78406c3a8f9397981484a7e075))
* **ga4:** common page call information(page, url, title) support in track call ([#2141](https://github.com/rudderlabs/rudder-transformer/issues/2141)) ([f7a32b2](https://github.com/rudderlabs/rudder-transformer/commit/f7a32b28373ef1e8de76edad5afbe9d04fd7561e))
* **ga4:** override client_id and session_id and add support of session_number in GA hybrid mode ([#2121](https://github.com/rudderlabs/rudder-transformer/issues/2121)) ([fd0dc94](https://github.com/rudderlabs/rudder-transformer/commit/fd0dc946ff35265a14658bf5336f6a089ca36438))
* **ga4:** override client_id and session_id in ga4 hybrid mode ([#2167](https://github.com/rudderlabs/rudder-transformer/issues/2167)) ([ff9d778](https://github.com/rudderlabs/rudder-transformer/commit/ff9d778d6e18cecec92b72437c9e00d66eb4f2b6))
* onboard new source formsort ([#2120](https://github.com/rudderlabs/rudder-transformer/issues/2120)) ([203a0c4](https://github.com/rudderlabs/rudder-transformer/commit/203a0c48eb72e6d076d611d5d23a9454c2934f4d))
* onboarding router batching for braze ([#2130](https://github.com/rudderlabs/rudder-transformer/issues/2130)) ([35a5b37](https://github.com/rudderlabs/rudder-transformer/commit/35a5b376aeb7bf7f8bc477f63df18cd9a8b91fc2))


### Bug Fixes

* async implementations ([#2103](https://github.com/rudderlabs/rudder-transformer/issues/2103)) ([52dee04](https://github.com/rudderlabs/rudder-transformer/commit/52dee043865ae169d89105199ea499cb224da222))
* **gaec:** gaec axios reponse parsing ([#2138](https://github.com/rudderlabs/rudder-transformer/issues/2138)) ([1f9a864](https://github.com/rudderlabs/rudder-transformer/commit/1f9a864af66657708bfe4c820316154350929ba8))
* handle 404 response code for proxy route ([#2134](https://github.com/rudderlabs/rudder-transformer/issues/2134)) ([99e2cf3](https://github.com/rudderlabs/rudder-transformer/commit/99e2cf3b1ace063229841e6401f7deab4af3ec51))
* prometheus metrics errors ([#2168](https://github.com/rudderlabs/rudder-transformer/issues/2168)) ([ccd911a](https://github.com/rudderlabs/rudder-transformer/commit/ccd911a873b524208391ef6c8503e905f1fe2b44))
* snyk issues fix ([#2136](https://github.com/rudderlabs/rudder-transformer/issues/2136)) ([653ae9b](https://github.com/rudderlabs/rudder-transformer/commit/653ae9b050f507a78671ce559e5563f13610baa9))
* undefined errors in braze, firehose, gaoc ([#2139](https://github.com/rudderlabs/rudder-transformer/issues/2139)) ([06110c5](https://github.com/rudderlabs/rudder-transformer/commit/06110c5f070e05d6d0f7e04b11a23f777cb65af8))

### [1.27.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.27.0...v1.27.1) (2023-05-10)


### Bug Fixes

* checkout code for generating tags ([e377f68](https://github.com/rudderlabs/rudder-transformer/commit/e377f68409eaee3c589a851ee83b6f00889fc20c))

## [1.27.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.26.0...v1.27.0) (2023-05-09)


### Features

* braze merge users ([#2135](https://github.com/rudderlabs/rudder-transformer/issues/2135)) ([a0f9ae9](https://github.com/rudderlabs/rudder-transformer/commit/a0f9ae9008308cbfd6270522bf37f8e3f8531a23))
* braze merge users ([#2135](https://github.com/rudderlabs/rudder-transformer/issues/2135)) ([58f69d2](https://github.com/rudderlabs/rudder-transformer/commit/58f69d2778e822716e7f9f10f1f899b00b2d8785))
* **ga4:** common page call information(page, url, title) support in track call ([#2141](https://github.com/rudderlabs/rudder-transformer/issues/2141)) ([f7a32b2](https://github.com/rudderlabs/rudder-transformer/commit/f7a32b28373ef1e8de76edad5afbe9d04fd7561e))
* onboard new source formsort ([#2120](https://github.com/rudderlabs/rudder-transformer/issues/2120)) ([203a0c4](https://github.com/rudderlabs/rudder-transformer/commit/203a0c48eb72e6d076d611d5d23a9454c2934f4d))


### Bug Fixes

* snyk issues fix ([#2136](https://github.com/rudderlabs/rudder-transformer/issues/2136)) ([653ae9b](https://github.com/rudderlabs/rudder-transformer/commit/653ae9b050f507a78671ce559e5563f13610baa9))
* undefined errors in braze, firehose, gaoc ([#2139](https://github.com/rudderlabs/rudder-transformer/issues/2139)) ([06110c5](https://github.com/rudderlabs/rudder-transformer/commit/06110c5f070e05d6d0f7e04b11a23f777cb65af8))

## [1.26.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.25.0...v1.26.0) (2023-05-05)


### Features

* intercom group support ([#2089](https://github.com/rudderlabs/rudder-transformer/issues/2089)) ([8185f28](https://github.com/rudderlabs/rudder-transformer/commit/8185f288f8b6c0822f6aea8bf080d6b2b9ef2691))


### Bug Fixes

* allow null values to be passed in Braze for standard properties ([#2111](https://github.com/rudderlabs/rudder-transformer/issues/2111)) ([10d037a](https://github.com/rudderlabs/rudder-transformer/commit/10d037a17aae9ff0e60be1276120a2a1fa6c6a86))
* call to lower case only when message.type is defined ([#2109](https://github.com/rudderlabs/rudder-transformer/issues/2109)) ([71c1e7a](https://github.com/rudderlabs/rudder-transformer/commit/71c1e7aea8c14904660908eabf2eabb060315410))
* remove skip verify flag ([#2114](https://github.com/rudderlabs/rudder-transformer/issues/2114)) ([c4b0a69](https://github.com/rudderlabs/rudder-transformer/commit/c4b0a695442bb30c280c7301a10aea773f610e4f))

## [1.25.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.24.0...v1.25.0) (2023-05-02)


### Features

* **destination:** braze dedup  ([#1931](https://github.com/rudderlabs/rudder-transformer/issues/1931)) ([66b335c](https://github.com/rudderlabs/rudder-transformer/commit/66b335c2c18ce123024a2605b5a1964a0dfa71ed))
* fetch audience id for retl criteo audience ([#2058](https://github.com/rudderlabs/rudder-transformer/issues/2058)) ([f80f843](https://github.com/rudderlabs/rudder-transformer/commit/f80f843d283c6b97cd3075857671a12db3d5e813))
* introduced additional variable for conversionDateTime for GAOC Stor… ([#2108](https://github.com/rudderlabs/rudder-transformer/issues/2108)) ([14e06ee](https://github.com/rudderlabs/rudder-transformer/commit/14e06ee0b9bc91c8fc79545cd1ebde6d35da5a9c))


### Bug Fixes

* **attentive_tag:** ecom events user object fix ([#2106](https://github.com/rudderlabs/rudder-transformer/issues/2106)) ([ebd3c05](https://github.com/rudderlabs/rudder-transformer/commit/ebd3c0569eca00d3f732010027388aad76bcfe77))
* **ga4:** update hybrid mode check condition and remove dependency on… ([#2087](https://github.com/rudderlabs/rudder-transformer/issues/2087)) ([041d4b6](https://github.com/rudderlabs/rudder-transformer/commit/041d4b6f2c6d4161fab6cc9092a1a228c5e28604))
* gracefulshutdown ([#2113](https://github.com/rudderlabs/rudder-transformer/issues/2113)) ([2367241](https://github.com/rudderlabs/rudder-transformer/commit/2367241e002990880ada425ae3c7aef844ce6998))
* **pinterest cdk:** add step name ([#2101](https://github.com/rudderlabs/rudder-transformer/issues/2101)) ([f7a302b](https://github.com/rudderlabs/rudder-transformer/commit/f7a302babce96b9ae5abe20e28b05c49437c1089))

## [1.24.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.23.1...v1.24.0) (2023-04-25)


### Features

* fb_custom_audience batching according to payload size ([#2054](https://github.com/rudderlabs/rudder-transformer/issues/2054)) ([e742e8d](https://github.com/rudderlabs/rudder-transformer/commit/e742e8dba33bd468b27ae318bbd7df5552e4bc19))
* **pinterest:** passing unkown event in v3 ([#2092](https://github.com/rudderlabs/rudder-transformer/issues/2092)) ([a77a0dd](https://github.com/rudderlabs/rudder-transformer/commit/a77a0dd227bd0d752d189f7464c2fa18117bb8b6))
* **pinterest:** version update ([#2063](https://github.com/rudderlabs/rudder-transformer/issues/2063)) ([79f1629](https://github.com/rudderlabs/rudder-transformer/commit/79f16292fa2818ef9a0ab3f12f0e4bc7df419d06))


### Bug Fixes

* added missed stats to dest transform controllers ([#2080](https://github.com/rudderlabs/rudder-transformer/issues/2080)) ([9cbbd0e](https://github.com/rudderlabs/rudder-transformer/commit/9cbbd0e31ca49603c54fdae882d56ff1d1227020))
* prioritize timestamp over originalTimstamp across destinations ([#2078](https://github.com/rudderlabs/rudder-transformer/issues/2078)) ([b7a0fdb](https://github.com/rudderlabs/rudder-transformer/commit/b7a0fdbf8bc4d132c7951a5eab01bb837b53f6e8))
* shopify default check for anonymousId ([#2086](https://github.com/rudderlabs/rudder-transformer/issues/2086)) ([c7472a8](https://github.com/rudderlabs/rudder-transformer/commit/c7472a82822b652b101700617b782ca955f73b54))

### [1.23.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.23.0...v1.23.1) (2023-04-20)


### Bug Fixes

* anonymous id default value  ([#2081](https://github.com/rudderlabs/rudder-transformer/issues/2081)) ([6457c09](https://github.com/rudderlabs/rudder-transformer/commit/6457c09a0f0963179388ba8535fbcd9f872ba9fd))
* Default Val for Anon Id ([4dd1df7](https://github.com/rudderlabs/rudder-transformer/commit/4dd1df7e25bd6fea7770e6c38c4c63bb1d81141c))

## [1.23.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.22.2...v1.23.0) (2023-04-17)


### Features

* **mixpanel:** add simplified api in page/screen/group/revenue event ([#2065](https://github.com/rudderlabs/rudder-transformer/issues/2065)) ([400a5d3](https://github.com/rudderlabs/rudder-transformer/commit/400a5d37e40fdc7c31e13d1d167959803f57aaf3))
* **mixpanel:** add support of simplified api ([#2042](https://github.com/rudderlabs/rudder-transformer/issues/2042)) ([593bcc0](https://github.com/rudderlabs/rudder-transformer/commit/593bcc0a37b5c0c3fc63e748646077e498782780))
* onboarding tiktok ads to transformmer proxy ([#1905](https://github.com/rudderlabs/rudder-transformer/issues/1905)) ([d26a924](https://github.com/rudderlabs/rudder-transformer/commit/d26a92477e6a1b3354e66dbe8f8d9561a1dc7296))
* shopify identity stitching  3 ([#2039](https://github.com/rudderlabs/rudder-transformer/issues/2039)) ([0d3c4fc](https://github.com/rudderlabs/rudder-transformer/commit/0d3c4fceb2933448c4614b129aa79aa856b5fc5d))
* **tiktok_ads_offline_conversions:** support of multiple phone numbers ([#2061](https://github.com/rudderlabs/rudder-transformer/issues/2061)) ([ecaa337](https://github.com/rudderlabs/rudder-transformer/commit/ecaa3376ecf62b62526a9fea67002ae84530aa2a))


### Bug Fixes

* add override field support in contextual traits ([#2066](https://github.com/rudderlabs/rudder-transformer/issues/2066)) ([e4abff8](https://github.com/rudderlabs/rudder-transformer/commit/e4abff8c8a58a344c3aa59d4c58b725c2f7a0c65))
* **cdk v2:** webhook destination can accept payload without message type ([#2067](https://github.com/rudderlabs/rudder-transformer/issues/2067)) ([4d920a3](https://github.com/rudderlabs/rudder-transformer/commit/4d920a3b7518ac1be6325ad9b06b50319ba96539))
* freshsales rudderEvent to freshsales standard event ([#2053](https://github.com/rudderlabs/rudder-transformer/issues/2053)) ([606e10c](https://github.com/rudderlabs/rudder-transformer/commit/606e10ccbcba63c5efcd70c97f700552b97d5a20))
* **hs:** input data type validation based on the property map ([#2055](https://github.com/rudderlabs/rudder-transformer/issues/2055)) ([8cbb215](https://github.com/rudderlabs/rudder-transformer/commit/8cbb215dbaf099fbc3002236b0c286af8964fa92))
* update priority of timestamp over originaltimestamp ([#2064](https://github.com/rudderlabs/rudder-transformer/issues/2064)) ([bf969ff](https://github.com/rudderlabs/rudder-transformer/commit/bf969ff7cbbfe913bcc78bbf11a47413cb42ae47))

### [1.22.2](https://github.com/rudderlabs/rudder-transformer/compare/v1.22.1...v1.22.2) (2023-04-13)


### Bug Fixes

* update workflow file ([a3cccad](https://github.com/rudderlabs/rudder-transformer/commit/a3cccad7c1d0cdb5ea3dfb128bbade42d80039f8))

### [1.22.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.22.0...v1.22.1) (2023-04-12)


### Bug Fixes

* allow event names without forced lowercasing, disable lowercasing ([#2050](https://github.com/rudderlabs/rudder-transformer/issues/2050)) ([02382c5](https://github.com/rudderlabs/rudder-transformer/commit/02382c5f6c02511928e25264ed6472ec3e2b0566))
* **drip:** datatype and character limit check ([#2045](https://github.com/rudderlabs/rudder-transformer/issues/2045)) ([15889ce](https://github.com/rudderlabs/rudder-transformer/commit/15889ce0929c0369c639e877bca9a668ed153aae))

## [1.22.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.21.0...v1.22.0) (2023-04-10)


### Features

* add override support in clevertap ([#2043](https://github.com/rudderlabs/rudder-transformer/issues/2043)) ([addb9f9](https://github.com/rudderlabs/rudder-transformer/commit/addb9f90258233ed0c05583250b6d6e7ff56041c))
* **clevertap:** ignore stringification for objects for Charged event ([#2041](https://github.com/rudderlabs/rudder-transformer/issues/2041)) ([fd3e4ea](https://github.com/rudderlabs/rudder-transformer/commit/fd3e4ea5297712011022ccaf4eb785b79c321b7d))
* enhancement gaoc store conversion ([#1990](https://github.com/rudderlabs/rudder-transformer/issues/1990)) ([f90b16f](https://github.com/rudderlabs/rudder-transformer/commit/f90b16f8c827aa32fbe92e0fa053cc8212bad0a3))


### Bug Fixes

* batching with multiplexing ([#1926](https://github.com/rudderlabs/rudder-transformer/issues/1926)) ([e3fe5b5](https://github.com/rudderlabs/rudder-transformer/commit/e3fe5b520fa85849b0ef6148c2380afd8242eec6))

## [1.21.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.20.2...v1.21.0) (2023-04-04)


### Bug Fixes

* add canonicals for adobe analytics ([#2033](https://github.com/rudderlabs/rudder-transformer/issues/2033)) ([a5ce9f4](https://github.com/rudderlabs/rudder-transformer/commit/a5ce9f4564c4635420d9027f2229c4c098a3d6ca))
* **customerio:** group call filter logic ([#2027](https://github.com/rudderlabs/rudder-transformer/issues/2027)) ([196e501](https://github.com/rudderlabs/rudder-transformer/commit/196e501006a93fa164f7207253a1b20ffce2342e))
* removed console ([#2034](https://github.com/rudderlabs/rudder-transformer/issues/2034)) ([a03f5cd](https://github.com/rudderlabs/rudder-transformer/commit/a03f5cd2d54d2e04634733911f31d9fecfd4dd69))


### [1.20.2](https://github.com/rudderlabs/rudder-transformer/compare/v1.20.1...v1.20.2) (2023-04-01)


### Bug Fixes

* add the missing git commit sha of the source to bugsnag ([#2030](https://github.com/rudderlabs/rudder-transformer/issues/2030)) ([65ccbdd](https://github.com/rudderlabs/rudder-transformer/commit/65ccbdd693b68c331e500a50f0019ea0a7e2a27c))


### [1.20.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.20.0...v1.20.1) (2023-04-01)


### Features

* add audience id for retl sources from context ([#2025](https://github.com/rudderlabs/rudder-transformer/issues/2025)) ([40481a8](https://github.com/rudderlabs/rudder-transformer/commit/40481a83100ac40316fb5b3eb999464c5b927b4d))
* add fb to transformer proxy ([#1900](https://github.com/rudderlabs/rudder-transformer/issues/1900)) ([7e6341f](https://github.com/rudderlabs/rudder-transformer/commit/7e6341f3d065aecefe3abe634cd3720cf426583a))


### Bug Fixes

* **customerio:** added validations to convert integer to string ([#2017](https://github.com/rudderlabs/rudder-transformer/issues/2017)) ([f50b128](https://github.com/rudderlabs/rudder-transformer/commit/f50b12845008fb6b7bfdc410cf9b43a246dc4ca3))
* **customerio:** update logic of getting event name ([#2028](https://github.com/rudderlabs/rudder-transformer/issues/2028)) ([18e4a83](https://github.com/rudderlabs/rudder-transformer/commit/18e4a83a8d2da1146dc1b1f78cf710a200c30b92))


## [1.20.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.19.0...v1.20.0) (2023-03-28)


### Bug Fixes

* **gainsignt_px:** undefined attributes issue ([#2010](https://github.com/rudderlabs/rudder-transformer/issues/2010)) ([bf56359](https://github.com/rudderlabs/rudder-transformer/commit/bf5635942a88a3afc25506ba6591bf6b844624f3))
* **monday:**  axios call empty response issue ([#2001](https://github.com/rudderlabs/rudder-transformer/issues/2001)) ([196294f](https://github.com/rudderlabs/rudder-transformer/commit/196294f70bc967efea70aef084268db9c567417a))
* **rockerbox:** make email as non-required field ([#1995](https://github.com/rudderlabs/rudder-transformer/issues/1995)) ([2f7ebff](https://github.com/rudderlabs/rudder-transformer/commit/2f7ebff62c8934165c1271a7c019c2b0b5b2a4b3))
* **snapchat_conversion:** price calculation ([#1988](https://github.com/rudderlabs/rudder-transformer/issues/1988)) ([8240224](https://github.com/rudderlabs/rudder-transformer/commit/82402242a1ffe9ccc75671023cff1ebbbcb390e6))
* **test-cases:** fix test cases to use template like secret keys ([#1973](https://github.com/rudderlabs/rudder-transformer/issues/1973)) ([f709d1f](https://github.com/rudderlabs/rudder-transformer/commit/f709d1fb9d1d22e306fc600872dd2b702436f961))
* undefined columnToPropertyMapping config issue ([#1998](https://github.com/rudderlabs/rudder-transformer/issues/1998)) ([ef7a351](https://github.com/rudderlabs/rudder-transformer/commit/ef7a3511e26e652caa54fb600db01ebe6bd0cc3d))


## [1.19.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.18.0...v1.19.0) (2023-03-23)


### Features

* **indicative:** parse user agent info ([#1971](https://github.com/rudderlabs/rudder-transformer/issues/1971)) ([1328b5a](https://github.com/rudderlabs/rudder-transformer/commit/1328b5ac38f9d21def89bacbbca4891dbd6e4450))


### Bug Fixes

* file names in helm charts update job ([#1992](https://github.com/rudderlabs/rudder-transformer/issues/1992)) ([c694b49](https://github.com/rudderlabs/rudder-transformer/commit/c694b49cfae270e10bdad1d2e990f287b679649d))
* ga4 user_properties structure ([#1982](https://github.com/rudderlabs/rudder-transformer/issues/1982)) ([3d81202](https://github.com/rudderlabs/rudder-transformer/commit/3d81202fcd88b8033504e9f5aa5d095e6863dc76))
* **GA4:** revert context.traits support for user_properties ([#1991](https://github.com/rudderlabs/rudder-transformer/issues/1991)) ([ae001dc](https://github.com/rudderlabs/rudder-transformer/commit/ae001dc7aafe8b33be696acac9fad3416b51f8e8))
* revert context.traits support for user_properties ([4f51403](https://github.com/rudderlabs/rudder-transformer/commit/4f51403facdadfc2928f13159918bede3a5c073c))
* tik-tok ads offline events email array issue ([#1979](https://github.com/rudderlabs/rudder-transformer/issues/1979)) ([3c7f4ac](https://github.com/rudderlabs/rudder-transformer/commit/3c7f4ac60ec564198f0bf0524a0780dfc581140a))

## [1.18.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.17.0...v1.18.0) (2023-03-23)


### Features

* **indicative:** parse user agent info ([#1971](https://github.com/rudderlabs/rudder-transformer/issues/1971)) ([1328b5a](https://github.com/rudderlabs/rudder-transformer/commit/1328b5ac38f9d21def89bacbbca4891dbd6e4450))


### Bug Fixes

* changelog ([d8d81a2](https://github.com/rudderlabs/rudder-transformer/commit/d8d81a2d4ad428be2936932f22e63fd9007d9799))
* ga4 user_properties structure ([#1982](https://github.com/rudderlabs/rudder-transformer/issues/1982)) ([3d81202](https://github.com/rudderlabs/rudder-transformer/commit/3d81202fcd88b8033504e9f5aa5d095e6863dc76))
* tik-tok ads offline events email array issue ([#1979](https://github.com/rudderlabs/rudder-transformer/issues/1979)) ([3c7f4ac](https://github.com/rudderlabs/rudder-transformer/commit/3c7f4ac60ec564198f0bf0524a0780dfc581140a))

## [1.17.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.16.2...v1.17.0) (2023-03-21)


### Features

* add default action source ([#1957](https://github.com/rudderlabs/rudder-transformer/issues/1957)) ([043cae2](https://github.com/rudderlabs/rudder-transformer/commit/043cae2802c81e7a1d25d266eaeca06a3000aeaa))
* **braze:** refactor code custom attribute operations ([#1943](https://github.com/rudderlabs/rudder-transformer/issues/1943)) ([9c91bfc](https://github.com/rudderlabs/rudder-transformer/commit/9c91bfc4f7eeeaa1e97174a2c96c1902c6817c6a))
* **mix-panel:** add support for multiple group key value ([#1773](https://github.com/rudderlabs/rudder-transformer/issues/1773)) ([e7a8d48](https://github.com/rudderlabs/rudder-transformer/commit/e7a8d489cb3fda2718e106730d69506e6f56c9f3))


### Bug Fixes

* added products array check for iterable destination ([#1949](https://github.com/rudderlabs/rudder-transformer/issues/1949)) ([87db73e](https://github.com/rudderlabs/rudder-transformer/commit/87db73e062dcac54fdb1906659a90d2df0f13648))
* **fb pixel:** ecomm ([#1932](https://github.com/rudderlabs/rudder-transformer/issues/1932)) ([8d5e07a](https://github.com/rudderlabs/rudder-transformer/commit/8d5e07a2862ee757ecd3523b36e150f29a134b0f)), closes [#1964](https://github.com/rudderlabs/rudder-transformer/issues/1964)
* **firehose:** handle undefined message type ([#1942](https://github.com/rudderlabs/rudder-transformer/issues/1942)) ([d3ea664](https://github.com/rudderlabs/rudder-transformer/commit/d3ea664c182cc1702ab0298cf79ecad2aae7ce6b))
* **integration:** pinterest content_id field dropped when having null value to match with cdkv2 ([#1950](https://github.com/rudderlabs/rudder-transformer/issues/1950)) ([09995e9](https://github.com/rudderlabs/rudder-transformer/commit/09995e9cc9931827d8be5b1ede59be9ce77c0cd4))

### [1.16.2](https://github.com/rudderlabs/rudder-transformer/compare/v1.16.1...v1.16.2) (2023-03-16)


### Bug Fixes

* add optional chaining for phone in tiktok_ads_offline_events ([37dc013](https://github.com/rudderlabs/rudder-transformer/commit/37dc0139a28fab113eac4b337f3475ac2ea29262))

### [1.16.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.16.0...v1.16.1) (2023-03-15)


### Bug Fixes

* **fb pixel:** add default action source ([#1946](https://github.com/rudderlabs/rudder-transformer/issues/1946)) ([2e03f4d](https://github.com/rudderlabs/rudder-transformer/commit/2e03f4dcfbfb1c6d35aecf950e0f1e3828ceaaef))

## [1.16.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.15.1...v1.16.0) (2023-03-14)


### Features

* **facebook_app_events:** update api version ([#1921](https://github.com/rudderlabs/rudder-transformer/issues/1921)) ([793ebfb](https://github.com/rudderlabs/rudder-transformer/commit/793ebfb39e8667882cd40ff4add2ea6b5dfb9564))


### Bug Fixes

* changelog ([ef13dd8](https://github.com/rudderlabs/rudder-transformer/commit/ef13dd8bef572c80ddb8511abb7d5be23cc5dd81))
* create pull-request jobs in workflows ([36b2677](https://github.com/rudderlabs/rudder-transformer/commit/36b2677209b9b34a33375381dd74a74988e11dd2))
* syntax issue in workflow ([09d7659](https://github.com/rudderlabs/rudder-transformer/commit/09d765912ef07552729c1193e28c1bd149f68401))
* syntax issue in workflow ([c84ef6e](https://github.com/rudderlabs/rudder-transformer/commit/c84ef6e1d1b4feefb208e10c316c4f5bd647efa3))
* **util:** getDestinationExternalIDObjectForRetl funciton ([#1919](https://github.com/rudderlabs/rudder-transformer/issues/1919)) ([235243d](https://github.com/rudderlabs/rudder-transformer/commit/235243de9afb1b52b56b7db9170e5eb3345b1de6))

### [1.15.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.15.0...v1.15.1) (2023-03-13)


### Features

* mautic: support self hosted instance ([#1909](https://github.com/rudderlabs/rudder-transformer/issues/1909)) ([7c0a724](https://github.com/rudderlabs/rudder-transformer/commit/7c0a7240d9fcef45e4066a4a7dee8234c7e782d3))
* moenagae alias call support ([#1930](https://github.com/rudderlabs/rudder-transformer/issues/1930)) ([194bf8e](https://github.com/rudderlabs/rudder-transformer/commit/194bf8e3e2f47ca63ee273c9255468b41bc6ffcf))
* transformation secrets ([#1912](https://github.com/rudderlabs/rudder-transformer/issues/1912)) ([a0b488a](https://github.com/rudderlabs/rudder-transformer/commit/a0b488a4514c9c868f39d000a4ae40aa3f7b5de6))


### Bug Fixes

* client_id mapping for ga4 ([#1904](https://github.com/rudderlabs/rudder-transformer/issues/1904)) ([9aaf908](https://github.com/rudderlabs/rudder-transformer/commit/9aaf90864bd489fb463a56f62a673ead2bb83fe5))
* **destination:** add channel as platform ([#1906](https://github.com/rudderlabs/rudder-transformer/issues/1906)) ([4cfbbd0](https://github.com/rudderlabs/rudder-transformer/commit/4cfbbd02530d1cc02b1b04ab5c721f1b642d41bc))
* remove ga4 identify call support for cloud mode and treat identify call event as track events (login, sign_up and generate_lead) ([#1903](https://github.com/rudderlabs/rudder-transformer/issues/1903)) ([fa8fd74](https://github.com/rudderlabs/rudder-transformer/commit/fa8fd74f14d0ac6707f83ed81897a541ae6191e6))
* **slack:** handlebars error handling ([#1910](https://github.com/rudderlabs/rudder-transformer/issues/1910)) ([0c6bc2e](https://github.com/rudderlabs/rudder-transformer/commit/0c6bc2edb17986a1d99365a4468a67bd65e09e47))

## [1.15.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.14.0...v1.15.0) (2023-03-07)


### Features

* log process memory errors ([#1920](https://github.com/rudderlabs/rudder-transformer/issues/1920)) ([076d7b5](https://github.com/rudderlabs/rudder-transformer/commit/076d7b58831b035102a0544985d9a1ff67ef1791))
* revamp github actions for release management ([#1898](https://github.com/rudderlabs/rudder-transformer/issues/1898)) ([8847f58](https://github.com/rudderlabs/rudder-transformer/commit/8847f589dc2248d4210c82326022d9f459b2f888))
* suppress errors from unwanted modules to bugsnag ([#1907](https://github.com/rudderlabs/rudder-transformer/issues/1907)) ([9e6a1c0](https://github.com/rudderlabs/rudder-transformer/commit/9e6a1c0bd3dfa79e2a470eefad7d4c9b34c842cb))


### Bug Fixes

* correcting method name for prepareProxy ([#1923](https://github.com/rudderlabs/rudder-transformer/issues/1923)) ([cfed522](https://github.com/rudderlabs/rudder-transformer/commit/cfed5228be21bd8d7f5a2ea8bc4b97c973a112be))
* **fb pixel:** zp mapping and external_id ([#1908](https://github.com/rudderlabs/rudder-transformer/issues/1908)) ([c8665d4](https://github.com/rudderlabs/rudder-transformer/commit/c8665d4475fe06d45d3b4fdd26b46247be0188f6))
* **ga4:** product array issue ([#1845](https://github.com/rudderlabs/rudder-transformer/issues/1845)) ([3d24e93](https://github.com/rudderlabs/rudder-transformer/commit/3d24e93a6c00c3d2bd425012e4b315997b5e05b6))
* updated batching logic for pinterest_tag ([#1878](https://github.com/rudderlabs/rudder-transformer/issues/1878)) ([e38d772](https://github.com/rudderlabs/rudder-transformer/commit/e38d7721451d4c43d8c1fe67d28566302dced440))

## [1.14.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.13.0...v1.14.0) (2023-02-28)


### Features

* added customerio group call support ([#1869](https://github.com/rudderlabs/rudder-transformer/issues/1869)) ([5e692ea](https://github.com/rudderlabs/rudder-transformer/commit/5e692ead3c43819edd47f8cf244a3f78ce510359))
* added new destination vitally ([#1892](https://github.com/rudderlabs/rudder-transformer/issues/1892)) ([8638ee7](https://github.com/rudderlabs/rudder-transformer/commit/8638ee7765b4e3ecf215ec90056d03cffb42f5f6))
* include latest image of transformer ([#1879](https://github.com/rudderlabs/rudder-transformer/issues/1879)) ([b179fef](https://github.com/rudderlabs/rudder-transformer/commit/b179fef031fe06aa8d4e3b258c4740b45f4387bb))
* onboard courier destination ([#1844](https://github.com/rudderlabs/rudder-transformer/issues/1844)) ([#1883](https://github.com/rudderlabs/rudder-transformer/issues/1883)) ([18bcdf8](https://github.com/rudderlabs/rudder-transformer/commit/18bcdf8b4b1f0b63cbe3f839df38f4b6b6875e98))
* python libraries ([#1855](https://github.com/rudderlabs/rudder-transformer/issues/1855)) ([01f3df5](https://github.com/rudderlabs/rudder-transformer/commit/01f3df5ad5868a3604715c26f7ea9d8dea82860b))
* **transformation:** adding rudder libraries support ([#1817](https://github.com/rudderlabs/rudder-transformer/issues/1817)) ([1c91d22](https://github.com/rudderlabs/rudder-transformer/commit/1c91d22795b142a90011e35cf85d1a4ac8eaa545))


### Bug Fixes

* **active-campaign:** add check before iterating stored event array ([#1902](https://github.com/rudderlabs/rudder-transformer/issues/1902)) ([9666e85](https://github.com/rudderlabs/rudder-transformer/commit/9666e851751101efc99f1d48018a9ae1ed6a9b8e))
* **integration:** Algolia  in CDK v2 now errors out for non string event names ([#1867](https://github.com/rudderlabs/rudder-transformer/issues/1867)) ([5be8891](https://github.com/rudderlabs/rudder-transformer/commit/5be88917270a9fb1c28fdd7f547e9a017aacf56d))
* logger import ([#1874](https://github.com/rudderlabs/rudder-transformer/issues/1874)) ([7ff1b4a](https://github.com/rudderlabs/rudder-transformer/commit/7ff1b4a11fe530de45dacce1da7bf0d58d4b38fd))
* package.json & package-lock.json to reduce vulnerabilities ([#1885](https://github.com/rudderlabs/rudder-transformer/issues/1885)) ([11b4a4b](https://github.com/rudderlabs/rudder-transformer/commit/11b4a4b523b00dffb0c9d0017a6ed3279fc596d2))

## [1.13.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.12.0...v1.13.0) (2023-02-15)


### Features

* **destination:** onboard criteo audience ([#1792](https://github.com/rudderlabs/rudder-transformer/issues/1792)) ([5904c75](https://github.com/rudderlabs/rudder-transformer/commit/5904c75042c7cb34320fc43bcd3b54bfe5ce97fc))
* **integration:** rockerbox - add support for custom properties mapping ([#1815](https://github.com/rudderlabs/rudder-transformer/issues/1815)) ([8ba50d2](https://github.com/rudderlabs/rudder-transformer/commit/8ba50d2249d5bd5db84ff9c37323e618b5942ec5))
* **integration:** rockerbox - allow all properties to be passed over to rockerbox ([#1838](https://github.com/rudderlabs/rudder-transformer/issues/1838)) ([fb64039](https://github.com/rudderlabs/rudder-transformer/commit/fb6403992c76077398a9f8b5ac4cbe9fb28fd073))
* **integrations:** onboarding webhook to CDK v2 ([#1783](https://github.com/rudderlabs/rudder-transformer/issues/1783)) ([22d583a](https://github.com/rudderlabs/rudder-transformer/commit/22d583ae2c239f532629a0d0db055658e2eda65d))
* **mailchimp:** add support for track call ([#1814](https://github.com/rudderlabs/rudder-transformer/issues/1814)) ([94c10ba](https://github.com/rudderlabs/rudder-transformer/commit/94c10ba971a54f5f9894c0107a96a121068994cf))
* moengage source ([#1846](https://github.com/rudderlabs/rudder-transformer/issues/1846)) ([123a2d9](https://github.com/rudderlabs/rudder-transformer/commit/123a2d9f57fd4f0c76f939b8d56edbbbc995ab00))
* **new integration:** onboard optimizely fullstack cloud mode ([#1805](https://github.com/rudderlabs/rudder-transformer/issues/1805)) ([5373185](https://github.com/rudderlabs/rudder-transformer/commit/537318589110672ad6f453510a19e7fde3bfd2bb))
* shopify - add cart token, order token and checkout token in the Context object ([#1847](https://github.com/rudderlabs/rudder-transformer/issues/1847)) ([88e8fe0](https://github.com/rudderlabs/rudder-transformer/commit/88e8fe0a14766532739aaf800cebb61b0ef6175d))
* **source:** initial commit for identity stitching in shopify ([#1810](https://github.com/rudderlabs/rudder-transformer/issues/1810)) ([7b662df](https://github.com/rudderlabs/rudder-transformer/commit/7b662dfbf192f08f7bd2baf8dbd9dc5f12a8f23e))
* **transformation:** libraries import extractor ([#1851](https://github.com/rudderlabs/rudder-transformer/issues/1851)) ([462bba9](https://github.com/rudderlabs/rudder-transformer/commit/462bba9e9ed49f0a76a8bb0e4d0b444e324f208c))
* userId to be converted to string for Router ([#1822](https://github.com/rudderlabs/rudder-transformer/issues/1822)) ([7ec03c6](https://github.com/rudderlabs/rudder-transformer/commit/7ec03c66632513da4a311c3e19abcb3accf3437e))


### Bug Fixes

* **active_campaign:** handle bad url string while formatting with domainUrlV2 ([#1816](https://github.com/rudderlabs/rudder-transformer/issues/1816)) ([7fd15be](https://github.com/rudderlabs/rudder-transformer/commit/7fd15be8633c9cc6fcb4448f73042d641f81356c))
* amplitude check for actionKey before accessing it  ([#1833](https://github.com/rudderlabs/rudder-transformer/issues/1833)) ([5071582](https://github.com/rudderlabs/rudder-transformer/commit/50715827981e70e814c427cfa0359de16fb3c554))
* bugsnag errors ([#1863](https://github.com/rudderlabs/rudder-transformer/issues/1863)) ([ae627d3](https://github.com/rudderlabs/rudder-transformer/commit/ae627d3adc48aa5ab390461693005d8957757430))
* **CDK v2:** editing CDK v2 for pinterest tag for num_items field ([#1840](https://github.com/rudderlabs/rudder-transformer/issues/1840)) ([b1265c0](https://github.com/rudderlabs/rudder-transformer/commit/b1265c0949f8352881dfb13d5d31ba712e26363b))
* codebuild issue ([16eab14](https://github.com/rudderlabs/rudder-transformer/commit/16eab14e627184d04b1a7dbb1fdd3388ff065c85))
* criteo_audience: stringification of destination error ([#1839](https://github.com/rudderlabs/rudder-transformer/issues/1839)) ([fe17453](https://github.com/rudderlabs/rudder-transformer/commit/fe17453db7bef03916feb271bae1c25b613829da))
* ga4 userId issue ([#1857](https://github.com/rudderlabs/rudder-transformer/issues/1857)) ([cd30c47](https://github.com/rudderlabs/rudder-transformer/commit/cd30c47f292db71a8961bef6b38a3478316e00b9))
* **integration:** Pinterest conversion in CDK v2 returns correct num_items for single product array ([#1861](https://github.com/rudderlabs/rudder-transformer/issues/1861)) ([8c8c316](https://github.com/rudderlabs/rudder-transformer/commit/8c8c316b9ba795111f716c314cedb189e968260e))
* **integrations:** salesforce update error message and error response handler ([#1799](https://github.com/rudderlabs/rudder-transformer/issues/1799)) ([b473c23](https://github.com/rudderlabs/rudder-transformer/commit/b473c2389909e1f06d8d79b279e66b86b414c908))
* **klaviyo:** skip profile lookup call for rETL events ([#1856](https://github.com/rudderlabs/rudder-transformer/issues/1856)) ([9e6b5e4](https://github.com/rudderlabs/rudder-transformer/commit/9e6b5e4c145d64341e043014baed4e344fecc74c))
* order_token updated in shopify ([#1865](https://github.com/rudderlabs/rudder-transformer/issues/1865)) ([7fc608e](https://github.com/rudderlabs/rudder-transformer/commit/7fc608e0f1c264c4494b987e0102ff48aa51e4fe))
* package.json & package-lock.json to reduce vulnerabilities ([#1824](https://github.com/rudderlabs/rudder-transformer/issues/1824)) ([779edb2](https://github.com/rudderlabs/rudder-transformer/commit/779edb290b04694b126739708a30be024a53fe33))
* refactor subscribe user flow to stop subscribing user without consent ([#1841](https://github.com/rudderlabs/rudder-transformer/issues/1841)) ([fe231c2](https://github.com/rudderlabs/rudder-transformer/commit/fe231c280a1250413f4b665820e4da303e05259a))
* set context as metadata in bugsnag error notification ([#1778](https://github.com/rudderlabs/rudder-transformer/issues/1778)) ([55c3097](https://github.com/rudderlabs/rudder-transformer/commit/55c309716877b303943c18537352347b83d72c2f))
* **singular:** undefined properties object for track ([#1808](https://github.com/rudderlabs/rudder-transformer/issues/1808)) ([f53bec1](https://github.com/rudderlabs/rudder-transformer/commit/f53bec192825aedfcf320197c386a449f9677816))
* **transformation:** release isolate in case of error while creating ([#1850](https://github.com/rudderlabs/rudder-transformer/issues/1850)) ([ea51e24](https://github.com/rudderlabs/rudder-transformer/commit/ea51e24a893daa18e9b30463e9300ce029230a00))
* typecast userId, anonymousId to string ([2150033](https://github.com/rudderlabs/rudder-transformer/commit/215003381557c583bd8889cef121ebbba56785c2))
* undefined check added for isHybridModeEnabled function ([#1812](https://github.com/rudderlabs/rudder-transformer/issues/1812)) ([a49be9e](https://github.com/rudderlabs/rudder-transformer/commit/a49be9e77b6ba6bc1ef5087208ddc1a135e4301e))
* update check for props value ([343e946](https://github.com/rudderlabs/rudder-transformer/commit/343e946ed4adc89ad8c17d945b69c2f3f3be7506))

## [1.12.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.11.0...v1.12.0) (2023-01-19)


### Features

* **BQStream:** add batch support ([#1377](https://github.com/rudderlabs/rudder-transformer/issues/1377)) ([14c7531](https://github.com/rudderlabs/rudder-transformer/commit/14c7531635b5348ef518dcad483f25d4adeddddd))
* **destination:** onboard lemnisk integration  ([#1787](https://github.com/rudderlabs/rudder-transformer/issues/1787)) ([3c6b9e1](https://github.com/rudderlabs/rudder-transformer/commit/3c6b9e148dff559357fb61de49602f9d1689d699)), closes [#1728](https://github.com/rudderlabs/rudder-transformer/issues/1728)
* ga4 page calls are discarded if hybrid mode is enabled ([#1794](https://github.com/rudderlabs/rudder-transformer/issues/1794)) ([ca12d07](https://github.com/rudderlabs/rudder-transformer/commit/ca12d078e3f936c4c0fd4449259d1a55ba0a4424))
* sessionId consistency across destinations ([#1789](https://github.com/rudderlabs/rudder-transformer/issues/1789)) ([ff68a44](https://github.com/rudderlabs/rudder-transformer/commit/ff68a4488e50f4a44c950395d0f9e5dc514db1df))


### Bug Fixes

* add missing implementation stat tag for router transformation ([#1779](https://github.com/rudderlabs/rudder-transformer/issues/1779)) ([5ebde56](https://github.com/rudderlabs/rudder-transformer/commit/5ebde56ea644f81d1a17fa4d85697821879fa191))
* add sources as valid channel to cdkv1 ([bd74ef7](https://github.com/rudderlabs/rudder-transformer/commit/bd74ef7eff712d4db75856a205ddaa473d80ddd9))
* add sources as valid channel to cdkv1 ([#1803](https://github.com/rudderlabs/rudder-transformer/issues/1803)) ([e3057db](https://github.com/rudderlabs/rudder-transformer/commit/e3057dbff9d8daa1f64b5cd6de6b57ab97c016ee))
* add validation for event name as string ([#1768](https://github.com/rudderlabs/rudder-transformer/issues/1768)) ([c48ec5e](https://github.com/rudderlabs/rudder-transformer/commit/c48ec5e3cd6590e5c766bc3afac9eb5c368b85f0))
* array type check for externalIdArray ([#1785](https://github.com/rudderlabs/rudder-transformer/issues/1785)) ([dec3bb6](https://github.com/rudderlabs/rudder-transformer/commit/dec3bb6661b6737203964b2c4b5e3d2bd7421433))
* bugsnag error fixes for salesforce, garl, gaoc ([#1776](https://github.com/rudderlabs/rudder-transformer/issues/1776)) ([553c5de](https://github.com/rudderlabs/rudder-transformer/commit/553c5defc098e01e74d98606cf59baa9008b814d))
* change destination configuration errors to abortable ([#1790](https://github.com/rudderlabs/rudder-transformer/issues/1790)) ([fb1281d](https://github.com/rudderlabs/rudder-transformer/commit/fb1281d2bc090bda34c7420c10946504e83756ef))
* destination transformation change from processor to router ([#1754](https://github.com/rudderlabs/rudder-transformer/issues/1754)) ([674d476](https://github.com/rudderlabs/rudder-transformer/commit/674d476bd1e55194456798c7a83bd27a62b868e3))
* **integration:** GAOC - fix timestamp format, allow calls without custom variables ([#1796](https://github.com/rudderlabs/rudder-transformer/issues/1796)) ([7c450ee](https://github.com/rudderlabs/rudder-transformer/commit/7c450ee78db2052bbb70866cbc6bd98cfd9c32b4))
* iterable alias call is separated from identify batching ([#1777](https://github.com/rudderlabs/rudder-transformer/issues/1777)) ([3676c45](https://github.com/rudderlabs/rudder-transformer/commit/3676c4591e8b241ad6a7873954bc8f07e7a69584))
* products array mapping and rename impact_radius to impact ([#1797](https://github.com/rudderlabs/rudder-transformer/issues/1797)) ([f812f0d](https://github.com/rudderlabs/rudder-transformer/commit/f812f0d3fbff6d6bfdd3670c59cf8ea01744f80f))
* proper error throw in gaec ([#1767](https://github.com/rudderlabs/rudder-transformer/issues/1767)) ([a2ed19d](https://github.com/rudderlabs/rudder-transformer/commit/a2ed19dc0b5eb6bbaec7dd88b25762553b1aae79))
* remove regex validation for phone_number ([#1771](https://github.com/rudderlabs/rudder-transformer/issues/1771)) ([6c01642](https://github.com/rudderlabs/rudder-transformer/commit/6c016428b496cea7e3771d3cf5ab4dfbbd7e382b))
* revert salesforce fix for undefined access_token ([#1780](https://github.com/rudderlabs/rudder-transformer/issues/1780)) ([d917b2e](https://github.com/rudderlabs/rudder-transformer/commit/d917b2e61afbdfb697e5d6066aa6e34fd9f71427))
* send dest info for failed events ([#1770](https://github.com/rudderlabs/rudder-transformer/issues/1770)) ([9f108c0](https://github.com/rudderlabs/rudder-transformer/commit/9f108c0b6a0978b7ca71d1b1bbeaafbba8dce2ee))

## [1.11.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.10.0...v1.11.0) (2023-01-10)


### Features

* [impact radius] onboard impact radius cloud mode destination ([#1730](https://github.com/rudderlabs/rudder-transformer/issues/1730)) ([8d55c24](https://github.com/rudderlabs/rudder-transformer/commit/8d55c24930e45ddb0a38d1e2ca935b11d8fac665)), closes [#1764](https://github.com/rudderlabs/rudder-transformer/issues/1764)
* appcenter updated to support test events ([#1741](https://github.com/rudderlabs/rudder-transformer/issues/1741)) ([00648da](https://github.com/rudderlabs/rudder-transformer/commit/00648da21286cf4170e395e601dcd4b7d199957f))
* **braze:** nested array ops ([#1753](https://github.com/rudderlabs/rudder-transformer/issues/1753)) ([0658a5f](https://github.com/rudderlabs/rudder-transformer/commit/0658a5f323a7b076a88fcb987f2ac25ea803552f))
* clientId support added for ga4 hybrid mode ([#1759](https://github.com/rudderlabs/rudder-transformer/issues/1759)) ([04638cb](https://github.com/rudderlabs/rudder-transformer/commit/04638cb1550c05435a12d8ed481fd55c13e667da))
* **destination:** onboard discord ([#1725](https://github.com/rudderlabs/rudder-transformer/issues/1725)) ([4f6323b](https://github.com/rudderlabs/rudder-transformer/commit/4f6323bcb5e13fb70fd0fd879c64917d46120a34)), closes [#1647](https://github.com/rudderlabs/rudder-transformer/issues/1647) [#1644](https://github.com/rudderlabs/rudder-transformer/issues/1644) [#1656](https://github.com/rudderlabs/rudder-transformer/issues/1656) [#1658](https://github.com/rudderlabs/rudder-transformer/issues/1658) [#1665](https://github.com/rudderlabs/rudder-transformer/issues/1665) [#1649](https://github.com/rudderlabs/rudder-transformer/issues/1649) [#1652](https://github.com/rudderlabs/rudder-transformer/issues/1652) [#1651](https://github.com/rudderlabs/rudder-transformer/issues/1651) [#1669](https://github.com/rudderlabs/rudder-transformer/issues/1669) [#1673](https://github.com/rudderlabs/rudder-transformer/issues/1673) [#1638](https://github.com/rudderlabs/rudder-transformer/issues/1638) [#1641](https://github.com/rudderlabs/rudder-transformer/issues/1641) [#1653](https://github.com/rudderlabs/rudder-transformer/issues/1653) [#1661](https://github.com/rudderlabs/rudder-transformer/issues/1661) [#1666](https://github.com/rudderlabs/rudder-transformer/issues/1666) [#1667](https://github.com/rudderlabs/rudder-transformer/issues/1667) [#1671](https://github.com/rudderlabs/rudder-transformer/issues/1671) [#1659](https://github.com/rudderlabs/rudder-transformer/issues/1659) [#1654](https://github.com/rudderlabs/rudder-transformer/issues/1654) [#1655](https://github.com/rudderlabs/rudder-transformer/issues/1655) [#1670](https://github.com/rudderlabs/rudder-transformer/issues/1670) [#1657](https://github.com/rudderlabs/rudder-transformer/issues/1657) [#1672](https://github.com/rudderlabs/rudder-transformer/issues/1672) [#1642](https://github.com/rudderlabs/rudder-transformer/issues/1642) [#1645](https://github.com/rudderlabs/rudder-transformer/issues/1645) [#1650](https://github.com/rudderlabs/rudder-transformer/issues/1650) [#1639](https://github.com/rudderlabs/rudder-transformer/issues/1639) [#1674](https://github.com/rudderlabs/rudder-transformer/issues/1674) [#1660](https://github.com/rudderlabs/rudder-transformer/issues/1660) [#1648](https://github.com/rudderlabs/rudder-transformer/issues/1648) [#1675](https://github.com/rudderlabs/rudder-transformer/issues/1675) [#1677](https://github.com/rudderlabs/rudder-transformer/issues/1677) [#1678](https://github.com/rudderlabs/rudder-transformer/issues/1678) [#1676](https://github.com/rudderlabs/rudder-transformer/issues/1676) [#1680](https://github.com/rudderlabs/rudder-transformer/issues/1680) [#1682](https://github.com/rudderlabs/rudder-transformer/issues/1682) [#1681](https://github.com/rudderlabs/rudder-transformer/issues/1681) [#1684](https://github.com/rudderlabs/rudder-transformer/issues/1684) [#1685](https://github.com/rudderlabs/rudder-transformer/issues/1685) [#1686](https://github.com/rudderlabs/rudder-transformer/issues/1686) [#1687](https://github.com/rudderlabs/rudder-transformer/issues/1687) [#1688](https://github.com/rudderlabs/rudder-transformer/issues/1688) [#1689](https://github.com/rudderlabs/rudder-transformer/issues/1689) [#1690](https://github.com/rudderlabs/rudder-transformer/issues/1690) [#1691](https://github.com/rudderlabs/rudder-transformer/issues/1691) [#1692](https://github.com/rudderlabs/rudder-transformer/issues/1692) [#1697](https://github.com/rudderlabs/rudder-transformer/issues/1697) [#1699](https://github.com/rudderlabs/rudder-transformer/issues/1699) [#1700](https://github.com/rudderlabs/rudder-transformer/issues/1700) [#1698](https://github.com/rudderlabs/rudder-transformer/issues/1698) [#1704](https://github.com/rudderlabs/rudder-transformer/issues/1704) [#1705](https://github.com/rudderlabs/rudder-transformer/issues/1705)
* **destination:** onboard pipedream ([#1703](https://github.com/rudderlabs/rudder-transformer/issues/1703)) ([f03e86a](https://github.com/rudderlabs/rudder-transformer/commit/f03e86a89c1123310b5d9507c5e4d82ea3d4bbf8))
* **destination:** onboard TikTok_Ads_Offline_Events ([#1749](https://github.com/rudderlabs/rudder-transformer/issues/1749)) ([67a3a4e](https://github.com/rudderlabs/rudder-transformer/commit/67a3a4ef6f9caa3a87afce09d502a702c584ce33))
* ga4 hybrid mode support ([#1709](https://github.com/rudderlabs/rudder-transformer/issues/1709)) ([08779d4](https://github.com/rudderlabs/rudder-transformer/commit/08779d4b8ff94bd21d9ef3600736503193da1620))
* **integration:** adobe_analytics-fix typo, add missing mapping ([#1763](https://github.com/rudderlabs/rudder-transformer/issues/1763)) ([32f65dc](https://github.com/rudderlabs/rudder-transformer/commit/32f65dcdd3d807be1eb9a409a7b5b1d0892b067a))
* **new integration:** onboarding sendinblue cloud mode destination ([#1662](https://github.com/rudderlabs/rudder-transformer/issues/1662)) ([e265e66](https://github.com/rudderlabs/rudder-transformer/commit/e265e66a900671f537198769b8ee0c61694bdbf2))
* onboard pagerduty destination ([#1736](https://github.com/rudderlabs/rudder-transformer/issues/1736)) ([a947b10](https://github.com/rudderlabs/rudder-transformer/commit/a947b10c5d642463d1a03061906520ebbfdc9b05))
* onboard pagerduty source ([#1721](https://github.com/rudderlabs/rudder-transformer/issues/1721)) ([927fa95](https://github.com/rudderlabs/rudder-transformer/commit/927fa951c35cfe098dfdb3e5499fdffcc47cb18d))
* **pinterest:** add ldp support ([#1731](https://github.com/rudderlabs/rudder-transformer/issues/1731)) ([a54d074](https://github.com/rudderlabs/rudder-transformer/commit/a54d074f547e5e1d291bf6fa830afc013c2c7146))
* **transformation:** faas integration for python transformations ([#1664](https://github.com/rudderlabs/rudder-transformer/issues/1664)) ([5ac8ac5](https://github.com/rudderlabs/rudder-transformer/commit/5ac8ac54b2e10ff600ab7c08b8a9ce3e6a345bee))


### Bug Fixes

* **amplitude:** added an error validation at processor ([#1717](https://github.com/rudderlabs/rudder-transformer/issues/1717)) ([424bce9](https://github.com/rudderlabs/rudder-transformer/commit/424bce9cc72a2196a955efd08e643d04e337317a))
* **destination:** credentials exposure on live events for aws lambda ([#1726](https://github.com/rudderlabs/rudder-transformer/issues/1726)) ([589fc40](https://github.com/rudderlabs/rudder-transformer/commit/589fc407d2c4449628fa7915289ae9a1c97d20d4))
* encode email with encodeUriComponent before searching ([#1729](https://github.com/rudderlabs/rudder-transformer/issues/1729)) ([21b624f](https://github.com/rudderlabs/rudder-transformer/commit/21b624f59c098a0459a16347e1845d7a661377fd))
* **facebook pixel:** error code mapping for transformer proxy ([#1738](https://github.com/rudderlabs/rudder-transformer/issues/1738)) ([4e98299](https://github.com/rudderlabs/rudder-transformer/commit/4e98299298f10dc5ae39d5a3994746515622c729))
* fixed flattenJson method ([#1718](https://github.com/rudderlabs/rudder-transformer/issues/1718)) ([9edb44e](https://github.com/rudderlabs/rudder-transformer/commit/9edb44e11b9b7ae059e9f4cfa88633e3fa4cd902))
* hotfix for zendesk global variable ([a5d4424](https://github.com/rudderlabs/rudder-transformer/commit/a5d442405b3b55cc3bafd1389a771904d31da7c6))
* set content_type product by default ([#1761](https://github.com/rudderlabs/rudder-transformer/issues/1761)) ([6f9cda1](https://github.com/rudderlabs/rudder-transformer/commit/6f9cda143cb8ab6b215f4b3684c5375a76d160fd))
* user deletion handlers implementation across destinations ([#1748](https://github.com/rudderlabs/rudder-transformer/issues/1748)) ([786cfe0](https://github.com/rudderlabs/rudder-transformer/commit/786cfe0d0849d68a511c920d6c292ef3f73aee7f)), closes [#1720](https://github.com/rudderlabs/rudder-transformer/issues/1720) [#1719](https://github.com/rudderlabs/rudder-transformer/issues/1719) [#1723](https://github.com/rudderlabs/rudder-transformer/issues/1723) [#1751](https://github.com/rudderlabs/rudder-transformer/issues/1751) [#1750](https://github.com/rudderlabs/rudder-transformer/issues/1750) [#1735](https://github.com/rudderlabs/rudder-transformer/issues/1735)
* **zendesk:** remove endpoint global variable ([#1746](https://github.com/rudderlabs/rudder-transformer/issues/1746)) ([836c37e](https://github.com/rudderlabs/rudder-transformer/commit/836c37eb069ee88d24806e692ec70e0d0b045ae1))

## [1.10.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.9.1...v1.10.0) (2022-12-20)


### Features

* introduce new tags and error classes ([#1631](https://github.com/rudderlabs/rudder-transformer/issues/1631)) ([0615a31](https://github.com/rudderlabs/rudder-transformer/commit/0615a3196d4203f6f648a4e04ca84e7ede405895)), closes [#1647](https://github.com/rudderlabs/rudder-transformer/issues/1647) [#1644](https://github.com/rudderlabs/rudder-transformer/issues/1644) [#1656](https://github.com/rudderlabs/rudder-transformer/issues/1656) [#1658](https://github.com/rudderlabs/rudder-transformer/issues/1658) [#1665](https://github.com/rudderlabs/rudder-transformer/issues/1665) [#1649](https://github.com/rudderlabs/rudder-transformer/issues/1649) [#1652](https://github.com/rudderlabs/rudder-transformer/issues/1652) [#1651](https://github.com/rudderlabs/rudder-transformer/issues/1651) [#1669](https://github.com/rudderlabs/rudder-transformer/issues/1669) [#1673](https://github.com/rudderlabs/rudder-transformer/issues/1673) [#1638](https://github.com/rudderlabs/rudder-transformer/issues/1638) [#1641](https://github.com/rudderlabs/rudder-transformer/issues/1641) [#1653](https://github.com/rudderlabs/rudder-transformer/issues/1653) [#1661](https://github.com/rudderlabs/rudder-transformer/issues/1661) [#1666](https://github.com/rudderlabs/rudder-transformer/issues/1666) [#1667](https://github.com/rudderlabs/rudder-transformer/issues/1667) [#1671](https://github.com/rudderlabs/rudder-transformer/issues/1671) [#1659](https://github.com/rudderlabs/rudder-transformer/issues/1659) [#1654](https://github.com/rudderlabs/rudder-transformer/issues/1654) [#1655](https://github.com/rudderlabs/rudder-transformer/issues/1655) [#1670](https://github.com/rudderlabs/rudder-transformer/issues/1670) [#1657](https://github.com/rudderlabs/rudder-transformer/issues/1657) [#1672](https://github.com/rudderlabs/rudder-transformer/issues/1672) [#1642](https://github.com/rudderlabs/rudder-transformer/issues/1642) [#1645](https://github.com/rudderlabs/rudder-transformer/issues/1645) [#1650](https://github.com/rudderlabs/rudder-transformer/issues/1650) [#1639](https://github.com/rudderlabs/rudder-transformer/issues/1639) [#1674](https://github.com/rudderlabs/rudder-transformer/issues/1674) [#1660](https://github.com/rudderlabs/rudder-transformer/issues/1660) [#1648](https://github.com/rudderlabs/rudder-transformer/issues/1648) [#1675](https://github.com/rudderlabs/rudder-transformer/issues/1675) [#1677](https://github.com/rudderlabs/rudder-transformer/issues/1677) [#1678](https://github.com/rudderlabs/rudder-transformer/issues/1678) [#1676](https://github.com/rudderlabs/rudder-transformer/issues/1676) [#1680](https://github.com/rudderlabs/rudder-transformer/issues/1680) [#1682](https://github.com/rudderlabs/rudder-transformer/issues/1682) [#1681](https://github.com/rudderlabs/rudder-transformer/issues/1681) [#1684](https://github.com/rudderlabs/rudder-transformer/issues/1684) [#1685](https://github.com/rudderlabs/rudder-transformer/issues/1685) [#1686](https://github.com/rudderlabs/rudder-transformer/issues/1686) [#1687](https://github.com/rudderlabs/rudder-transformer/issues/1687) [#1688](https://github.com/rudderlabs/rudder-transformer/issues/1688) [#1689](https://github.com/rudderlabs/rudder-transformer/issues/1689) [#1690](https://github.com/rudderlabs/rudder-transformer/issues/1690) [#1691](https://github.com/rudderlabs/rudder-transformer/issues/1691) [#1692](https://github.com/rudderlabs/rudder-transformer/issues/1692) [#1697](https://github.com/rudderlabs/rudder-transformer/issues/1697) [#1699](https://github.com/rudderlabs/rudder-transformer/issues/1699) [#1700](https://github.com/rudderlabs/rudder-transformer/issues/1700) [#1698](https://github.com/rudderlabs/rudder-transformer/issues/1698) [#1704](https://github.com/rudderlabs/rudder-transformer/issues/1704) [#1705](https://github.com/rudderlabs/rudder-transformer/issues/1705)


### Bug Fixes

* minor issues ([#1711](https://github.com/rudderlabs/rudder-transformer/issues/1711)) ([fdea0bd](https://github.com/rudderlabs/rudder-transformer/commit/fdea0bd74529d7f4625885a594eea9fa20a0f20a))

### [1.9.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.9.0...v1.9.1) (2022-12-16)


### Bug Fixes

* **trackingplan:** error message population ([#1706](https://github.com/rudderlabs/rudder-transformer/issues/1706)) ([72079a7](https://github.com/rudderlabs/rudder-transformer/commit/72079a7a71f52d44b057df6a910f0b0b54108f72))

## [1.9.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.8.0...v1.9.0) (2022-12-16)


### Features

* **destination:** onboard pipedream as event stream source ([#1634](https://github.com/rudderlabs/rudder-transformer/issues/1634)) ([477e2f7](https://github.com/rudderlabs/rudder-transformer/commit/477e2f79704576c5611a9a7e97faf066db10dd87))
* map the usertraits for all event in Posthog ([#1636](https://github.com/rudderlabs/rudder-transformer/issues/1636)) ([3a12f79](https://github.com/rudderlabs/rudder-transformer/commit/3a12f793073ab360ef5f235aac77b3c587c16006))
* onboard ga4 hybrid mode ([#1617](https://github.com/rudderlabs/rudder-transformer/issues/1617)) ([0986b76](https://github.com/rudderlabs/rudder-transformer/commit/0986b769d2e2d84314724a16c322cd05d9fa8bd4))
* onboard pinterest and algolia to json template engine ([#1640](https://github.com/rudderlabs/rudder-transformer/issues/1640)) ([f0f4717](https://github.com/rudderlabs/rudder-transformer/commit/f0f471762dae0ccc8f3449c50f1602bf03a54ec5))


### Bug Fixes

* **destination:** follow ecommerce spec in tiktok_ads ([#1629](https://github.com/rudderlabs/rudder-transformer/issues/1629)) ([a258bfb](https://github.com/rudderlabs/rudder-transformer/commit/a258bfb4b746aa48c12435792adb477a2957334e))
* upgrade base node image in dockerfiles ([#1702](https://github.com/rudderlabs/rudder-transformer/issues/1702)) ([a26b20e](https://github.com/rudderlabs/rudder-transformer/commit/a26b20e43915cb8020e46e16c1997b38663f1899))

## [1.8.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.7.0...v1.8.0) (2022-12-07)


### Features

* added subscription group in braze ([#1597](https://github.com/rudderlabs/rudder-transformer/issues/1597)) ([f321f4e](https://github.com/rudderlabs/rudder-transformer/commit/f321f4e525c077c06c853530d8c8c23da35baee1))
* **clevertap:** onboarding clevertap transformer proxy ([#1596](https://github.com/rudderlabs/rudder-transformer/issues/1596)) ([5479aa6](https://github.com/rudderlabs/rudder-transformer/commit/5479aa6afde2171bfd767602c55a36590ed7059b))
* **destination:** add groupId support as groupKey in mixpanel ([#1590](https://github.com/rudderlabs/rudder-transformer/issues/1590)) ([a33adc6](https://github.com/rudderlabs/rudder-transformer/commit/a33adc6c12a4f7cd6b62955bc29d58206034b3c4))
* **destination:** cache eviction in salesforce ([#1598](https://github.com/rudderlabs/rudder-transformer/issues/1598)) ([9af5552](https://github.com/rudderlabs/rudder-transformer/commit/9af55520f3199b4ad0027edac4650b81193ff9c5))
* **destination:** onboard awin integration ([#1589](https://github.com/rudderlabs/rudder-transformer/issues/1589)) ([f015518](https://github.com/rudderlabs/rudder-transformer/commit/f0155185d3a9b9dfa3681a9b52c64fe5e24d6d6d))
* **destination:** onboard marketo static list ([#1558](https://github.com/rudderlabs/rudder-transformer/issues/1558)) ([db73de9](https://github.com/rudderlabs/rudder-transformer/commit/db73de99dd538eb1c820d3bd2d42689163993cfe))
* **destination:** onboard persistIq ([#1612](https://github.com/rudderlabs/rudder-transformer/issues/1612)) ([103ad00](https://github.com/rudderlabs/rudder-transformer/commit/103ad00df7d28d3368382cf7b0099c901bb853e4))
* **destination:** singular- add support for other apple os ([#1611](https://github.com/rudderlabs/rudder-transformer/issues/1611)) ([63f23d8](https://github.com/rudderlabs/rudder-transformer/commit/63f23d8dc8bcf80b84b0976903dfb360785bec86))
* ga user delete support ([#1531](https://github.com/rudderlabs/rudder-transformer/issues/1531)) ([eb198dd](https://github.com/rudderlabs/rudder-transformer/commit/eb198dd085d16d9c9069352cec8bfb6f33247654)), closes [#1551](https://github.com/rudderlabs/rudder-transformer/issues/1551)
* ga4 hybrid mode suport ([#1607](https://github.com/rudderlabs/rudder-transformer/issues/1607)) ([3edaa10](https://github.com/rudderlabs/rudder-transformer/commit/3edaa10741b2527bb05e13b129f233cba781d1e3))
* **integration:** shopify- Add topic support in context for debugging ([#1602](https://github.com/rudderlabs/rudder-transformer/issues/1602)) ([ff3fab2](https://github.com/rudderlabs/rudder-transformer/commit/ff3fab2ec13e012aad1920c6b86b6b3e78062690))
* **integrations:** update primary email for zendesk ([#1604](https://github.com/rudderlabs/rudder-transformer/issues/1604)) ([157f91e](https://github.com/rudderlabs/rudder-transformer/commit/157f91ef5654fddda90e8eb3e1f5899cee681854))
* onboard olark source ([#1614](https://github.com/rudderlabs/rudder-transformer/issues/1614)) ([64db0ec](https://github.com/rudderlabs/rudder-transformer/commit/64db0ec3a77a58a61d456ac66d91bcc1ee172c64))
* **source:** onboard satismeter as an event-stream ([#1594](https://github.com/rudderlabs/rudder-transformer/issues/1594)) ([53b9d6f](https://github.com/rudderlabs/rudder-transformer/commit/53b9d6ffaf0db1daa3eda8f8c89a0034cb50164e))


### Bug Fixes

* bugsnag bug fixes for several destinations and sources ([#1585](https://github.com/rudderlabs/rudder-transformer/issues/1585)) ([c222dc6](https://github.com/rudderlabs/rudder-transformer/commit/c222dc6cbc489d23ad9b38137c449e76084b458e))
* **destination:** empty params fix in awin ([#1628](https://github.com/rudderlabs/rudder-transformer/issues/1628)) ([e36ab45](https://github.com/rudderlabs/rudder-transformer/commit/e36ab455ce33a308c58aed84c51fef7f9b80ea26))
* email not required for update call ([#1626](https://github.com/rudderlabs/rudder-transformer/issues/1626)) ([51dcbd9](https://github.com/rudderlabs/rudder-transformer/commit/51dcbd9a0efee2cdc3342bdcc96c67783a5aa118))
* fixed encryption info and quantity mandatory in CM360 ([#1618](https://github.com/rudderlabs/rudder-transformer/issues/1618)) ([bbe0a26](https://github.com/rudderlabs/rudder-transformer/commit/bbe0a2689930ed783abfd1cf6ea66d50cf1cf826))
* remove disable destination category for OAuth destinations ([#1601](https://github.com/rudderlabs/rudder-transformer/issues/1601)) ([06f9ee7](https://github.com/rudderlabs/rudder-transformer/commit/06f9ee749d692ec781d53aa229fd58964d0420dd))
* saas -> master ([#1603](https://github.com/rudderlabs/rudder-transformer/issues/1603)) ([b154e1d](https://github.com/rudderlabs/rudder-transformer/commit/b154e1d61bd894e27f62ecc737d1dd0f1b16d28a)), closes [#1601](https://github.com/rudderlabs/rudder-transformer/issues/1601) [#1606](https://github.com/rudderlabs/rudder-transformer/issues/1606)

## [1.7.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.6.0...v1.7.0) (2022-11-17)


### Features

* add support for topic parsing ([#1574](https://github.com/rudderlabs/rudder-transformer/issues/1574)) ([da64878](https://github.com/rudderlabs/rudder-transformer/commit/da648788ab0460bd231cf9147fb9852747551ef8))
* **destination:** add partner_name for tiktok ads ([#1583](https://github.com/rudderlabs/rudder-transformer/issues/1583)) ([12265a9](https://github.com/rudderlabs/rudder-transformer/commit/12265a952a171627ac05d7eab8899d97ceade13c))
* **destination:** onboard campaign manager ([#1580](https://github.com/rudderlabs/rudder-transformer/issues/1580)) ([b823a53](https://github.com/rudderlabs/rudder-transformer/commit/b823a538ca4d4f38faa4762ae986375e0eb8ae05))
* sendgrid idetify and user deletion support ([#1571](https://github.com/rudderlabs/rudder-transformer/issues/1571)) ([caee969](https://github.com/rudderlabs/rudder-transformer/commit/caee969c79ce9673096d0fc4d08be3ba942ce9f5))


### Bug Fixes

* (marketo) logger import ([#1576](https://github.com/rudderlabs/rudder-transformer/issues/1576)) ([c83f046](https://github.com/rudderlabs/rudder-transformer/commit/c83f046ee8baed0e61e8c4d2ac78fec74d74b794))
* add test coverage for processMetadata function ([#1567](https://github.com/rudderlabs/rudder-transformer/issues/1567)) ([b438daa](https://github.com/rudderlabs/rudder-transformer/commit/b438daad9bf0c845d867e0261ff69e77fc3ee0cd))
* **destination:** fix the flattening issue solve for ga4  ([#1581](https://github.com/rudderlabs/rudder-transformer/issues/1581)) ([bea730d](https://github.com/rudderlabs/rudder-transformer/commit/bea730da510c016bd3a71cb519316375b44ea6d3))
* **destination:** revamp group call in Gainsight_PX to reduce API calls ([#1578](https://github.com/rudderlabs/rudder-transformer/issues/1578)) ([f641cc0](https://github.com/rudderlabs/rudder-transformer/commit/f641cc0d3b64fcb736bbd4d5208819958bacb393))
* **destination:** update formating of user traits in facebook pixel ([#1579](https://github.com/rudderlabs/rudder-transformer/issues/1579)) ([b7772e4](https://github.com/rudderlabs/rudder-transformer/commit/b7772e41530f1d4e88263408d4ff3532c187eaf5))
* **integration:** Shopify - correct typo in customer_disabled, add to track_maps ([#1573](https://github.com/rudderlabs/rudder-transformer/issues/1573)) ([cfb5c56](https://github.com/rudderlabs/rudder-transformer/commit/cfb5c56bdc70e52dc996fdfc9c26743a6728d875))
* **transformation:** convert slash to dot to get valid docker image name ([#1564](https://github.com/rudderlabs/rudder-transformer/issues/1564)) ([f1b6b94](https://github.com/rudderlabs/rudder-transformer/commit/f1b6b946e1a6eb519560b675f3fce10d1e833950))
* typo in topic mapping for shopify source ([#1566](https://github.com/rudderlabs/rudder-transformer/issues/1566)) ([0ecf278](https://github.com/rudderlabs/rudder-transformer/commit/0ecf278be9a2435ed67fee299350a34c4b13bb9a))

## [1.6.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.5.0...v1.6.0) (2022-11-10)


### Features

* **destination:** skip unix timestamp conversion if already being sent from source ([#1560](https://github.com/rudderlabs/rudder-transformer/issues/1560)) ([a52cbd7](https://github.com/rudderlabs/rudder-transformer/commit/a52cbd797fa8a0ccec6589ff78b966da26040fbc))
* **destination:** stringify the object and array for Clevertap ([#1554](https://github.com/rudderlabs/rudder-transformer/issues/1554)) ([1c7b459](https://github.com/rudderlabs/rudder-transformer/commit/1c7b459d74ae0b17360d0e49e9bc11557e6f4233))
* **destination:** support custom mapping with client_id for ga4 destination ([#1553](https://github.com/rudderlabs/rudder-transformer/issues/1553)) ([e9f056b](https://github.com/rudderlabs/rudder-transformer/commit/e9f056bacad84d7e59e58904626c6eb7edcc4686))
* **destination:** update identify call to set primary email for Zendesk([#1539](https://github.com/rudderlabs/rudder-transformer/issues/1539)) ([ed307a3](https://github.com/rudderlabs/rudder-transformer/commit/ed307a31ff46575f3a606a0894eeeaaec0b40c00))
* **marketo:** add dynamic ttl & cache eviction support ([#1519](https://github.com/rudderlabs/rudder-transformer/issues/1519)) ([19f1081](https://github.com/rudderlabs/rudder-transformer/commit/19f1081cc32ba9798876dcb9d46d9d094c171e1d))
* support custom webhooks in auth0 source transformer ([#1527](https://github.com/rudderlabs/rudder-transformer/issues/1527)) ([ebc005f](https://github.com/rudderlabs/rudder-transformer/commit/ebc005f84d3af4a7a32f362cc7ece842c8f269a1))


### Bug Fixes

* (marketo)- remove duplicate responseHandler from util and refactor ([#1557](https://github.com/rudderlabs/rudder-transformer/issues/1557)) ([144793e](https://github.com/rudderlabs/rudder-transformer/commit/144793eef2c83b9bc43b989b061c7c7a7c4f07fe))
* **destination:** do not update event properties to lowercase in hubspot ([#1559](https://github.com/rudderlabs/rudder-transformer/issues/1559)) ([e41b37f](https://github.com/rudderlabs/rudder-transformer/commit/e41b37f38f1f9de87fa452ea30c6587d87a95a5d))
* ecom events properties mapping correction ([#1549](https://github.com/rudderlabs/rudder-transformer/issues/1549)) ([0e9c816](https://github.com/rudderlabs/rudder-transformer/commit/0e9c816092c5fc777f2d472e13ec3aa94def2160))
* incorrect lodash cloneDeep import ([#1545](https://github.com/rudderlabs/rudder-transformer/issues/1545)) ([5e70dca](https://github.com/rudderlabs/rudder-transformer/commit/5e70dcae665f3610ea6e65bb2d6303b9a547036e))
* suppress cdk error types ([#1555](https://github.com/rudderlabs/rudder-transformer/issues/1555)) ([9215a7c](https://github.com/rudderlabs/rudder-transformer/commit/9215a7ca272122199202d26301f9515a1a3bd6b0))

## [1.5.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.4.0...v1.5.0) (2022-11-03)


### Features

* added multitopic support for kafka ([#1488](https://github.com/rudderlabs/rudder-transformer/issues/1488)) ([bd1298b](https://github.com/rudderlabs/rudder-transformer/commit/bd1298b57358cf62a2ef7f74fe06ba0200bda488))
* **new integration:** onboarding snapchat custom audience ([#1443](https://github.com/rudderlabs/rudder-transformer/issues/1443)) ([1e00248](https://github.com/rudderlabs/rudder-transformer/commit/1e0024824074e4b66a67f38302ec02d611e7a8c7))


### Bug Fixes

* fixing errors caught by bugsnag ([#1536](https://github.com/rudderlabs/rudder-transformer/issues/1536)) ([9c43896](https://github.com/rudderlabs/rudder-transformer/commit/9c43896f27be87d8c024a61b4cb4a09124918f23))
* suppress errors thrown from the transformers in bugsnag notifier ([#1534](https://github.com/rudderlabs/rudder-transformer/issues/1534)) ([1ca8e9f](https://github.com/rudderlabs/rudder-transformer/commit/1ca8e9f704eb03699c198c91cf1691ccdfa42772))

## [1.4.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.3.0...v1.4.0) (2022-11-01)


### Features

* **integration:** onboarding gainsight px source ([#1500](https://github.com/rudderlabs/rudder-transformer/issues/1500)) ([0d0cce5](https://github.com/rudderlabs/rudder-transformer/commit/0d0cce5299b0cad9c616cb7b0bbee92f6f414732))
* onboard algolia destination to cdk 2.0 ([#1474](https://github.com/rudderlabs/rudder-transformer/issues/1474)) ([e716d84](https://github.com/rudderlabs/rudder-transformer/commit/e716d8458d636854f59a555cafc2a7b00a0b1b50))


### Bug Fixes

* **amplitude:** send error response instead of discarding the event during batch processing ([#1521](https://github.com/rudderlabs/rudder-transformer/issues/1521)) ([fece19f](https://github.com/rudderlabs/rudder-transformer/commit/fece19fccff44a31d1d96c43bd138ce6f2cce10d))
* cdk based live compare test results ([#1483](https://github.com/rudderlabs/rudder-transformer/issues/1483)) ([d8f32c3](https://github.com/rudderlabs/rudder-transformer/commit/d8f32c3d522a6e3b33023828e1bd8b870046861f))
* error stat issue for algolia ([#1528](https://github.com/rudderlabs/rudder-transformer/issues/1528)) ([3a7482c](https://github.com/rudderlabs/rudder-transformer/commit/3a7482cf4f6d37785e9ef595bd7e4a9d54aebedb))
* upgrade ajv from 8.6.1 to 8.11.0 ([#1372](https://github.com/rudderlabs/rudder-transformer/issues/1372)) ([f3b54c0](https://github.com/rudderlabs/rudder-transformer/commit/f3b54c0876bb7be79244e02e31517db13260c610))
* upgrade axios from 0.26.1 to 0.27.2 ([#1403](https://github.com/rudderlabs/rudder-transformer/issues/1403)) ([1186518](https://github.com/rudderlabs/rudder-transformer/commit/1186518cf89ad4de3ad16ae0a0fcb09e148bdfe5))

## [1.3.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.2.0...v1.3.0) (2022-10-25)


### Features

* **error reporting:** integrate bugsnag ([#1469](https://github.com/rudderlabs/rudder-transformer/issues/1469)) ([39b5fa2](https://github.com/rudderlabs/rudder-transformer/commit/39b5fa22ddb8e79d540242c66732cdcb31760ba9))
* **integrations:** added support for catalogs iterable with vdm rETL source ([#1439](https://github.com/rudderlabs/rudder-transformer/issues/1439)) ([586f771](https://github.com/rudderlabs/rudder-transformer/commit/586f771f8e0733ac2f79ea4741bb155eb24910ca))
* **new integration:** factorsAi ([#1490](https://github.com/rudderlabs/rudder-transformer/issues/1490)) ([1000ca8](https://github.com/rudderlabs/rudder-transformer/commit/1000ca8853b48f65bf1e8db0e2999f1d4b47387b))


### Bug Fixes

* bugsnag error notify handler ([#1512](https://github.com/rudderlabs/rudder-transformer/issues/1512)) ([d947c0e](https://github.com/rudderlabs/rudder-transformer/commit/d947c0ec23998ce54553839cf4b2e337c379713e))
* **mixpanel:** stripped off last 36 characters of insert_id ([#1503](https://github.com/rudderlabs/rudder-transformer/issues/1503)) ([550faec](https://github.com/rudderlabs/rudder-transformer/commit/550faecae92d48364b0fdebb8e50c057c0dfffe2))
* posthog group update ([#1496](https://github.com/rudderlabs/rudder-transformer/issues/1496)) ([154f656](https://github.com/rudderlabs/rudder-transformer/commit/154f656e2d437c1c54a6ef85c1b37f65fe154f14))
* skip adding Id field to salesforce payload for retl ([#1501](https://github.com/rudderlabs/rudder-transformer/issues/1501)) ([d2808f4](https://github.com/rudderlabs/rudder-transformer/commit/d2808f42ae3d3281468dbec1fc13e1511a45ebcd))
* upgrade @aws-sdk/client-s3 from 3.56.0 to 3.180.0 ([#1505](https://github.com/rudderlabs/rudder-transformer/issues/1505)) ([58c0179](https://github.com/rudderlabs/rudder-transformer/commit/58c01795f2c5b767e614c0d1777d7173eb741d17))
* upgrade @aws-sdk/lib-storage from 3.56.0 to 3.142.0 ([#1370](https://github.com/rudderlabs/rudder-transformer/issues/1370)) ([94faae5](https://github.com/rudderlabs/rudder-transformer/commit/94faae5fe34ef559b82975d4c53f4bd54b6dbaf1))

## [1.2.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.1.0...v1.2.0) (2022-10-18)


* release 1.2.0 ([1ce4963](https://github.com/rudderlabs/rudder-transformer/commit/1ce4963a959d38077d5eece1795d7af5b6379314))

## [1.1.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.0.0...v1.1.0) (2022-10-17)


### Features

* **integration:** Marketo- attribute to attributes, apiName to name,… ([#1481](https://github.com/rudderlabs/rudder-transformer/issues/1481)) ([e7187d6](https://github.com/rudderlabs/rudder-transformer/commit/e7187d64ef20dd788826eed91a9bd234b778c93a))

## [1.0.0](https://github.com/rudderlabs/rudder-transformer/compare/v0.1.5-rc.0...v1.0.0) (2022-10-13)


### Features

* add commit id and version in health endpoint ([#1445](https://github.com/rudderlabs/rudder-transformer/issues/1445)) ([e21dca7](https://github.com/rudderlabs/rudder-transformer/commit/e21dca7106afae7b6150fa8ab85520de321a2ea4))
* Add library key support ([4aa31af](https://github.com/rudderlabs/rudder-transformer/commit/4aa31afc9828a20132a5b9142279f6d06179039a))
* Add support for all Apple family OSes ([#925](https://github.com/rudderlabs/rudder-transformer/issues/925)) ([0962527](https://github.com/rudderlabs/rudder-transformer/commit/0962527bbe11927a53dd0c3973d5d39da0b961ce))
* add Variance as a destination ([c5f84c6](https://github.com/rudderlabs/rudder-transformer/commit/c5f84c6f58b27ee45728f190869e21145a522a62))
* Added library key support for Amplitude ([5af62c0](https://github.com/rudderlabs/rudder-transformer/commit/5af62c09668eff2ee321dc72eed784c27bb25ee0))
* Added library key support for Amplitude ([f0cf6b5](https://github.com/rudderlabs/rudder-transformer/commit/f0cf6b526cf3f0dc9ffcc1476df683a351264c04))
* **Facebook Pixel:** add response parsing support ([#1412](https://github.com/rudderlabs/rudder-transformer/issues/1412)) ([00893c1](https://github.com/rudderlabs/rudder-transformer/commit/00893c1e525473df306648b0946ecb90841c4197))
* **hs:** Add support for hubspot association events sent from retl ([#1361](https://github.com/rudderlabs/rudder-transformer/issues/1361)) ([b18c93f](https://github.com/rudderlabs/rudder-transformer/commit/b18c93f9865b4ecb0b5025370c544c58102a4df0))
* integrate cdk v2 ([#1448](https://github.com/rudderlabs/rudder-transformer/issues/1448)) ([d5086c2](https://github.com/rudderlabs/rudder-transformer/commit/d5086c2f0807424ac4e66a6c12e59b07eada5cbe))
* **integration:** fb custom audience - upgrade v14 to v15 ([#1463](https://github.com/rudderlabs/rudder-transformer/issues/1463)) ([f83a4b6](https://github.com/rudderlabs/rudder-transformer/commit/f83a4b607fdf02746e60c103e8a29850caeca9e3))
* **integration:** marketo - correct attribute to attributes, fix test cases ([#1446](https://github.com/rudderlabs/rudder-transformer/issues/1446)) ([80b148f](https://github.com/rudderlabs/rudder-transformer/commit/80b148fabb0eb49ac132e196c2aae0e5be3fed6f))
* **integration:** onboard Facebook Offline Conversions destination ([#1462](https://github.com/rudderlabs/rudder-transformer/issues/1462)) ([9f0413b](https://github.com/rudderlabs/rudder-transformer/commit/9f0413b8285793ced787cd385beed956b675982a))
* **integration:** Singular- allow empty string by default for instal… ([#1480](https://github.com/rudderlabs/rudder-transformer/issues/1480)) ([c44dec2](https://github.com/rudderlabs/rudder-transformer/commit/c44dec2a0d6952647489754b3bd5d7917d563251))
* **integration:** Singular- unixtimestamp format fixes and empty url allowed for openuri ([#1476](https://github.com/rudderlabs/rudder-transformer/issues/1476)) ([66c1efd](https://github.com/rudderlabs/rudder-transformer/commit/66c1efd87878485c78a01f82ec8cafd21056f8a6))
* **integrations:** user deletion support for mp, clevertap, and af destinations ([#1426](https://github.com/rudderlabs/rudder-transformer/issues/1426)) ([b5c5d6f](https://github.com/rudderlabs/rudder-transformer/commit/b5c5d6fbb9023fbf86e370366ab3f6818b4c343b))
* json support for warehouse destinations ([#1144](https://github.com/rudderlabs/rudder-transformer/issues/1144)) ([a431b08](https://github.com/rudderlabs/rudder-transformer/commit/a431b087e139a26477050f64ee26dbbe473899a9))
* Klaviyo ecommerce Specs ([#904](https://github.com/rudderlabs/rudder-transformer/issues/904)) ([5dd5329](https://github.com/rudderlabs/rudder-transformer/commit/5dd53296fbe4add44cc4acb330a61d5e4e11ddc9))
* migrate pinterest to cdk ([#1458](https://github.com/rudderlabs/rudder-transformer/issues/1458)) ([addff70](https://github.com/rudderlabs/rudder-transformer/commit/addff70d77e50b53cb7bb10fa4f4f59523f38f57))
* **new integration:** google adwords offline conversions onboarding ([#1397](https://github.com/rudderlabs/rudder-transformer/issues/1397)) ([4974b6d](https://github.com/rudderlabs/rudder-transformer/commit/4974b6d40c6cfcae0f455bc18704137d9b921192))
* **new integration:** june cloud mode destination onboarding ([#1433](https://github.com/rudderlabs/rudder-transformer/issues/1433)) ([458b32c](https://github.com/rudderlabs/rudder-transformer/commit/458b32c2d4e0100a56eb084128ca0aa76e2a006c))
* **new integration:** onboard Monday cloud mode destination ([#1400](https://github.com/rudderlabs/rudder-transformer/issues/1400)) ([f4e5cc4](https://github.com/rudderlabs/rudder-transformer/commit/f4e5cc4542a4cd729d8e8c77d4973dbe858bb6db))
* **new integration:** onboarding mailjet ([#1449](https://github.com/rudderlabs/rudder-transformer/issues/1449)) ([81de8a1](https://github.com/rudderlabs/rudder-transformer/commit/81de8a16c6d1cdeb3ac8b27a7d8a0cd51fc2c4af))
* **new integration:** onboarding mailmodo source ([#1414](https://github.com/rudderlabs/rudder-transformer/issues/1414)) ([e3689c2](https://github.com/rudderlabs/rudder-transformer/commit/e3689c249fd92baa9b3d640c0802f71b78d22650))
* **serenytics:** onboarding serenytics cloud mode destinations ([#1430](https://github.com/rudderlabs/rudder-transformer/issues/1430)) ([b7e93e3](https://github.com/rudderlabs/rudder-transformer/commit/b7e93e310903e93c39403f1f4b819c14e09d528d))
* **signl4:** onboarding signl4 cloud mode destination ([#1424](https://github.com/rudderlabs/rudder-transformer/issues/1424)) ([47bd3f8](https://github.com/rudderlabs/rudder-transformer/commit/47bd3f817a4df4d555a8ede656a8b311a4232519))
* support 'event' alias for 'message' in dynamic config ([#1289](https://github.com/rudderlabs/rudder-transformer/issues/1289)) ([ff6abb8](https://github.com/rudderlabs/rudder-transformer/commit/ff6abb8d4e89af154289b246b33f6e988c0efcbd))
* **transformation:** update env varibale name ([d904828](https://github.com/rudderlabs/rudder-transformer/commit/d904828e47a94d82a8428cf376dea5eb926d44a4))


### Bug Fixes

* address async and flow type issues ([#1457](https://github.com/rudderlabs/rudder-transformer/issues/1457)) ([632f74e](https://github.com/rudderlabs/rudder-transformer/commit/632f74e5f1d35d882ed6531f2af84b7d1fba0472))
* **algolia:** adding check on eventTypeSetting availability ([#1423](https://github.com/rudderlabs/rudder-transformer/issues/1423)) ([d8572ff](https://github.com/rudderlabs/rudder-transformer/commit/d8572ff4949513573d5f7367fa0dc0811086e61f))
* **appsflyer:** event name casing in track payloads ([#1390](https://github.com/rudderlabs/rudder-transformer/issues/1390)) ([3b22f18](https://github.com/rudderlabs/rudder-transformer/commit/3b22f1840acaf57b110ff67a9805be6d2bf7b062))
* **braze:** adding dynamic support for eu data center ([#1236](https://github.com/rudderlabs/rudder-transformer/issues/1236)) ([90bc03f](https://github.com/rudderlabs/rudder-transformer/commit/90bc03f00d8ce48b8e93f28c06863c80c353116f))
* docker vulnerabilities ([#1435](https://github.com/rudderlabs/rudder-transformer/issues/1435)) ([27084e2](https://github.com/rudderlabs/rudder-transformer/commit/27084e2c483bec679c9988a998b087a558bc5826))
* facebook pixel proxy tests ([#1444](https://github.com/rudderlabs/rudder-transformer/issues/1444)) ([f632583](https://github.com/rudderlabs/rudder-transformer/commit/f6325833244affaffad8aa311466c1596ef01cdd))
* Fix test case ([ac2342d](https://github.com/rudderlabs/rudder-transformer/commit/ac2342d43feabe92c7ed23495e02d9f77fb5fccd))
* **ga:** Do not fallback to userId for cid when disableMd5 is true, keep it undefined ([ad72d59](https://github.com/rudderlabs/rudder-transformer/commit/ad72d5962c19b00ae9dbbb3cec0cc6b223c7683d))
* **hs:** logic for custom objects support of hs with rETL  ([#1222](https://github.com/rudderlabs/rudder-transformer/issues/1222)) ([5353bcc](https://github.com/rudderlabs/rudder-transformer/commit/5353bcc33f7b077aa5240ac653c747aa6f3fd4b6))
* kafka schemaId ([#1283](https://github.com/rudderlabs/rudder-transformer/issues/1283)) ([214d5d5](https://github.com/rudderlabs/rudder-transformer/commit/214d5d53edb20b6b994d3b01bee8dddcc4fe2128))
* **marketo:** unhandled exception status-code fix ([#1432](https://github.com/rudderlabs/rudder-transformer/issues/1432)) ([6cc4868](https://github.com/rudderlabs/rudder-transformer/commit/6cc48688c82ba501b296c1171c0327cc91e33e4d))
* Remove event type guard that prevent traits from copying to user props ([e276ade](https://github.com/rudderlabs/rudder-transformer/commit/e276ade3c57c4556399a5be8b09f15a1877c5a2b))
* **signl4:** correcting timestamp format ([#1431](https://github.com/rudderlabs/rudder-transformer/issues/1431)) ([18632e6](https://github.com/rudderlabs/rudder-transformer/commit/18632e632330db753eabe1fe4d90f22703979c1b))
* **trackingplan:** adding message type optional check in tp source config ([60f0658](https://github.com/rudderlabs/rudder-transformer/commit/60f0658a5b7701d8d545ebfb838bfa19cc68c6e2))
* upgrade dotenv from 8.2.0 to 8.6.0 ([#1389](https://github.com/rudderlabs/rudder-transformer/issues/1389)) ([1c3d001](https://github.com/rudderlabs/rudder-transformer/commit/1c3d001f8c35d0885497faa87c8ce728d6403efe))
* upgrade koa from 2.13.0 to 2.13.4 ([#1398](https://github.com/rudderlabs/rudder-transformer/issues/1398)) ([213e30e](https://github.com/rudderlabs/rudder-transformer/commit/213e30e4c04481ee4aa9d59c346ed959acfd5bb5))
* upgrade ua-parser-js from 0.7.24 to 0.8.1 ([#1378](https://github.com/rudderlabs/rudder-transformer/issues/1378)) ([a50899b](https://github.com/rudderlabs/rudder-transformer/commit/a50899b6780d3f640c260830c74f28cd4b1d9b5d))
* vulnerabilities in dependencies ([#1436](https://github.com/rudderlabs/rudder-transformer/issues/1436)) ([a26e7f5](https://github.com/rudderlabs/rudder-transformer/commit/a26e7f54d5aaafa48c20826cd5dd5f3f8f30e39f))

### [0.1.5-rc.0](https://github.com/rudderlabs/rudder-transformer/compare/v0.1.4...v0.1.5-rc.0) (2020-03-16)

### [0.1.4](https://github.com/rudderlabs/rudder-transformer/compare/v0.1.3...v0.1.4) (2020-03-02)

### [0.1.3](https://github.com/rudderlabs/rudder-transformer/compare/v0.1.2...v0.1.3) (2020-02-11)

### [0.1.2](https://github.com/rudderlabs/rudder-transformer/compare/v0.1.1...v0.1.2) (2020-02-07)


### Bug Fixes

* salesforce  tests ([86500b8](https://github.com/rudderlabs/rudder-transformer/commit/86500b832610f047666a4fe4799a843c5a1fb6e9))

### [0.1.1](https://github.com/rudderlabs/rudder-transformer/compare/v0.1.0...v0.1.1) (2019-11-05)

## 0.1.0 (2019-10-24)

## [1.18.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.17.0...v1.18.0) (2023-03-23)


### Features

* add default action source ([#1957](https://github.com/rudderlabs/rudder-transformer/issues/1957)) ([043cae2](https://github.com/rudderlabs/rudder-transformer/commit/043cae2802c81e7a1d25d266eaeca06a3000aeaa))
* **braze:** refactor code custom attribute operations ([#1943](https://github.com/rudderlabs/rudder-transformer/issues/1943)) ([9c91bfc](https://github.com/rudderlabs/rudder-transformer/commit/9c91bfc4f7eeeaa1e97174a2c96c1902c6817c6a))
* **indicative:** parse user agent info ([#1971](https://github.com/rudderlabs/rudder-transformer/issues/1971)) ([1328b5a](https://github.com/rudderlabs/rudder-transformer/commit/1328b5ac38f9d21def89bacbbca4891dbd6e4450))
* **mix-panel:** add support for multiple group key value ([#1773](https://github.com/rudderlabs/rudder-transformer/issues/1773)) ([e7a8d48](https://github.com/rudderlabs/rudder-transformer/commit/e7a8d489cb3fda2718e106730d69506e6f56c9f3))


### Bug Fixes

* added products array check for iterable destination ([#1949](https://github.com/rudderlabs/rudder-transformer/issues/1949)) ([87db73e](https://github.com/rudderlabs/rudder-transformer/commit/87db73e062dcac54fdb1906659a90d2df0f13648))
* **fb pixel:** ecomm ([#1932](https://github.com/rudderlabs/rudder-transformer/issues/1932)) ([8d5e07a](https://github.com/rudderlabs/rudder-transformer/commit/8d5e07a2862ee757ecd3523b36e150f29a134b0f)), closes [#1964](https://github.com/rudderlabs/rudder-transformer/issues/1964)
* **firehose:** handle undefined message type ([#1942](https://github.com/rudderlabs/rudder-transformer/issues/1942)) ([d3ea664](https://github.com/rudderlabs/rudder-transformer/commit/d3ea664c182cc1702ab0298cf79ecad2aae7ce6b))
* ga4 user_properties structure ([#1982](https://github.com/rudderlabs/rudder-transformer/issues/1982)) ([3d81202](https://github.com/rudderlabs/rudder-transformer/commit/3d81202fcd88b8033504e9f5aa5d095e6863dc76))
* **integration:** pinterest content_id field dropped when having null value to match with cdkv2 ([#1950](https://github.com/rudderlabs/rudder-transformer/issues/1950)) ([09995e9](https://github.com/rudderlabs/rudder-transformer/commit/09995e9cc9931827d8be5b1ede59be9ce77c0cd4))
* tik-tok ads offline events email array issue ([#1979](https://github.com/rudderlabs/rudder-transformer/issues/1979)) ([3c7f4ac](https://github.com/rudderlabs/rudder-transformer/commit/3c7f4ac60ec564198f0bf0524a0780dfc581140a))

## [1.17.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.14.0...v1.17.0) (2023-03-21)


### Features

* add default action source ([#1957](https://github.com/rudderlabs/rudder-transformer/issues/1957)) ([043cae2](https://github.com/rudderlabs/rudder-transformer/commit/043cae2802c81e7a1d25d266eaeca06a3000aeaa))
* **braze:** refactor code custom attribute operations ([#1943](https://github.com/rudderlabs/rudder-transformer/issues/1943)) ([9c91bfc](https://github.com/rudderlabs/rudder-transformer/commit/9c91bfc4f7eeeaa1e97174a2c96c1902c6817c6a))
* **facebook_app_events:** update api version ([#1921](https://github.com/rudderlabs/rudder-transformer/issues/1921)) ([793ebfb](https://github.com/rudderlabs/rudder-transformer/commit/793ebfb39e8667882cd40ff4add2ea6b5dfb9564))
* log process memory errors ([#1920](https://github.com/rudderlabs/rudder-transformer/issues/1920)) ([076d7b5](https://github.com/rudderlabs/rudder-transformer/commit/076d7b58831b035102a0544985d9a1ff67ef1791))
* mautic: support self hosted instance ([#1909](https://github.com/rudderlabs/rudder-transformer/issues/1909)) ([7c0a724](https://github.com/rudderlabs/rudder-transformer/commit/7c0a7240d9fcef45e4066a4a7dee8234c7e782d3))
* **mix-panel:** add support for multiple group key value ([#1773](https://github.com/rudderlabs/rudder-transformer/issues/1773)) ([e7a8d48](https://github.com/rudderlabs/rudder-transformer/commit/e7a8d489cb3fda2718e106730d69506e6f56c9f3))
* moenagae alias call support ([#1930](https://github.com/rudderlabs/rudder-transformer/issues/1930)) ([194bf8e](https://github.com/rudderlabs/rudder-transformer/commit/194bf8e3e2f47ca63ee273c9255468b41bc6ffcf))
* revamp github actions for release management ([#1898](https://github.com/rudderlabs/rudder-transformer/issues/1898)) ([8847f58](https://github.com/rudderlabs/rudder-transformer/commit/8847f589dc2248d4210c82326022d9f459b2f888))
* suppress errors from unwanted modules to bugsnag ([#1907](https://github.com/rudderlabs/rudder-transformer/issues/1907)) ([9e6a1c0](https://github.com/rudderlabs/rudder-transformer/commit/9e6a1c0bd3dfa79e2a470eefad7d4c9b34c842cb))
* transformation secrets ([#1912](https://github.com/rudderlabs/rudder-transformer/issues/1912)) ([a0b488a](https://github.com/rudderlabs/rudder-transformer/commit/a0b488a4514c9c868f39d000a4ae40aa3f7b5de6))


### Bug Fixes

* added products array check for iterable destination ([#1949](https://github.com/rudderlabs/rudder-transformer/issues/1949)) ([87db73e](https://github.com/rudderlabs/rudder-transformer/commit/87db73e062dcac54fdb1906659a90d2df0f13648))
* changelog ([ef13dd8](https://github.com/rudderlabs/rudder-transformer/commit/ef13dd8bef572c80ddb8511abb7d5be23cc5dd81))
* client_id mapping for ga4 ([#1904](https://github.com/rudderlabs/rudder-transformer/issues/1904)) ([9aaf908](https://github.com/rudderlabs/rudder-transformer/commit/9aaf90864bd489fb463a56f62a673ead2bb83fe5))
* correcting method name for prepareProxy ([#1923](https://github.com/rudderlabs/rudder-transformer/issues/1923)) ([cfed522](https://github.com/rudderlabs/rudder-transformer/commit/cfed5228be21bd8d7f5a2ea8bc4b97c973a112be))
* create pull-request jobs in workflows ([36b2677](https://github.com/rudderlabs/rudder-transformer/commit/36b2677209b9b34a33375381dd74a74988e11dd2))
* **destination:** add channel as platform ([#1906](https://github.com/rudderlabs/rudder-transformer/issues/1906)) ([4cfbbd0](https://github.com/rudderlabs/rudder-transformer/commit/4cfbbd02530d1cc02b1b04ab5c721f1b642d41bc))
* **fb pixel:** add default action source ([#1946](https://github.com/rudderlabs/rudder-transformer/issues/1946)) ([2e03f4d](https://github.com/rudderlabs/rudder-transformer/commit/2e03f4dcfbfb1c6d35aecf950e0f1e3828ceaaef))
* **fb pixel:** ecomm ([#1932](https://github.com/rudderlabs/rudder-transformer/issues/1932)) ([8d5e07a](https://github.com/rudderlabs/rudder-transformer/commit/8d5e07a2862ee757ecd3523b36e150f29a134b0f)), closes [#1964](https://github.com/rudderlabs/rudder-transformer/issues/1964)
* **fb pixel:** zp mapping and external_id ([#1908](https://github.com/rudderlabs/rudder-transformer/issues/1908)) ([c8665d4](https://github.com/rudderlabs/rudder-transformer/commit/c8665d4475fe06d45d3b4fdd26b46247be0188f6))
* **firehose:** handle undefined message type ([#1942](https://github.com/rudderlabs/rudder-transformer/issues/1942)) ([d3ea664](https://github.com/rudderlabs/rudder-transformer/commit/d3ea664c182cc1702ab0298cf79ecad2aae7ce6b))
* **ga4:** product array issue ([#1845](https://github.com/rudderlabs/rudder-transformer/issues/1845)) ([3d24e93](https://github.com/rudderlabs/rudder-transformer/commit/3d24e93a6c00c3d2bd425012e4b315997b5e05b6))
* **integration:** pinterest content_id field dropped when having null value to match with cdkv2 ([#1950](https://github.com/rudderlabs/rudder-transformer/issues/1950)) ([09995e9](https://github.com/rudderlabs/rudder-transformer/commit/09995e9cc9931827d8be5b1ede59be9ce77c0cd4))
* remove ga4 identify call support for cloud mode and treat identify call event as track events (login, sign_up and generate_lead) ([#1903](https://github.com/rudderlabs/rudder-transformer/issues/1903)) ([fa8fd74](https://github.com/rudderlabs/rudder-transformer/commit/fa8fd74f14d0ac6707f83ed81897a541ae6191e6))
* **slack:** handlebars error handling ([#1910](https://github.com/rudderlabs/rudder-transformer/issues/1910)) ([0c6bc2e](https://github.com/rudderlabs/rudder-transformer/commit/0c6bc2edb17986a1d99365a4468a67bd65e09e47))
* syntax issue in workflow ([09d7659](https://github.com/rudderlabs/rudder-transformer/commit/09d765912ef07552729c1193e28c1bd149f68401))
* syntax issue in workflow ([c84ef6e](https://github.com/rudderlabs/rudder-transformer/commit/c84ef6e1d1b4feefb208e10c316c4f5bd647efa3))
* updated batching logic for pinterest_tag ([#1878](https://github.com/rudderlabs/rudder-transformer/issues/1878)) ([e38d772](https://github.com/rudderlabs/rudder-transformer/commit/e38d7721451d4c43d8c1fe67d28566302dced440))
* **util:** getDestinationExternalIDObjectForRetl funciton ([#1919](https://github.com/rudderlabs/rudder-transformer/issues/1919)) ([235243d](https://github.com/rudderlabs/rudder-transformer/commit/235243de9afb1b52b56b7db9170e5eb3345b1de6))

### [1.16.2](https://github.com/rudderlabs/rudder-transformer/compare/v1.16.1...v1.16.2) (2023-03-16)


### Bug Fixes

* add optional chaining for phone in tiktok_ads_offline_events ([37dc013](https://github.com/rudderlabs/rudder-transformer/commit/37dc0139a28fab113eac4b337f3475ac2ea29262))

### [1.16.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.16.0...v1.16.1) (2023-03-15)


### Bug Fixes

* **fb pixel:** add default action source ([#1946](https://github.com/rudderlabs/rudder-transformer/issues/1946)) ([2e03f4d](https://github.com/rudderlabs/rudder-transformer/commit/2e03f4dcfbfb1c6d35aecf950e0f1e3828ceaaef))

## [1.16.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.15.1...v1.16.0) (2023-03-14)


### Features

* **facebook_app_events:** update api version ([#1921](https://github.com/rudderlabs/rudder-transformer/issues/1921)) ([793ebfb](https://github.com/rudderlabs/rudder-transformer/commit/793ebfb39e8667882cd40ff4add2ea6b5dfb9564))


### Bug Fixes

* changelog ([ef13dd8](https://github.com/rudderlabs/rudder-transformer/commit/ef13dd8bef572c80ddb8511abb7d5be23cc5dd81))
* create pull-request jobs in workflows ([36b2677](https://github.com/rudderlabs/rudder-transformer/commit/36b2677209b9b34a33375381dd74a74988e11dd2))
* syntax issue in workflow ([09d7659](https://github.com/rudderlabs/rudder-transformer/commit/09d765912ef07552729c1193e28c1bd149f68401))
* syntax issue in workflow ([c84ef6e](https://github.com/rudderlabs/rudder-transformer/commit/c84ef6e1d1b4feefb208e10c316c4f5bd647efa3))
* **util:** getDestinationExternalIDObjectForRetl funciton ([#1919](https://github.com/rudderlabs/rudder-transformer/issues/1919)) ([235243d](https://github.com/rudderlabs/rudder-transformer/commit/235243de9afb1b52b56b7db9170e5eb3345b1de6))

### [1.15.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.15.0...v1.15.1) (2023-03-13)


### Features

* mautic: support self hosted instance ([#1909](https://github.com/rudderlabs/rudder-transformer/issues/1909)) ([7c0a724](https://github.com/rudderlabs/rudder-transformer/commit/7c0a7240d9fcef45e4066a4a7dee8234c7e782d3))
* moenagae alias call support ([#1930](https://github.com/rudderlabs/rudder-transformer/issues/1930)) ([194bf8e](https://github.com/rudderlabs/rudder-transformer/commit/194bf8e3e2f47ca63ee273c9255468b41bc6ffcf))
* transformation secrets ([#1912](https://github.com/rudderlabs/rudder-transformer/issues/1912)) ([a0b488a](https://github.com/rudderlabs/rudder-transformer/commit/a0b488a4514c9c868f39d000a4ae40aa3f7b5de6))


### Bug Fixes

* client_id mapping for ga4 ([#1904](https://github.com/rudderlabs/rudder-transformer/issues/1904)) ([9aaf908](https://github.com/rudderlabs/rudder-transformer/commit/9aaf90864bd489fb463a56f62a673ead2bb83fe5))
* **destination:** add channel as platform ([#1906](https://github.com/rudderlabs/rudder-transformer/issues/1906)) ([4cfbbd0](https://github.com/rudderlabs/rudder-transformer/commit/4cfbbd02530d1cc02b1b04ab5c721f1b642d41bc))
* remove ga4 identify call support for cloud mode and treat identify call event as track events (login, sign_up and generate_lead) ([#1903](https://github.com/rudderlabs/rudder-transformer/issues/1903)) ([fa8fd74](https://github.com/rudderlabs/rudder-transformer/commit/fa8fd74f14d0ac6707f83ed81897a541ae6191e6))
* **slack:** handlebars error handling ([#1910](https://github.com/rudderlabs/rudder-transformer/issues/1910)) ([0c6bc2e](https://github.com/rudderlabs/rudder-transformer/commit/0c6bc2edb17986a1d99365a4468a67bd65e09e47))

## [1.15.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.14.0...v1.15.0) (2023-03-07)


### Features

* log process memory errors ([#1920](https://github.com/rudderlabs/rudder-transformer/issues/1920)) ([076d7b5](https://github.com/rudderlabs/rudder-transformer/commit/076d7b58831b035102a0544985d9a1ff67ef1791))
* revamp github actions for release management ([#1898](https://github.com/rudderlabs/rudder-transformer/issues/1898)) ([8847f58](https://github.com/rudderlabs/rudder-transformer/commit/8847f589dc2248d4210c82326022d9f459b2f888))
* suppress errors from unwanted modules to bugsnag ([#1907](https://github.com/rudderlabs/rudder-transformer/issues/1907)) ([9e6a1c0](https://github.com/rudderlabs/rudder-transformer/commit/9e6a1c0bd3dfa79e2a470eefad7d4c9b34c842cb))


### Bug Fixes

* correcting method name for prepareProxy ([#1923](https://github.com/rudderlabs/rudder-transformer/issues/1923)) ([cfed522](https://github.com/rudderlabs/rudder-transformer/commit/cfed5228be21bd8d7f5a2ea8bc4b97c973a112be))
* **fb pixel:** zp mapping and external_id ([#1908](https://github.com/rudderlabs/rudder-transformer/issues/1908)) ([c8665d4](https://github.com/rudderlabs/rudder-transformer/commit/c8665d4475fe06d45d3b4fdd26b46247be0188f6))
* **ga4:** product array issue ([#1845](https://github.com/rudderlabs/rudder-transformer/issues/1845)) ([3d24e93](https://github.com/rudderlabs/rudder-transformer/commit/3d24e93a6c00c3d2bd425012e4b315997b5e05b6))
* updated batching logic for pinterest_tag ([#1878](https://github.com/rudderlabs/rudder-transformer/issues/1878)) ([e38d772](https://github.com/rudderlabs/rudder-transformer/commit/e38d7721451d4c43d8c1fe67d28566302dced440))

## [1.14.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.13.0...v1.14.0) (2023-02-28)


### Features

* added customerio group call support ([#1869](https://github.com/rudderlabs/rudder-transformer/issues/1869)) ([5e692ea](https://github.com/rudderlabs/rudder-transformer/commit/5e692ead3c43819edd47f8cf244a3f78ce510359))
* added new destination vitally ([#1892](https://github.com/rudderlabs/rudder-transformer/issues/1892)) ([8638ee7](https://github.com/rudderlabs/rudder-transformer/commit/8638ee7765b4e3ecf215ec90056d03cffb42f5f6))
* include latest image of transformer ([#1879](https://github.com/rudderlabs/rudder-transformer/issues/1879)) ([b179fef](https://github.com/rudderlabs/rudder-transformer/commit/b179fef031fe06aa8d4e3b258c4740b45f4387bb))
* onboard courier destination ([#1844](https://github.com/rudderlabs/rudder-transformer/issues/1844)) ([#1883](https://github.com/rudderlabs/rudder-transformer/issues/1883)) ([18bcdf8](https://github.com/rudderlabs/rudder-transformer/commit/18bcdf8b4b1f0b63cbe3f839df38f4b6b6875e98))
* python libraries ([#1855](https://github.com/rudderlabs/rudder-transformer/issues/1855)) ([01f3df5](https://github.com/rudderlabs/rudder-transformer/commit/01f3df5ad5868a3604715c26f7ea9d8dea82860b))
* **transformation:** adding rudder libraries support ([#1817](https://github.com/rudderlabs/rudder-transformer/issues/1817)) ([1c91d22](https://github.com/rudderlabs/rudder-transformer/commit/1c91d22795b142a90011e35cf85d1a4ac8eaa545))


### Bug Fixes

* **active-campaign:** add check before iterating stored event array ([#1902](https://github.com/rudderlabs/rudder-transformer/issues/1902)) ([9666e85](https://github.com/rudderlabs/rudder-transformer/commit/9666e851751101efc99f1d48018a9ae1ed6a9b8e))
* **integration:** Algolia  in CDK v2 now errors out for non string event names ([#1867](https://github.com/rudderlabs/rudder-transformer/issues/1867)) ([5be8891](https://github.com/rudderlabs/rudder-transformer/commit/5be88917270a9fb1c28fdd7f547e9a017aacf56d))
* logger import ([#1874](https://github.com/rudderlabs/rudder-transformer/issues/1874)) ([7ff1b4a](https://github.com/rudderlabs/rudder-transformer/commit/7ff1b4a11fe530de45dacce1da7bf0d58d4b38fd))
* package.json & package-lock.json to reduce vulnerabilities ([#1885](https://github.com/rudderlabs/rudder-transformer/issues/1885)) ([11b4a4b](https://github.com/rudderlabs/rudder-transformer/commit/11b4a4b523b00dffb0c9d0017a6ed3279fc596d2))

## [1.13.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.12.0...v1.13.0) (2023-02-15)


### Features

* **destination:** onboard criteo audience ([#1792](https://github.com/rudderlabs/rudder-transformer/issues/1792)) ([5904c75](https://github.com/rudderlabs/rudder-transformer/commit/5904c75042c7cb34320fc43bcd3b54bfe5ce97fc))
* **integration:** rockerbox - add support for custom properties mapping ([#1815](https://github.com/rudderlabs/rudder-transformer/issues/1815)) ([8ba50d2](https://github.com/rudderlabs/rudder-transformer/commit/8ba50d2249d5bd5db84ff9c37323e618b5942ec5))
* **integration:** rockerbox - allow all properties to be passed over to rockerbox ([#1838](https://github.com/rudderlabs/rudder-transformer/issues/1838)) ([fb64039](https://github.com/rudderlabs/rudder-transformer/commit/fb6403992c76077398a9f8b5ac4cbe9fb28fd073))
* **integrations:** onboarding webhook to CDK v2 ([#1783](https://github.com/rudderlabs/rudder-transformer/issues/1783)) ([22d583a](https://github.com/rudderlabs/rudder-transformer/commit/22d583ae2c239f532629a0d0db055658e2eda65d))
* **mailchimp:** add support for track call ([#1814](https://github.com/rudderlabs/rudder-transformer/issues/1814)) ([94c10ba](https://github.com/rudderlabs/rudder-transformer/commit/94c10ba971a54f5f9894c0107a96a121068994cf))
* moengage source ([#1846](https://github.com/rudderlabs/rudder-transformer/issues/1846)) ([123a2d9](https://github.com/rudderlabs/rudder-transformer/commit/123a2d9f57fd4f0c76f939b8d56edbbbc995ab00))
* **new integration:** onboard optimizely fullstack cloud mode ([#1805](https://github.com/rudderlabs/rudder-transformer/issues/1805)) ([5373185](https://github.com/rudderlabs/rudder-transformer/commit/537318589110672ad6f453510a19e7fde3bfd2bb))
* shopify - add cart token, order token and checkout token in the Context object ([#1847](https://github.com/rudderlabs/rudder-transformer/issues/1847)) ([88e8fe0](https://github.com/rudderlabs/rudder-transformer/commit/88e8fe0a14766532739aaf800cebb61b0ef6175d))
* **source:** initial commit for identity stitching in shopify ([#1810](https://github.com/rudderlabs/rudder-transformer/issues/1810)) ([7b662df](https://github.com/rudderlabs/rudder-transformer/commit/7b662dfbf192f08f7bd2baf8dbd9dc5f12a8f23e))
* **transformation:** libraries import extractor ([#1851](https://github.com/rudderlabs/rudder-transformer/issues/1851)) ([462bba9](https://github.com/rudderlabs/rudder-transformer/commit/462bba9e9ed49f0a76a8bb0e4d0b444e324f208c))
* userId to be converted to string for Router ([#1822](https://github.com/rudderlabs/rudder-transformer/issues/1822)) ([7ec03c6](https://github.com/rudderlabs/rudder-transformer/commit/7ec03c66632513da4a311c3e19abcb3accf3437e))


### Bug Fixes

* **active_campaign:** handle bad url string while formatting with domainUrlV2 ([#1816](https://github.com/rudderlabs/rudder-transformer/issues/1816)) ([7fd15be](https://github.com/rudderlabs/rudder-transformer/commit/7fd15be8633c9cc6fcb4448f73042d641f81356c))
* amplitude check for actionKey before accessing it  ([#1833](https://github.com/rudderlabs/rudder-transformer/issues/1833)) ([5071582](https://github.com/rudderlabs/rudder-transformer/commit/50715827981e70e814c427cfa0359de16fb3c554))
* bugsnag errors ([#1863](https://github.com/rudderlabs/rudder-transformer/issues/1863)) ([ae627d3](https://github.com/rudderlabs/rudder-transformer/commit/ae627d3adc48aa5ab390461693005d8957757430))
* **CDK v2:** editing CDK v2 for pinterest tag for num_items field ([#1840](https://github.com/rudderlabs/rudder-transformer/issues/1840)) ([b1265c0](https://github.com/rudderlabs/rudder-transformer/commit/b1265c0949f8352881dfb13d5d31ba712e26363b))
* codebuild issue ([16eab14](https://github.com/rudderlabs/rudder-transformer/commit/16eab14e627184d04b1a7dbb1fdd3388ff065c85))
* criteo_audience: stringification of destination error ([#1839](https://github.com/rudderlabs/rudder-transformer/issues/1839)) ([fe17453](https://github.com/rudderlabs/rudder-transformer/commit/fe17453db7bef03916feb271bae1c25b613829da))
* ga4 userId issue ([#1857](https://github.com/rudderlabs/rudder-transformer/issues/1857)) ([cd30c47](https://github.com/rudderlabs/rudder-transformer/commit/cd30c47f292db71a8961bef6b38a3478316e00b9))
* **integration:** Pinterest conversion in CDK v2 returns correct num_items for single product array ([#1861](https://github.com/rudderlabs/rudder-transformer/issues/1861)) ([8c8c316](https://github.com/rudderlabs/rudder-transformer/commit/8c8c316b9ba795111f716c314cedb189e968260e))
* **integrations:** salesforce update error message and error response handler ([#1799](https://github.com/rudderlabs/rudder-transformer/issues/1799)) ([b473c23](https://github.com/rudderlabs/rudder-transformer/commit/b473c2389909e1f06d8d79b279e66b86b414c908))
* **klaviyo:** skip profile lookup call for rETL events ([#1856](https://github.com/rudderlabs/rudder-transformer/issues/1856)) ([9e6b5e4](https://github.com/rudderlabs/rudder-transformer/commit/9e6b5e4c145d64341e043014baed4e344fecc74c))
* order_token updated in shopify ([#1865](https://github.com/rudderlabs/rudder-transformer/issues/1865)) ([7fc608e](https://github.com/rudderlabs/rudder-transformer/commit/7fc608e0f1c264c4494b987e0102ff48aa51e4fe))
* package.json & package-lock.json to reduce vulnerabilities ([#1824](https://github.com/rudderlabs/rudder-transformer/issues/1824)) ([779edb2](https://github.com/rudderlabs/rudder-transformer/commit/779edb290b04694b126739708a30be024a53fe33))
* refactor subscribe user flow to stop subscribing user without consent ([#1841](https://github.com/rudderlabs/rudder-transformer/issues/1841)) ([fe231c2](https://github.com/rudderlabs/rudder-transformer/commit/fe231c280a1250413f4b665820e4da303e05259a))
* set context as metadata in bugsnag error notification ([#1778](https://github.com/rudderlabs/rudder-transformer/issues/1778)) ([55c3097](https://github.com/rudderlabs/rudder-transformer/commit/55c309716877b303943c18537352347b83d72c2f))
* **singular:** undefined properties object for track ([#1808](https://github.com/rudderlabs/rudder-transformer/issues/1808)) ([f53bec1](https://github.com/rudderlabs/rudder-transformer/commit/f53bec192825aedfcf320197c386a449f9677816))
* **transformation:** release isolate in case of error while creating ([#1850](https://github.com/rudderlabs/rudder-transformer/issues/1850)) ([ea51e24](https://github.com/rudderlabs/rudder-transformer/commit/ea51e24a893daa18e9b30463e9300ce029230a00))
* typecast userId, anonymousId to string ([2150033](https://github.com/rudderlabs/rudder-transformer/commit/215003381557c583bd8889cef121ebbba56785c2))
* undefined check added for isHybridModeEnabled function ([#1812](https://github.com/rudderlabs/rudder-transformer/issues/1812)) ([a49be9e](https://github.com/rudderlabs/rudder-transformer/commit/a49be9e77b6ba6bc1ef5087208ddc1a135e4301e))
* update check for props value ([343e946](https://github.com/rudderlabs/rudder-transformer/commit/343e946ed4adc89ad8c17d945b69c2f3f3be7506))

## [1.12.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.11.0...v1.12.0) (2023-01-19)


### Features

* **BQStream:** add batch support ([#1377](https://github.com/rudderlabs/rudder-transformer/issues/1377)) ([14c7531](https://github.com/rudderlabs/rudder-transformer/commit/14c7531635b5348ef518dcad483f25d4adeddddd))
* **destination:** onboard lemnisk integration  ([#1787](https://github.com/rudderlabs/rudder-transformer/issues/1787)) ([3c6b9e1](https://github.com/rudderlabs/rudder-transformer/commit/3c6b9e148dff559357fb61de49602f9d1689d699)), closes [#1728](https://github.com/rudderlabs/rudder-transformer/issues/1728)
* ga4 page calls are discarded if hybrid mode is enabled ([#1794](https://github.com/rudderlabs/rudder-transformer/issues/1794)) ([ca12d07](https://github.com/rudderlabs/rudder-transformer/commit/ca12d078e3f936c4c0fd4449259d1a55ba0a4424))
* sessionId consistency across destinations ([#1789](https://github.com/rudderlabs/rudder-transformer/issues/1789)) ([ff68a44](https://github.com/rudderlabs/rudder-transformer/commit/ff68a4488e50f4a44c950395d0f9e5dc514db1df))


### Bug Fixes

* add missing implementation stat tag for router transformation ([#1779](https://github.com/rudderlabs/rudder-transformer/issues/1779)) ([5ebde56](https://github.com/rudderlabs/rudder-transformer/commit/5ebde56ea644f81d1a17fa4d85697821879fa191))
* add sources as valid channel to cdkv1 ([bd74ef7](https://github.com/rudderlabs/rudder-transformer/commit/bd74ef7eff712d4db75856a205ddaa473d80ddd9))
* add sources as valid channel to cdkv1 ([#1803](https://github.com/rudderlabs/rudder-transformer/issues/1803)) ([e3057db](https://github.com/rudderlabs/rudder-transformer/commit/e3057dbff9d8daa1f64b5cd6de6b57ab97c016ee))
* add validation for event name as string ([#1768](https://github.com/rudderlabs/rudder-transformer/issues/1768)) ([c48ec5e](https://github.com/rudderlabs/rudder-transformer/commit/c48ec5e3cd6590e5c766bc3afac9eb5c368b85f0))
* array type check for externalIdArray ([#1785](https://github.com/rudderlabs/rudder-transformer/issues/1785)) ([dec3bb6](https://github.com/rudderlabs/rudder-transformer/commit/dec3bb6661b6737203964b2c4b5e3d2bd7421433))
* bugsnag error fixes for salesforce, garl, gaoc ([#1776](https://github.com/rudderlabs/rudder-transformer/issues/1776)) ([553c5de](https://github.com/rudderlabs/rudder-transformer/commit/553c5defc098e01e74d98606cf59baa9008b814d))
* change destination configuration errors to abortable ([#1790](https://github.com/rudderlabs/rudder-transformer/issues/1790)) ([fb1281d](https://github.com/rudderlabs/rudder-transformer/commit/fb1281d2bc090bda34c7420c10946504e83756ef))
* destination transformation change from processor to router ([#1754](https://github.com/rudderlabs/rudder-transformer/issues/1754)) ([674d476](https://github.com/rudderlabs/rudder-transformer/commit/674d476bd1e55194456798c7a83bd27a62b868e3))
* **integration:** GAOC - fix timestamp format, allow calls without custom variables ([#1796](https://github.com/rudderlabs/rudder-transformer/issues/1796)) ([7c450ee](https://github.com/rudderlabs/rudder-transformer/commit/7c450ee78db2052bbb70866cbc6bd98cfd9c32b4))
* iterable alias call is separated from identify batching ([#1777](https://github.com/rudderlabs/rudder-transformer/issues/1777)) ([3676c45](https://github.com/rudderlabs/rudder-transformer/commit/3676c4591e8b241ad6a7873954bc8f07e7a69584))
* products array mapping and rename impact_radius to impact ([#1797](https://github.com/rudderlabs/rudder-transformer/issues/1797)) ([f812f0d](https://github.com/rudderlabs/rudder-transformer/commit/f812f0d3fbff6d6bfdd3670c59cf8ea01744f80f))
* proper error throw in gaec ([#1767](https://github.com/rudderlabs/rudder-transformer/issues/1767)) ([a2ed19d](https://github.com/rudderlabs/rudder-transformer/commit/a2ed19dc0b5eb6bbaec7dd88b25762553b1aae79))
* remove regex validation for phone_number ([#1771](https://github.com/rudderlabs/rudder-transformer/issues/1771)) ([6c01642](https://github.com/rudderlabs/rudder-transformer/commit/6c016428b496cea7e3771d3cf5ab4dfbbd7e382b))
* revert salesforce fix for undefined access_token ([#1780](https://github.com/rudderlabs/rudder-transformer/issues/1780)) ([d917b2e](https://github.com/rudderlabs/rudder-transformer/commit/d917b2e61afbdfb697e5d6066aa6e34fd9f71427))
* send dest info for failed events ([#1770](https://github.com/rudderlabs/rudder-transformer/issues/1770)) ([9f108c0](https://github.com/rudderlabs/rudder-transformer/commit/9f108c0b6a0978b7ca71d1b1bbeaafbba8dce2ee))

## [1.11.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.10.0...v1.11.0) (2023-01-10)


### Features

* [impact radius] onboard impact radius cloud mode destination ([#1730](https://github.com/rudderlabs/rudder-transformer/issues/1730)) ([8d55c24](https://github.com/rudderlabs/rudder-transformer/commit/8d55c24930e45ddb0a38d1e2ca935b11d8fac665)), closes [#1764](https://github.com/rudderlabs/rudder-transformer/issues/1764)
* appcenter updated to support test events ([#1741](https://github.com/rudderlabs/rudder-transformer/issues/1741)) ([00648da](https://github.com/rudderlabs/rudder-transformer/commit/00648da21286cf4170e395e601dcd4b7d199957f))
* **braze:** nested array ops ([#1753](https://github.com/rudderlabs/rudder-transformer/issues/1753)) ([0658a5f](https://github.com/rudderlabs/rudder-transformer/commit/0658a5f323a7b076a88fcb987f2ac25ea803552f))
* clientId support added for ga4 hybrid mode ([#1759](https://github.com/rudderlabs/rudder-transformer/issues/1759)) ([04638cb](https://github.com/rudderlabs/rudder-transformer/commit/04638cb1550c05435a12d8ed481fd55c13e667da))
* **destination:** onboard discord ([#1725](https://github.com/rudderlabs/rudder-transformer/issues/1725)) ([4f6323b](https://github.com/rudderlabs/rudder-transformer/commit/4f6323bcb5e13fb70fd0fd879c64917d46120a34)), closes [#1647](https://github.com/rudderlabs/rudder-transformer/issues/1647) [#1644](https://github.com/rudderlabs/rudder-transformer/issues/1644) [#1656](https://github.com/rudderlabs/rudder-transformer/issues/1656) [#1658](https://github.com/rudderlabs/rudder-transformer/issues/1658) [#1665](https://github.com/rudderlabs/rudder-transformer/issues/1665) [#1649](https://github.com/rudderlabs/rudder-transformer/issues/1649) [#1652](https://github.com/rudderlabs/rudder-transformer/issues/1652) [#1651](https://github.com/rudderlabs/rudder-transformer/issues/1651) [#1669](https://github.com/rudderlabs/rudder-transformer/issues/1669) [#1673](https://github.com/rudderlabs/rudder-transformer/issues/1673) [#1638](https://github.com/rudderlabs/rudder-transformer/issues/1638) [#1641](https://github.com/rudderlabs/rudder-transformer/issues/1641) [#1653](https://github.com/rudderlabs/rudder-transformer/issues/1653) [#1661](https://github.com/rudderlabs/rudder-transformer/issues/1661) [#1666](https://github.com/rudderlabs/rudder-transformer/issues/1666) [#1667](https://github.com/rudderlabs/rudder-transformer/issues/1667) [#1671](https://github.com/rudderlabs/rudder-transformer/issues/1671) [#1659](https://github.com/rudderlabs/rudder-transformer/issues/1659) [#1654](https://github.com/rudderlabs/rudder-transformer/issues/1654) [#1655](https://github.com/rudderlabs/rudder-transformer/issues/1655) [#1670](https://github.com/rudderlabs/rudder-transformer/issues/1670) [#1657](https://github.com/rudderlabs/rudder-transformer/issues/1657) [#1672](https://github.com/rudderlabs/rudder-transformer/issues/1672) [#1642](https://github.com/rudderlabs/rudder-transformer/issues/1642) [#1645](https://github.com/rudderlabs/rudder-transformer/issues/1645) [#1650](https://github.com/rudderlabs/rudder-transformer/issues/1650) [#1639](https://github.com/rudderlabs/rudder-transformer/issues/1639) [#1674](https://github.com/rudderlabs/rudder-transformer/issues/1674) [#1660](https://github.com/rudderlabs/rudder-transformer/issues/1660) [#1648](https://github.com/rudderlabs/rudder-transformer/issues/1648) [#1675](https://github.com/rudderlabs/rudder-transformer/issues/1675) [#1677](https://github.com/rudderlabs/rudder-transformer/issues/1677) [#1678](https://github.com/rudderlabs/rudder-transformer/issues/1678) [#1676](https://github.com/rudderlabs/rudder-transformer/issues/1676) [#1680](https://github.com/rudderlabs/rudder-transformer/issues/1680) [#1682](https://github.com/rudderlabs/rudder-transformer/issues/1682) [#1681](https://github.com/rudderlabs/rudder-transformer/issues/1681) [#1684](https://github.com/rudderlabs/rudder-transformer/issues/1684) [#1685](https://github.com/rudderlabs/rudder-transformer/issues/1685) [#1686](https://github.com/rudderlabs/rudder-transformer/issues/1686) [#1687](https://github.com/rudderlabs/rudder-transformer/issues/1687) [#1688](https://github.com/rudderlabs/rudder-transformer/issues/1688) [#1689](https://github.com/rudderlabs/rudder-transformer/issues/1689) [#1690](https://github.com/rudderlabs/rudder-transformer/issues/1690) [#1691](https://github.com/rudderlabs/rudder-transformer/issues/1691) [#1692](https://github.com/rudderlabs/rudder-transformer/issues/1692) [#1697](https://github.com/rudderlabs/rudder-transformer/issues/1697) [#1699](https://github.com/rudderlabs/rudder-transformer/issues/1699) [#1700](https://github.com/rudderlabs/rudder-transformer/issues/1700) [#1698](https://github.com/rudderlabs/rudder-transformer/issues/1698) [#1704](https://github.com/rudderlabs/rudder-transformer/issues/1704) [#1705](https://github.com/rudderlabs/rudder-transformer/issues/1705)
* **destination:** onboard pipedream ([#1703](https://github.com/rudderlabs/rudder-transformer/issues/1703)) ([f03e86a](https://github.com/rudderlabs/rudder-transformer/commit/f03e86a89c1123310b5d9507c5e4d82ea3d4bbf8))
* **destination:** onboard TikTok_Ads_Offline_Events ([#1749](https://github.com/rudderlabs/rudder-transformer/issues/1749)) ([67a3a4e](https://github.com/rudderlabs/rudder-transformer/commit/67a3a4ef6f9caa3a87afce09d502a702c584ce33))
* ga4 hybrid mode support ([#1709](https://github.com/rudderlabs/rudder-transformer/issues/1709)) ([08779d4](https://github.com/rudderlabs/rudder-transformer/commit/08779d4b8ff94bd21d9ef3600736503193da1620))
* **integration:** adobe_analytics-fix typo, add missing mapping ([#1763](https://github.com/rudderlabs/rudder-transformer/issues/1763)) ([32f65dc](https://github.com/rudderlabs/rudder-transformer/commit/32f65dcdd3d807be1eb9a409a7b5b1d0892b067a))
* **new integration:** onboarding sendinblue cloud mode destination ([#1662](https://github.com/rudderlabs/rudder-transformer/issues/1662)) ([e265e66](https://github.com/rudderlabs/rudder-transformer/commit/e265e66a900671f537198769b8ee0c61694bdbf2))
* onboard pagerduty destination ([#1736](https://github.com/rudderlabs/rudder-transformer/issues/1736)) ([a947b10](https://github.com/rudderlabs/rudder-transformer/commit/a947b10c5d642463d1a03061906520ebbfdc9b05))
* onboard pagerduty source ([#1721](https://github.com/rudderlabs/rudder-transformer/issues/1721)) ([927fa95](https://github.com/rudderlabs/rudder-transformer/commit/927fa951c35cfe098dfdb3e5499fdffcc47cb18d))
* **pinterest:** add ldp support ([#1731](https://github.com/rudderlabs/rudder-transformer/issues/1731)) ([a54d074](https://github.com/rudderlabs/rudder-transformer/commit/a54d074f547e5e1d291bf6fa830afc013c2c7146))
* **transformation:** faas integration for python transformations ([#1664](https://github.com/rudderlabs/rudder-transformer/issues/1664)) ([5ac8ac5](https://github.com/rudderlabs/rudder-transformer/commit/5ac8ac54b2e10ff600ab7c08b8a9ce3e6a345bee))


### Bug Fixes

* **amplitude:** added an error validation at processor ([#1717](https://github.com/rudderlabs/rudder-transformer/issues/1717)) ([424bce9](https://github.com/rudderlabs/rudder-transformer/commit/424bce9cc72a2196a955efd08e643d04e337317a))
* **destination:** credentials exposure on live events for aws lambda ([#1726](https://github.com/rudderlabs/rudder-transformer/issues/1726)) ([589fc40](https://github.com/rudderlabs/rudder-transformer/commit/589fc407d2c4449628fa7915289ae9a1c97d20d4))
* encode email with encodeUriComponent before searching ([#1729](https://github.com/rudderlabs/rudder-transformer/issues/1729)) ([21b624f](https://github.com/rudderlabs/rudder-transformer/commit/21b624f59c098a0459a16347e1845d7a661377fd))
* **facebook pixel:** error code mapping for transformer proxy ([#1738](https://github.com/rudderlabs/rudder-transformer/issues/1738)) ([4e98299](https://github.com/rudderlabs/rudder-transformer/commit/4e98299298f10dc5ae39d5a3994746515622c729))
* fixed flattenJson method ([#1718](https://github.com/rudderlabs/rudder-transformer/issues/1718)) ([9edb44e](https://github.com/rudderlabs/rudder-transformer/commit/9edb44e11b9b7ae059e9f4cfa88633e3fa4cd902))
* hotfix for zendesk global variable ([a5d4424](https://github.com/rudderlabs/rudder-transformer/commit/a5d442405b3b55cc3bafd1389a771904d31da7c6))
* set content_type product by default ([#1761](https://github.com/rudderlabs/rudder-transformer/issues/1761)) ([6f9cda1](https://github.com/rudderlabs/rudder-transformer/commit/6f9cda143cb8ab6b215f4b3684c5375a76d160fd))
* user deletion handlers implementation across destinations ([#1748](https://github.com/rudderlabs/rudder-transformer/issues/1748)) ([786cfe0](https://github.com/rudderlabs/rudder-transformer/commit/786cfe0d0849d68a511c920d6c292ef3f73aee7f)), closes [#1720](https://github.com/rudderlabs/rudder-transformer/issues/1720) [#1719](https://github.com/rudderlabs/rudder-transformer/issues/1719) [#1723](https://github.com/rudderlabs/rudder-transformer/issues/1723) [#1751](https://github.com/rudderlabs/rudder-transformer/issues/1751) [#1750](https://github.com/rudderlabs/rudder-transformer/issues/1750) [#1735](https://github.com/rudderlabs/rudder-transformer/issues/1735)
* **zendesk:** remove endpoint global variable ([#1746](https://github.com/rudderlabs/rudder-transformer/issues/1746)) ([836c37e](https://github.com/rudderlabs/rudder-transformer/commit/836c37eb069ee88d24806e692ec70e0d0b045ae1))

## [1.10.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.9.1...v1.10.0) (2022-12-20)


### Features

* introduce new tags and error classes ([#1631](https://github.com/rudderlabs/rudder-transformer/issues/1631)) ([0615a31](https://github.com/rudderlabs/rudder-transformer/commit/0615a3196d4203f6f648a4e04ca84e7ede405895)), closes [#1647](https://github.com/rudderlabs/rudder-transformer/issues/1647) [#1644](https://github.com/rudderlabs/rudder-transformer/issues/1644) [#1656](https://github.com/rudderlabs/rudder-transformer/issues/1656) [#1658](https://github.com/rudderlabs/rudder-transformer/issues/1658) [#1665](https://github.com/rudderlabs/rudder-transformer/issues/1665) [#1649](https://github.com/rudderlabs/rudder-transformer/issues/1649) [#1652](https://github.com/rudderlabs/rudder-transformer/issues/1652) [#1651](https://github.com/rudderlabs/rudder-transformer/issues/1651) [#1669](https://github.com/rudderlabs/rudder-transformer/issues/1669) [#1673](https://github.com/rudderlabs/rudder-transformer/issues/1673) [#1638](https://github.com/rudderlabs/rudder-transformer/issues/1638) [#1641](https://github.com/rudderlabs/rudder-transformer/issues/1641) [#1653](https://github.com/rudderlabs/rudder-transformer/issues/1653) [#1661](https://github.com/rudderlabs/rudder-transformer/issues/1661) [#1666](https://github.com/rudderlabs/rudder-transformer/issues/1666) [#1667](https://github.com/rudderlabs/rudder-transformer/issues/1667) [#1671](https://github.com/rudderlabs/rudder-transformer/issues/1671) [#1659](https://github.com/rudderlabs/rudder-transformer/issues/1659) [#1654](https://github.com/rudderlabs/rudder-transformer/issues/1654) [#1655](https://github.com/rudderlabs/rudder-transformer/issues/1655) [#1670](https://github.com/rudderlabs/rudder-transformer/issues/1670) [#1657](https://github.com/rudderlabs/rudder-transformer/issues/1657) [#1672](https://github.com/rudderlabs/rudder-transformer/issues/1672) [#1642](https://github.com/rudderlabs/rudder-transformer/issues/1642) [#1645](https://github.com/rudderlabs/rudder-transformer/issues/1645) [#1650](https://github.com/rudderlabs/rudder-transformer/issues/1650) [#1639](https://github.com/rudderlabs/rudder-transformer/issues/1639) [#1674](https://github.com/rudderlabs/rudder-transformer/issues/1674) [#1660](https://github.com/rudderlabs/rudder-transformer/issues/1660) [#1648](https://github.com/rudderlabs/rudder-transformer/issues/1648) [#1675](https://github.com/rudderlabs/rudder-transformer/issues/1675) [#1677](https://github.com/rudderlabs/rudder-transformer/issues/1677) [#1678](https://github.com/rudderlabs/rudder-transformer/issues/1678) [#1676](https://github.com/rudderlabs/rudder-transformer/issues/1676) [#1680](https://github.com/rudderlabs/rudder-transformer/issues/1680) [#1682](https://github.com/rudderlabs/rudder-transformer/issues/1682) [#1681](https://github.com/rudderlabs/rudder-transformer/issues/1681) [#1684](https://github.com/rudderlabs/rudder-transformer/issues/1684) [#1685](https://github.com/rudderlabs/rudder-transformer/issues/1685) [#1686](https://github.com/rudderlabs/rudder-transformer/issues/1686) [#1687](https://github.com/rudderlabs/rudder-transformer/issues/1687) [#1688](https://github.com/rudderlabs/rudder-transformer/issues/1688) [#1689](https://github.com/rudderlabs/rudder-transformer/issues/1689) [#1690](https://github.com/rudderlabs/rudder-transformer/issues/1690) [#1691](https://github.com/rudderlabs/rudder-transformer/issues/1691) [#1692](https://github.com/rudderlabs/rudder-transformer/issues/1692) [#1697](https://github.com/rudderlabs/rudder-transformer/issues/1697) [#1699](https://github.com/rudderlabs/rudder-transformer/issues/1699) [#1700](https://github.com/rudderlabs/rudder-transformer/issues/1700) [#1698](https://github.com/rudderlabs/rudder-transformer/issues/1698) [#1704](https://github.com/rudderlabs/rudder-transformer/issues/1704) [#1705](https://github.com/rudderlabs/rudder-transformer/issues/1705)


### Bug Fixes

* minor issues ([#1711](https://github.com/rudderlabs/rudder-transformer/issues/1711)) ([fdea0bd](https://github.com/rudderlabs/rudder-transformer/commit/fdea0bd74529d7f4625885a594eea9fa20a0f20a))

### [1.9.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.9.0...v1.9.1) (2022-12-16)


### Bug Fixes

* **trackingplan:** error message population ([#1706](https://github.com/rudderlabs/rudder-transformer/issues/1706)) ([72079a7](https://github.com/rudderlabs/rudder-transformer/commit/72079a7a71f52d44b057df6a910f0b0b54108f72))

## [1.9.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.8.0...v1.9.0) (2022-12-16)


### Features

* **destination:** onboard pipedream as event stream source ([#1634](https://github.com/rudderlabs/rudder-transformer/issues/1634)) ([477e2f7](https://github.com/rudderlabs/rudder-transformer/commit/477e2f79704576c5611a9a7e97faf066db10dd87))
* map the usertraits for all event in Posthog ([#1636](https://github.com/rudderlabs/rudder-transformer/issues/1636)) ([3a12f79](https://github.com/rudderlabs/rudder-transformer/commit/3a12f793073ab360ef5f235aac77b3c587c16006))
* onboard ga4 hybrid mode ([#1617](https://github.com/rudderlabs/rudder-transformer/issues/1617)) ([0986b76](https://github.com/rudderlabs/rudder-transformer/commit/0986b769d2e2d84314724a16c322cd05d9fa8bd4))
* onboard pinterest and algolia to json template engine ([#1640](https://github.com/rudderlabs/rudder-transformer/issues/1640)) ([f0f4717](https://github.com/rudderlabs/rudder-transformer/commit/f0f471762dae0ccc8f3449c50f1602bf03a54ec5))


### Bug Fixes

* **destination:** follow ecommerce spec in tiktok_ads ([#1629](https://github.com/rudderlabs/rudder-transformer/issues/1629)) ([a258bfb](https://github.com/rudderlabs/rudder-transformer/commit/a258bfb4b746aa48c12435792adb477a2957334e))
* upgrade base node image in dockerfiles ([#1702](https://github.com/rudderlabs/rudder-transformer/issues/1702)) ([a26b20e](https://github.com/rudderlabs/rudder-transformer/commit/a26b20e43915cb8020e46e16c1997b38663f1899))

## [1.8.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.7.0...v1.8.0) (2022-12-07)


### Features

* added subscription group in braze ([#1597](https://github.com/rudderlabs/rudder-transformer/issues/1597)) ([f321f4e](https://github.com/rudderlabs/rudder-transformer/commit/f321f4e525c077c06c853530d8c8c23da35baee1))
* **clevertap:** onboarding clevertap transformer proxy ([#1596](https://github.com/rudderlabs/rudder-transformer/issues/1596)) ([5479aa6](https://github.com/rudderlabs/rudder-transformer/commit/5479aa6afde2171bfd767602c55a36590ed7059b))
* **destination:** add groupId support as groupKey in mixpanel ([#1590](https://github.com/rudderlabs/rudder-transformer/issues/1590)) ([a33adc6](https://github.com/rudderlabs/rudder-transformer/commit/a33adc6c12a4f7cd6b62955bc29d58206034b3c4))
* **destination:** cache eviction in salesforce ([#1598](https://github.com/rudderlabs/rudder-transformer/issues/1598)) ([9af5552](https://github.com/rudderlabs/rudder-transformer/commit/9af55520f3199b4ad0027edac4650b81193ff9c5))
* **destination:** onboard awin integration ([#1589](https://github.com/rudderlabs/rudder-transformer/issues/1589)) ([f015518](https://github.com/rudderlabs/rudder-transformer/commit/f0155185d3a9b9dfa3681a9b52c64fe5e24d6d6d))
* **destination:** onboard marketo static list ([#1558](https://github.com/rudderlabs/rudder-transformer/issues/1558)) ([db73de9](https://github.com/rudderlabs/rudder-transformer/commit/db73de99dd538eb1c820d3bd2d42689163993cfe))
* **destination:** onboard persistIq ([#1612](https://github.com/rudderlabs/rudder-transformer/issues/1612)) ([103ad00](https://github.com/rudderlabs/rudder-transformer/commit/103ad00df7d28d3368382cf7b0099c901bb853e4))
* **destination:** singular- add support for other apple os ([#1611](https://github.com/rudderlabs/rudder-transformer/issues/1611)) ([63f23d8](https://github.com/rudderlabs/rudder-transformer/commit/63f23d8dc8bcf80b84b0976903dfb360785bec86))
* ga user delete support ([#1531](https://github.com/rudderlabs/rudder-transformer/issues/1531)) ([eb198dd](https://github.com/rudderlabs/rudder-transformer/commit/eb198dd085d16d9c9069352cec8bfb6f33247654)), closes [#1551](https://github.com/rudderlabs/rudder-transformer/issues/1551)
* ga4 hybrid mode suport ([#1607](https://github.com/rudderlabs/rudder-transformer/issues/1607)) ([3edaa10](https://github.com/rudderlabs/rudder-transformer/commit/3edaa10741b2527bb05e13b129f233cba781d1e3))
* **integration:** shopify- Add topic support in context for debugging ([#1602](https://github.com/rudderlabs/rudder-transformer/issues/1602)) ([ff3fab2](https://github.com/rudderlabs/rudder-transformer/commit/ff3fab2ec13e012aad1920c6b86b6b3e78062690))
* **integrations:** update primary email for zendesk ([#1604](https://github.com/rudderlabs/rudder-transformer/issues/1604)) ([157f91e](https://github.com/rudderlabs/rudder-transformer/commit/157f91ef5654fddda90e8eb3e1f5899cee681854))
* onboard olark source ([#1614](https://github.com/rudderlabs/rudder-transformer/issues/1614)) ([64db0ec](https://github.com/rudderlabs/rudder-transformer/commit/64db0ec3a77a58a61d456ac66d91bcc1ee172c64))
* **source:** onboard satismeter as an event-stream ([#1594](https://github.com/rudderlabs/rudder-transformer/issues/1594)) ([53b9d6f](https://github.com/rudderlabs/rudder-transformer/commit/53b9d6ffaf0db1daa3eda8f8c89a0034cb50164e))


### Bug Fixes

* bugsnag bug fixes for several destinations and sources ([#1585](https://github.com/rudderlabs/rudder-transformer/issues/1585)) ([c222dc6](https://github.com/rudderlabs/rudder-transformer/commit/c222dc6cbc489d23ad9b38137c449e76084b458e))
* **destination:** empty params fix in awin ([#1628](https://github.com/rudderlabs/rudder-transformer/issues/1628)) ([e36ab45](https://github.com/rudderlabs/rudder-transformer/commit/e36ab455ce33a308c58aed84c51fef7f9b80ea26))
* email not required for update call ([#1626](https://github.com/rudderlabs/rudder-transformer/issues/1626)) ([51dcbd9](https://github.com/rudderlabs/rudder-transformer/commit/51dcbd9a0efee2cdc3342bdcc96c67783a5aa118))
* fixed encryption info and quantity mandatory in CM360 ([#1618](https://github.com/rudderlabs/rudder-transformer/issues/1618)) ([bbe0a26](https://github.com/rudderlabs/rudder-transformer/commit/bbe0a2689930ed783abfd1cf6ea66d50cf1cf826))
* remove disable destination category for OAuth destinations ([#1601](https://github.com/rudderlabs/rudder-transformer/issues/1601)) ([06f9ee7](https://github.com/rudderlabs/rudder-transformer/commit/06f9ee749d692ec781d53aa229fd58964d0420dd))
* saas -> master ([#1603](https://github.com/rudderlabs/rudder-transformer/issues/1603)) ([b154e1d](https://github.com/rudderlabs/rudder-transformer/commit/b154e1d61bd894e27f62ecc737d1dd0f1b16d28a)), closes [#1601](https://github.com/rudderlabs/rudder-transformer/issues/1601) [#1606](https://github.com/rudderlabs/rudder-transformer/issues/1606)

## [1.7.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.6.0...v1.7.0) (2022-11-17)


### Features

* add support for topic parsing ([#1574](https://github.com/rudderlabs/rudder-transformer/issues/1574)) ([da64878](https://github.com/rudderlabs/rudder-transformer/commit/da648788ab0460bd231cf9147fb9852747551ef8))
* **destination:** add partner_name for tiktok ads ([#1583](https://github.com/rudderlabs/rudder-transformer/issues/1583)) ([12265a9](https://github.com/rudderlabs/rudder-transformer/commit/12265a952a171627ac05d7eab8899d97ceade13c))
* **destination:** onboard campaign manager ([#1580](https://github.com/rudderlabs/rudder-transformer/issues/1580)) ([b823a53](https://github.com/rudderlabs/rudder-transformer/commit/b823a538ca4d4f38faa4762ae986375e0eb8ae05))
* sendgrid idetify and user deletion support ([#1571](https://github.com/rudderlabs/rudder-transformer/issues/1571)) ([caee969](https://github.com/rudderlabs/rudder-transformer/commit/caee969c79ce9673096d0fc4d08be3ba942ce9f5))


### Bug Fixes

* (marketo) logger import ([#1576](https://github.com/rudderlabs/rudder-transformer/issues/1576)) ([c83f046](https://github.com/rudderlabs/rudder-transformer/commit/c83f046ee8baed0e61e8c4d2ac78fec74d74b794))
* add test coverage for processMetadata function ([#1567](https://github.com/rudderlabs/rudder-transformer/issues/1567)) ([b438daa](https://github.com/rudderlabs/rudder-transformer/commit/b438daad9bf0c845d867e0261ff69e77fc3ee0cd))
* **destination:** fix the flattening issue solve for ga4  ([#1581](https://github.com/rudderlabs/rudder-transformer/issues/1581)) ([bea730d](https://github.com/rudderlabs/rudder-transformer/commit/bea730da510c016bd3a71cb519316375b44ea6d3))
* **destination:** revamp group call in Gainsight_PX to reduce API calls ([#1578](https://github.com/rudderlabs/rudder-transformer/issues/1578)) ([f641cc0](https://github.com/rudderlabs/rudder-transformer/commit/f641cc0d3b64fcb736bbd4d5208819958bacb393))
* **destination:** update formating of user traits in facebook pixel ([#1579](https://github.com/rudderlabs/rudder-transformer/issues/1579)) ([b7772e4](https://github.com/rudderlabs/rudder-transformer/commit/b7772e41530f1d4e88263408d4ff3532c187eaf5))
* **integration:** Shopify - correct typo in customer_disabled, add to track_maps ([#1573](https://github.com/rudderlabs/rudder-transformer/issues/1573)) ([cfb5c56](https://github.com/rudderlabs/rudder-transformer/commit/cfb5c56bdc70e52dc996fdfc9c26743a6728d875))
* **transformation:** convert slash to dot to get valid docker image name ([#1564](https://github.com/rudderlabs/rudder-transformer/issues/1564)) ([f1b6b94](https://github.com/rudderlabs/rudder-transformer/commit/f1b6b946e1a6eb519560b675f3fce10d1e833950))
* typo in topic mapping for shopify source ([#1566](https://github.com/rudderlabs/rudder-transformer/issues/1566)) ([0ecf278](https://github.com/rudderlabs/rudder-transformer/commit/0ecf278be9a2435ed67fee299350a34c4b13bb9a))

## [1.6.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.5.0...v1.6.0) (2022-11-10)


### Features

* **destination:** skip unix timestamp conversion if already being sent from source ([#1560](https://github.com/rudderlabs/rudder-transformer/issues/1560)) ([a52cbd7](https://github.com/rudderlabs/rudder-transformer/commit/a52cbd797fa8a0ccec6589ff78b966da26040fbc))
* **destination:** stringify the object and array for Clevertap ([#1554](https://github.com/rudderlabs/rudder-transformer/issues/1554)) ([1c7b459](https://github.com/rudderlabs/rudder-transformer/commit/1c7b459d74ae0b17360d0e49e9bc11557e6f4233))
* **destination:** support custom mapping with client_id for ga4 destination ([#1553](https://github.com/rudderlabs/rudder-transformer/issues/1553)) ([e9f056b](https://github.com/rudderlabs/rudder-transformer/commit/e9f056bacad84d7e59e58904626c6eb7edcc4686))
* **destination:** update identify call to set primary email for Zendesk([#1539](https://github.com/rudderlabs/rudder-transformer/issues/1539)) ([ed307a3](https://github.com/rudderlabs/rudder-transformer/commit/ed307a31ff46575f3a606a0894eeeaaec0b40c00))
* **marketo:** add dynamic ttl & cache eviction support ([#1519](https://github.com/rudderlabs/rudder-transformer/issues/1519)) ([19f1081](https://github.com/rudderlabs/rudder-transformer/commit/19f1081cc32ba9798876dcb9d46d9d094c171e1d))
* support custom webhooks in auth0 source transformer ([#1527](https://github.com/rudderlabs/rudder-transformer/issues/1527)) ([ebc005f](https://github.com/rudderlabs/rudder-transformer/commit/ebc005f84d3af4a7a32f362cc7ece842c8f269a1))


### Bug Fixes

* (marketo)- remove duplicate responseHandler from util and refactor ([#1557](https://github.com/rudderlabs/rudder-transformer/issues/1557)) ([144793e](https://github.com/rudderlabs/rudder-transformer/commit/144793eef2c83b9bc43b989b061c7c7a7c4f07fe))
* **destination:** do not update event properties to lowercase in hubspot ([#1559](https://github.com/rudderlabs/rudder-transformer/issues/1559)) ([e41b37f](https://github.com/rudderlabs/rudder-transformer/commit/e41b37f38f1f9de87fa452ea30c6587d87a95a5d))
* ecom events properties mapping correction ([#1549](https://github.com/rudderlabs/rudder-transformer/issues/1549)) ([0e9c816](https://github.com/rudderlabs/rudder-transformer/commit/0e9c816092c5fc777f2d472e13ec3aa94def2160))
* incorrect lodash cloneDeep import ([#1545](https://github.com/rudderlabs/rudder-transformer/issues/1545)) ([5e70dca](https://github.com/rudderlabs/rudder-transformer/commit/5e70dcae665f3610ea6e65bb2d6303b9a547036e))
* suppress cdk error types ([#1555](https://github.com/rudderlabs/rudder-transformer/issues/1555)) ([9215a7c](https://github.com/rudderlabs/rudder-transformer/commit/9215a7ca272122199202d26301f9515a1a3bd6b0))

## [1.5.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.4.0...v1.5.0) (2022-11-03)


### Features

* added multitopic support for kafka ([#1488](https://github.com/rudderlabs/rudder-transformer/issues/1488)) ([bd1298b](https://github.com/rudderlabs/rudder-transformer/commit/bd1298b57358cf62a2ef7f74fe06ba0200bda488))
* **new integration:** onboarding snapchat custom audience ([#1443](https://github.com/rudderlabs/rudder-transformer/issues/1443)) ([1e00248](https://github.com/rudderlabs/rudder-transformer/commit/1e0024824074e4b66a67f38302ec02d611e7a8c7))


### Bug Fixes

* fixing errors caught by bugsnag ([#1536](https://github.com/rudderlabs/rudder-transformer/issues/1536)) ([9c43896](https://github.com/rudderlabs/rudder-transformer/commit/9c43896f27be87d8c024a61b4cb4a09124918f23))
* suppress errors thrown from the transformers in bugsnag notifier ([#1534](https://github.com/rudderlabs/rudder-transformer/issues/1534)) ([1ca8e9f](https://github.com/rudderlabs/rudder-transformer/commit/1ca8e9f704eb03699c198c91cf1691ccdfa42772))

## [1.4.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.3.0...v1.4.0) (2022-11-01)


### Features

* **integration:** onboarding gainsight px source ([#1500](https://github.com/rudderlabs/rudder-transformer/issues/1500)) ([0d0cce5](https://github.com/rudderlabs/rudder-transformer/commit/0d0cce5299b0cad9c616cb7b0bbee92f6f414732))
* onboard algolia destination to cdk 2.0 ([#1474](https://github.com/rudderlabs/rudder-transformer/issues/1474)) ([e716d84](https://github.com/rudderlabs/rudder-transformer/commit/e716d8458d636854f59a555cafc2a7b00a0b1b50))


### Bug Fixes

* **amplitude:** send error response instead of discarding the event during batch processing ([#1521](https://github.com/rudderlabs/rudder-transformer/issues/1521)) ([fece19f](https://github.com/rudderlabs/rudder-transformer/commit/fece19fccff44a31d1d96c43bd138ce6f2cce10d))
* cdk based live compare test results ([#1483](https://github.com/rudderlabs/rudder-transformer/issues/1483)) ([d8f32c3](https://github.com/rudderlabs/rudder-transformer/commit/d8f32c3d522a6e3b33023828e1bd8b870046861f))
* error stat issue for algolia ([#1528](https://github.com/rudderlabs/rudder-transformer/issues/1528)) ([3a7482c](https://github.com/rudderlabs/rudder-transformer/commit/3a7482cf4f6d37785e9ef595bd7e4a9d54aebedb))
* upgrade ajv from 8.6.1 to 8.11.0 ([#1372](https://github.com/rudderlabs/rudder-transformer/issues/1372)) ([f3b54c0](https://github.com/rudderlabs/rudder-transformer/commit/f3b54c0876bb7be79244e02e31517db13260c610))
* upgrade axios from 0.26.1 to 0.27.2 ([#1403](https://github.com/rudderlabs/rudder-transformer/issues/1403)) ([1186518](https://github.com/rudderlabs/rudder-transformer/commit/1186518cf89ad4de3ad16ae0a0fcb09e148bdfe5))

## [1.3.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.2.0...v1.3.0) (2022-10-25)


### Features

* **error reporting:** integrate bugsnag ([#1469](https://github.com/rudderlabs/rudder-transformer/issues/1469)) ([39b5fa2](https://github.com/rudderlabs/rudder-transformer/commit/39b5fa22ddb8e79d540242c66732cdcb31760ba9))
* **integrations:** added support for catalogs iterable with vdm rETL source ([#1439](https://github.com/rudderlabs/rudder-transformer/issues/1439)) ([586f771](https://github.com/rudderlabs/rudder-transformer/commit/586f771f8e0733ac2f79ea4741bb155eb24910ca))
* **new integration:** factorsAi ([#1490](https://github.com/rudderlabs/rudder-transformer/issues/1490)) ([1000ca8](https://github.com/rudderlabs/rudder-transformer/commit/1000ca8853b48f65bf1e8db0e2999f1d4b47387b))


### Bug Fixes

* bugsnag error notify handler ([#1512](https://github.com/rudderlabs/rudder-transformer/issues/1512)) ([d947c0e](https://github.com/rudderlabs/rudder-transformer/commit/d947c0ec23998ce54553839cf4b2e337c379713e))
* **mixpanel:** stripped off last 36 characters of insert_id ([#1503](https://github.com/rudderlabs/rudder-transformer/issues/1503)) ([550faec](https://github.com/rudderlabs/rudder-transformer/commit/550faecae92d48364b0fdebb8e50c057c0dfffe2))
* posthog group update ([#1496](https://github.com/rudderlabs/rudder-transformer/issues/1496)) ([154f656](https://github.com/rudderlabs/rudder-transformer/commit/154f656e2d437c1c54a6ef85c1b37f65fe154f14))
* skip adding Id field to salesforce payload for retl ([#1501](https://github.com/rudderlabs/rudder-transformer/issues/1501)) ([d2808f4](https://github.com/rudderlabs/rudder-transformer/commit/d2808f42ae3d3281468dbec1fc13e1511a45ebcd))
* upgrade @aws-sdk/client-s3 from 3.56.0 to 3.180.0 ([#1505](https://github.com/rudderlabs/rudder-transformer/issues/1505)) ([58c0179](https://github.com/rudderlabs/rudder-transformer/commit/58c01795f2c5b767e614c0d1777d7173eb741d17))
* upgrade @aws-sdk/lib-storage from 3.56.0 to 3.142.0 ([#1370](https://github.com/rudderlabs/rudder-transformer/issues/1370)) ([94faae5](https://github.com/rudderlabs/rudder-transformer/commit/94faae5fe34ef559b82975d4c53f4bd54b6dbaf1))

## [1.2.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.1.0...v1.2.0) (2022-10-18)


* release 1.2.0 ([1ce4963](https://github.com/rudderlabs/rudder-transformer/commit/1ce4963a959d38077d5eece1795d7af5b6379314))

## [1.1.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.0.0...v1.1.0) (2022-10-17)


### Features

* **integration:** Marketo- attribute to attributes, apiName to name,… ([#1481](https://github.com/rudderlabs/rudder-transformer/issues/1481)) ([e7187d6](https://github.com/rudderlabs/rudder-transformer/commit/e7187d64ef20dd788826eed91a9bd234b778c93a))

## [1.0.0](https://github.com/rudderlabs/rudder-transformer/compare/v0.1.5-rc.0...v1.0.0) (2022-10-13)


### Features

* add commit id and version in health endpoint ([#1445](https://github.com/rudderlabs/rudder-transformer/issues/1445)) ([e21dca7](https://github.com/rudderlabs/rudder-transformer/commit/e21dca7106afae7b6150fa8ab85520de321a2ea4))
* Add library key support ([4aa31af](https://github.com/rudderlabs/rudder-transformer/commit/4aa31afc9828a20132a5b9142279f6d06179039a))
* Add support for all Apple family OSes ([#925](https://github.com/rudderlabs/rudder-transformer/issues/925)) ([0962527](https://github.com/rudderlabs/rudder-transformer/commit/0962527bbe11927a53dd0c3973d5d39da0b961ce))
* add Variance as a destination ([c5f84c6](https://github.com/rudderlabs/rudder-transformer/commit/c5f84c6f58b27ee45728f190869e21145a522a62))
* Added library key support for Amplitude ([5af62c0](https://github.com/rudderlabs/rudder-transformer/commit/5af62c09668eff2ee321dc72eed784c27bb25ee0))
* Added library key support for Amplitude ([f0cf6b5](https://github.com/rudderlabs/rudder-transformer/commit/f0cf6b526cf3f0dc9ffcc1476df683a351264c04))
* **Facebook Pixel:** add response parsing support ([#1412](https://github.com/rudderlabs/rudder-transformer/issues/1412)) ([00893c1](https://github.com/rudderlabs/rudder-transformer/commit/00893c1e525473df306648b0946ecb90841c4197))
* **hs:** Add support for hubspot association events sent from retl ([#1361](https://github.com/rudderlabs/rudder-transformer/issues/1361)) ([b18c93f](https://github.com/rudderlabs/rudder-transformer/commit/b18c93f9865b4ecb0b5025370c544c58102a4df0))
* integrate cdk v2 ([#1448](https://github.com/rudderlabs/rudder-transformer/issues/1448)) ([d5086c2](https://github.com/rudderlabs/rudder-transformer/commit/d5086c2f0807424ac4e66a6c12e59b07eada5cbe))
* **integration:** fb custom audience - upgrade v14 to v15 ([#1463](https://github.com/rudderlabs/rudder-transformer/issues/1463)) ([f83a4b6](https://github.com/rudderlabs/rudder-transformer/commit/f83a4b607fdf02746e60c103e8a29850caeca9e3))
* **integration:** marketo - correct attribute to attributes, fix test cases ([#1446](https://github.com/rudderlabs/rudder-transformer/issues/1446)) ([80b148f](https://github.com/rudderlabs/rudder-transformer/commit/80b148fabb0eb49ac132e196c2aae0e5be3fed6f))
* **integration:** onboard Facebook Offline Conversions destination ([#1462](https://github.com/rudderlabs/rudder-transformer/issues/1462)) ([9f0413b](https://github.com/rudderlabs/rudder-transformer/commit/9f0413b8285793ced787cd385beed956b675982a))
* **integration:** Singular- allow empty string by default for instal… ([#1480](https://github.com/rudderlabs/rudder-transformer/issues/1480)) ([c44dec2](https://github.com/rudderlabs/rudder-transformer/commit/c44dec2a0d6952647489754b3bd5d7917d563251))
* **integration:** Singular- unixtimestamp format fixes and empty url allowed for openuri ([#1476](https://github.com/rudderlabs/rudder-transformer/issues/1476)) ([66c1efd](https://github.com/rudderlabs/rudder-transformer/commit/66c1efd87878485c78a01f82ec8cafd21056f8a6))
* **integrations:** user deletion support for mp, clevertap, and af destinations ([#1426](https://github.com/rudderlabs/rudder-transformer/issues/1426)) ([b5c5d6f](https://github.com/rudderlabs/rudder-transformer/commit/b5c5d6fbb9023fbf86e370366ab3f6818b4c343b))
* json support for warehouse destinations ([#1144](https://github.com/rudderlabs/rudder-transformer/issues/1144)) ([a431b08](https://github.com/rudderlabs/rudder-transformer/commit/a431b087e139a26477050f64ee26dbbe473899a9))
* Klaviyo ecommerce Specs ([#904](https://github.com/rudderlabs/rudder-transformer/issues/904)) ([5dd5329](https://github.com/rudderlabs/rudder-transformer/commit/5dd53296fbe4add44cc4acb330a61d5e4e11ddc9))
* migrate pinterest to cdk ([#1458](https://github.com/rudderlabs/rudder-transformer/issues/1458)) ([addff70](https://github.com/rudderlabs/rudder-transformer/commit/addff70d77e50b53cb7bb10fa4f4f59523f38f57))
* **new integration:** google adwords offline conversions onboarding ([#1397](https://github.com/rudderlabs/rudder-transformer/issues/1397)) ([4974b6d](https://github.com/rudderlabs/rudder-transformer/commit/4974b6d40c6cfcae0f455bc18704137d9b921192))
* **new integration:** june cloud mode destination onboarding ([#1433](https://github.com/rudderlabs/rudder-transformer/issues/1433)) ([458b32c](https://github.com/rudderlabs/rudder-transformer/commit/458b32c2d4e0100a56eb084128ca0aa76e2a006c))
* **new integration:** onboard Monday cloud mode destination ([#1400](https://github.com/rudderlabs/rudder-transformer/issues/1400)) ([f4e5cc4](https://github.com/rudderlabs/rudder-transformer/commit/f4e5cc4542a4cd729d8e8c77d4973dbe858bb6db))
* **new integration:** onboarding mailjet ([#1449](https://github.com/rudderlabs/rudder-transformer/issues/1449)) ([81de8a1](https://github.com/rudderlabs/rudder-transformer/commit/81de8a16c6d1cdeb3ac8b27a7d8a0cd51fc2c4af))
* **new integration:** onboarding mailmodo source ([#1414](https://github.com/rudderlabs/rudder-transformer/issues/1414)) ([e3689c2](https://github.com/rudderlabs/rudder-transformer/commit/e3689c249fd92baa9b3d640c0802f71b78d22650))
* **serenytics:** onboarding serenytics cloud mode destinations ([#1430](https://github.com/rudderlabs/rudder-transformer/issues/1430)) ([b7e93e3](https://github.com/rudderlabs/rudder-transformer/commit/b7e93e310903e93c39403f1f4b819c14e09d528d))
* **signl4:** onboarding signl4 cloud mode destination ([#1424](https://github.com/rudderlabs/rudder-transformer/issues/1424)) ([47bd3f8](https://github.com/rudderlabs/rudder-transformer/commit/47bd3f817a4df4d555a8ede656a8b311a4232519))
* support 'event' alias for 'message' in dynamic config ([#1289](https://github.com/rudderlabs/rudder-transformer/issues/1289)) ([ff6abb8](https://github.com/rudderlabs/rudder-transformer/commit/ff6abb8d4e89af154289b246b33f6e988c0efcbd))
* **transformation:** update env varibale name ([d904828](https://github.com/rudderlabs/rudder-transformer/commit/d904828e47a94d82a8428cf376dea5eb926d44a4))


### Bug Fixes

* address async and flow type issues ([#1457](https://github.com/rudderlabs/rudder-transformer/issues/1457)) ([632f74e](https://github.com/rudderlabs/rudder-transformer/commit/632f74e5f1d35d882ed6531f2af84b7d1fba0472))
* **algolia:** adding check on eventTypeSetting availability ([#1423](https://github.com/rudderlabs/rudder-transformer/issues/1423)) ([d8572ff](https://github.com/rudderlabs/rudder-transformer/commit/d8572ff4949513573d5f7367fa0dc0811086e61f))
* **appsflyer:** event name casing in track payloads ([#1390](https://github.com/rudderlabs/rudder-transformer/issues/1390)) ([3b22f18](https://github.com/rudderlabs/rudder-transformer/commit/3b22f1840acaf57b110ff67a9805be6d2bf7b062))
* **braze:** adding dynamic support for eu data center ([#1236](https://github.com/rudderlabs/rudder-transformer/issues/1236)) ([90bc03f](https://github.com/rudderlabs/rudder-transformer/commit/90bc03f00d8ce48b8e93f28c06863c80c353116f))
* docker vulnerabilities ([#1435](https://github.com/rudderlabs/rudder-transformer/issues/1435)) ([27084e2](https://github.com/rudderlabs/rudder-transformer/commit/27084e2c483bec679c9988a998b087a558bc5826))
* facebook pixel proxy tests ([#1444](https://github.com/rudderlabs/rudder-transformer/issues/1444)) ([f632583](https://github.com/rudderlabs/rudder-transformer/commit/f6325833244affaffad8aa311466c1596ef01cdd))
* Fix test case ([ac2342d](https://github.com/rudderlabs/rudder-transformer/commit/ac2342d43feabe92c7ed23495e02d9f77fb5fccd))
* **ga:** Do not fallback to userId for cid when disableMd5 is true, keep it undefined ([ad72d59](https://github.com/rudderlabs/rudder-transformer/commit/ad72d5962c19b00ae9dbbb3cec0cc6b223c7683d))
* **hs:** logic for custom objects support of hs with rETL  ([#1222](https://github.com/rudderlabs/rudder-transformer/issues/1222)) ([5353bcc](https://github.com/rudderlabs/rudder-transformer/commit/5353bcc33f7b077aa5240ac653c747aa6f3fd4b6))
* kafka schemaId ([#1283](https://github.com/rudderlabs/rudder-transformer/issues/1283)) ([214d5d5](https://github.com/rudderlabs/rudder-transformer/commit/214d5d53edb20b6b994d3b01bee8dddcc4fe2128))
* **marketo:** unhandled exception status-code fix ([#1432](https://github.com/rudderlabs/rudder-transformer/issues/1432)) ([6cc4868](https://github.com/rudderlabs/rudder-transformer/commit/6cc48688c82ba501b296c1171c0327cc91e33e4d))
* Remove event type guard that prevent traits from copying to user props ([e276ade](https://github.com/rudderlabs/rudder-transformer/commit/e276ade3c57c4556399a5be8b09f15a1877c5a2b))
* **signl4:** correcting timestamp format ([#1431](https://github.com/rudderlabs/rudder-transformer/issues/1431)) ([18632e6](https://github.com/rudderlabs/rudder-transformer/commit/18632e632330db753eabe1fe4d90f22703979c1b))
* **trackingplan:** adding message type optional check in tp source config ([60f0658](https://github.com/rudderlabs/rudder-transformer/commit/60f0658a5b7701d8d545ebfb838bfa19cc68c6e2))
* upgrade dotenv from 8.2.0 to 8.6.0 ([#1389](https://github.com/rudderlabs/rudder-transformer/issues/1389)) ([1c3d001](https://github.com/rudderlabs/rudder-transformer/commit/1c3d001f8c35d0885497faa87c8ce728d6403efe))
* upgrade koa from 2.13.0 to 2.13.4 ([#1398](https://github.com/rudderlabs/rudder-transformer/issues/1398)) ([213e30e](https://github.com/rudderlabs/rudder-transformer/commit/213e30e4c04481ee4aa9d59c346ed959acfd5bb5))
* upgrade ua-parser-js from 0.7.24 to 0.8.1 ([#1378](https://github.com/rudderlabs/rudder-transformer/issues/1378)) ([a50899b](https://github.com/rudderlabs/rudder-transformer/commit/a50899b6780d3f640c260830c74f28cd4b1d9b5d))
* vulnerabilities in dependencies ([#1436](https://github.com/rudderlabs/rudder-transformer/issues/1436)) ([a26e7f5](https://github.com/rudderlabs/rudder-transformer/commit/a26e7f54d5aaafa48c20826cd5dd5f3f8f30e39f))

### [0.1.5-rc.0](https://github.com/rudderlabs/rudder-transformer/compare/v0.1.4...v0.1.5-rc.0) (2020-03-16)

### [0.1.4](https://github.com/rudderlabs/rudder-transformer/compare/v0.1.3...v0.1.4) (2020-03-02)

### [0.1.3](https://github.com/rudderlabs/rudder-transformer/compare/v0.1.2...v0.1.3) (2020-02-11)

### [0.1.2](https://github.com/rudderlabs/rudder-transformer/compare/v0.1.1...v0.1.2) (2020-02-07)


### Bug Fixes

* salesforce  tests ([86500b8](https://github.com/rudderlabs/rudder-transformer/commit/86500b832610f047666a4fe4799a843c5a1fb6e9))

### [0.1.1](https://github.com/rudderlabs/rudder-transformer/compare/v0.1.0...v0.1.1) (2019-11-05)

### 0.1.0 (2019-10-24)

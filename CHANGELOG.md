# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.8.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.7.0...v1.8.0) (2022-12-06)


### Features

* added subscription group in braze ([#1597](https://github.com/rudderlabs/rudder-transformer/issues/1597)) ([f321f4e](https://github.com/rudderlabs/rudder-transformer/commit/f321f4e525c077c06c853530d8c8c23da35baee1))
* **clevertap:** onboarding clevertap transformer proxy ([#1596](https://github.com/rudderlabs/rudder-transformer/issues/1596)) ([5479aa6](https://github.com/rudderlabs/rudder-transformer/commit/5479aa6afde2171bfd767602c55a36590ed7059b))
* **destination:** add groupId support as groupKey in mixpanel ([#1590](https://github.com/rudderlabs/rudder-transformer/issues/1590)) ([a33adc6](https://github.com/rudderlabs/rudder-transformer/commit/a33adc6c12a4f7cd6b62955bc29d58206034b3c4))
* **destination:** cache eviction in salesforce ([#1598](https://github.com/rudderlabs/rudder-transformer/issues/1598)) ([9af5552](https://github.com/rudderlabs/rudder-transformer/commit/9af55520f3199b4ad0027edac4650b81193ff9c5))
* **destination:** onboard awin integration ([#1589](https://github.com/rudderlabs/rudder-transformer/issues/1589)) ([f015518](https://github.com/rudderlabs/rudder-transformer/commit/f0155185d3a9b9dfa3681a9b52c64fe5e24d6d6d))
* **destination:** onboard marketo static list ([#1558](https://github.com/rudderlabs/rudder-transformer/issues/1558)) ([db73de9](https://github.com/rudderlabs/rudder-transformer/commit/db73de99dd538eb1c820d3bd2d42689163993cfe))
* **destination:** onboard persistIq ([#1612](https://github.com/rudderlabs/rudder-transformer/issues/1612)) ([103ad00](https://github.com/rudderlabs/rudder-transformer/commit/103ad00df7d28d3368382cf7b0099c901bb853e4))
* **destination:** singular- add support for other apple os ([#1611](https://github.com/rudderlabs/rudder-transformer/issues/1611)) ([63f23d8](https://github.com/rudderlabs/rudder-transformer/commit/63f23d8dc8bcf80b84b0976903dfb360785bec86))
* ga user delete support ([#1531](https://github.com/rudderlabs/rudder-transformer/issues/1531)) ([eb198dd](https://github.com/rudderlabs/rudder-transformer/commit/eb198dd085d16d9c9069352cec8bfb6f33247654))
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
* saas -&gt; master ([#1603](https://github.com/rudderlabs/rudder-transformer/issues/1603)) ([b154e1d](https://github.com/rudderlabs/rudder-transformer/commit/b154e1d61bd894e27f62ecc737d1dd0f1b16d28a))


### Miscellaneous

* add benchmarking support for cdk ([#1610](https://github.com/rudderlabs/rudder-transformer/issues/1610)) ([a034574](https://github.com/rudderlabs/rudder-transformer/commit/a034574fa64a296b0a21bef89ddc6a5d6792adb9))
* add cdk live comparison time stats ([#1529](https://github.com/rudderlabs/rudder-transformer/issues/1529)) ([8a526fa](https://github.com/rudderlabs/rudder-transformer/commit/8a526faa4656983014373c9b1d152809b8f77b32))
* add router support to benchmarking script ([#1613](https://github.com/rudderlabs/rudder-transformer/issues/1613)) ([0673c2f](https://github.com/rudderlabs/rudder-transformer/commit/0673c2f5fb4b924114fa61c247307406ecd1acc8))
* **deps:** bump decode-uri-component from 0.2.0 to 0.2.2 ([#1625](https://github.com/rudderlabs/rudder-transformer/issues/1625)) ([b2d155f](https://github.com/rudderlabs/rudder-transformer/commit/b2d155f2041b379ed09a13cff72ac26bd079b049))
* **existing destinations:** error handling ([#1593](https://github.com/rudderlabs/rudder-transformer/issues/1593)) ([bd56ec4](https://github.com/rudderlabs/rudder-transformer/commit/bd56ec472ada3dd8b3a974b336ba9fcbe8668285))
* stop using cpu count for workers ([#1582](https://github.com/rudderlabs/rudder-transformer/issues/1582)) ([6359737](https://github.com/rudderlabs/rudder-transformer/commit/6359737701948ca7d08dd268cdaf1af36425170b))

## [1.7.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.6.0...v1.7.0) (2022-11-17)

### Features

- add support for topic parsing ([#1574](https://github.com/rudderlabs/rudder-transformer/issues/1574)) ([da64878](https://github.com/rudderlabs/rudder-transformer/commit/da648788ab0460bd231cf9147fb9852747551ef8))
- **destination:** add partner_name for tiktok ads ([#1583](https://github.com/rudderlabs/rudder-transformer/issues/1583)) ([12265a9](https://github.com/rudderlabs/rudder-transformer/commit/12265a952a171627ac05d7eab8899d97ceade13c))
- **destination:** onboard campaign manager ([#1580](https://github.com/rudderlabs/rudder-transformer/issues/1580)) ([b823a53](https://github.com/rudderlabs/rudder-transformer/commit/b823a538ca4d4f38faa4762ae986375e0eb8ae05))
- sendgrid idetify and user deletion support ([#1571](https://github.com/rudderlabs/rudder-transformer/issues/1571)) ([caee969](https://github.com/rudderlabs/rudder-transformer/commit/caee969c79ce9673096d0fc4d08be3ba942ce9f5))

### Bug Fixes

- (marketo) logger import ([#1576](https://github.com/rudderlabs/rudder-transformer/issues/1576)) ([c83f046](https://github.com/rudderlabs/rudder-transformer/commit/c83f046ee8baed0e61e8c4d2ac78fec74d74b794))
- add test coverage for processMetadata function ([#1567](https://github.com/rudderlabs/rudder-transformer/issues/1567)) ([b438daa](https://github.com/rudderlabs/rudder-transformer/commit/b438daad9bf0c845d867e0261ff69e77fc3ee0cd))
- **destination:** fix the flattening issue solve for ga4 ([#1581](https://github.com/rudderlabs/rudder-transformer/issues/1581)) ([bea730d](https://github.com/rudderlabs/rudder-transformer/commit/bea730da510c016bd3a71cb519316375b44ea6d3))
- **destination:** revamp group call in Gainsight_PX to reduce API calls ([#1578](https://github.com/rudderlabs/rudder-transformer/issues/1578)) ([f641cc0](https://github.com/rudderlabs/rudder-transformer/commit/f641cc0d3b64fcb736bbd4d5208819958bacb393))
- **destination:** update formating of user traits in facebook pixel ([#1579](https://github.com/rudderlabs/rudder-transformer/issues/1579)) ([b7772e4](https://github.com/rudderlabs/rudder-transformer/commit/b7772e41530f1d4e88263408d4ff3532c187eaf5))
- **integration:** Shopify - correct typo in customer_disabled, add to track_maps ([#1573](https://github.com/rudderlabs/rudder-transformer/issues/1573)) ([cfb5c56](https://github.com/rudderlabs/rudder-transformer/commit/cfb5c56bdc70e52dc996fdfc9c26743a6728d875))
- **transformation:** convert slash to dot to get valid docker image name ([#1564](https://github.com/rudderlabs/rudder-transformer/issues/1564)) ([f1b6b94](https://github.com/rudderlabs/rudder-transformer/commit/f1b6b946e1a6eb519560b675f3fce10d1e833950))
- typo in topic mapping for shopify source ([#1566](https://github.com/rudderlabs/rudder-transformer/issues/1566)) ([0ecf278](https://github.com/rudderlabs/rudder-transformer/commit/0ecf278be9a2435ed67fee299350a34c4b13bb9a))

### Miscellaneous

- update CODEOWNERS ([2514aaf](https://github.com/rudderlabs/rudder-transformer/commit/2514aafb5c28017632a02df4ffb936e43419c12e))

## [1.6.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.5.0...v1.6.0) (2022-11-10)

### Features

- **destination:** skip unix timestamp conversion if already being sent from source ([#1560](https://github.com/rudderlabs/rudder-transformer/issues/1560)) ([a52cbd7](https://github.com/rudderlabs/rudder-transformer/commit/a52cbd797fa8a0ccec6589ff78b966da26040fbc))
- **destination:** stringify the object and array for Clevertap ([#1554](https://github.com/rudderlabs/rudder-transformer/issues/1554)) ([1c7b459](https://github.com/rudderlabs/rudder-transformer/commit/1c7b459d74ae0b17360d0e49e9bc11557e6f4233))
- **destination:** support custom mapping with client_id for ga4 destination ([#1553](https://github.com/rudderlabs/rudder-transformer/issues/1553)) ([e9f056b](https://github.com/rudderlabs/rudder-transformer/commit/e9f056bacad84d7e59e58904626c6eb7edcc4686))
- **destination:** update identify call to set primary email for Zendesk([#1539](https://github.com/rudderlabs/rudder-transformer/issues/1539)) ([ed307a3](https://github.com/rudderlabs/rudder-transformer/commit/ed307a31ff46575f3a606a0894eeeaaec0b40c00))
- **marketo:** add dynamic ttl & cache eviction support ([#1519](https://github.com/rudderlabs/rudder-transformer/issues/1519)) ([19f1081](https://github.com/rudderlabs/rudder-transformer/commit/19f1081cc32ba9798876dcb9d46d9d094c171e1d))
- support custom webhooks in auth0 source transformer ([#1527](https://github.com/rudderlabs/rudder-transformer/issues/1527)) ([ebc005f](https://github.com/rudderlabs/rudder-transformer/commit/ebc005f84d3af4a7a32f362cc7ece842c8f269a1))

### Bug Fixes

- (marketo)- remove duplicate responseHandler from util and refactor ([#1557](https://github.com/rudderlabs/rudder-transformer/issues/1557)) ([144793e](https://github.com/rudderlabs/rudder-transformer/commit/144793eef2c83b9bc43b989b061c7c7a7c4f07fe))
- amplitude http api version update ([#1538](https://github.com/rudderlabs/rudder-transformer/issues/1538)) ([0d5e2d4](https://github.com/rudderlabs/rudder-transformer/commit/0d5e2d469740b4fd02b1008dfa67d3bbe8a5542d))
- **destination:** do not update event properties to lowercase in hubspot ([#1559](https://github.com/rudderlabs/rudder-transformer/issues/1559)) ([e41b37f](https://github.com/rudderlabs/rudder-transformer/commit/e41b37f38f1f9de87fa452ea30c6587d87a95a5d))
- ecom events properties mapping correction ([#1549](https://github.com/rudderlabs/rudder-transformer/issues/1549)) ([0e9c816](https://github.com/rudderlabs/rudder-transformer/commit/0e9c816092c5fc777f2d472e13ec3aa94def2160))
- incorrect lodash cloneDeep import ([#1545](https://github.com/rudderlabs/rudder-transformer/issues/1545)) ([5e70dca](https://github.com/rudderlabs/rudder-transformer/commit/5e70dcae665f3610ea6e65bb2d6303b9a547036e))
- suppress cdk error types ([#1555](https://github.com/rudderlabs/rudder-transformer/issues/1555)) ([9215a7c](https://github.com/rudderlabs/rudder-transformer/commit/9215a7ca272122199202d26301f9515a1a3bd6b0))

### Miscellaneous

- **data-delivery:** decouple network handlers ([#1541](https://github.com/rudderlabs/rudder-transformer/issues/1541)) ([8a56fd5](https://github.com/rudderlabs/rudder-transformer/commit/8a56fd5c41b616f557a5f63aab55e3722158c182))
- skip single commit checks in prs ([759f4d4](https://github.com/rudderlabs/rudder-transformer/commit/759f4d47ac048cd5a7c2ac2a7b562f268b95ee67))
- sync master to saas ([#1546](https://github.com/rudderlabs/rudder-transformer/issues/1546)) ([e4e406e](https://github.com/rudderlabs/rudder-transformer/commit/e4e406e32b5998f19a72f2ec769d4b182740f56d))
- **transformation:** adding user transformation builds separately ([#1515](https://github.com/rudderlabs/rudder-transformer/issues/1515)) ([f703801](https://github.com/rudderlabs/rudder-transformer/commit/f7038010279504ccfdf52f6a8b69a4ae80605ab7))
- **transformation:** setting default timeout for user transformation ([#1421](https://github.com/rudderlabs/rudder-transformer/issues/1421)) ([eb676b8](https://github.com/rudderlabs/rudder-transformer/commit/eb676b869e9a86c1a532a206ab9fa959f7f466ad))

## [1.5.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.4.0...v1.5.0) (2022-11-03)

### Features

- added multitopic support for kafka ([#1488](https://github.com/rudderlabs/rudder-transformer/issues/1488)) ([bd1298b](https://github.com/rudderlabs/rudder-transformer/commit/bd1298b57358cf62a2ef7f74fe06ba0200bda488))
- **new integration:** onboarding snapchat custom audience ([#1443](https://github.com/rudderlabs/rudder-transformer/issues/1443)) ([1e00248](https://github.com/rudderlabs/rudder-transformer/commit/1e0024824074e4b66a67f38302ec02d611e7a8c7))

### Bug Fixes

- fixing errors caught by bugsnag ([#1536](https://github.com/rudderlabs/rudder-transformer/issues/1536)) ([9c43896](https://github.com/rudderlabs/rudder-transformer/commit/9c43896f27be87d8c024a61b4cb4a09124918f23))
- suppress errors thrown from the transformers in bugsnag notifier ([#1534](https://github.com/rudderlabs/rudder-transformer/issues/1534)) ([1ca8e9f](https://github.com/rudderlabs/rudder-transformer/commit/1ca8e9f704eb03699c198c91cf1691ccdfa42772))

### Miscellaneous

- clean up CODEOWNERS file ([#1535](https://github.com/rudderlabs/rudder-transformer/issues/1535)) ([19922bd](https://github.com/rudderlabs/rudder-transformer/commit/19922bd6c3cea041c3b3c84321d0fa6ebb2d74ae))

## [1.4.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.3.0...v1.4.0) (2022-11-01)

### Features

- **integration:** onboarding gainsight px source ([#1500](https://github.com/rudderlabs/rudder-transformer/issues/1500)) ([0d0cce5](https://github.com/rudderlabs/rudder-transformer/commit/0d0cce5299b0cad9c616cb7b0bbee92f6f414732))
- onboard algolia destination to cdk 2.0 ([#1474](https://github.com/rudderlabs/rudder-transformer/issues/1474)) ([e716d84](https://github.com/rudderlabs/rudder-transformer/commit/e716d8458d636854f59a555cafc2a7b00a0b1b50))

### Bug Fixes

- **amplitude:** send error response instead of discarding the event during batch processing ([#1521](https://github.com/rudderlabs/rudder-transformer/issues/1521)) ([fece19f](https://github.com/rudderlabs/rudder-transformer/commit/fece19fccff44a31d1d96c43bd138ce6f2cce10d))
- cdk based live compare test results ([#1483](https://github.com/rudderlabs/rudder-transformer/issues/1483)) ([d8f32c3](https://github.com/rudderlabs/rudder-transformer/commit/d8f32c3d522a6e3b33023828e1bd8b870046861f))
- error stat issue for algolia ([#1528](https://github.com/rudderlabs/rudder-transformer/issues/1528)) ([3a7482c](https://github.com/rudderlabs/rudder-transformer/commit/3a7482cf4f6d37785e9ef595bd7e4a9d54aebedb))
- upgrade ajv from 8.6.1 to 8.11.0 ([#1372](https://github.com/rudderlabs/rudder-transformer/issues/1372)) ([f3b54c0](https://github.com/rudderlabs/rudder-transformer/commit/f3b54c0876bb7be79244e02e31517db13260c610))
- upgrade axios from 0.26.1 to 0.27.2 ([#1403](https://github.com/rudderlabs/rudder-transformer/issues/1403)) ([1186518](https://github.com/rudderlabs/rudder-transformer/commit/1186518cf89ad4de3ad16ae0a0fcb09e148bdfe5))

### Miscellaneous

- **destination:** added log and change returned error during searching objects for retl sources to debug chatpay ([#1455](https://github.com/rudderlabs/rudder-transformer/issues/1455)) ([9cbfe30](https://github.com/rudderlabs/rudder-transformer/commit/9cbfe3021ed80a86160c2a45aaae33a29214f4eb))
- **destination:** error handling ([#1442](https://github.com/rudderlabs/rudder-transformer/issues/1442)) ([00d16a3](https://github.com/rudderlabs/rudder-transformer/commit/00d16a3fffb93a79b06e47a10b05665089de95c4))

## [1.3.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.2.0...v1.3.0) (2022-10-25)

### Features

- **error reporting:** integrate bugsnag ([#1469](https://github.com/rudderlabs/rudder-transformer/issues/1469)) ([39b5fa2](https://github.com/rudderlabs/rudder-transformer/commit/39b5fa22ddb8e79d540242c66732cdcb31760ba9))
- **integrations:** added support for catalogs iterable with vdm rETL source ([#1439](https://github.com/rudderlabs/rudder-transformer/issues/1439)) ([586f771](https://github.com/rudderlabs/rudder-transformer/commit/586f771f8e0733ac2f79ea4741bb155eb24910ca))
- **new integration:** factorsAi ([#1490](https://github.com/rudderlabs/rudder-transformer/issues/1490)) ([1000ca8](https://github.com/rudderlabs/rudder-transformer/commit/1000ca8853b48f65bf1e8db0e2999f1d4b47387b))

### Bug Fixes

- bugsnag error notify handler ([#1512](https://github.com/rudderlabs/rudder-transformer/issues/1512)) ([d947c0e](https://github.com/rudderlabs/rudder-transformer/commit/d947c0ec23998ce54553839cf4b2e337c379713e))
- **mixpanel:** stripped off last 36 characters of insert_id ([#1503](https://github.com/rudderlabs/rudder-transformer/issues/1503)) ([550faec](https://github.com/rudderlabs/rudder-transformer/commit/550faecae92d48364b0fdebb8e50c057c0dfffe2))
- posthog group update ([#1496](https://github.com/rudderlabs/rudder-transformer/issues/1496)) ([154f656](https://github.com/rudderlabs/rudder-transformer/commit/154f656e2d437c1c54a6ef85c1b37f65fe154f14))
- skip adding Id field to salesforce payload for retl ([#1501](https://github.com/rudderlabs/rudder-transformer/issues/1501)) ([d2808f4](https://github.com/rudderlabs/rudder-transformer/commit/d2808f42ae3d3281468dbec1fc13e1511a45ebcd))
- upgrade @aws-sdk/client-s3 from 3.56.0 to 3.180.0 ([#1505](https://github.com/rudderlabs/rudder-transformer/issues/1505)) ([58c0179](https://github.com/rudderlabs/rudder-transformer/commit/58c01795f2c5b767e614c0d1777d7173eb741d17))
- upgrade @aws-sdk/lib-storage from 3.56.0 to 3.142.0 ([#1370](https://github.com/rudderlabs/rudder-transformer/issues/1370)) ([94faae5](https://github.com/rudderlabs/rudder-transformer/commit/94faae5fe34ef559b82975d4c53f4bd54b6dbaf1))

### Miscellaneous

- upgrade transformer version in config backend deployment to ci-cd ([#1494](https://github.com/rudderlabs/rudder-transformer/issues/1494)) ([a433560](https://github.com/rudderlabs/rudder-transformer/commit/a433560c900c30b826c463a48ef6a7d338f7fed8))

## [1.2.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.1.0...v1.2.0) (2022-10-18)

### Features

- added custom traits support in profile updation request ([3fabd79](https://github.com/rudderlabs/rudder-transformer/commit/3fabd79813a2fc0c2ee04bccca75dc78d05e0f79))

### Miscellaneous

- **node-fetch:** capture fetchError status code thrown by fetch call ([#1491](https://github.com/rudderlabs/rudder-transformer/issues/1491)) ([84c5f99](https://github.com/rudderlabs/rudder-transformer/commit/84c5f999ae81ff108300249120f8897d76e903d4))
- release 1.2.0 ([1ce4963](https://github.com/rudderlabs/rudder-transformer/commit/1ce4963a959d38077d5eece1795d7af5b6379314))

## [1.1.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.0.0...v1.1.0) (2022-10-14)

### Features

- **integration:** Marketo- attribute to attributes, apiName to name,… ([#1481](https://github.com/rudderlabs/rudder-transformer/issues/1481)) ([e7187d6](https://github.com/rudderlabs/rudder-transformer/commit/e7187d64ef20dd788826eed91a9bd234b778c93a))

### Miscellaneous

- **node-fetch:** capture fetchError thrownby fetch call ([#1485](https://github.com/rudderlabs/rudder-transformer/issues/1485)) ([1cf5d4d](https://github.com/rudderlabs/rudder-transformer/commit/1cf5d4d17588c920bc2f60c8de82bf82993f89b6))

## 1.0.0 (2022-10-13)

### Features

- add commit id and version in health endpoint ([#1445](https://github.com/rudderlabs/rudder-transformer/issues/1445)) ([e21dca7](https://github.com/rudderlabs/rudder-transformer/commit/e21dca7106afae7b6150fa8ab85520de321a2ea4))
- **Facebook Pixel:** add response parsing support ([#1412](https://github.com/rudderlabs/rudder-transformer/issues/1412)) ([00893c1](https://github.com/rudderlabs/rudder-transformer/commit/00893c1e525473df306648b0946ecb90841c4197))
- **hs:** Add support for hubspot association events sent from retl ([#1361](https://github.com/rudderlabs/rudder-transformer/issues/1361)) ([b18c93f](https://github.com/rudderlabs/rudder-transformer/commit/b18c93f9865b4ecb0b5025370c544c58102a4df0))
- integrate cdk v2 ([#1448](https://github.com/rudderlabs/rudder-transformer/issues/1448)) ([d5086c2](https://github.com/rudderlabs/rudder-transformer/commit/d5086c2f0807424ac4e66a6c12e59b07eada5cbe))
- **integration:** fb custom audience - upgrade v14 to v15 ([#1463](https://github.com/rudderlabs/rudder-transformer/issues/1463)) ([f83a4b6](https://github.com/rudderlabs/rudder-transformer/commit/f83a4b607fdf02746e60c103e8a29850caeca9e3))
- **integration:** marketo - correct attribute to attributes, fix test cases ([#1446](https://github.com/rudderlabs/rudder-transformer/issues/1446)) ([80b148f](https://github.com/rudderlabs/rudder-transformer/commit/80b148fabb0eb49ac132e196c2aae0e5be3fed6f))
- **integration:** onboard Facebook Offline Conversions destination ([#1462](https://github.com/rudderlabs/rudder-transformer/issues/1462)) ([9f0413b](https://github.com/rudderlabs/rudder-transformer/commit/9f0413b8285793ced787cd385beed956b675982a))
- **integration:** Singular- allow empty string by default for instal… ([#1480](https://github.com/rudderlabs/rudder-transformer/issues/1480)) ([c44dec2](https://github.com/rudderlabs/rudder-transformer/commit/c44dec2a0d6952647489754b3bd5d7917d563251))
- **integration:** Singular- unixtimestamp format fixes and empty url allowed for openuri ([#1476](https://github.com/rudderlabs/rudder-transformer/issues/1476)) ([66c1efd](https://github.com/rudderlabs/rudder-transformer/commit/66c1efd87878485c78a01f82ec8cafd21056f8a6))
- **integrations:** user deletion support for mp, clevertap, and af destinations ([#1426](https://github.com/rudderlabs/rudder-transformer/issues/1426)) ([b5c5d6f](https://github.com/rudderlabs/rudder-transformer/commit/b5c5d6fbb9023fbf86e370366ab3f6818b4c343b))
- json support for warehouse destinations ([#1144](https://github.com/rudderlabs/rudder-transformer/issues/1144)) ([a431b08](https://github.com/rudderlabs/rudder-transformer/commit/a431b087e139a26477050f64ee26dbbe473899a9))
- migrate pinterest to cdk ([#1458](https://github.com/rudderlabs/rudder-transformer/issues/1458)) ([addff70](https://github.com/rudderlabs/rudder-transformer/commit/addff70d77e50b53cb7bb10fa4f4f59523f38f57))
- **Mixpanel:** : Revamping code. ([#1376](https://github.com/rudderlabs/rudder-transformer/issues/1376)) ([649cb8a](https://github.com/rudderlabs/rudder-transformer/commit/649cb8a83be918f262469c7d7240eaeecf6ccecc))
- **new integration:** google adwords offline conversions onboarding ([#1397](https://github.com/rudderlabs/rudder-transformer/issues/1397)) ([4974b6d](https://github.com/rudderlabs/rudder-transformer/commit/4974b6d40c6cfcae0f455bc18704137d9b921192))
- **new integration:** june cloud mode destination onboarding ([#1433](https://github.com/rudderlabs/rudder-transformer/issues/1433)) ([458b32c](https://github.com/rudderlabs/rudder-transformer/commit/458b32c2d4e0100a56eb084128ca0aa76e2a006c))
- **new integration:** onboard Monday cloud mode destination ([#1400](https://github.com/rudderlabs/rudder-transformer/issues/1400)) ([f4e5cc4](https://github.com/rudderlabs/rudder-transformer/commit/f4e5cc4542a4cd729d8e8c77d4973dbe858bb6db))
- **new integration:** onboarding mailjet ([#1449](https://github.com/rudderlabs/rudder-transformer/issues/1449)) ([81de8a1](https://github.com/rudderlabs/rudder-transformer/commit/81de8a16c6d1cdeb3ac8b27a7d8a0cd51fc2c4af))
- **new integration:** onboarding mailmodo source ([#1414](https://github.com/rudderlabs/rudder-transformer/issues/1414)) ([e3689c2](https://github.com/rudderlabs/rudder-transformer/commit/e3689c249fd92baa9b3d640c0802f71b78d22650))
- **serenytics:** onboarding serenytics cloud mode destinations ([#1430](https://github.com/rudderlabs/rudder-transformer/issues/1430)) ([b7e93e3](https://github.com/rudderlabs/rudder-transformer/commit/b7e93e310903e93c39403f1f4b819c14e09d528d))
- **signl4:** onboarding signl4 cloud mode destination ([#1424](https://github.com/rudderlabs/rudder-transformer/issues/1424)) ([47bd3f8](https://github.com/rudderlabs/rudder-transformer/commit/47bd3f817a4df4d555a8ede656a8b311a4232519))
- support 'event' alias for 'message' in dynamic config ([#1289](https://github.com/rudderlabs/rudder-transformer/issues/1289)) ([ff6abb8](https://github.com/rudderlabs/rudder-transformer/commit/ff6abb8d4e89af154289b246b33f6e988c0efcbd))
- **transformation:** update env varibale name ([d904828](https://github.com/rudderlabs/rudder-transformer/commit/d904828e47a94d82a8428cf376dea5eb926d44a4))

### Bug Fixes

- address async and flow type issues ([#1457](https://github.com/rudderlabs/rudder-transformer/issues/1457)) ([632f74e](https://github.com/rudderlabs/rudder-transformer/commit/632f74e5f1d35d882ed6531f2af84b7d1fba0472))
- **algolia:** adding check on eventTypeSetting availability ([#1423](https://github.com/rudderlabs/rudder-transformer/issues/1423)) ([d8572ff](https://github.com/rudderlabs/rudder-transformer/commit/d8572ff4949513573d5f7367fa0dc0811086e61f))
- **appsflyer:** event name casing in track payloads ([#1390](https://github.com/rudderlabs/rudder-transformer/issues/1390)) ([3b22f18](https://github.com/rudderlabs/rudder-transformer/commit/3b22f1840acaf57b110ff67a9805be6d2bf7b062))
- **braze:** adding dynamic support for eu data center ([#1236](https://github.com/rudderlabs/rudder-transformer/issues/1236)) ([90bc03f](https://github.com/rudderlabs/rudder-transformer/commit/90bc03f00d8ce48b8e93f28c06863c80c353116f))
- docker vulnerabilities ([#1435](https://github.com/rudderlabs/rudder-transformer/issues/1435)) ([27084e2](https://github.com/rudderlabs/rudder-transformer/commit/27084e2c483bec679c9988a998b087a558bc5826))
- facebook pixel proxy tests ([#1444](https://github.com/rudderlabs/rudder-transformer/issues/1444)) ([f632583](https://github.com/rudderlabs/rudder-transformer/commit/f6325833244affaffad8aa311466c1596ef01cdd))
- **hs:** logic for custom objects support of hs with rETL ([#1222](https://github.com/rudderlabs/rudder-transformer/issues/1222)) ([5353bcc](https://github.com/rudderlabs/rudder-transformer/commit/5353bcc33f7b077aa5240ac653c747aa6f3fd4b6))
- **integration:** Engage ([#1472](https://github.com/rudderlabs/rudder-transformer/issues/1472)) ([5f4bc8c](https://github.com/rudderlabs/rudder-transformer/commit/5f4bc8c60c6887bc8599ef7324ba8b10c2752556))
- kafka schemaId ([#1283](https://github.com/rudderlabs/rudder-transformer/issues/1283)) ([214d5d5](https://github.com/rudderlabs/rudder-transformer/commit/214d5d53edb20b6b994d3b01bee8dddcc4fe2128))
- **marketo:** unhandled exception status-code fix ([#1432](https://github.com/rudderlabs/rudder-transformer/issues/1432)) ([6cc4868](https://github.com/rudderlabs/rudder-transformer/commit/6cc48688c82ba501b296c1171c0327cc91e33e4d))
- **signl4:** correcting timestamp format ([#1431](https://github.com/rudderlabs/rudder-transformer/issues/1431)) ([18632e6](https://github.com/rudderlabs/rudder-transformer/commit/18632e632330db753eabe1fe4d90f22703979c1b))
- **trackingplan:** adding message type optional check in tp source config ([60f0658](https://github.com/rudderlabs/rudder-transformer/commit/60f0658a5b7701d8d545ebfb838bfa19cc68c6e2))
- upgrade dotenv from 8.2.0 to 8.6.0 ([#1389](https://github.com/rudderlabs/rudder-transformer/issues/1389)) ([1c3d001](https://github.com/rudderlabs/rudder-transformer/commit/1c3d001f8c35d0885497faa87c8ce728d6403efe))
- upgrade koa from 2.13.0 to 2.13.4 ([#1398](https://github.com/rudderlabs/rudder-transformer/issues/1398)) ([213e30e](https://github.com/rudderlabs/rudder-transformer/commit/213e30e4c04481ee4aa9d59c346ed959acfd5bb5))
- upgrade ua-parser-js from 0.7.24 to 0.8.1 ([#1378](https://github.com/rudderlabs/rudder-transformer/issues/1378)) ([a50899b](https://github.com/rudderlabs/rudder-transformer/commit/a50899b6780d3f640c260830c74f28cd4b1d9b5d))
- vulnerabilities in dependencies ([#1436](https://github.com/rudderlabs/rudder-transformer/issues/1436)) ([a26e7f5](https://github.com/rudderlabs/rudder-transformer/commit/a26e7f54d5aaafa48c20826cd5dd5f3f8f30e39f))

### Miscellaneous

- add support for live testing of cdk v2 destination ([#1471](https://github.com/rudderlabs/rudder-transformer/issues/1471)) ([7098b64](https://github.com/rudderlabs/rudder-transformer/commit/7098b6414e0c3a162488194745358a58b430265f))
- clean up workflows for CI/CD ([#1478](https://github.com/rudderlabs/rudder-transformer/issues/1478)) ([2658915](https://github.com/rudderlabs/rudder-transformer/commit/2658915d7975d47aaf0b7bc335d7dcdd21ca5fcd))
- **core:** upgrade esline parser from 2018 to 2020 ([#1365](https://github.com/rudderlabs/rudder-transformer/issues/1365)) ([4402a7b](https://github.com/rudderlabs/rudder-transformer/commit/4402a7bd0331bcae9ffeabbf4ee5a68f3cf976f5))
- **deps:** bump protobufjs from 6.11.2 to 6.11.3 ([#1220](https://github.com/rudderlabs/rudder-transformer/issues/1220)) ([4172546](https://github.com/rudderlabs/rudder-transformer/commit/4172546b99b86a8b5b19f5cdeb5b782c5a5be15d))
- **environment:** add engines specification to package.json ([#1325](https://github.com/rudderlabs/rudder-transformer/issues/1325)) ([3427df8](https://github.com/rudderlabs/rudder-transformer/commit/3427df8df43bf6d6c161aadc1162585705aef6a5))
- **tfProxy:** stat tag changed to destType ([#1338](https://github.com/rudderlabs/rudder-transformer/issues/1338)) ([5b7c007](https://github.com/rudderlabs/rudder-transformer/commit/5b7c0073d1b554508ddf2383677fa8c95d128749))
- trigger commit ([95b4f66](https://github.com/rudderlabs/rudder-transformer/commit/95b4f660b55e24c7c234dea9a9827f84b46ea47a))
- **warehouse:** tracking plan validation compatiblility for spread sheet plugin ([#1193](https://github.com/rudderlabs/rudder-transformer/issues/1193)) ([3f40cd2](https://github.com/rudderlabs/rudder-transformer/commit/3f40cd2c463d360b1e3ab4b6b9e427502561193f))

## [0.1.5-rc.0] - 2020-03-16

### Added

- Bug Fixes

## [0.1.4] - 2020-02-28

### Added

- Bug Fixes

## [0.1.3] - 2020-02-11

### Added

- Branch Fixes

## [0.1.2] - 2020-02-07

### Added

- Branch integration
- Kochava integration
- Keen integration
- Salesforce integration
- Kissmetrics integration
- Adjust integration

## [0.1.1] - 2019-11-05

### Added

- Hubspot integration
- AppsFlyer integration
- Facebook Ads integration

## [0.1.0] - 2019-10-24

### Added

- User Functions
- Google Analytics, Amplitude, MixPanel Integrations
- Raw data destinations like S3, Minio

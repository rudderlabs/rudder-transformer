# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.19.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.18.0...v1.19.0) (2023-03-23)


### Features

* **indicative:** parse user agent info ([#1971](https://github.com/rudderlabs/rudder-transformer/issues/1971)) ([1328b5a](https://github.com/rudderlabs/rudder-transformer/commit/1328b5ac38f9d21def89bacbbca4891dbd6e4450))


### Bug Fixes

* file names in helm charts update job ([#1992](https://github.com/rudderlabs/rudder-transformer/issues/1992)) ([c694b49](https://github.com/rudderlabs/rudder-transformer/commit/c694b49cfae270e10bdad1d2e990f287b679649d))
* ga4 user_properties structure ([#1982](https://github.com/rudderlabs/rudder-transformer/issues/1982)) ([3d81202](https://github.com/rudderlabs/rudder-transformer/commit/3d81202fcd88b8033504e9f5aa5d095e6863dc76))
* **GA4:** revert context.traits support for user_properties ([#1991](https://github.com/rudderlabs/rudder-transformer/issues/1991)) ([ae001dc](https://github.com/rudderlabs/rudder-transformer/commit/ae001dc7aafe8b33be696acac9fad3416b51f8e8))
* revert context.traits support for user_properties ([4f51403](https://github.com/rudderlabs/rudder-transformer/commit/4f51403facdadfc2928f13159918bede3a5c073c))
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

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.16.0](https://github.com/rudderlabs/rudder-transformer/compare/1.15.1...1.16.0) (2023-03-14)


### Features

* mautic: support self hosted instance ([#1909](https://github.com/rudderlabs/rudder-transformer/issues/1909)) ([7c0a724](https://github.com/rudderlabs/rudder-transformer/commit/7c0a7240d9fcef45e4066a4a7dee8234c7e782d3))
* moenagae alias call support ([#1930](https://github.com/rudderlabs/rudder-transformer/issues/1930)) ([194bf8e](https://github.com/rudderlabs/rudder-transformer/commit/194bf8e3e2f47ca63ee273c9255468b41bc6ffcf))
* transformation secrets ([#1912](https://github.com/rudderlabs/rudder-transformer/issues/1912)) ([a0b488a](https://github.com/rudderlabs/rudder-transformer/commit/a0b488a4514c9c868f39d000a4ae40aa3f7b5de6))


### Bug Fixes

* client_id mapping for ga4 ([#1904](https://github.com/rudderlabs/rudder-transformer/issues/1904)) ([9aaf908](https://github.com/rudderlabs/rudder-transformer/commit/9aaf90864bd489fb463a56f62a673ead2bb83fe5))
* **destination:** add channel as platform ([#1906](https://github.com/rudderlabs/rudder-transformer/issues/1906)) ([4cfbbd0](https://github.com/rudderlabs/rudder-transformer/commit/4cfbbd02530d1cc02b1b04ab5c721f1b642d41bc))
* remove ga4 identify call support for cloud mode and treat identify call event as track events (login, sign_up and generate_lead) ([#1903](https://github.com/rudderlabs/rudder-transformer/issues/1903)) ([fa8fd74](https://github.com/rudderlabs/rudder-transformer/commit/fa8fd74f14d0ac6707f83ed81897a541ae6191e6))
* **slack:** handlebars error handling ([#1910](https://github.com/rudderlabs/rudder-transformer/issues/1910)) ([0c6bc2e](https://github.com/rudderlabs/rudder-transformer/commit/0c6bc2edb17986a1d99365a4468a67bd65e09e47))
* **util:** getDestinationExternalIDObjectForRetl funciton ([#1919](https://github.com/rudderlabs/rudder-transformer/issues/1919)) ([235243d](https://github.com/rudderlabs/rudder-transformer/commit/235243de9afb1b52b56b7db9170e5eb3345b1de6))

### [1.15.1](https://github.com/rudderlabs/rudder-transformer/compare/1.15.0...1.15.1) (2023-03-13)

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


### Miscellaneous

* **ci:** improve build time with npm ci ([#1886](https://github.com/rudderlabs/rudder-transformer/issues/1886)) ([5d5c1d3](https://github.com/rudderlabs/rudder-transformer/commit/5d5c1d3cf3143504de1fe4244c64f5dec365ed90))
* replace references of master with main ([#1889](https://github.com/rudderlabs/rudder-transformer/issues/1889)) ([3417109](https://github.com/rudderlabs/rudder-transformer/commit/341710960405757d8e9791b5a6cd884f44ecfc97))
* support for refreshing token during transformation ([#1882](https://github.com/rudderlabs/rudder-transformer/issues/1882)) ([db59d10](https://github.com/rudderlabs/rudder-transformer/commit/db59d10d3659ea2acec46155deda9333f84a97ee))
* **trackingplan:** collecting violation metrics for tracking plan ([#1896](https://github.com/rudderlabs/rudder-transformer/issues/1896)) ([f7bb8b6](https://github.com/rudderlabs/rudder-transformer/commit/f7bb8b6d9b5cd2d79a5a7b6c980399378d7e1a77))

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


### Miscellaneous

* add instanceName tag to statsd metrics ([#1860](https://github.com/rudderlabs/rudder-transformer/issues/1860)) ([e1984b1](https://github.com/rudderlabs/rudder-transformer/commit/e1984b171cfcb4501922b141b903ca64c4d6bdfc))
* add logging for cdk v2 for debugging comparison failures ([#1820](https://github.com/rudderlabs/rudder-transformer/issues/1820)) ([bac5ca4](https://github.com/rudderlabs/rudder-transformer/commit/bac5ca4292f85ac7f05510590fbc7eb8c4c73949))
* add support for multi platform docker images ([#1235](https://github.com/rudderlabs/rudder-transformer/issues/1235)) ([7d29cb1](https://github.com/rudderlabs/rudder-transformer/commit/7d29cb1ac4d1695311044cb00181dc00e91d9962))
* add type declaration file to eslint ignore ([f8de632](https://github.com/rudderlabs/rudder-transformer/commit/f8de632887e82db2372d1d639cd99191bb63db34))
* add unit tests for extractCustomFields function ([#1848](https://github.com/rudderlabs/rudder-transformer/issues/1848)) ([6fd1278](https://github.com/rudderlabs/rudder-transformer/commit/6fd1278dd25e78c24c1cb4da90c92c9977be25ed))
* email made unmandatory ([#1819](https://github.com/rudderlabs/rudder-transformer/issues/1819)) ([65f42ae](https://github.com/rudderlabs/rudder-transformer/commit/65f42ae4bd8809a9eb60a7d38886de6356c04648))
* refactor utility function test scripts ([#1832](https://github.com/rudderlabs/rudder-transformer/issues/1832)) ([7ce889a](https://github.com/rudderlabs/rudder-transformer/commit/7ce889aba987dba14fea4bef8d8e59648eaaa212))
* **trackingplan:** added ajv format definitions support ([#1806](https://github.com/rudderlabs/rudder-transformer/issues/1806)) ([c0f46fc](https://github.com/rudderlabs/rudder-transformer/commit/c0f46fc5855f9793089aa3a9a92e630e5227e8e4))
* unit test suite for integrations ([#1835](https://github.com/rudderlabs/rudder-transformer/issues/1835)) ([8bb0927](https://github.com/rudderlabs/rudder-transformer/commit/8bb09276813a463f8b16fc66ac5b7aaf18b8017c))

## [1.12.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.11.1...v1.12.0) (2023-01-19)


### Features

* **BQStream:** add batch support ([#1377](https://github.com/rudderlabs/rudder-transformer/issues/1377)) ([14c7531](https://github.com/rudderlabs/rudder-transformer/commit/14c7531635b5348ef518dcad483f25d4adeddddd))
* **destination:** onboard lemnisk integration  ([#1787](https://github.com/rudderlabs/rudder-transformer/issues/1787)) ([3c6b9e1](https://github.com/rudderlabs/rudder-transformer/commit/3c6b9e148dff559357fb61de49602f9d1689d699))
* ga4 page calls are discarded if hybrid mode is enabled ([#1794](https://github.com/rudderlabs/rudder-transformer/issues/1794)) ([ca12d07](https://github.com/rudderlabs/rudder-transformer/commit/ca12d078e3f936c4c0fd4449259d1a55ba0a4424))
* sessionId consistency across destinations ([#1789](https://github.com/rudderlabs/rudder-transformer/issues/1789)) ([ff68a44](https://github.com/rudderlabs/rudder-transformer/commit/ff68a4488e50f4a44c950395d0f9e5dc514db1df))


### Bug Fixes

* add sources as valid channel to cdkv1 ([bd74ef7](https://github.com/rudderlabs/rudder-transformer/commit/bd74ef7eff712d4db75856a205ddaa473d80ddd9))
* add sources as valid channel to cdkv1 ([#1803](https://github.com/rudderlabs/rudder-transformer/issues/1803)) ([e3057db](https://github.com/rudderlabs/rudder-transformer/commit/e3057dbff9d8daa1f64b5cd6de6b57ab97c016ee))
* array type check for externalIdArray ([#1785](https://github.com/rudderlabs/rudder-transformer/issues/1785)) ([dec3bb6](https://github.com/rudderlabs/rudder-transformer/commit/dec3bb6661b6737203964b2c4b5e3d2bd7421433))
* change destination configuration errors to abortable ([#1790](https://github.com/rudderlabs/rudder-transformer/issues/1790)) ([fb1281d](https://github.com/rudderlabs/rudder-transformer/commit/fb1281d2bc090bda34c7420c10946504e83756ef))
* **integration:** GAOC - fix timestamp format, allow calls without custom variables ([#1796](https://github.com/rudderlabs/rudder-transformer/issues/1796)) ([7c450ee](https://github.com/rudderlabs/rudder-transformer/commit/7c450ee78db2052bbb70866cbc6bd98cfd9c32b4))
* iterable alias call is separated from identify batching ([#1777](https://github.com/rudderlabs/rudder-transformer/issues/1777)) ([3676c45](https://github.com/rudderlabs/rudder-transformer/commit/3676c4591e8b241ad6a7873954bc8f07e7a69584))
* products array mapping and rename impact_radius to impact ([#1797](https://github.com/rudderlabs/rudder-transformer/issues/1797)) ([f812f0d](https://github.com/rudderlabs/rudder-transformer/commit/f812f0d3fbff6d6bfdd3670c59cf8ea01744f80f))
* remove regex validation for phone_number ([#1771](https://github.com/rudderlabs/rudder-transformer/issues/1771)) ([6c01642](https://github.com/rudderlabs/rudder-transformer/commit/6c016428b496cea7e3771d3cf5ab4dfbbd7e382b))


### Miscellaneous

* fix formatting and linting issues ([#1772](https://github.com/rudderlabs/rudder-transformer/issues/1772)) ([fb8b818](https://github.com/rudderlabs/rudder-transformer/commit/fb8b818b2cbd05f784117b9f3040856dab1a7346))
* **owner:** added a code owner ([#1793](https://github.com/rudderlabs/rudder-transformer/issues/1793)) ([1c6f92a](https://github.com/rudderlabs/rudder-transformer/commit/1c6f92a90363489bfc3e9430ec50fb30b2a65557))

## [1.11.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.11.0...v1.11.1) (2023-01-13)


### Bug Fixes

* add missing implementation stat tag for router transformation ([#1779](https://github.com/rudderlabs/rudder-transformer/issues/1779)) ([5ebde56](https://github.com/rudderlabs/rudder-transformer/commit/5ebde56ea644f81d1a17fa4d85697821879fa191))
* add validation for event name as string ([#1768](https://github.com/rudderlabs/rudder-transformer/issues/1768)) ([c48ec5e](https://github.com/rudderlabs/rudder-transformer/commit/c48ec5e3cd6590e5c766bc3afac9eb5c368b85f0))
* bugsnag error fixes for salesforce, garl, gaoc ([#1776](https://github.com/rudderlabs/rudder-transformer/issues/1776)) ([553c5de](https://github.com/rudderlabs/rudder-transformer/commit/553c5defc098e01e74d98606cf59baa9008b814d))
* destination transformation change from processor to router ([#1754](https://github.com/rudderlabs/rudder-transformer/issues/1754)) ([674d476](https://github.com/rudderlabs/rudder-transformer/commit/674d476bd1e55194456798c7a83bd27a62b868e3))
* proper error throw in gaec ([#1767](https://github.com/rudderlabs/rudder-transformer/issues/1767)) ([a2ed19d](https://github.com/rudderlabs/rudder-transformer/commit/a2ed19dc0b5eb6bbaec7dd88b25762553b1aae79))
* revert salesforce fix for undefined access_token ([#1780](https://github.com/rudderlabs/rudder-transformer/issues/1780)) ([d917b2e](https://github.com/rudderlabs/rudder-transformer/commit/d917b2e61afbdfb697e5d6066aa6e34fd9f71427))
* send dest info for failed events ([#1770](https://github.com/rudderlabs/rudder-transformer/issues/1770)) ([9f108c0](https://github.com/rudderlabs/rudder-transformer/commit/9f108c0b6a0978b7ca71d1b1bbeaafbba8dce2ee))


### Miscellaneous

* clean up event types constant ([#1781](https://github.com/rudderlabs/rudder-transformer/issues/1781)) ([6cb80e0](https://github.com/rudderlabs/rudder-transformer/commit/6cb80e019f898c973a05619cc7c8ef69e8a2de12))
* correct constants names and avoid redundant code ([#1782](https://github.com/rudderlabs/rudder-transformer/issues/1782)) ([b3ab51b](https://github.com/rudderlabs/rudder-transformer/commit/b3ab51b0bbe9357ef7ce10a0d90a4f3780da9e9e))

## [1.11.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.10.0...v1.11.0) (2023-01-10)


### Features

* [impact radius] onboard impact radius cloud mode destination ([#1730](https://github.com/rudderlabs/rudder-transformer/issues/1730)) ([8d55c24](https://github.com/rudderlabs/rudder-transformer/commit/8d55c24930e45ddb0a38d1e2ca935b11d8fac665))
* appcenter updated to support test events ([#1741](https://github.com/rudderlabs/rudder-transformer/issues/1741)) ([00648da](https://github.com/rudderlabs/rudder-transformer/commit/00648da21286cf4170e395e601dcd4b7d199957f))
* **braze:** nested array ops ([#1753](https://github.com/rudderlabs/rudder-transformer/issues/1753)) ([0658a5f](https://github.com/rudderlabs/rudder-transformer/commit/0658a5f323a7b076a88fcb987f2ac25ea803552f))
* clientId support added for ga4 hybrid mode ([#1759](https://github.com/rudderlabs/rudder-transformer/issues/1759)) ([04638cb](https://github.com/rudderlabs/rudder-transformer/commit/04638cb1550c05435a12d8ed481fd55c13e667da))
* **destination:** onboard discord ([#1725](https://github.com/rudderlabs/rudder-transformer/issues/1725)) ([4f6323b](https://github.com/rudderlabs/rudder-transformer/commit/4f6323bcb5e13fb70fd0fd879c64917d46120a34))
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
* user deletion handlers implementation across destinations ([#1748](https://github.com/rudderlabs/rudder-transformer/issues/1748)) ([786cfe0](https://github.com/rudderlabs/rudder-transformer/commit/786cfe0d0849d68a511c920d6c292ef3f73aee7f))
* **zendesk:** remove endpoint global variable ([#1746](https://github.com/rudderlabs/rudder-transformer/issues/1746)) ([836c37e](https://github.com/rudderlabs/rudder-transformer/commit/836c37eb069ee88d24806e692ec70e0d0b045ae1))


### Miscellaneous

* add issue templates ([#1758](https://github.com/rudderlabs/rudder-transformer/issues/1758)) ([6383171](https://github.com/rudderlabs/rudder-transformer/commit/638317167e72a58873606189509524de67f1ae49))
* **deps:** use latest npm dependencies to fix vulnerabilities ([#1762](https://github.com/rudderlabs/rudder-transformer/issues/1762)) ([e497bc4](https://github.com/rudderlabs/rudder-transformer/commit/e497bc4ed9d502a0dc201e091011de54c86f79f3))
* empty commit to trigger build ([d06f69e](https://github.com/rudderlabs/rudder-transformer/commit/d06f69ef33b23599dc49669cbf174e8b71bf0415))
* **transformation:** add watchdog configuration on openfaas functions ([#1766](https://github.com/rudderlabs/rudder-transformer/issues/1766)) ([8d3c34e](https://github.com/rudderlabs/rudder-transformer/commit/8d3c34ed34fd4b8b339285a5e141cd563f8ebd2e))

## [1.10.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.9.1...v1.10.0) (2022-12-20)


### Features

* introduce new tags and error classes ([#1631](https://github.com/rudderlabs/rudder-transformer/issues/1631)) ([0615a31](https://github.com/rudderlabs/rudder-transformer/commit/0615a3196d4203f6f648a4e04ca84e7ede405895))


### Bug Fixes

* minor issues ([#1711](https://github.com/rudderlabs/rudder-transformer/issues/1711)) ([fdea0bd](https://github.com/rudderlabs/rudder-transformer/commit/fdea0bd74529d7f4625885a594eea9fa20a0f20a))

## [1.9.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.9.0...v1.9.1) (2022-12-16)


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


### Miscellaneous

* **ci:** add master build action ([#1643](https://github.com/rudderlabs/rudder-transformer/issues/1643)) ([62ef556](https://github.com/rudderlabs/rudder-transformer/commit/62ef556c03f085ba26529fa77bbeecc6c3ac1010))
* **ci:** fix the buildspec file for helm chart changes ([#1701](https://github.com/rudderlabs/rudder-transformer/issues/1701)) ([d2714a5](https://github.com/rudderlabs/rudder-transformer/commit/d2714a52d3f5c994a7315bf0a80ca07fcd025617))
* optimize performance using new json template features ([#1635](https://github.com/rudderlabs/rudder-transformer/issues/1635)) ([23ce982](https://github.com/rudderlabs/rudder-transformer/commit/23ce982f2756c62d009250aba3cafc87f4b63b67))
* reorganize files to follow popular convention ([#1620](https://github.com/rudderlabs/rudder-transformer/issues/1620)) ([63d75bb](https://github.com/rudderlabs/rudder-transformer/commit/63d75bbe2aea1ae151661b479c331b0a9b771650))
* revamp npm scripts ([#1663](https://github.com/rudderlabs/rudder-transformer/issues/1663)) ([46a7dbf](https://github.com/rudderlabs/rudder-transformer/commit/46a7dbf96d8809517e52e8eab8abd89cc3acee0e))
* suppress cdk v2 comparision logs ([#1694](https://github.com/rudderlabs/rudder-transformer/issues/1694)) ([38b09ca](https://github.com/rudderlabs/rudder-transformer/commit/38b09ca9518296d7e759e1894e3688d687de9ac0))
* **trackingplan:** added tests with no track or global config ([#1646](https://github.com/rudderlabs/rudder-transformer/issues/1646)) ([60d5be5](https://github.com/rudderlabs/rudder-transformer/commit/60d5be5d0252fa30727a3158f6c8bc22d56dce42))

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

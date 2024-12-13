# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.86.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.85.1...v1.86.0) (2024-12-09)


### Features

* add support for getting anonymousId by note attributes array ([53d2bef](https://github.com/rudderlabs/rudder-transformer/commit/53d2bef38ad5d7bc5504111ec797b3c3973546dd))
* add support for getting anonymousId by note attributes array ([#3893](https://github.com/rudderlabs/rudder-transformer/issues/3893)) ([d7f390c](https://github.com/rudderlabs/rudder-transformer/commit/d7f390cb471e44afb276484b8b804d1f257c539c))


### Bug Fixes

* braze subscription group fixes ([#3901](https://github.com/rudderlabs/rudder-transformer/issues/3901)) ([ebcf84e](https://github.com/rudderlabs/rudder-transformer/commit/ebcf84e07bf121d882c99df973af265a915a1ce1))
* remove redundant ids and userIdentifier when gbraid or wbraid are there ([#3910](https://github.com/rudderlabs/rudder-transformer/issues/3910)) ([313710c](https://github.com/rudderlabs/rudder-transformer/commit/313710ca725538e5ffe357216d9c88e444f995c8))
* skipping users events for snowpipe streaming ([#3836](https://github.com/rudderlabs/rudder-transformer/issues/3836)) ([12621c8](https://github.com/rudderlabs/rudder-transformer/commit/12621c8eee641f5a03a997e95ed016cff0eefde7))

### [1.85.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.85.0...v1.85.1) (2024-11-21)


### Bug Fixes

* braze subscription batch size ([#3897](https://github.com/rudderlabs/rudder-transformer/issues/3897)) ([ca71a31](https://github.com/rudderlabs/rudder-transformer/commit/ca71a318e4d8d098116fe539964b699254f58617))
* stringifying session ID for airship ([#3896](https://github.com/rudderlabs/rudder-transformer/issues/3896)) ([bb0b9dc](https://github.com/rudderlabs/rudder-transformer/commit/bb0b9dc1e5a56e8141c6cb56e89835ba61ee7761))

## [1.85.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.84.0...v1.85.0) (2024-11-18)


### Features

* added support to eu/us2 datacenter for gainsight px destination ([#3871](https://github.com/rudderlabs/rudder-transformer/issues/3871)) ([12ac3de](https://github.com/rudderlabs/rudder-transformer/commit/12ac3de6e7cc91a6cd52c33bc342f74bbaa8a631))
* iterable EUDC ([#3828](https://github.com/rudderlabs/rudder-transformer/issues/3828)) ([1c134f8](https://github.com/rudderlabs/rudder-transformer/commit/1c134f84601aaea78581078137cb9955de576f9e))
* iterable EUDC deleteUsers ([#3881](https://github.com/rudderlabs/rudder-transformer/issues/3881)) ([becb4fa](https://github.com/rudderlabs/rudder-transformer/commit/becb4fa54e9093ed69779f54c36864cb9d28d321))
* moved userSchema to connection config in GARL vdmv2 ([#3870](https://github.com/rudderlabs/rudder-transformer/issues/3870)) ([640a11e](https://github.com/rudderlabs/rudder-transformer/commit/640a11eb3dca5735fed3ad9ad5bd058974b069d6))
* now getting consent related fields from connection config from retl for GARL ([#3877](https://github.com/rudderlabs/rudder-transformer/issues/3877)) ([51bbc02](https://github.com/rudderlabs/rudder-transformer/commit/51bbc02d5b00ce1b8fe8c91b4a7041e926bae9bd))
* onboard linkedin audience destination ([#3857](https://github.com/rudderlabs/rudder-transformer/issues/3857)) ([f3ff409](https://github.com/rudderlabs/rudder-transformer/commit/f3ff4092d455508dd3354ffb22d345fa97f4d1f2))
* onboarding intercom v2 retl support ([#3843](https://github.com/rudderlabs/rudder-transformer/issues/3843)) ([3d7db73](https://github.com/rudderlabs/rudder-transformer/commit/3d7db7366e30df31c37cc473e344da82b49ed885))
* sources v2 spec support along with adapters ([04c0694](https://github.com/rudderlabs/rudder-transformer/commit/04c069486bdd3c101906fa6c621e983090fcab25))
* sources v2 spec support along with adapters ([#3810](https://github.com/rudderlabs/rudder-transformer/issues/3810)) ([c51cfbb](https://github.com/rudderlabs/rudder-transformer/commit/c51cfbb4664a8531dce23b2d06fe40997f95697e))
* update pinterest_tag single product events with new mapping ([#3858](https://github.com/rudderlabs/rudder-transformer/issues/3858)) ([8520278](https://github.com/rudderlabs/rudder-transformer/commit/85202781de3464bd46fe910159d2b143cd4209e8))


### Bug Fixes

* adding logger for undefined source event ([#3879](https://github.com/rudderlabs/rudder-transformer/issues/3879)) ([79e5979](https://github.com/rudderlabs/rudder-transformer/commit/79e597907eee126b4187e4534b2aa2253d1431da))
* adding uuid transformation for airship ([#3884](https://github.com/rudderlabs/rudder-transformer/issues/3884)) ([a80f874](https://github.com/rudderlabs/rudder-transformer/commit/a80f87486dc93b423e4fe6efbee6f4cb8330ba02))
* handling invalid timestamp for adjust source ([#3866](https://github.com/rudderlabs/rudder-transformer/issues/3866)) ([d57f48e](https://github.com/rudderlabs/rudder-transformer/commit/d57f48e989d18d469bea0de94293bc685300945b))
* revert gaec changes ([#3885](https://github.com/rudderlabs/rudder-transformer/issues/3885)) ([0aeaa39](https://github.com/rudderlabs/rudder-transformer/commit/0aeaa391b025fc68de6e3d63a6721f067c5be318))

## [1.84.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.83.2...v1.84.0) (2024-11-11)


### Features

* gaec migration ([#3855](https://github.com/rudderlabs/rudder-transformer/issues/3855)) ([7a26459](https://github.com/rudderlabs/rudder-transformer/commit/7a264590b61d3d31d5559c8ac53fd572b40cddec))
* **GARL:** support vdm next for GARL ([#3835](https://github.com/rudderlabs/rudder-transformer/issues/3835)) ([f4b38eb](https://github.com/rudderlabs/rudder-transformer/commit/f4b38eba3ca8dff602915853fda5cd7ca284bba3))
* update on twitter_ads ([#3856](https://github.com/rudderlabs/rudder-transformer/issues/3856)) ([adc8976](https://github.com/rudderlabs/rudder-transformer/commit/adc8976990fa98c5b874472aee180cadfabb0088))


### Bug Fixes

* adding throttled status code for server unavailable error in salesforce ([#3862](https://github.com/rudderlabs/rudder-transformer/issues/3862)) ([fa93f09](https://github.com/rudderlabs/rudder-transformer/commit/fa93f0917d4f75fc197a6ea4c574d37faa0a3f77))
* linkedin ads conversionValue object as well as price is not mandatory ([#3860](https://github.com/rudderlabs/rudder-transformer/issues/3860)) ([bfd7edc](https://github.com/rudderlabs/rudder-transformer/commit/bfd7edc5608c60a39644a1d4ad6e15e5dbcbea0e))
* marketo bulk upload handle special chars ([#3859](https://github.com/rudderlabs/rudder-transformer/issues/3859)) ([f959a7d](https://github.com/rudderlabs/rudder-transformer/commit/f959a7dc2487dc7e36377f5f2e265014f692f476))
* unsafe property getting set via set value library ([#3853](https://github.com/rudderlabs/rudder-transformer/issues/3853)) ([80d7b41](https://github.com/rudderlabs/rudder-transformer/commit/80d7b417be7a0e459de49caca25aba43ffdba337))

### [1.83.2](https://github.com/rudderlabs/rudder-transformer/compare/v1.83.1...v1.83.2) (2024-11-05)


### Bug Fixes

* update gaec destination with config validation ([#3847](https://github.com/rudderlabs/rudder-transformer/issues/3847)) ([e5c5b0a](https://github.com/rudderlabs/rudder-transformer/commit/e5c5b0a28070ff5ca89a274c3998b96780139149))

### [1.83.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.83.0...v1.83.1) (2024-11-01)

## [1.83.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.82.2...v1.83.0) (2024-10-25)


### Features

* add support for identity stitching for shopify pixel flow ([#3818](https://github.com/rudderlabs/rudder-transformer/issues/3818)) ([3a09181](https://github.com/rudderlabs/rudder-transformer/commit/3a091810bff12ae893c16b514c07d17e6374062a))
* onboard tune destination ([#3795](https://github.com/rudderlabs/rudder-transformer/issues/3795)) ([741f0c6](https://github.com/rudderlabs/rudder-transformer/commit/741f0c6d6714cf760ce98cc9354b61f7b5ce4684))
* snowpipe streaming ([#3740](https://github.com/rudderlabs/rudder-transformer/issues/3740)) ([21b1039](https://github.com/rudderlabs/rudder-transformer/commit/21b1039c26067b4896a15adf8b10a044e69cb495))
* support for multiple zap urls ([#3825](https://github.com/rudderlabs/rudder-transformer/issues/3825)) ([f79dfe7](https://github.com/rudderlabs/rudder-transformer/commit/f79dfe74b447b8ccd80287e143ff771688c510be))


### Bug Fixes

* add missing field for pinterest_tag single product events ([f781a84](https://github.com/rudderlabs/rudder-transformer/commit/f781a84ade98649d68cebf4da13c2ceff8df2df2))
* add missing field for pinterest_tag single product events ([#3826](https://github.com/rudderlabs/rudder-transformer/issues/3826)) ([4a63277](https://github.com/rudderlabs/rudder-transformer/commit/4a63277efd0b4357d8321618640d1a0ba2a47d71))
* heap userId extraction ([#3801](https://github.com/rudderlabs/rudder-transformer/issues/3801)) ([e578413](https://github.com/rudderlabs/rudder-transformer/commit/e57841396ad666d716e195fbd4e9b74a63bf5191))
* not allowing empty string or null values for mandatory fields in zoho ([#3800](https://github.com/rudderlabs/rudder-transformer/issues/3800)) ([fcd8d99](https://github.com/rudderlabs/rudder-transformer/commit/fcd8d997fe815d61d21ffff235b0799e69b7ded9))
* populate source destination info env set properly ([#3806](https://github.com/rudderlabs/rudder-transformer/issues/3806)) ([d730daf](https://github.com/rudderlabs/rudder-transformer/commit/d730dafbbd2de30b67c35db8ca05396a98a8d2e0))
* str replace is not a function error ([#3799](https://github.com/rudderlabs/rudder-transformer/issues/3799)) ([8f18e1a](https://github.com/rudderlabs/rudder-transformer/commit/8f18e1aca70ab68e3f157a4632d63ae7cec0e87b))
* update order_id in checkout events, messageId in pixel events ([#3794](https://github.com/rudderlabs/rudder-transformer/issues/3794)) ([427be71](https://github.com/rudderlabs/rudder-transformer/commit/427be71a91df8495f81b42d2b58aa490db439b23))

### [1.82.2](https://github.com/rudderlabs/rudder-transformer/compare/v1.82.1...v1.82.2) (2024-10-18)


### Bug Fixes

* add missing fields to pinterest_tag mapping ([#3814](https://github.com/rudderlabs/rudder-transformer/issues/3814)) ([88c6175](https://github.com/rudderlabs/rudder-transformer/commit/88c6175391cf4575a57936aced898465ad78b55e))

### [1.82.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.82.0...v1.82.1) (2024-10-16)


### Bug Fixes

* heap userId extraction ([fa620e0](https://github.com/rudderlabs/rudder-transformer/commit/fa620e00db13b7bcdc599cb99966395cfbe53f96))

## [1.82.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.81.0...v1.82.0) (2024-10-09)


### Features

* onboard Amazon Audience ([#3727](https://github.com/rudderlabs/rudder-transformer/issues/3727)) ([5ac8186](https://github.com/rudderlabs/rudder-transformer/commit/5ac81860c51f9971343df8c61bfd0b2de8161735))
* onboard intercom v2 destination ([#3721](https://github.com/rudderlabs/rudder-transformer/issues/3721)) ([f8cde8c](https://github.com/rudderlabs/rudder-transformer/commit/f8cde8c072eb9415368fb97f53a3070027a3943b))


### Bug Fixes

* add list of the props, which need to be placed at the root ([#3777](https://github.com/rudderlabs/rudder-transformer/issues/3777)) ([b357dd4](https://github.com/rudderlabs/rudder-transformer/commit/b357dd4e8a49ed66576f731a6aac84da55397475))
* rakuten amount value rounded up to nearest integer ([#3784](https://github.com/rudderlabs/rudder-transformer/issues/3784)) ([f3046f0](https://github.com/rudderlabs/rudder-transformer/commit/f3046f0ae37c113c1239d988d056fc204f2776a0))
* webhook proc workflow object assign bug ([#3775](https://github.com/rudderlabs/rudder-transformer/issues/3775)) ([de8e503](https://github.com/rudderlabs/rudder-transformer/commit/de8e503524c1e8e3320f7458c66b8581f121b9bb))

## [1.81.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.79.1...v1.81.0) (2024-10-04)


### Features

* add unity source support in Singular ([#3634](https://github.com/rudderlabs/rudder-transformer/issues/3634)) ([12996d7](https://github.com/rudderlabs/rudder-transformer/commit/12996d7a7ce23de7c150c1c1e012d4dda8668977))
* onboard shopify to v1 ([#3665](https://github.com/rudderlabs/rudder-transformer/issues/3665)) ([d40e772](https://github.com/rudderlabs/rudder-transformer/commit/d40e772f1a3741c1c4e9ab2365ed464b3988812e))


### Bug Fixes

* add correct validation for purchase events ([#3766](https://github.com/rudderlabs/rudder-transformer/issues/3766)) ([9cc72f2](https://github.com/rudderlabs/rudder-transformer/commit/9cc72f2288f99ee394977ffeb209faaae657f6d2))
* braze include fields_to_export to lookup users ([#3761](https://github.com/rudderlabs/rudder-transformer/issues/3761)) ([173b989](https://github.com/rudderlabs/rudder-transformer/commit/173b9895fb2a0bed615f6e3a9c670abe42d5754f))
* correct typo for order fulfillment event, add test ([#3764](https://github.com/rudderlabs/rudder-transformer/issues/3764)) ([6f92bd3](https://github.com/rudderlabs/rudder-transformer/commit/6f92bd31b60caaa07d18bb86ce5939cd7cc9a416))
* fixing lytics user_id and anonymousId mapping ([#3745](https://github.com/rudderlabs/rudder-transformer/issues/3745)) ([45b1067](https://github.com/rudderlabs/rudder-transformer/commit/45b1067d81f3883e19d35634ffec52434fef452f))
* npm start command to include exec ([9f5140b](https://github.com/rudderlabs/rudder-transformer/commit/9f5140b194384295c0a56147fed16273b2b7805b))
* payment info entered event in facebook_conversions ([#3762](https://github.com/rudderlabs/rudder-transformer/issues/3762)) ([7fa7c8d](https://github.com/rudderlabs/rudder-transformer/commit/7fa7c8d3a4f6aefb580cf0de2e64e2f8aef5b5ce))
* posthog alias mapping swap ([#3765](https://github.com/rudderlabs/rudder-transformer/issues/3765)) ([b6240d0](https://github.com/rudderlabs/rudder-transformer/commit/b6240d06a9d1f7f3bc8f245807f72a72ab40f170)), closes [#3507](https://github.com/rudderlabs/rudder-transformer/issues/3507)

## [1.80.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.79.1...v1.80.0) (2024-09-30)


### Features

* add unity source support in Singular ([#3634](https://github.com/rudderlabs/rudder-transformer/issues/3634)) ([12996d7](https://github.com/rudderlabs/rudder-transformer/commit/12996d7a7ce23de7c150c1c1e012d4dda8668977))
* onboard shopify to v1 ([#3665](https://github.com/rudderlabs/rudder-transformer/issues/3665)) ([d40e772](https://github.com/rudderlabs/rudder-transformer/commit/d40e772f1a3741c1c4e9ab2365ed464b3988812e))


### Bug Fixes

* add correct validation for purchase events ([#3766](https://github.com/rudderlabs/rudder-transformer/issues/3766)) ([9cc72f2](https://github.com/rudderlabs/rudder-transformer/commit/9cc72f2288f99ee394977ffeb209faaae657f6d2))
* braze include fields_to_export to lookup users ([#3761](https://github.com/rudderlabs/rudder-transformer/issues/3761)) ([173b989](https://github.com/rudderlabs/rudder-transformer/commit/173b9895fb2a0bed615f6e3a9c670abe42d5754f))
* correct typo for order fulfillment event, add test ([#3764](https://github.com/rudderlabs/rudder-transformer/issues/3764)) ([6f92bd3](https://github.com/rudderlabs/rudder-transformer/commit/6f92bd31b60caaa07d18bb86ce5939cd7cc9a416))
* fixing lytics user_id and anonymousId mapping ([#3745](https://github.com/rudderlabs/rudder-transformer/issues/3745)) ([45b1067](https://github.com/rudderlabs/rudder-transformer/commit/45b1067d81f3883e19d35634ffec52434fef452f))
* payment info entered event in facebook_conversions ([#3762](https://github.com/rudderlabs/rudder-transformer/issues/3762)) ([7fa7c8d](https://github.com/rudderlabs/rudder-transformer/commit/7fa7c8d3a4f6aefb580cf0de2e64e2f8aef5b5ce))
* posthog alias mapping swap ([#3765](https://github.com/rudderlabs/rudder-transformer/issues/3765)) ([b6240d0](https://github.com/rudderlabs/rudder-transformer/commit/b6240d06a9d1f7f3bc8f245807f72a72ab40f170)), closes [#3507](https://github.com/rudderlabs/rudder-transformer/issues/3507)

### [1.79.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.79.0...v1.79.1) (2024-09-24)


### Bug Fixes

* allow users context traits and underscore divide numbers configuration ([#3752](https://github.com/rudderlabs/rudder-transformer/issues/3752)) ([386d2ab](https://github.com/rudderlabs/rudder-transformer/commit/386d2ab88c0fe72dc47ba119be08ad1c0cd6d51b))
* populate users fields for sentAt, timestamp and originalTimestamp ([#3753](https://github.com/rudderlabs/rudder-transformer/issues/3753)) ([f50effe](https://github.com/rudderlabs/rudder-transformer/commit/f50effeeabdb888f82451c225a80971dbe6532b6))
* prefer event check vs config check for vdm ([#3754](https://github.com/rudderlabs/rudder-transformer/issues/3754)) ([b2c1a18](https://github.com/rudderlabs/rudder-transformer/commit/b2c1a1893dfb957ac7a24c000b33cd254ef54b6c))
* support different lookup fields and custom_attributes for rETL events  ([#3751](https://github.com/rudderlabs/rudder-transformer/issues/3751)) ([10d914e](https://github.com/rudderlabs/rudder-transformer/commit/10d914e25203bd6ae95801c2a98c17690bd2d6ef))

## [1.79.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.78.0...v1.79.0) (2024-09-20)


### Features

* add support for vdm next to fb custom audiences ([#3729](https://github.com/rudderlabs/rudder-transformer/issues/3729)) ([f33f525](https://github.com/rudderlabs/rudder-transformer/commit/f33f52503679be9271751aaa2fdca0661fed62e9))


### Bug Fixes

* use destination definition name in place of string for custom object ([#3746](https://github.com/rudderlabs/rudder-transformer/issues/3746)) ([27040b0](https://github.com/rudderlabs/rudder-transformer/commit/27040b06276c2bd1c1a6bd535172b50848a97261))

## [1.78.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.77.1...v1.78.0) (2024-09-16)


### Features

* add source id isolation for reverse etl ([#3496](https://github.com/rudderlabs/rudder-transformer/issues/3496)) ([b4f4dd1](https://github.com/rudderlabs/rudder-transformer/commit/b4f4dd1c43f8fd4b4f744413d79cfe8f5f77708b))
* add util for applying json string template ([#3699](https://github.com/rudderlabs/rudder-transformer/issues/3699)) ([b2f5654](https://github.com/rudderlabs/rudder-transformer/commit/b2f56540148066a40770e1506faadb4f3f5a296b))
* onboard X(Twiiter) Audience ([#3696](https://github.com/rudderlabs/rudder-transformer/issues/3696)) ([f77d2ab](https://github.com/rudderlabs/rudder-transformer/commit/f77d2ab4125a1a44bba95bebbee25bb4fac032da))
* webhook v2 path variables support ([#3705](https://github.com/rudderlabs/rudder-transformer/issues/3705)) ([f7783d8](https://github.com/rudderlabs/rudder-transformer/commit/f7783d8fb30093a847f450ee7ddd9449f272b112))


### Bug Fixes

* added support for window stabilization fix through envs ([#3720](https://github.com/rudderlabs/rudder-transformer/issues/3720)) ([8dcf1b3](https://github.com/rudderlabs/rudder-transformer/commit/8dcf1b3c5aff424d39bece8c9912ec4a1eb221ea))
* circular json bugsnag ([#3713](https://github.com/rudderlabs/rudder-transformer/issues/3713)) ([263d075](https://github.com/rudderlabs/rudder-transformer/commit/263d0758be828402068278c7c5356b65119e7e9a))
* error messages in gaec ([#3702](https://github.com/rudderlabs/rudder-transformer/issues/3702)) ([441fb57](https://github.com/rudderlabs/rudder-transformer/commit/441fb57a537592cc1cc45dc8f31fa8be98e18320))
* gaoc bugsnag alert for email.trim ([#3693](https://github.com/rudderlabs/rudder-transformer/issues/3693)) ([6ba16f6](https://github.com/rudderlabs/rudder-transformer/commit/6ba16f6e5d9bb0de773ebcb8be13a78af325a4a1))

### [1.77.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.77.0...v1.77.1) (2024-09-05)


### Bug Fixes

* add namespace and cluster labels to python transformation functions ([255f3e5](https://github.com/rudderlabs/rudder-transformer/commit/255f3e52fb66ae6cb55e24938fff60ec6e28b285))

## [1.77.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.76.1...v1.77.0) (2024-09-02)


### Features

* add support for customerio source email subscribed event ([#3679](https://github.com/rudderlabs/rudder-transformer/issues/3679)) ([4cb2799](https://github.com/rudderlabs/rudder-transformer/commit/4cb27998f2c1e2a2a7b535666a54621fd1d43ef0))
* add support for headers to source transformation flows ([#3683](https://github.com/rudderlabs/rudder-transformer/issues/3683)) ([f8cd6bd](https://github.com/rudderlabs/rudder-transformer/commit/f8cd6bda158654501555554ac0d284af8ba058fd))
* include source attribute for identify messages for koala ([#3667](https://github.com/rudderlabs/rudder-transformer/issues/3667)) ([b1d0d08](https://github.com/rudderlabs/rudder-transformer/commit/b1d0d08b91273fd3b8fa2e87381c5ae090e1cb21)), closes [#3603](https://github.com/rudderlabs/rudder-transformer/issues/3603)
* webhook v2 ([#3651](https://github.com/rudderlabs/rudder-transformer/issues/3651)) ([e21ebd0](https://github.com/rudderlabs/rudder-transformer/commit/e21ebd0085aadfe61cb6442da6689e32be33f52f))


### Bug Fixes

* adding a new condition for retrying the function creation in python transformation ([#3684](https://github.com/rudderlabs/rudder-transformer/issues/3684)) ([9fb463e](https://github.com/rudderlabs/rudder-transformer/commit/9fb463e7661c225077b11a0196b3190c15741058))
* handle trade desk null, undefined fields ([#3661](https://github.com/rudderlabs/rudder-transformer/issues/3661)) ([2d8b315](https://github.com/rudderlabs/rudder-transformer/commit/2d8b315a5f2e681bc256128032e4ee066f9177fc))
* klaviyo jobs order ([#3686](https://github.com/rudderlabs/rudder-transformer/issues/3686)) ([26926c4](https://github.com/rudderlabs/rudder-transformer/commit/26926c40fcbf4c146a37ac16c2cc7280e110a6e6))
* login using docker creds on the node to allow to pull the desired image ([#3682](https://github.com/rudderlabs/rudder-transformer/issues/3682)) ([fc6bcf7](https://github.com/rudderlabs/rudder-transformer/commit/fc6bcf7eda690d82cfe2d381753948058efbcd3d))
* npm vulnerabilities ([c305974](https://github.com/rudderlabs/rudder-transformer/commit/c3059746f25677eae739468c3a4b7496aa82f4da))
* npm vulnerabilities ([#3695](https://github.com/rudderlabs/rudder-transformer/issues/3695)) ([494df08](https://github.com/rudderlabs/rudder-transformer/commit/494df08bc992632ebc405c88a3f23ed5e1262553))

### [1.76.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.76.0...v1.76.1) (2024-08-29)


### Bug Fixes

* reddit authorisation failed case handling ([#3690](https://github.com/rudderlabs/rudder-transformer/issues/3690)) ([f24759a](https://github.com/rudderlabs/rudder-transformer/commit/f24759aebbeb560f0de9d4920ae2ed0cdc7bfa3f))

## [1.76.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.75.1...v1.76.0) (2024-08-20)


### Features

* klaviyo onboard unsubscribe profile support ([#3646](https://github.com/rudderlabs/rudder-transformer/issues/3646)) ([474f2bd](https://github.com/rudderlabs/rudder-transformer/commit/474f2bddc58e1962206e39d92514827f29f84c83))
* onboard sfmc with vdm for rETL ([#3655](https://github.com/rudderlabs/rudder-transformer/issues/3655)) ([d987d1f](https://github.com/rudderlabs/rudder-transformer/commit/d987d1fc9afb9e1dc7482b2fe1458573f0f2699e))
* onboard smartly destination ([#3660](https://github.com/rudderlabs/rudder-transformer/issues/3660)) ([474a36e](https://github.com/rudderlabs/rudder-transformer/commit/474a36ec385abf9ff83596b062d4d8e4c24469b8))
* add bloomreach retl support ([#3619](https://github.com/rudderlabs/rudder-transformer/issues/3619)) ([6b1a23a](https://github.com/rudderlabs/rudder-transformer/commit/6b1a23af845084d6f2f5fd14656e4a1d11a7e34b))


### Bug Fixes

* add alias support in case alias details are present  ([#3579](https://github.com/rudderlabs/rudder-transformer/issues/3579)) ([cb67262](https://github.com/rudderlabs/rudder-transformer/commit/cb672628b312f20ea0fcc27a60ec8ab5692f8b06))
* attentive tag bugsnag issue ([#3663](https://github.com/rudderlabs/rudder-transformer/issues/3663)) ([866dbf3](https://github.com/rudderlabs/rudder-transformer/commit/866dbf3e81754e71ff8ac08b258b359ec5cc6889))
* fixing facebook utils ([#3664](https://github.com/rudderlabs/rudder-transformer/issues/3664)) ([1a61675](https://github.com/rudderlabs/rudder-transformer/commit/1a6167584a5780ab50beda13cc5ef6bf4e283e38))
* reserved properties for braze ([#3573](https://github.com/rudderlabs/rudder-transformer/issues/3573)) ([413e9ce](https://github.com/rudderlabs/rudder-transformer/commit/413e9ce56f8f6569bbeb188bff4f43d400ea71b1))
* source transformation integration test generation ([#3645](https://github.com/rudderlabs/rudder-transformer/issues/3645)) ([23196ec](https://github.com/rudderlabs/rudder-transformer/commit/23196ec42acf35f314e1953f339f6acbb72edd70))

### [1.75.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.75.0...v1.75.1) (2024-08-14)


### Bug Fixes

* add validation for concurrent_modification error ([#3654](https://github.com/rudderlabs/rudder-transformer/issues/3654)) ([62cdc46](https://github.com/rudderlabs/rudder-transformer/commit/62cdc4641d44d79e21949722660173df4c749f24))
* clevertap bugsnag issue ([#3656](https://github.com/rudderlabs/rudder-transformer/issues/3656)) ([6c51487](https://github.com/rudderlabs/rudder-transformer/commit/6c51487183b6b0b755620aac6cd51c2ffc966102))
* snapchat conversion bugsnag issue ([#3657](https://github.com/rudderlabs/rudder-transformer/issues/3657)) ([31b03fc](https://github.com/rudderlabs/rudder-transformer/commit/31b03fc022ace0cda8df798c50e4764a9703c23b))
* validation for iterable object of HS ([#3653](https://github.com/rudderlabs/rudder-transformer/issues/3653)) ([1cb3f86](https://github.com/rudderlabs/rudder-transformer/commit/1cb3f86c894f30bdf04df870484c6df3a956f36e))

## [1.75.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.74.1...v1.75.0) (2024-08-12)


### Features

* move hubspot to transformer proxy to enable partial batch handling ([#3308](https://github.com/rudderlabs/rudder-transformer/issues/3308)) ([8450021](https://github.com/rudderlabs/rudder-transformer/commit/8450021672c51ac798ec0aeab422f5fceea5e53e))


### Bug Fixes

* handle attentive tag null, undefined properties ([#3647](https://github.com/rudderlabs/rudder-transformer/issues/3647)) ([9327925](https://github.com/rudderlabs/rudder-transformer/commit/932792561c98833baf9881a83ee36ae5000e37b4))
* handle null values for braze dedupe ([#3638](https://github.com/rudderlabs/rudder-transformer/issues/3638)) ([0a9b681](https://github.com/rudderlabs/rudder-transformer/commit/0a9b68118241158623d45ee28896377296bafd91))

### [1.74.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.74.0...v1.74.1) (2024-08-08)


### Bug Fixes

* sendgrid read root traits ([#3642](https://github.com/rudderlabs/rudder-transformer/issues/3642)) ([5acad70](https://github.com/rudderlabs/rudder-transformer/commit/5acad707d3125f3d50380d886f5fecb1406836cd))

## [1.74.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.73.1...v1.74.0) (2024-08-05)


### Features

* detach user and company in intercom identify call ([#3580](https://github.com/rudderlabs/rudder-transformer/issues/3580)) ([286c44a](https://github.com/rudderlabs/rudder-transformer/commit/286c44a47e8451486bde281b8c938df59945cdfc))
* onboard new api for klaviyo 15-06-2024 ([#3574](https://github.com/rudderlabs/rudder-transformer/issues/3574)) ([44baab9](https://github.com/rudderlabs/rudder-transformer/commit/44baab9298d171efe1209b3ec360d15e84a4190c))
* supporting device token type using integrations object ([#3620](https://github.com/rudderlabs/rudder-transformer/issues/3620)) ([14e776e](https://github.com/rudderlabs/rudder-transformer/commit/14e776e659b745c814d31cd049fc4051c1e6735d))
* updated examples for swagger ([#3526](https://github.com/rudderlabs/rudder-transformer/issues/3526)) ([5e22fa0](https://github.com/rudderlabs/rudder-transformer/commit/5e22fa0555b98e83ca1b11f16e87f367d1f85ca8))


### Bug Fixes

* customerio page undefined name ([#3613](https://github.com/rudderlabs/rudder-transformer/issues/3613)) ([adc2a4a](https://github.com/rudderlabs/rudder-transformer/commit/adc2a4a6650c9d9add26be51999f5b3078c59f15))
* facebook conversion version upgrade ([#3607](https://github.com/rudderlabs/rudder-transformer/issues/3607)) ([9d06546](https://github.com/rudderlabs/rudder-transformer/commit/9d065467f376a047d1cebb095de0b33be6e32206))
* fb custom audience version upgrade from v18 to v20 ([#3604](https://github.com/rudderlabs/rudder-transformer/issues/3604)) ([c2d7555](https://github.com/rudderlabs/rudder-transformer/commit/c2d7555dcea5e476f276eec5926d392f58dbd7fa))
* fb pixel and fb app events version upgrade ([#3606](https://github.com/rudderlabs/rudder-transformer/issues/3606)) ([7caf476](https://github.com/rudderlabs/rudder-transformer/commit/7caf4762be2c527725a2bdfb090a626d40723c36))
* rakuten for amount list ([#3612](https://github.com/rudderlabs/rudder-transformer/issues/3612)) ([2fb7e6b](https://github.com/rudderlabs/rudder-transformer/commit/2fb7e6b4bc2b7524f6fa86a54596f7c6550fa51a))
* shopify: incorporate new shopify cart token format ([#3626](https://github.com/rudderlabs/rudder-transformer/issues/3626)) ([0d3c042](https://github.com/rudderlabs/rudder-transformer/commit/0d3c0426571f14e88b5b8a703065935713ce8198))

### [1.73.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.73.0...v1.73.1) (2024-08-02)


### Bug Fixes

* update getAuthErrCategory and update error message for garl ([#3629](https://github.com/rudderlabs/rudder-transformer/issues/3629)) ([feadfcf](https://github.com/rudderlabs/rudder-transformer/commit/feadfcf6009ccc9b972634347448ba9428696ebb))

## [1.73.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.72.2...v1.73.0) (2024-07-31)


### Features


### Bug Fixes


### [1.72.4](https://github.com/rudderlabs/rudder-transformer/compare/v1.72.3...v1.72.4) (2024-07-25)


### Bug Fixes

* added support for ga4 v2 hybrid mode ([#3586](https://github.com/rudderlabs/rudder-transformer/issues/3586)) ([dedca07](https://github.com/rudderlabs/rudder-transformer/commit/dedca0796ee12478d57e020ef3c254afabc6e105))

### [1.72.3](https://github.com/rudderlabs/rudder-transformer/compare/v1.72.2...v1.72.3) (2024-07-24)


### Bug Fixes

* add validation for cordial destination ([#3599](https://github.com/rudderlabs/rudder-transformer/issues/3599)) ([b7860a5](https://github.com/rudderlabs/rudder-transformer/commit/b7860a5b2b87fb61aaff8c68a904ac996d63efd3))
* update getConversionActionId function for gaoc ([#3594](https://github.com/rudderlabs/rudder-transformer/issues/3594)) ([68367f5](https://github.com/rudderlabs/rudder-transformer/commit/68367f5227c96f2700a773018b991b1e87a0774d))

### [1.72.2](https://github.com/rudderlabs/rudder-transformer/compare/v1.72.1...v1.72.2) (2024-07-23)

### [1.72.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.72.0...v1.72.1) (2024-07-23)


### Bug Fixes

* garl get auth err category ([#3590](https://github.com/rudderlabs/rudder-transformer/issues/3590)) ([475ebc1](https://github.com/rudderlabs/rudder-transformer/commit/475ebc104c69a52eaa425a9ed564ea9aca1ecd9c))

## [1.72.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.71.3...v1.72.0) (2024-07-22)


### Features

* add support for subscribing for RETL flow ([#3195](https://github.com/rudderlabs/rudder-transformer/issues/3195)) ([cc56004](https://github.com/rudderlabs/rudder-transformer/commit/cc560044ceb769da1f0090da4f690933552b6347))
* braze source event mapping ([#3527](https://github.com/rudderlabs/rudder-transformer/issues/3527)) ([e357141](https://github.com/rudderlabs/rudder-transformer/commit/e357141d22e5296b6d1cda2e763ac24abfcb66e6))
* introduces new user fields in titkok ads ([#3575](https://github.com/rudderlabs/rudder-transformer/issues/3575)) ([6304abb](https://github.com/rudderlabs/rudder-transformer/commit/6304abb2346f331b78e927b73e7c2ca17e94f4cf))
* onboard cordial destination ([#3581](https://github.com/rudderlabs/rudder-transformer/issues/3581)) ([fbcdcd6](https://github.com/rudderlabs/rudder-transformer/commit/fbcdcd609888150efa0da33eec60a4cc7b436d06))
* onboarding new destination zoho ([#3555](https://github.com/rudderlabs/rudder-transformer/issues/3555)) ([20aa7f3](https://github.com/rudderlabs/rudder-transformer/commit/20aa7f35e13ad89e8a43fbbb743df73b0c103975)), closes [#3566](https://github.com/rudderlabs/rudder-transformer/issues/3566)
* update webhook destination to support all datatypes ([#3541](https://github.com/rudderlabs/rudder-transformer/issues/3541)) ([448f574](https://github.com/rudderlabs/rudder-transformer/commit/448f57484c57d4a55147e9566149c8b714a191c9))


### Bug Fixes

* add optional chaining to webengage page event ([#3570](https://github.com/rudderlabs/rudder-transformer/issues/3570)) ([20205d6](https://github.com/rudderlabs/rudder-transformer/commit/20205d66298f5633d3971888f0866db2c38a50e2))
* add validation for type in google pubsub ([#3578](https://github.com/rudderlabs/rudder-transformer/issues/3578)) ([1bef212](https://github.com/rudderlabs/rudder-transformer/commit/1bef2126a75324598c2af0ecaffcf582f038af11))
* adding readiness probe annotations for openfaas ([#3529](https://github.com/rudderlabs/rudder-transformer/issues/3529)) ([2eb92e3](https://github.com/rudderlabs/rudder-transformer/commit/2eb92e3332ef0e8b2f83621fe0130fbc1356fa91))
* **gainsight:** replace myAxios utility with handleHttpRequest utility ([#3241](https://github.com/rudderlabs/rudder-transformer/issues/3241)) ([04be1aa](https://github.com/rudderlabs/rudder-transformer/commit/04be1aaf438f824ddf61fc2f4d13eb7d8a223a9d))
* job ordering for hs ([#3319](https://github.com/rudderlabs/rudder-transformer/issues/3319)) ([f840d54](https://github.com/rudderlabs/rudder-transformer/commit/f840d54dcbdc011eeb716dce74f2ecb36e99d0e9))
* update authErrorCategory for 2 step verification issue for google ads destinations ([#3552](https://github.com/rudderlabs/rudder-transformer/issues/3552)) ([5a0392e](https://github.com/rudderlabs/rudder-transformer/commit/5a0392ee24301486b7973531be28f8178ef03eab))
* update python transformation fn ([#3491](https://github.com/rudderlabs/rudder-transformer/issues/3491)) ([f363f35](https://github.com/rudderlabs/rudder-transformer/commit/f363f3512f690e0745165f46587efdbe88f48683))

### [1.71.3](https://github.com/rudderlabs/rudder-transformer/compare/v1.71.2...v1.71.3) (2024-07-15)


### Bug Fixes

* fix unit test intercom ([9ba33e8](https://github.com/rudderlabs/rudder-transformer/commit/9ba33e83cdb4804559b3851c253683ae4930266d))

### [1.71.2](https://github.com/rudderlabs/rudder-transformer/compare/v1.71.1...v1.71.2) (2024-07-15)


### Bug Fixes

* add user-agent header in api calls ([53710f9](https://github.com/rudderlabs/rudder-transformer/commit/53710f91a94a631861512093a46acf97534eb607))

### [1.71.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.71.0...v1.71.1) (2024-07-10)


### Bug Fixes

* ga4 v2 userproperties ([#3544](https://github.com/rudderlabs/rudder-transformer/issues/3544)) ([bc7b886](https://github.com/rudderlabs/rudder-transformer/commit/bc7b886fd314f35b5b5573989d8f094b7ba0321f))
* tiktok: remove default value for content type for all events ([#3545](https://github.com/rudderlabs/rudder-transformer/issues/3545)) ([0ca08c3](https://github.com/rudderlabs/rudder-transformer/commit/0ca08c3fe8e4d53f92ce16eccd1f60224e1f1409))

## [1.71.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.70.1...v1.71.0) (2024-07-08)


### Features

* onboard new custom destination: wunderkind ([#3456](https://github.com/rudderlabs/rudder-transformer/issues/3456)) ([7f49a01](https://github.com/rudderlabs/rudder-transformer/commit/7f49a01b04322a38c5f96199d21097a9210e80fc))


### Bug Fixes

* zapier event lower case issue ([#3535](https://github.com/rudderlabs/rudder-transformer/issues/3535)) ([277c1f0](https://github.com/rudderlabs/rudder-transformer/commit/277c1f00606b0ec5974e6bf24dae6749a1679069))

### [1.70.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.70.0...v1.70.1) (2024-07-03)

### Bug Fixes

* revert fb pixel change ([769161a](https://github.com/rudderlabs/rudder-transformer/commit/a0026152e4763569dc05693af1639e5a44d47b05))

## [1.70.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.69.1...v1.70.0) (2024-07-01)


### Features

* add support in fb pixel for advertiser_tracking_enabled ([#3025](https://github.com/rudderlabs/rudder-transformer/issues/3025)) ([769161a](https://github.com/rudderlabs/rudder-transformer/commit/769161a54de03fa3d4fe9f5db9ac51c11fa89dac))
* add tags to a company in intercom ([#3434](https://github.com/rudderlabs/rudder-transformer/issues/3434)) ([dc8eae2](https://github.com/rudderlabs/rudder-transformer/commit/dc8eae2e8d87df8bb02cdf2662a6003289599525))
* cm360 enhanced conversions ([#3414](https://github.com/rudderlabs/rudder-transformer/issues/3414)) ([04d0783](https://github.com/rudderlabs/rudder-transformer/commit/04d078310d4b102588f35cf9eb2bc34bf18b23ca))
* garl record event support ([#3403](https://github.com/rudderlabs/rudder-transformer/issues/3403)) ([60fee0e](https://github.com/rudderlabs/rudder-transformer/commit/60fee0e5a442c4f6c773234d88d86b447434de9b))
* **integrations/auth0:** add Auth0 event type to event context ([#3433](https://github.com/rudderlabs/rudder-transformer/issues/3433)) ([d4d5a89](https://github.com/rudderlabs/rudder-transformer/commit/d4d5a89951414f02d02101a6582b6e9fa8f9a7a5))
* onboard closeCRM source ([#3467](https://github.com/rudderlabs/rudder-transformer/issues/3467)) ([bba1a3b](https://github.com/rudderlabs/rudder-transformer/commit/bba1a3b7f09e15f5a59aeed22593751d46960ebb))
* onboard klaviyo bulk upload destination ([#3348](https://github.com/rudderlabs/rudder-transformer/issues/3348)) ([f55c481](https://github.com/rudderlabs/rudder-transformer/commit/f55c4818155cfbbfeda761153b036563e0877329))
* onboarding clicksend destination ([#3486](https://github.com/rudderlabs/rudder-transformer/issues/3486)) ([85c8ea7](https://github.com/rudderlabs/rudder-transformer/commit/85c8ea70d661f3692cd9dc1cef8151a474892408))
* add ability to aggregate metrics in a thread ([#3458](https://github.com/rudderlabs/rudder-transformer/pull/3458)) ([6be9d3e](https://github.com/rudderlabs/rudder-transformer/commit/6be9d3e727520ec01697d78a868d9c1a1e4ea085))


### Bug Fixes

* add missing userid and anonymousid for revenuecat source ([#3485](https://github.com/rudderlabs/rudder-transformer/issues/3485)) ([a08de31](https://github.com/rudderlabs/rudder-transformer/commit/a08de31e5ac5829bc5cca7da8982c9a4156b1ed5))
* adding actual error messgae for default code in facebook destinations ([#3490](https://github.com/rudderlabs/rudder-transformer/issues/3490)) ([dfa0cbd](https://github.com/rudderlabs/rudder-transformer/commit/dfa0cbd3608d22340c9acb5769af4173be4d4bfc))
* credential error handling ([7eb537c](https://github.com/rudderlabs/rudder-transformer/commit/7eb537c91f40ee4802f14a088a249ebed903e7b5))
* credential param ([c280d81](https://github.com/rudderlabs/rudder-transformer/commit/c280d81307a3c5da02f728961d7eeeabb79a7e39))
* credentials payload fix ([e6c5098](https://github.com/rudderlabs/rudder-transformer/commit/e6c50980a12960a419f5c03e120739eea642767a))
* fixes in javascript transformation ([67e9277](https://github.com/rudderlabs/rudder-transformer/commit/67e9277120e39402b32eac55ffa34a0053b6af61))
* lint issues ([136ca64](https://github.com/rudderlabs/rudder-transformer/commit/136ca64b3d8b1949950f98d4431a9670e22810cf))
* mapping changes for aifa,andi and asid ([#3465](https://github.com/rudderlabs/rudder-transformer/issues/3465)) ([a0f5c2f](https://github.com/rudderlabs/rudder-transformer/commit/a0f5c2f7fe2dc8bc983a35840e86655d0f92482b))
* metadata tags capturing in v0 transformation ([#3492](https://github.com/rudderlabs/rudder-transformer/issues/3492)) ([8129a06](https://github.com/rudderlabs/rudder-transformer/commit/8129a06e3a12c9bca17354598849750498c72d2e))
* onboard custom alias support for braze ([#3335](https://github.com/rudderlabs/rudder-transformer/issues/3335)) ([1a01362](https://github.com/rudderlabs/rudder-transformer/commit/1a013627d13e0dc286f55de8925bfbb12d9a462b))
* pr comments ([46cd341](https://github.com/rudderlabs/rudder-transformer/commit/46cd3413af065b76e4f89fb5b2720cbf6213e51b))
* test ([3137964](https://github.com/rudderlabs/rudder-transformer/commit/31379645c33b9dc75cd839849952297fa233f2cb))
* tests names, credentialsMap refactor ([3db810c](https://github.com/rudderlabs/rudder-transformer/commit/3db810c857017318c1979965ce653eca3b3fdadf))
* undefined tests ([819f508](https://github.com/rudderlabs/rudder-transformer/commit/819f508b017f988e302b6e2579cb3da4030dcfa0))
* update access token key for garl destination ([#3522](https://github.com/rudderlabs/rudder-transformer/issues/3522)) ([38946e3](https://github.com/rudderlabs/rudder-transformer/commit/38946e30fbc26896cfbb92124ba4ca8a4b8c431b))

### [1.69.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.69.0...v1.69.1) (2024-06-25)


### Bug Fixes

* enhancement: introduce user model for one signal ([#3499](https://github.com/rudderlabs/rudder-transformer/issues/3499)) ([1c8e950](https://github.com/rudderlabs/rudder-transformer/commit/1c8e950f3d8789b33bba69a30c9eb21c40ce3d04))

## [1.69.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.68.2...v1.69.0) (2024-06-10)


### Features

* add request_ip as fallback for mixpanel group call ([#3421](https://github.com/rudderlabs/rudder-transformer/issues/3421)) ([a73ab75](https://github.com/rudderlabs/rudder-transformer/commit/a73ab75032d753b35cb0e18234dcd7289dd1e644))
* add v3 api support to appsflyer ([#3412](https://github.com/rudderlabs/rudder-transformer/issues/3412)) ([e124470](https://github.com/rudderlabs/rudder-transformer/commit/e124470e82b6aa9934094146d4050af02bb62fff)), closes [#3395](https://github.com/rudderlabs/rudder-transformer/issues/3395) [#3402](https://github.com/rudderlabs/rudder-transformer/issues/3402)
* changes for supporting record event in FB audience ([#3351](https://github.com/rudderlabs/rudder-transformer/issues/3351)) ([ac4a32a](https://github.com/rudderlabs/rudder-transformer/commit/ac4a32ab5e0c7e02a149e81d455666ed24fa01a3))


### Bug Fixes

* allowing traffic type dynamically for split.io ([#3425](https://github.com/rudderlabs/rudder-transformer/issues/3425)) ([3bea186](https://github.com/rudderlabs/rudder-transformer/commit/3bea186e725ec473ad757760355d6cc9670c4f8c))
* bugsnag issue fix for zendesk ([#3439](https://github.com/rudderlabs/rudder-transformer/issues/3439)) ([775e8ee](https://github.com/rudderlabs/rudder-transformer/commit/775e8ee55a62ecddb58ff505302e4aabb8bffe24))

### [1.68.2](https://github.com/rudderlabs/rudder-transformer/compare/v1.68.1...v1.68.2) (2024-06-06)


### Bug Fixes

* **user-transformation:** pass tf id in common metadata ([d2b0779](https://github.com/rudderlabs/rudder-transformer/commit/d2b0779d3a0145c0088903edfe328c1c7554cbd2))

### [1.68.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.68.0...v1.68.1) (2024-05-29)


### Bug Fixes

* tiktok_v2 assigning value to undefined properties ([#3426](https://github.com/rudderlabs/rudder-transformer/issues/3426)) ([323396b](https://github.com/rudderlabs/rudder-transformer/commit/323396b09fd6b7fda3cce53cc4f1cc443d7a78c1))

## [1.68.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.67.0...v1.68.0) (2024-05-27)


### Features

* add json-data type support in redis ([#3336](https://github.com/rudderlabs/rudder-transformer/issues/3336)) ([0196f20](https://github.com/rudderlabs/rudder-transformer/commit/0196f20cc79e1f470d96a649dd9404c3c9284329))
* facebook custom audience app secret support ([#3357](https://github.com/rudderlabs/rudder-transformer/issues/3357)) ([fce4ef9](https://github.com/rudderlabs/rudder-transformer/commit/fce4ef973500411c7ad812e7949bb1b73dabc3ba))
* filtering unknown events in awin ([#3392](https://github.com/rudderlabs/rudder-transformer/issues/3392)) ([d842da8](https://github.com/rudderlabs/rudder-transformer/commit/d842da87a34cb63023eba288e0c5258e29997dcf))
* **ga4:** component test refactor ([#3220](https://github.com/rudderlabs/rudder-transformer/issues/3220)) ([3ff9a5e](https://github.com/rudderlabs/rudder-transformer/commit/3ff9a5e8e955b929a1b04a89dcf0ccbc49e18648))
* **integrations/auth0:** include Auth0 event type in Rudderstack message ([#3370](https://github.com/rudderlabs/rudder-transformer/issues/3370)) ([e9409fd](https://github.com/rudderlabs/rudder-transformer/commit/e9409fde6063d7eaa8558396b85b5fdf99f964e1))
* onboard koddi destination ([#3359](https://github.com/rudderlabs/rudder-transformer/issues/3359)) ([f74c4a0](https://github.com/rudderlabs/rudder-transformer/commit/f74c4a0bc92ae6ccb0c00ac5b21745e496a015bc))
* onboarding adjust source ([#3395](https://github.com/rudderlabs/rudder-transformer/issues/3395)) ([668d331](https://github.com/rudderlabs/rudder-transformer/commit/668d3311aadacbb92b1873bf43919db7d341afbb))


### Bug Fixes

* fb custom audience html response ([#3402](https://github.com/rudderlabs/rudder-transformer/issues/3402)) ([d1a2bd6](https://github.com/rudder
* standardise hashing for all CAPI integrations ([#3379](https://github.com/rudderlabs/rudder-transformer/issues/3379)) ([c249a69](https://github.com/rudderlabs/rudder-transformer/commit/c249a694d735f6d241a35b6e21f493c54890ac84))
* tiktok_v2 remove default value for content-type for custom events ([#3383](https://github.com/rudderlabs/rudder-transformer/issues/3383)) ([6e7b5a0](https://github.com/rudderlabs/rudder-transformer/commit/6e7b5a0d8bf2c859dfb15b9cad7ed6070bd0892b))
* added step for reconciling openfaas functions for python transformations ([#3420](https://github.com/rudderlabs/rudder-transformer/issues/3420)) ([7a2ab63](https://github.com/rudderlabs/rudder-transformer/commit/7a2ab63674d40870af4d16f0673a2a2594c899e9))

## [1.67.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.66.1...v1.67.0) (2024-05-23)


### Features

* sre 456 ut move high cardinality histogram metrics to summaries cp ([#3409](https://github.com/rudderlabs/rudder-transformer/issues/3409)) ([be20dc2](https://github.com/rudderlabs/rudder-transformer/commit/be20dc26ade2fa0212dc91126cf42087a84a07c9))

### [1.66.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.66.0...v1.66.1) (2024-05-20)


### Bug Fixes

* add validation for null/undefined traits in slack ([#3382](https://github.com/rudderlabs/rudder-transformer/issues/3382)) ([755073c](https://github.com/rudderlabs/rudder-transformer/commit/755073c4341a454785050d835021d9f17e0b9d3f))
* gaoc store sales batching transform contract ([#3384](https://github.com/rudderlabs/rudder-transformer/issues/3384)) ([e7678cb](https://github.com/rudderlabs/rudder-transformer/commit/e7678cbdae4c06449ea9352ce3db390d2a29da14))
* move af_currency outside properties in eventValue ([#3316](https://github.com/rudderlabs/rudder-transformer/issues/3316)) ([71c3d46](https://github.com/rudderlabs/rudder-transformer/commit/71c3d46236fff9209625cfb0737c21db2d275345))
* remove default traits from ortto ([#3389](https://github.com/rudderlabs/rudder-transformer/issues/3389)) ([fbb0811](https://github.com/rudderlabs/rudder-transformer/commit/fbb0811aa0e417b0cffcea4ecc103979afccfe74))
* update validation of event duration ([#3376](https://github.com/rudderlabs/rudder-transformer/issues/3376)) ([3ad7850](https://github.com/rudderlabs/rudder-transformer/commit/3ad78506446915ada8bdc5f5594dc2710e6b0646))

## [1.66.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.65.1...v1.66.0) (2024-05-13)


### Features

* add slack source ([#3148](https://github.com/rudderlabs/rudder-transformer/issues/3148))
* onboard monday to proxy ([#3347](https://github.com/rudderlabs/rudder-transformer/issues/3347))
* onboard emarsys destination ([#3369](https://github.com/rudderlabs/rudder-transformer/issues/3369))


### Bug Fixes

* ninetailed: modify parameter requirements and add default values ([#3364](https://github.com/rudderlabs/rudder-transformer/issues/3364))

### [1.65.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.65.0...v1.65.1) (2024-05-10)


### Bug Fixes

* update regex which was discarding firstname and lastname ([#3360](https://github.com/rudderlabs/rudder-transformer/issues/3360)) ([cb10aa7](https://github.com/rudderlabs/rudder-transformer/commit/cb10aa7707518b52edcf7fb1081c6969bcb5f8f8))

## [1.65.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.64.0...v1.65.0) (2024-05-06)


### Features

* generate anonymousId and move to component testcases ([447f85f](https://github.com/rudderlabs/rudder-transformer/commit/447f85faf6ccca2179ab33b7fe43e281fc4f5897))


### Bug Fixes

* auth0 error handling ([2e22075](https://github.com/rudderlabs/rudder-transformer/commit/2e22075ddf792c573642fd09c5f9d31d8132525b))
* auth0 error handling for missing userId ([#3334](https://github.com/rudderlabs/rudder-transformer/issues/3334)) ([d2cce77](https://github.com/rudderlabs/rudder-transformer/commit/d2cce772d6f0485ff8ee51af261006eb2066c3a2))
* braze dedup for non-billable attributes ([#3320](https://github.com/rudderlabs/rudder-transformer/issues/3320)) ([ac59fdc](https://github.com/rudderlabs/rudder-transformer/commit/ac59fdc37d6fe08847d79d249d166de7cc358fd6))
* multiple event mappings in ortto ([#3341](https://github.com/rudderlabs/rudder-transformer/issues/3341)) ([0a9a2e9](https://github.com/rudderlabs/rudder-transformer/commit/0a9a2e9e2a3029ad7b4834820ba2132d3f57ce98))

## [1.64.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.63.0...v1.64.0) (2024-04-29)


### Features

* adding custom properties support to bluecore ([#3282](https://github.com/rudderlabs/rudder-transformer/issues/3282)) ([8592e66](https://github.com/rudderlabs/rudder-transformer/commit/8592e664eb568e70a00261e275ab2faed8f6f618))
* onboard Yandex Metrica Offline Events Destination ([#3232](https://github.com/rudderlabs/rudder-transformer/issues/3232)) ([8f79f53](https://github.com/rudderlabs/rudder-transformer/commit/8f79f53d30326e07fc92dd624e799015ff9f87c2))
* transactional custom property support for awin ([#3325](https://github.com/rudderlabs/rudder-transformer/issues/3325)) ([fdecaf3](https://github.com/rudderlabs/rudder-transformer/commit/fdecaf36d91db7540d6f68a013e4f7fb2a36ebaa))


### Bug Fixes

* algolia enhancement ( adding currency, price, subType and objectData support ) ([#3290](https://github.com/rudderlabs/rudder-transformer/issues/3290)) ([f06ebde](https://github.com/rudderlabs/rudder-transformer/commit/f06ebde110693fe32f8e450dc395f1f4019defab))
* **delighted:** replace myAxios utility with handleHttpRequest utility ([#3237](https://github.com/rudderlabs/rudder-transformer/issues/3237)) ([bac3cc5](https://github.com/rudderlabs/rudder-transformer/commit/bac3cc5670c149454a6063a55a4b901043b0ff02))
* handle empty userId ([5402b21](https://github.com/rudderlabs/rudder-transformer/commit/5402b219ccdeaafb710c8c2828e983e9864a415f))
* handle empty userId (movable ink, bloomreach) ([#3300](https://github.com/rudderlabs/rudder-transformer/issues/3300)) ([038c1aa](https://github.com/rudderlabs/rudder-transformer/commit/038c1aa04049aaa1caa1bf82cf6c69611b5d3fd9))
* send content_ids as a string if there is only one value ([#3317](https://github.com/rudderlabs/rudder-transformer/issues/3317)) ([54eca32](https://github.com/rudderlabs/rudder-transformer/commit/54eca3220ea48fae64c655813fe4430dd704639e))

## [1.63.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.62.2...v1.63.0) (2024-04-25)


### Features

* remove redundant data from traits in hubspot ([#3310](https://github.com/rudderlabs/rudder-transformer/issues/3310)) ([4b21f13](https://github.com/rudderlabs/rudder-transformer/commit/4b21f1353d3d9a431a0d5446d019f66a543b977b))

### [1.62.2](https://github.com/rudderlabs/rudder-transformer/compare/v1.62.1...v1.62.2) (2024-04-18)


### Bug Fixes

* twitter_ads logger ([#3295](https://github.com/rudderlabs/rudder-transformer/issues/3295)) ([e92b052](https://github.com/rudderlabs/rudder-transformer/commit/e92b052e03182deb41b20b3ec3741306afa50380))

### [1.62.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.62.0...v1.62.1) (2024-04-18)


### Bug Fixes

* revert mixpanel deprecate /track ([#3291](https://github.com/rudderlabs/rudder-transformer/issues/3291)) ([ec068b4](https://github.com/rudderlabs/rudder-transformer/commit/ec068b49bd4a5652a762c60a8257c883e4709d1a))

## [1.62.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.61.1...v1.62.0) (2024-04-15)


### Features

* do away myaxios ([#3222](https://github.com/rudderlabs/rudder-transformer/issues/3222)) ([9214594](https://github.com/rudderlabs/rudder-transformer/commit/9214594bab2c86a4ae6f75e12531f778490cf127))
* for reddit adding currency and value for addToCart, viewConent event as well ([#3239](https://github.com/rudderlabs/rudder-transformer/issues/3239)) ([ad235e7](https://github.com/rudderlabs/rudder-transformer/commit/ad235e785bf6039e11231a915be098130b25ec3b))
* logger upgrade in services, dest, source ([#3228](https://github.com/rudderlabs/rudder-transformer/issues/3228)) ([c204113](https://github.com/rudderlabs/rudder-transformer/commit/c204113eab37a782f217488d0d626a8d6df345d3))
* rakuten: adding a default value for tr ([#3240](https://github.com/rudderlabs/rudder-transformer/issues/3240)) ([3748f24](https://github.com/rudderlabs/rudder-transformer/commit/3748f24e21634fc74c5e5b3761551c64c8e69942))


### Bug Fixes

* adding check for reserved key words in extract custom fields  ([#3264](https://github.com/rudderlabs/rudder-transformer/issues/3264)) ([3399c47](https://github.com/rudderlabs/rudder-transformer/commit/3399c47fdce1b3d19e29306ca3c5692a2fbc30fb))
* deployment file paths ([#3216](https://github.com/rudderlabs/rudder-transformer/issues/3216)) ([808727d](https://github.com/rudderlabs/rudder-transformer/commit/808727de17e400ed102a843ab3b30f81f8900f24))
* email mappings ([#3247](https://github.com/rudderlabs/rudder-transformer/issues/3247)) ([791cbf5](https://github.com/rudderlabs/rudder-transformer/commit/791cbf55fc6940af4e3208212b82c891c6618fc3))
* fixed userId mapping, now mapping to uid instead of id ([#3262](https://github.com/rudderlabs/rudder-transformer/issues/3262)) ([9c6b251](https://github.com/rudderlabs/rudder-transformer/commit/9c6b251a6c784cc391f27e846a008fbe2901e2c8))
* hs bugsnag error ([#3252](https://github.com/rudderlabs/rudder-transformer/issues/3252)) ([9daf1c9](https://github.com/rudderlabs/rudder-transformer/commit/9daf1c989258bd410d5780c1b11c4f6df9654af5))
* hubspot: search for contact using secondary prop ([#3258](https://github.com/rudderlabs/rudder-transformer/issues/3258)) ([0b57204](https://github.com/rudderlabs/rudder-transformer/commit/0b5720446693efe1fd0ccdfc141bd7f21b2c32ae))
* impact: support custom product mapping ([#3249](https://github.com/rudderlabs/rudder-transformer/issues/3249)) ([cb8ff2f](https://github.com/rudderlabs/rudder-transformer/commit/cb8ff2fb943c49df4ac083bd179d9674b40eb602))
* marketo bulk ignore null while checking data type mismatch ([#3263](https://github.com/rudderlabs/rudder-transformer/issues/3263)) ([6e3274b](https://github.com/rudderlabs/rudder-transformer/commit/6e3274bfba9e7838d1f81d845a070427b67e75f5))
* shopify: send 500 for identifier call in case of failure ([#3235](https://github.com/rudderlabs/rudder-transformer/issues/3235)) ([8eb4c4e](https://github.com/rudderlabs/rudder-transformer/commit/8eb4c4e9b8daebbaeb1d12ff0c17915fe19c2b50))

### [1.61.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.61.0...v1.61.1) (2024-04-03)

## [1.61.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.60.0...v1.61.0) (2024-04-02)


### Features

* consent field support for ga4 ([#3213](https://github.com/rudderlabs/rudder-transformer/issues/3213)) ([92515a5](https://github.com/rudderlabs/rudder-transformer/commit/92515a5fd8a2798c48010078f62b360ec6a49979))
* consent field support for gaoc and upgrade the api version from v14 to v16 ([#3121](https://github.com/rudderlabs/rudder-transformer/issues/3121)) ([2aac2a6](https://github.com/rudderlabs/rudder-transformer/commit/2aac2a62547b7a7c617735fc3d6e88e0a1bed76e)), closes [#3190](https://github.com/rudderlabs/rudder-transformer/issues/3190)
* onboard new destination bloomreach ([#3185](https://github.com/rudderlabs/rudder-transformer/issues/3185)) ([d9b7e1f](https://github.com/rudderlabs/rudder-transformer/commit/d9b7e1f70565d59979aee3e62f60e39edb9a23c7))
* onboarding linkedin conversion api ([#3194](https://github.com/rudderlabs/rudder-transformer/issues/3194)) ([eb7b197](https://github.com/rudderlabs/rudder-transformer/commit/eb7b197322c617b14c2579de8cb4d4dacf8e1df3))
* update movable ink batch size ([#3223](https://github.com/rudderlabs/rudder-transformer/issues/3223)) ([667095f](https://github.com/rudderlabs/rudder-transformer/commit/667095fa8316cd95a066f15b848ad503c6b4af80))


### Bug Fixes

* fixed userId mapping, now mapping to uid instead of id ([#3192](https://github.com/rudderlabs/rudder-transformer/issues/3192)) ([70a468b](https://github.com/rudderlabs/rudder-transformer/commit/70a468bf16ecd5ee0b6fecee4b837895d19c525f))
* ninetailed: remove  page support ([#3218](https://github.com/rudderlabs/rudder-transformer/issues/3218)) ([2f30c56](https://github.com/rudderlabs/rudder-transformer/commit/2f30c56af62e983d09b5d4f2da9a0ba22f5c1612))
* shopify invalid_event metric prometheus label ([#3200](https://github.com/rudderlabs/rudder-transformer/issues/3200)) ([345c87d](https://github.com/rudderlabs/rudder-transformer/commit/345c87d7c530c621ae3fd6c504d64e5a14e31f22))
* fix: snapchat conversion: add event level_complete ([#3231](https://github.com/rudderlabs/rudder-transformer/issues/3231)) ([39368a0](https://github.com/rudderlabs/rudder-transformer/commit/39368a09e48acc324faa855186bc623e5c347881))

## [1.60.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.57.1...v1.60.0) (2024-03-20)


### Features

* ninetailed: add default value for context.location as {} ([#3197](https://github.com/rudderlabs/rudder-transformer/issues/3197)) ([91fc0fb](https://github.com/rudderlabs/rudder-transformer/commit/91fc0fb3e9eeb127298a0ce305ef6d1d7b72a39f))


### Bug Fixes

* heap: make userId as required for track and identify call ([#3198](https://github.com/rudderlabs/rudder-transformer/issues/3198)) ([6a7c534](https://github.com/rudderlabs/rudder-transformer/commit/6a7c534a7df812bb7e39c1905eadcc29d7cd1329))
* tiktok_ads: validate message.event type ([#3203](https://github.com/rudderlabs/rudder-transformer/issues/3203)) ([a86c277](https://github.com/rudderlabs/rudder-transformer/commit/a86c2771034877cef4161cda61bcda5fdda2d89f))

## [1.59.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.57.1...v1.59.0) (2024-03-18)


### Features

* add Koala destination ([#3122](https://github.com/rudderlabs/rudder-transformer/issues/3122)) ([1ca039d](https://github.com/rudderlabs/rudder-transformer/commit/1ca039d64ebb1a18a0fc6b78ed5ee08528ad6b48))
* add support of skip_user_properties_sync on Amplitude ([#3181](https://github.com/rudderlabs/rudder-transformer/issues/3181)) ([5e4ddbd](https://github.com/rudderlabs/rudder-transformer/commit/5e4ddbd8a591341a581a5721505d6dcb010f2eec))
* adding zod validations ([#3066](https://github.com/rudderlabs/rudder-transformer/issues/3066)) ([325433b](https://github.com/rudderlabs/rudder-transformer/commit/325433b9188c8d1dbe740c7e193cdc2e58fdd751))
* onboard destination movable ink ([#3167](https://github.com/rudderlabs/rudder-transformer/issues/3167)) ([7018b1e](https://github.com/rudderlabs/rudder-transformer/commit/7018b1e5e7f37ae177191c5ecf3a71cfe2f3d147))
* update proxy tests for cm360 ([#3039](https://github.com/rudderlabs/rudder-transformer/issues/3039)) ([0504ffa](https://github.com/rudderlabs/rudder-transformer/commit/0504ffa898956f5b61771fb32ecfd0e0bf15248f))
* use dontBatch directive in algolia ([#3169](https://github.com/rudderlabs/rudder-transformer/issues/3169)) ([916aaec](https://github.com/rudderlabs/rudder-transformer/commit/916aaecb1939160620d5fd3c4c0c0e33f2a371b2))


### Bug Fixes

* api contract for v1 proxy ([#3049](https://github.com/rudderlabs/rudder-transformer/issues/3049)) ([93947db](https://github.com/rudderlabs/rudder-transformer/commit/93947db35cdaf1ca7ed87ec5f73567754af312ab))
* email mapping for clevertap ([#3173](https://github.com/rudderlabs/rudder-transformer/issues/3173)) ([04eab92](https://github.com/rudderlabs/rudder-transformer/commit/04eab92e1c383f9e8cdd5c845530a42a0af2932a))
* fb pixel test case refactor ([#3075](https://github.com/rudderlabs/rudder-transformer/issues/3075)) ([cff7d1c](https://github.com/rudderlabs/rudder-transformer/commit/cff7d1c4578087a37614c0ef4529058481873479))
* fixed 500 status for algolia dontBatch ([#3178](https://github.com/rudderlabs/rudder-transformer/issues/3178)) ([6330888](https://github.com/rudderlabs/rudder-transformer/commit/6330888ad5c67e3a800037b56501fc08da09e4d1))
* label not present in prometheus metrics ([#3176](https://github.com/rudderlabs/rudder-transformer/issues/3176)) ([01d460c](https://github.com/rudderlabs/rudder-transformer/commit/01d460c3edaf39b35c4686516c9e9140be46aa5e))
* send proper status to server in cm360 ([#3127](https://github.com/rudderlabs/rudder-transformer/issues/3127)) ([229ce47](https://github.com/rudderlabs/rudder-transformer/commit/229ce473af1ddd62d946bea1b018c882b142a5ef))

## [1.58.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.57.1...v1.58.0) (2024-03-04)


### Features

* add support for interaction events in sfmc ([#3109](https://github.com/rudderlabs/rudder-transformer/issues/3109)) ([0486049](https://github.com/rudderlabs/rudder-transformer/commit/0486049ba2ad96b50d8f29e96b46b96a8a5c9f76))
* add support of custom page/screen event name in mixpanel ([#3098](https://github.com/rudderlabs/rudder-transformer/issues/3098)) ([0eb2393](https://github.com/rudderlabs/rudder-transformer/commit/0eb2393939fba2452ef7f07a1d149d87f18290c3))
* consent mode support for google adwords remarketing list  ([#3143](https://github.com/rudderlabs/rudder-transformer/issues/3143)) ([7532c90](https://github.com/rudderlabs/rudder-transformer/commit/7532c90d7e1feac00f12961c56da18757010f44a))
* **facebook:** update content_type mapping logic for fb pixel and fb conversions ([#3113](https://github.com/rudderlabs/rudder-transformer/issues/3113)) ([aea417c](https://github.com/rudderlabs/rudder-transformer/commit/aea417cd2691547399010c034cadbc5db6b0c6ee))
* klaviyo profile mapping ([#3105](https://github.com/rudderlabs/rudder-transformer/issues/3105)) ([2761786](https://github.com/rudderlabs/rudder-transformer/commit/2761786ff3fc99ed6d4d3b7a6c2400226b1cfb12))
* onboard new destination ninetailed ([#3106](https://github.com/rudderlabs/rudder-transformer/issues/3106)) ([0e2588e](https://github.com/rudderlabs/rudder-transformer/commit/0e2588ecd87f3b2c6877a099aa1cbf2d5325966c))


### Bug Fixes

* add error handling for tiktok ads ([#3144](https://github.com/rudderlabs/rudder-transformer/issues/3144)) ([e93e47f](https://github.com/rudderlabs/rudder-transformer/commit/e93e47f33e098104fb532916932fe38bbfeaa4a1))
* **algolia:** added check for objectIds or filters to be non empty ([#3126](https://github.com/rudderlabs/rudder-transformer/issues/3126)) ([d619c97](https://github.com/rudderlabs/rudder-transformer/commit/d619c9769cd270cb2d16dad0865683ff4beb2d19))
* clevertap remove stringification of array object properties ([#3048](https://github.com/rudderlabs/rudder-transformer/issues/3048)) ([69e43b6](https://github.com/rudderlabs/rudder-transformer/commit/69e43b6ffadeaec87b7440da34a341890ceba252))
* convert to string from null in hs ([#3136](https://github.com/rudderlabs/rudder-transformer/issues/3136)) ([75e9f46](https://github.com/rudderlabs/rudder-transformer/commit/75e9f462b0ff9b9a8abab3c78dc7d147926e9e5e))
* event fix and added utility ([#3142](https://github.com/rudderlabs/rudder-transformer/issues/3142)) ([9b705b7](https://github.com/rudderlabs/rudder-transformer/commit/9b705b71a9d3a595ea0fbf532602c3941b0a18db))
* metadata structure correction ([#3119](https://github.com/rudderlabs/rudder-transformer/issues/3119)) ([8351b5c](https://github.com/rudderlabs/rudder-transformer/commit/8351b5cbbf81bbc14b2f884feaae4ad3ca59a39a))
* one_signal:  Encode external_id in endpoint ([#3140](https://github.com/rudderlabs/rudder-transformer/issues/3140)) ([8a20886](https://github.com/rudderlabs/rudder-transformer/commit/8a2088608d6da4b35bbb506db2fc3df1e4d41f3b))
* rakuten: sync property mapping sourcekeys to rudderstack standard spec ([#3129](https://github.com/rudderlabs/rudder-transformer/issues/3129)) ([2ebff95](https://github.com/rudderlabs/rudder-transformer/commit/2ebff956ff2aa74b008a8de832a31d8774d2d47e))
* reddit revenue mapping for floating point values ([#3118](https://github.com/rudderlabs/rudder-transformer/issues/3118)) ([41f4078](https://github.com/rudderlabs/rudder-transformer/commit/41f4078011ef54334bb9ecc11a7b2ccc8831a4aa))
* version deprecation failure false positive ([#3104](https://github.com/rudderlabs/rudder-transformer/issues/3104)) ([657b780](https://github.com/rudderlabs/rudder-transformer/commit/657b7805eb01da25a007d978198d5debf03917fd))

### [1.57.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.57.0...v1.57.1) (2024-03-04)


### Bug Fixes

* amplitude fix for user operations ([7f2364e](https://github.com/rudderlabs/rudder-transformer/commit/7f2364e41167611c41003559de65cee1fece5464))
* amplitude fix for user operations ([#3153](https://github.com/rudderlabs/rudder-transformer/issues/3153)) ([31869fb](https://github.com/rudderlabs/rudder-transformer/commit/31869fb114bb141d545de01c56f57b97e5aa54a6))

## [1.57.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.56.1...v1.57.0) (2024-02-29)


### Features

* add event mapping support for branch destination ([#3135](https://github.com/rudderlabs/rudder-transformer/issues/3135)) ([cc94bba](https://github.com/rudderlabs/rudder-transformer/commit/cc94bba682f667877a721f63627adc6ff6a7386a))


### Bug Fixes

* marketo bulk upload zero and null value allowed ([#3134](https://github.com/rudderlabs/rudder-transformer/issues/3134)) ([4dcbf8f](https://github.com/rudderlabs/rudder-transformer/commit/4dcbf8fb189a39bb40b950742425a0b9da2d8d7c))

### [1.56.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.56.0...v1.56.1) (2024-02-21)


### Bug Fixes

* update proxy data type for response handler input ([#3030](https://github.com/rudderlabs/rudder-transformer/issues/3030)) ([457a18b](https://github.com/rudderlabs/rudder-transformer/commit/457a18b2aec03aa0dfafcadc611b5f7176e97beb))

## [1.56.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.55.0...v1.56.0) (2024-02-19)


### Features

* **hs:** chunking data based on batch limit ([#2907](https://github.com/rudderlabs/rudder-transformer/issues/2907)) ([a60694c](https://github.com/rudderlabs/rudder-transformer/commit/a60694cef1da31d27a5cf90264548cad793f556f))
* onboard bluecore integration ([#3061](https://github.com/rudderlabs/rudder-transformer/issues/3061)) ([aef5f8e](https://github.com/rudderlabs/rudder-transformer/commit/aef5f8e5f267262e0f9e10229f14f2bcc8ad29e2))
* tiktok_offline_events added support for all Standard  events ([#3094](https://github.com/rudderlabs/rudder-transformer/issues/3094)) ([b5cdccb](https://github.com/rudderlabs/rudder-transformer/commit/b5cdccb75fe68150816140174087fddad677db10))


### Bug Fixes

* add support of placing properties at root in af ([#3082](https://github.com/rudderlabs/rudder-transformer/issues/3082)) ([0f01524](https://github.com/rudderlabs/rudder-transformer/commit/0f01524b6f4f2f82efc21f88f8c97cb6fdaf91ea))
* amplitude batch output metadata ([#3077](https://github.com/rudderlabs/rudder-transformer/issues/3077)) ([69c8348](https://github.com/rudderlabs/rudder-transformer/commit/69c83489c85486c9b2aed4a1292bd9f0aae9ca44))
* amplitude: Error handling for missing event type ([#3079](https://github.com/rudderlabs/rudder-transformer/issues/3079)) ([f7ec0a1](https://github.com/rudderlabs/rudder-transformer/commit/f7ec0a1244a7b97e6b40de5ed9881c63300866dc))
* custify user-regulation logic ([#3076](https://github.com/rudderlabs/rudder-transformer/issues/3076)) ([9683161](https://github.com/rudderlabs/rudder-transformer/commit/9683161612c7e3b9c2be95a2728f68ec7dcf69f4))
* error handling for auth0 source ([#3038](https://github.com/rudderlabs/rudder-transformer/issues/3038)) ([2a21274](https://github.com/rudderlabs/rudder-transformer/commit/2a21274333350c615991f7b56b81b766502d5bf4))
* **ga4:** failures not considered with 200 status in events tab ([#3089](https://github.com/rudderlabs/rudder-transformer/issues/3089)) ([6a364fb](https://github.com/rudderlabs/rudder-transformer/commit/6a364fba34c46b15c0fe4b06ecfa6f4b81b6f436))
* gaoc batching order ([#3064](https://github.com/rudderlabs/rudder-transformer/issues/3064)) ([a98cabd](https://github.com/rudderlabs/rudder-transformer/commit/a98cabdfe7781ada12baf742df4a3a439fc5fecd))
* resolve bugsnag issue caused due to undefined properties ([#3086](https://github.com/rudderlabs/rudder-transformer/issues/3086)) ([d522b35](https://github.com/rudderlabs/rudder-transformer/commit/d522b35c908a9f262ba3ba27dda0ea5d9ac5bc6b))
* tiktok ads v2 error handling ([#3084](https://github.com/rudderlabs/rudder-transformer/issues/3084)) ([b6edff4](https://github.com/rudderlabs/rudder-transformer/commit/b6edff46fa0e0e210e82206fea46a064e3fbe00f))

## [1.55.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.54.4...v1.55.0) (2024-02-05)


### Features

* add new stat for access token expired in fb custom audience ([#3043](https://github.com/rudderlabs/rudder-transformer/issues/3043)) ([1e6d540](https://github.com/rudderlabs/rudder-transformer/commit/1e6d540fafc61a84fbbaa63d4bc5b1edc17ec44e))
* **intercom:** upgrade intercom version from 1.4 to 2.10 ([#2976](https://github.com/rudderlabs/rudder-transformer/issues/2976)) ([717639b](https://github.com/rudderlabs/rudder-transformer/commit/717639bcce605109b145eb4cc6836fe1589278fe))
* onboard new destination rakuten ([#3046](https://github.com/rudderlabs/rudder-transformer/issues/3046)) ([c7c3110](https://github.com/rudderlabs/rudder-transformer/commit/c7c3110a4526e31bc296abb33f3246fa8eee049a))
* trade desk real time conversions ([#3023](https://github.com/rudderlabs/rudder-transformer/issues/3023)) ([212d5f0](https://github.com/rudderlabs/rudder-transformer/commit/212d5f09d8addc618d4398029e62c9a18a9512cf))


### Bug Fixes

* adding map for marketo known values and javascript known values ([#3037](https://github.com/rudderlabs/rudder-transformer/issues/3037)) ([64ab555](https://github.com/rudderlabs/rudder-transformer/commit/64ab555d31b4c1c49863794444bd79b2b6a45927))
* mixpanel timestamp in ms ([#3028](https://github.com/rudderlabs/rudder-transformer/issues/3028)) ([5ad55a2](https://github.com/rudderlabs/rudder-transformer/commit/5ad55a27c8b737fd96f65c68ba086769747c5360))
* upgrade ua-parser-js from 1.0.35 to 1.0.37 ([9a4cdef](https://github.com/rudderlabs/rudder-transformer/commit/9a4cdef59ab1c2d9dc95eb8629a7009d8d633297))

### [1.54.4](https://github.com/rudderlabs/rudder-transformer/compare/v1.54.3...v1.54.4) (2024-01-31)


### Bug Fixes

* purchsse events for reddit ([56d24ec](https://github.com/rudderlabs/rudder-transformer/commit/56d24ec74c0c21bcdcdf262b4feec6edd1dff51c))

### [1.54.3](https://github.com/rudderlabs/rudder-transformer/compare/v1.54.2...v1.54.3) (2024-01-30)


### Bug Fixes

* hubspot increasing batch limit from 10 to 100 ([8075b7c](https://github.com/rudderlabs/rudder-transformer/commit/8075b7c6c6203657a8aad2525bd2f302dabd9960))

### [1.54.2](https://github.com/rudderlabs/rudder-transformer/compare/v1.54.1...v1.54.2) (2024-01-25)


### Bug Fixes

* deleting access token cache for marketo bulk upload destination ([#3029](https://github.com/rudderlabs/rudder-transformer/issues/3029)) ([78b75bf](https://github.com/rudderlabs/rudder-transformer/commit/78b75bf4d9114209b3e89489fb43228dc9a70e5f))

### [1.54.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.54.0...v1.54.1) (2024-01-24)


### Bug Fixes

* remove brand mapping from products to contents in tiktok_ads ([49c4988](https://github.com/rudderlabs/rudder-transformer/commit/49c4988cc872f40780fa640240c209c3d768fab4))

## [1.54.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.53.0...v1.54.0) (2024-01-22)


### Features

* add regulation to features.json ([2ae4378](https://github.com/rudderlabs/rudder-transformer/commit/2ae437820952b87dace289ec04d5c116d77cf70c))
* add regulation to features.json ([#2988](https://github.com/rudderlabs/rudder-transformer/issues/2988)) ([65c79a8](https://github.com/rudderlabs/rudder-transformer/commit/65c79a8fd02218cee5d12e51004cdc023a0e7989))
* onboard new tiktok version events 2.0 ([#2961](https://github.com/rudderlabs/rudder-transformer/issues/2961)) ([0fca088](https://github.com/rudderlabs/rudder-transformer/commit/0fca088980368954e9a82addedd6a4544035259a))


### Bug Fixes

* add valid code coverage file in workflows ([#3000](https://github.com/rudderlabs/rudder-transformer/issues/3000)) ([34bf49d](https://github.com/rudderlabs/rudder-transformer/commit/34bf49d19f33326008a467230574e4f1c78e9ddb))
* error handling for trade desk first party data flow ([#2986](https://github.com/rudderlabs/rudder-transformer/issues/2986)) ([32c9c03](https://github.com/rudderlabs/rudder-transformer/commit/32c9c038ca96477cbe8d94d2a19679817b952e4c))
* fixing network and default error messages for marketo bulk upload ([#3016](https://github.com/rudderlabs/rudder-transformer/issues/3016)) ([3741073](https://github.com/rudderlabs/rudder-transformer/commit/3741073ea37e83aa1e6e35c3ccb26d5a41a49617))
* klaviyo validate event name to be string before accessing it ([#2998](https://github.com/rudderlabs/rudder-transformer/issues/2998)) ([7aa6687](https://github.com/rudderlabs/rudder-transformer/commit/7aa6687829783df3924a89698a53b9cb315449eb))
* mailjet source operating on array instead object ([#2999](https://github.com/rudderlabs/rudder-transformer/issues/2999)) ([0dbb307](https://github.com/rudderlabs/rudder-transformer/commit/0dbb307bf5d18893e3331cd92bc16bae1b4a6add))
* mixpanel alias simplified merge error message ([#2996](https://github.com/rudderlabs/rudder-transformer/issues/2996)) ([e53b304](https://github.com/rudderlabs/rudder-transformer/commit/e53b3046252bb5abcae046445baf4a67c40f37a3))
* optimise build and coverage ([#2985](https://github.com/rudderlabs/rudder-transformer/issues/2985)) ([81ab6e8](https://github.com/rudderlabs/rudder-transformer/commit/81ab6e86070a9992141bad405c6f52d1ab186f11))
* ortto remove phn:phone field if no phone is there in payload ([#2997](https://github.com/rudderlabs/rudder-transformer/issues/2997)) ([0c2f7bc](https://github.com/rudderlabs/rudder-transformer/commit/0c2f7bcbf705787087a8d9073145e282851ddb6f))
* pr conflicts in back merge ([#2984](https://github.com/rudderlabs/rudder-transformer/issues/2984)) ([f16066c](https://github.com/rudderlabs/rudder-transformer/commit/f16066cc8f867378f1b9bb9812f8efe389ca5bc8))
* **slack:** add support of blank space in handlebar ([#2959](https://github.com/rudderlabs/rudder-transformer/issues/2959)) ([ff12d8f](https://github.com/rudderlabs/rudder-transformer/commit/ff12d8ffddccbdac934c7cbac03730cd2593147f))
* tiktok add missing field brand ([#2942](https://github.com/rudderlabs/rudder-transformer/issues/2942)) ([ca76297](https://github.com/rudderlabs/rudder-transformer/commit/ca76297147f0a2c12d68d97dda95b9a44efe4020))
* tiktok_ads remove page.url as a required field ([#3006](https://github.com/rudderlabs/rudder-transformer/issues/3006)) ([595f819](https://github.com/rudderlabs/rudder-transformer/commit/595f81982a2604ec08621e15cea7c16564d5ecab))

## [1.53.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.52.4...v1.53.0) (2024-01-08)


### Features

* amplitude add support for unset ([#2941](https://github.com/rudderlabs/rudder-transformer/issues/2941)) ([429ca71](https://github.com/rudderlabs/rudder-transformer/commit/429ca719952e5b8a4b6bad2ef1a087575613e861))
* handle improper type validation sync vulnerability ([#2937](https://github.com/rudderlabs/rudder-transformer/issues/2937)) ([7d734f0](https://github.com/rudderlabs/rudder-transformer/commit/7d734f06df75d198f8440a953ce089631af15a8b))
* move intercom to routerTransform ([#2964](https://github.com/rudderlabs/rudder-transformer/issues/2964)) ([48e4036](https://github.com/rudderlabs/rudder-transformer/commit/48e40365de6d45c40b25b0af3373504bfd5368bd))
* onboard new destination the trade desk ([#2918](https://github.com/rudderlabs/rudder-transformer/issues/2918)) ([f5ad088](https://github.com/rudderlabs/rudder-transformer/commit/f5ad088439ae628c9652b58d1ecb90257d77cae3))
* pass ip details for factorsAI ([#2925](https://github.com/rudderlabs/rudder-transformer/issues/2925)) ([970d37d](https://github.com/rudderlabs/rudder-transformer/commit/970d37d6a3e4196c284513dd56f5405b0f3f2821))
* **sprig:** added user deletion support ([#2886](https://github.com/rudderlabs/rudder-transformer/issues/2886)) ([e0c225d](https://github.com/rudderlabs/rudder-transformer/commit/e0c225dfab711c1d87d1c5dd1be98fb476548588))


### Bug Fixes

* enhancement and version upgrade of google ads remarketing list ([#2945](https://github.com/rudderlabs/rudder-transformer/issues/2945)) ([2380f9d](https://github.com/rudderlabs/rudder-transformer/commit/2380f9dcfcda2c6fe101b8b3a2d580e26a6452f3))
* error handling when payload contains toString as key ([#2954](https://github.com/rudderlabs/rudder-transformer/issues/2954)) ([e002093](https://github.com/rudderlabs/rudder-transformer/commit/e00209337fa0e4da88f4f9959558636eecd4f120))
* for gainsight px only new users to have default signUp date ([#2953](https://github.com/rudderlabs/rudder-transformer/issues/2953)) ([8bf56cc](https://github.com/rudderlabs/rudder-transformer/commit/8bf56cc7914bda530b0bf3fb16bfece6be542ddd))
* version upgrade of gaec from 14 to 15 ([#2966](https://github.com/rudderlabs/rudder-transformer/issues/2966)) ([8bada4b](https://github.com/rudderlabs/rudder-transformer/commit/8bada4b21acf3ac884f44166b62098680f126898))

### [1.52.4](https://github.com/rudderlabs/rudder-transformer/compare/v1.52.3...v1.52.4) (2023-12-27)


### Bug Fixes

* send empty string instead of null when the schema data is undefined ([#2955](https://github.com/rudderlabs/rudder-transformer/issues/2955)) ([511741e](https://github.com/rudderlabs/rudder-transformer/commit/511741ed356b365f52e0335ce6a1fc953ccbc465))

### [1.52.3](https://github.com/rudderlabs/rudder-transformer/compare/v1.52.2...v1.52.3) (2023-12-18)


### Bug Fixes

* email validation for braze ([#2929](https://github.com/rudderlabs/rudder-transformer/issues/2929)) ([28207d0](https://github.com/rudderlabs/rudder-transformer/commit/28207d02a1b39b25325fa30be12c4dccd05c844e))
* pinterest event value is restricted to string ([#2933](https://github.com/rudderlabs/rudder-transformer/issues/2933)) ([7f6d519](https://github.com/rudderlabs/rudder-transformer/commit/7f6d519b811a5d8f83f7a2103d9ba50efed8a923))
* remove log from dcm_floodlight ([#2934](https://github.com/rudderlabs/rudder-transformer/issues/2934)) ([c5d9a3c](https://github.com/rudderlabs/rudder-transformer/commit/c5d9a3cc7d0270238c102cec809edcccad5b270d))
* tiktok remove lowercasing for custom events ([#2930](https://github.com/rudderlabs/rudder-transformer/issues/2930)) ([1a90719](https://github.com/rudderlabs/rudder-transformer/commit/1a9071931e9768a3fd02b749b4b705e8c28d9763))

### [1.52.2](https://github.com/rudderlabs/rudder-transformer/compare/v1.52.1...v1.52.2) (2023-12-15)


### Bug Fixes

* braze dedup for adding non-billable attributes ([#2921](https://github.com/rudderlabs/rudder-transformer/issues/2921)) ([4196b1b](https://github.com/rudderlabs/rudder-transformer/commit/4196b1bfec2fc3f7c2c5d0b305853b39033e894c))
* inclusion of right status-code & error details in proxy response ([#2916](https://github.com/rudderlabs/rudder-transformer/issues/2916)) ([5d295c2](https://github.com/rudderlabs/rudder-transformer/commit/5d295c232ff91bfb8564d4d6fcce49dc1e07958b))
* supportTransformerProxyV1 set to false ([#2920](https://github.com/rudderlabs/rudder-transformer/issues/2920)) ([90ee7ad](https://github.com/rudderlabs/rudder-transformer/commit/90ee7ad13921830c920ee60361adb0e0c5dc1d43))

### [1.52.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.52.0...v1.52.1) (2023-12-14)


### Bug Fixes

* update response handling for v1 proxy ([7d275ca](https://github.com/rudderlabs/rudder-transformer/commit/7d275ca1d58c38859fce95d7d0677e11342c662a))

## [1.52.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.51.1...v1.52.0) (2023-12-12)


### Features

* onboard msl changes for new record event ([#2644](https://github.com/rudderlabs/rudder-transformer/issues/2644)) ([36d3f25](https://github.com/rudderlabs/rudder-transformer/commit/36d3f258ed5ea4ba1899c8b2cae8203bf73d90ed)), closes [#2813](https://github.com/rudderlabs/rudder-transformer/issues/2813)
* onboard reddit cloud mode destination ([#2829](https://github.com/rudderlabs/rudder-transformer/issues/2829)) ([babb89a](https://github.com/rudderlabs/rudder-transformer/commit/babb89a5bf6d1b84d1319b967953c7c1b6de7c2c))
* tiktok_ads: add support for custom events ([#2891](https://github.com/rudderlabs/rudder-transformer/issues/2891)) ([091354c](https://github.com/rudderlabs/rudder-transformer/commit/091354c4427b33c9f8ac2678db3a4ab38b008e7d))


### Bug Fixes

* active_campaign error handler ([#2895](https://github.com/rudderlabs/rudder-transformer/issues/2895)) ([5a6d296](https://github.com/rudderlabs/rudder-transformer/commit/5a6d296b0ce83f3b6b4e215839fb65d4e0f2de41))
* add check to remove empty properties object from payload ([#2896](https://github.com/rudderlabs/rudder-transformer/issues/2896)) ([1a86a07](https://github.com/rudderlabs/rudder-transformer/commit/1a86a0723e3f5fb6fdf9cf1dc716a47c6da16745))
* adobe_analytics event field check ([#2890](https://github.com/rudderlabs/rudder-transformer/issues/2890)) ([bf39215](https://github.com/rudderlabs/rudder-transformer/commit/bf39215dd1bbed482665c837a2bfabfcb751c753))
* covert toString before toLowercase ([#2830](https://github.com/rudderlabs/rudder-transformer/issues/2830)) ([bed431e](https://github.com/rudderlabs/rudder-transformer/commit/bed431e1de94ab28df1ee592d083a1481b960b6d))
* **dm:** add workspaceId in common metadata to be returned to the callers ([#2868](https://github.com/rudderlabs/rudder-transformer/issues/2868)) ([b3437a3](https://github.com/rudderlabs/rudder-transformer/commit/b3437a34358d5fd5b1eb63f30a5a695f39aa84ff))
* **integrations:** onboard sprig destination ([#2857](https://github.com/rudderlabs/rudder-transformer/issues/2857)) ([ede22e3](https://github.com/rudderlabs/rudder-transformer/commit/ede22e3f8fb60a9e36e2a3f5a5e86260255c49ef))
* mailjet source transformation by adding email exists check ([#2889](https://github.com/rudderlabs/rudder-transformer/issues/2889)) ([4a7eaa0](https://github.com/rudderlabs/rudder-transformer/commit/4a7eaa09000bcb82eb7f217d500223939bd9b07b))
* missing null check in braze populateCustomAttributesWithOperation ([#2897](https://github.com/rudderlabs/rudder-transformer/issues/2897)) ([50e921d](https://github.com/rudderlabs/rudder-transformer/commit/50e921d1451bf7016e60b2e238b8f842d72b5b71))
* removed retry logic from v1 cm360, added adapter for v1 to v0 conversion ([#2860](https://github.com/rudderlabs/rudder-transformer/issues/2860)) ([776d2c4](https://github.com/rudderlabs/rudder-transformer/commit/776d2c4abe23cd279195064684b9ccc807d83afc))
* **dm:** use clones as false for tracking plan node cache ([#2899](https://github.com/rudderlabs/rudder-transformer/issues/2899)) ([8f47db8](https://github.com/rudderlabs/rudder-transformer/commit/8f47db8bcf581d1807cfa2aa823ef400a30a09e3))

### [1.51.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.51.0...v1.51.1) (2023-12-06)


### Bug Fixes

* marketo backward compatibility ([#2880](https://github.com/rudderlabs/rudder-transformer/issues/2880)) ([af6aebb](https://github.com/rudderlabs/rudder-transformer/commit/af6aebba9a9891fadc91fe2dc4ae4db4b1e269c9))
* marketo new field introduction backward compatibility ([cd6c3b0](https://github.com/rudderlabs/rudder-transformer/commit/cd6c3b0672a0b17078627f28f6613a2ef1898ee7))
* remove ErrorResponse type from postTransfomration delivery ([b13f0a6](https://github.com/rudderlabs/rudder-transformer/commit/b13f0a6340177a56417692ad7dcf3829d4990826))

## [1.51.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.50.1...v1.51.0) (2023-12-06)


### Features

* cm360 router batching ([#2836](https://github.com/rudderlabs/rudder-transformer/issues/2836)) ([4b260e4](https://github.com/rudderlabs/rudder-transformer/commit/4b260e4ec6d25875903830004b3e4975b3402b2d))
* cm360 transformerproxy V1 flag ([#2848](https://github.com/rudderlabs/rudder-transformer/issues/2848)) ([27f0797](https://github.com/rudderlabs/rudder-transformer/commit/27f0797c6dcd626a713c11a48c6e85a69e0a4963))
* **INT-305:** onboard gladly destination ([#2786](https://github.com/rudderlabs/rudder-transformer/issues/2786)) ([ff80b88](https://github.com/rudderlabs/rudder-transformer/commit/ff80b885fe0507c137b3c9eacffcef331010da0c))
* marketo: migrate config fields and fix test cases ([#2789](https://github.com/rudderlabs/rudder-transformer/issues/2789)) ([7910dba](https://github.com/rudderlabs/rudder-transformer/commit/7910dba2318f92cec3be1b7c7aa6b00428ecae94))
* mixpanel set once feature onboard ([#2820](https://github.com/rudderlabs/rudder-transformer/issues/2820)) ([9eda50e](https://github.com/rudderlabs/rudder-transformer/commit/9eda50e850c5a1ccb46f1b54c3d176edb915eb27))
* onboard webhook to component tests ([#2837](https://github.com/rudderlabs/rudder-transformer/issues/2837)) ([284d141](https://github.com/rudderlabs/rudder-transformer/commit/284d1411514c26dda2403a4a18967e5f40e255ea))
* update facebook destinations API version to v18.0 ([#2828](https://github.com/rudderlabs/rudder-transformer/issues/2828)) ([3127a1c](https://github.com/rudderlabs/rudder-transformer/commit/3127a1ca8dc1b887f9158a1d839c5504f40c4678))


### Bug Fixes

* add support for custom properties for braze purchase events ([#2856](https://github.com/rudderlabs/rudder-transformer/issues/2856)) ([be6ef26](https://github.com/rudderlabs/rudder-transformer/commit/be6ef2605f04e9182534b9633eeec1091cf7a431))
* bugsnag issue in moengage identify event ([#2845](https://github.com/rudderlabs/rudder-transformer/issues/2845)) ([0e7adc6](https://github.com/rudderlabs/rudder-transformer/commit/0e7adc66ff88d9510e48a5651460b4e02cc57c78))
* encode &, < and > to html counterparts in adobe analytics ([#2854](https://github.com/rudderlabs/rudder-transformer/issues/2854)) ([571dbf5](https://github.com/rudderlabs/rudder-transformer/commit/571dbf5bd65e7d0e261562ff3da3b393f27f27b6))
* error handling in active_campaign ([#2843](https://github.com/rudderlabs/rudder-transformer/issues/2843)) ([a015460](https://github.com/rudderlabs/rudder-transformer/commit/a015460f0a6d2d5320f633abc151febf22561b6b))
* make supportTransformerProxyV1 false ([#2861](https://github.com/rudderlabs/rudder-transformer/issues/2861)) ([80cf69d](https://github.com/rudderlabs/rudder-transformer/commit/80cf69dc40bb4dc7c0a6d516814f36d962018745))
* remove errorCategory for braze dedup error ([#2850](https://github.com/rudderlabs/rudder-transformer/issues/2850)) ([91d4cd1](https://github.com/rudderlabs/rudder-transformer/commit/91d4cd16f9839b0be5a663ca5010bdd72cff9bdc))
* sfmc bug fix for track event validations ([#2852](https://github.com/rudderlabs/rudder-transformer/issues/2852)) ([cd9a046](https://github.com/rudderlabs/rudder-transformer/commit/cd9a046f66eab8363373cb9a0fa1afeef3137d78))
* unhandled error code in facebook_custom_audience ([#2853](https://github.com/rudderlabs/rudder-transformer/issues/2853)) ([8c02b8c](https://github.com/rudderlabs/rudder-transformer/commit/8c02b8ccb2101147ac84b4555e7fd07235ebf9fc))
* updated transformerProxyV1 name ([#2859](https://github.com/rudderlabs/rudder-transformer/issues/2859)) ([1a8d825](https://github.com/rudderlabs/rudder-transformer/commit/1a8d825ccbb87d34d8ae5ff2cb02f4be9700eee6))

### [1.50.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.50.0...v1.50.1) (2023-12-05)


### Bug Fixes

* salesforce transformer proxy response handling issue for authorization flow ([#2873](https://github.com/rudderlabs/rudder-transformer/issues/2873)) ([4cec65e](https://github.com/rudderlabs/rudder-transformer/commit/4cec65e4103e99021f5108fcc7c557b952f1c5eb))

## [1.50.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.49.1...v1.50.0) (2023-11-13)


### Features

* add clickId support for tiktok and pinterest destination ([#2784](https://github.com/rudderlabs/rudder-transformer/issues/2784)) ([0e14296](https://github.com/rudderlabs/rudder-transformer/commit/0e1429663d167a2c5cded0d9130374eb586a18c0))
* add delivery_category as part of contents, remove flattening custom_data in FB conversions ([#2812](https://github.com/rudderlabs/rudder-transformer/issues/2812)) ([e82cef8](https://github.com/rudderlabs/rudder-transformer/commit/e82cef88e154d47519f0deeb60f55773f25fd3ad))
* add delivery_category as part of contents, update flattening custom_data in FB Pixel ([#2816](https://github.com/rudderlabs/rudder-transformer/issues/2816)) ([ee1f473](https://github.com/rudderlabs/rudder-transformer/commit/ee1f4733e82291375d85a6de8b8626ffdc8907b1))
* adding support for future oauth facility in salesforce ([#2746](https://github.com/rudderlabs/rudder-transformer/issues/2746)) ([916ea4c](https://github.com/rudderlabs/rudder-transformer/commit/916ea4c8d08f69b68b7795dd513a25a3cded55fa))
* introduce v1/source/sourceType endpoint ([#2722](https://github.com/rudderlabs/rudder-transformer/issues/2722)) ([0996e81](https://github.com/rudderlabs/rudder-transformer/commit/0996e816d3671c3e25561f76e3219be99225f24b))
* move cdkV1 to cdkv2 component tests ([#2804](https://github.com/rudderlabs/rudder-transformer/issues/2804)) ([195b48a](https://github.com/rudderlabs/rudder-transformer/commit/195b48ac0f438a200933e4bbb956fcc3941b7aed))
* use custom screen name amplitude ([#2823](https://github.com/rudderlabs/rudder-transformer/issues/2823)) ([93a82bd](https://github.com/rudderlabs/rudder-transformer/commit/93a82bd4856b462768d0213ae3de8b9b78e9858c))


### Bug Fixes

* source_transform_error stat label correction ([#2825](https://github.com/rudderlabs/rudder-transformer/issues/2825)) ([f3bcd7c](https://github.com/rudderlabs/rudder-transformer/commit/f3bcd7c9338ef96267be84f845c63f5234d37e33))
* shopify redis metric when there is no data returned for a key ([#2811](https://github.com/rudderlabs/rudder-transformer/issues/2811)) ([c02370e](https://github.com/rudderlabs/rudder-transformer/commit/c02370e38fabb581698baa00e1ddd3da93dc07fa))
* snapchat_conversion category mapping ([#2826](https://github.com/rudderlabs/rudder-transformer/issues/2826)) ([7acd004](https://github.com/rudderlabs/rudder-transformer/commit/7acd004e4290dfb5ea20402929041462eddb4496))

### [1.49.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.49.0...v1.49.1) (2023-11-10)


### Bug Fixes

* update create-hotfix-branch.yml ([#2815](https://github.com/rudderlabs/rudder-transformer/issues/2815)) ([dd884dd](https://github.com/rudderlabs/rudder-transformer/commit/dd884ddc78898bd7de155ec4f05ce8fe6e2c4b80))

## [1.49.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.48.0...v1.49.0) (2023-11-06)


### Features

* add new destination tiktok_audience ([#2710](https://github.com/rudderlabs/rudder-transformer/issues/2710)) ([9bc0fd8](https://github.com/rudderlabs/rudder-transformer/commit/9bc0fd8efcee44871a190bd6cb9e89c5cf035ff8))
* onboard one signal to router transform ([#2785](https://github.com/rudderlabs/rudder-transformer/issues/2785)) ([818858e](https://github.com/rudderlabs/rudder-transformer/commit/818858e046ce5f9735bbb97715c43a959ad3aa3c))
* onboard revenuecat as a source ([#2774](https://github.com/rudderlabs/rudder-transformer/issues/2774)) ([55f9637](https://github.com/rudderlabs/rudder-transformer/commit/55f96374b4d73db7013c1d5e72bfc9c8257b224b))


### Bug Fixes

* add check to remove null and undefined properties before sending ([#2796](https://github.com/rudderlabs/rudder-transformer/issues/2796)) ([6e89cd3](https://github.com/rudderlabs/rudder-transformer/commit/6e89cd3f67ea887ba17c1cd5ffbca6675f54d96c))
* allow support for full url from UI in freshsales and freshmarketer ([#2780](https://github.com/rudderlabs/rudder-transformer/issues/2780)) ([570532c](https://github.com/rudderlabs/rudder-transformer/commit/570532ce790c05a69621d9289758a1b1a7acda8c))
* busgnag issues for klaviyo, freshsales, customeio  ([#2795](https://github.com/rudderlabs/rudder-transformer/issues/2795)) ([11fb7c4](https://github.com/rudderlabs/rudder-transformer/commit/11fb7c47910681833e37d25a1573d2005e62742b))

## [1.48.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.47.0...v1.48.0) (2023-11-02)


### Features

* add support to add custom network policies for specific workspaces in faas pods ([bc1a760](https://github.com/rudderlabs/rudder-transformer/commit/bc1a76066c0aeb43776ded0b266ec48f5e69aa16))

## [1.47.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.46.5...v1.47.0) (2023-10-30)


### Features

* add custom utm parameters to mixpanel ([#2771](https://github.com/rudderlabs/rudder-transformer/issues/2771)) ([9c4fcd3](https://github.com/rudderlabs/rudder-transformer/commit/9c4fcd3595534a8b563df3467e23c94c580f08a6))
* add support filtering component tests by feature and index ([#2748](https://github.com/rudderlabs/rudder-transformer/issues/2748)) ([146f1c6](https://github.com/rudderlabs/rudder-transformer/commit/146f1c63db4e895c7d5ce2848a1b60e7c5bb9fb6))
* onboard destination ortto ([#2730](https://github.com/rudderlabs/rudder-transformer/issues/2730)) ([9be5740](https://github.com/rudderlabs/rudder-transformer/commit/9be5740d8670890b0318da3d37f258ddc5e35445))
* onboard facebook custom audience to transformer proxy ([#2769](https://github.com/rudderlabs/rudder-transformer/issues/2769)) ([14c5e40](https://github.com/rudderlabs/rudder-transformer/commit/14c5e40284af7df9e4f5b262ad226dd3afef226e))
* add custom event name support in pinterest v5 ([#2773](https://github.com/rudderlabs/rudder-transformer/pull/2773)) ([a586a92](https://github.com/rudderlabs/rudder-transformer/commit/a586a92bf410679d0f3aa7012d4d10f8e2f515d5))


### Bug Fixes

* bugsnag error for salesforce ([#2753](https://github.com/rudderlabs/rudder-transformer/issues/2753)) ([a2ccdad](https://github.com/rudderlabs/rudder-transformer/commit/a2ccdad52a1fb88f962745800cb45d605b5e0bf3))
* oom kill while stringifying large response json ([#2754](https://github.com/rudderlabs/rudder-transformer/issues/2754)) ([c8baf5b](https://github.com/rudderlabs/rudder-transformer/commit/c8baf5b2b6325d9e30200339055dcbefd780936c))
* salesforce: handle ECONNABORTED error ([#2732](https://github.com/rudderlabs/rudder-transformer/issues/2732)) ([6b23a9b](https://github.com/rudderlabs/rudder-transformer/commit/6b23a9b33acd28fdacaa2390c1970a1fa4415ffa))

### [1.46.5](https://github.com/rudderlabs/rudder-transformer/compare/v1.46.4...v1.46.5) (2023-10-23)


### Bug Fixes

* **hubspot:** property mismatch ([5530031](https://github.com/rudderlabs/rudder-transformer/commit/553003192a1492220e3930c6b6f2dd11ebac1bcb))

### [1.46.4](https://github.com/rudderlabs/rudder-transformer/compare/v1.46.3...v1.46.4) (2023-10-20)


### Bug Fixes

* **hs:** time stamp and contact not found issue ([391c7cd](https://github.com/rudderlabs/rudder-transformer/commit/391c7cdc5576152576bbd2c6d335a04ce6795833))

### [1.46.3](https://github.com/rudderlabs/rudder-transformer/compare/v1.46.2...v1.46.3) (2023-10-20)


### Bug Fixes

* deduplication key issue ([#2757](https://github.com/rudderlabs/rudder-transformer/issues/2757)) ([bc76305](https://github.com/rudderlabs/rudder-transformer/commit/bc76305e3fcc3c9ac69e639e90a37499566d0837))

### [1.46.2](https://github.com/rudderlabs/rudder-transformer/compare/v1.46.1...v1.46.2) (2023-10-19)


### Bug Fixes

* do not send 298 event for aborted ones in ut ([d414064](https://github.com/rudderlabs/rudder-transformer/commit/d414064aac1c8d769607346bc48b8db549e7a8dc))

### [1.46.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.46.0...v1.46.1) (2023-10-19)

### Bug Fixes

* add gzip support compatibility ([#2745](https://github.com/rudderlabs/rudder-transformer/issues/2745)) ([d72410f](https://github.com/rudderlabs/rudder-transformer/commit/d72410f7962e702218be3c2414de62341ca29e39))

## [1.46.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.45.3...v1.46.0) (2023-10-18)


### Features

* enhancement: snapchat_conversion add new fields ([#2721](https://github.com/rudderlabs/rudder-transformer/issues/2721)) ([45da19d](https://github.com/rudderlabs/rudder-transformer/commit/45da19db1e583d80f9fc5b508316f7a8bdd415b6))
* facebook pixel audit refactor ([#2713](https://github.com/rudderlabs/rudder-transformer/issues/2713)) ([43e1a61](https://github.com/rudderlabs/rudder-transformer/commit/43e1a61e19ad8b9c0fb999fe900b91347acb7ef8))
* mixpanel gzip support for import endpoint ([#2667](https://github.com/rudderlabs/rudder-transformer/issues/2667)) ([6b6bb66](https://github.com/rudderlabs/rudder-transformer/commit/6b6bb6633ed26d466bd80d04ae2c008d1435faca))
* onboard facebook_conversions destination ([#2720](https://github.com/rudderlabs/rudder-transformer/issues/2720)) ([5269af4](https://github.com/rudderlabs/rudder-transformer/commit/5269af47cdbceefec16be3b44910ca27aea35c35))
* onboard source ortto ([#2693](https://github.com/rudderlabs/rudder-transformer/issues/2693)) ([4682268](https://github.com/rudderlabs/rudder-transformer/commit/4682268d8396a40685a343a5c4f3978e7316d2d3))


### Bug Fixes

* fix getFbGenderVal function ([#2724](https://github.com/rudderlabs/rudder-transformer/issues/2724)) ([3aabe81](https://github.com/rudderlabs/rudder-transformer/commit/3aabe81252a09010d2b2e54e44c32e2c6302c057))

### [1.45.3](https://github.com/rudderlabs/rudder-transformer/compare/v1.45.2...v1.45.3) (2023-10-17)


### Bug Fixes

* ut metadata map ts type ([c8d3882](https://github.com/rudderlabs/rudder-transformer/commit/c8d3882baccc57d7b892c55ff9811c951afb5ec6))

### [1.45.2](https://github.com/rudderlabs/rudder-transformer/compare/v1.45.1...v1.45.2) (2023-10-17)


### Bug Fixes

* add event metadata to 298 status code responses ([f0493dc](https://github.com/rudderlabs/rudder-transformer/commit/f0493dccfd47bfe1897ebcec27141e2df31393c0))

### [1.45.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.45.0...v1.45.1) (2023-10-17)


### Bug Fixes

* **clevertap:** invalid parameters ordering issue ([a70d4db](https://github.com/rudderlabs/rudder-transformer/commit/a70d4db57b302abc710907aadb8570944d54165a))
* **clevertap:** parameters ordering issue ([#2727](https://github.com/rudderlabs/rudder-transformer/issues/2727)) ([bd6e096](https://github.com/rudderlabs/rudder-transformer/commit/bd6e096db3dc6b9bd2d607084b8a38ff315fab9c))

## [1.45.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.44.2...v1.45.0) (2023-10-11)


### Features

* **integrations:** introduced new status codes to suppress or filter events ([#2611](https://github.com/rudderlabs/rudder-transformer/issues/2611)) ([6bdb01e](https://github.com/rudderlabs/rudder-transformer/commit/6bdb01e1152f52339dc6d1936cbe686e64faf070))
* onboard braze stats ([#2703](https://github.com/rudderlabs/rudder-transformer/issues/2703)) ([f205325](https://github.com/rudderlabs/rudder-transformer/commit/f2053255bedac6017f909fe8b6de3775dd50bc93))
* support page call in snapchat conversion ([#2688](https://github.com/rudderlabs/rudder-transformer/issues/2688)) ([d681d5e](https://github.com/rudderlabs/rudder-transformer/commit/d681d5e1a39c1914e3a237e1020553518c297416))


### Bug Fixes

* added matchId check and timestamp conversion ([#2709](https://github.com/rudderlabs/rudder-transformer/issues/2709)) ([f49244d](https://github.com/rudderlabs/rudder-transformer/commit/f49244dce6cf15812d894d22c43d2432b5a4756a))
* bugsnag event sent as an object for track call ([#2681](https://github.com/rudderlabs/rudder-transformer/issues/2681)) ([b211840](https://github.com/rudderlabs/rudder-transformer/commit/b21184019691b472650901f6002ef81b579a1146))
* correct handling of permission_denied error for GAEC & GARL ([#2699](https://github.com/rudderlabs/rudder-transformer/issues/2699)) ([eca3be1](https://github.com/rudderlabs/rudder-transformer/commit/eca3be1fdcb7ac0ebf9432e9686a75fad2d6dc78))
* **garl:** partial failure handling ([#2666](https://github.com/rudderlabs/rudder-transformer/issues/2666)) ([d4cac26](https://github.com/rudderlabs/rudder-transformer/commit/d4cac268193e0db9540f95c7aab39157d70765c1))
* **kafka:** add status code & batched value in response structure ([#2684](https://github.com/rudderlabs/rudder-transformer/issues/2684)) ([99f39f5](https://github.com/rudderlabs/rudder-transformer/commit/99f39f5cd62ceb82bd8f51d1de84442b1e59c004))
* **klaviyo:** sending error field at root level for suppress events ([#2707](https://github.com/rudderlabs/rudder-transformer/issues/2707)) ([bc88f13](https://github.com/rudderlabs/rudder-transformer/commit/bc88f1303ec4f60a466492c72e8c3b57dd5070af))
* snapchat conversion introduce missing fields ([#2704](https://github.com/rudderlabs/rudder-transformer/issues/2704)) ([d6488d5](https://github.com/rudderlabs/rudder-transformer/commit/d6488d5a189ea90d1142e4ecb34b2af0bb940fe9))

### [1.44.2](https://github.com/rudderlabs/rudder-transformer/compare/v1.44.1...v1.44.2) (2023-10-09)


### Bug Fixes

* create instance of transformedObj ([37495e3](https://github.com/rudderlabs/rudder-transformer/commit/37495e3e4a90dc9c5abbf74e7d58152a9af10daf))

### [1.44.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.44.0...v1.44.1) (2023-10-06)


### Bug Fixes

* criteo_aud auth_token expire code incorporated ([#2687](https://github.com/rudderlabs/rudder-transformer/issues/2687)) ([cbe333a](https://github.com/rudderlabs/rudder-transformer/commit/cbe333a9e4eea7088bfe46a2aaf09d489a7bc7c7))

## [1.44.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.43.1...v1.44.0) (2023-09-29)


### Features

* add geolocation support for python transformations ([#2678](https://github.com/rudderlabs/rudder-transformer/issues/2678)) ([b688c4a](https://github.com/rudderlabs/rudder-transformer/commit/b688c4a6889250bacfd2a81c9de8a1436281daa9))
* add axios mocking to component test-suite ([#2638](https://github.com/rudderlabs/rudder-transformer/issues/2638)) ([100c808](https://github.com/rudderlabs/rudder-transformer/commit/100c80881eb99716198231deb9ec0e69dc3fa2a0))
* add circular reference check in flattern json ([#2650](https://github.com/rudderlabs/rudder-transformer/issues/2650)) ([a21ea3a](https://github.com/rudderlabs/rudder-transformer/commit/a21ea3aaecfc3d10de3f4eaa34425dda388032ff))
* **gaec:** partial failures handling ([#2631](https://github.com/rudderlabs/rudder-transformer/issues/2631)) ([0008277](https://github.com/rudderlabs/rudder-transformer/commit/0008277fe43d20ced4066f8f1f1b0f1d12345f01))
* **iterable:** user deletion support ([#2621](https://github.com/rudderlabs/rudder-transformer/issues/2621)) ([c0ab19a](https://github.com/rudderlabs/rudder-transformer/commit/c0ab19a293a72ea0a7575b863356aea9a0e6762f))
* tslint rules enable ([#2604](https://github.com/rudderlabs/rudder-transformer/issues/2604)) ([4d6c4b8](https://github.com/rudderlabs/rudder-transformer/commit/4d6c4b834de005484dc1099a52c69ab6212273e8))


### Bug Fixes
* add optional chaining for traits ([#2677](https://github.com/rudderlabs/rudder-transformer/issues/2677)) ([b80bfbc](https://github.com/rudderlabs/rudder-transformer/commit/b80bfbc8a6afdef57ad5f2560bb803c8e00bcbfc))
* add auth status inactive category handling to GA in userDeletion flow ([#2669](https://github.com/rudderlabs/rudder-transformer/issues/2669)) ([b784800](https://github.com/rudderlabs/rudder-transformer/commit/b7848004e2679ec7278c8381560cb1a77da6c642))
* add optional chaining for error message in network handler of Intercom ([#2648](https://github.com/rudderlabs/rudder-transformer/issues/2648)) ([10a13bc](https://github.com/rudderlabs/rudder-transformer/commit/10a13bcf7f987de45540b52d414883664e43f9cd))
* bqstream event ordering fix ([#2624](https://github.com/rudderlabs/rudder-transformer/issues/2624)) ([e97e7ca](https://github.com/rudderlabs/rudder-transformer/commit/e97e7caed20ffb007f1c543e15c15c6e89e2dfb7))
* **hubspot:** add validation for hubspotEvents ([#2643](https://github.com/rudderlabs/rudder-transformer/issues/2643)) ([b49d0ee](https://github.com/rudderlabs/rudder-transformer/commit/b49d0ee576f55e5f95e3d02b7111e995fc9b8ada))
* **mixpanel:** batch event ordering ([#2608](https://github.com/rudderlabs/rudder-transformer/issues/2608)) ([36c7f06](https://github.com/rudderlabs/rudder-transformer/commit/36c7f06ccfa534b751ca9b3f5c41e9bb6d2e9f00))
* refactor adjust using optional chaining ([#2671](https://github.com/rudderlabs/rudder-transformer/issues/2671)) ([f63b493](https://github.com/rudderlabs/rudder-transformer/commit/f63b4932d5ba467a82a36d3e8b80578f81f729cf))
* **snyk:** fix dependencies version from snyk ([#2640](https://github.com/rudderlabs/rudder-transformer/issues/2640)) ([8422744](https://github.com/rudderlabs/rudder-transformer/commit/8422744b3af48f71358f7acbe2df7b3688ce04a8))
* **snyk:** removed aws-sdk dependency ([08a3535](https://github.com/rudderlabs/rudder-transformer/commit/08a3535257e5d84566c95cebc701613478f0e039))
* **snyk:** removed the new added dependencies ([364779c](https://github.com/rudderlabs/rudder-transformer/commit/364779ce959d7548e5cf1cc8c718b71331dcb378))
* **snyk:** snyk updated versions merged to oen pr ([16a9b8e](https://github.com/rudderlabs/rudder-transformer/commit/16a9b8e6cc26a8df1331cb1af8774df7cc05c959))
* use promise for prompts in personalize create tracking script ([#2635](https://github.com/rudderlabs/rudder-transformer/issues/2635)) ([5fbddd1](https://github.com/rudderlabs/rudder-transformer/commit/5fbddd1490b16dbda6bca19df4cac5bef6ff78c5))

### [1.43.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.43.0...v1.43.1) (2023-09-26)


### Bug Fixes

* **dm:** updated the stats definition for the tracking plan service ([eb2724f](https://github.com/rudderlabs/rudder-transformer/commit/eb2724f135d2c3c2a1fb8a88051cfb0f2720b5ed))
* **iterable:** event id mapping ([#2659](https://github.com/rudderlabs/rudder-transformer/issues/2659)) ([84083aa](https://github.com/rudderlabs/rudder-transformer/commit/84083aa671312e3934414b5534489fba87d9b29f))

## [1.43.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.42.0...v1.43.0) (2023-09-25)


### Features

* update google_cloud_function implementation as per custom destination ([#2652](https://github.com/rudderlabs/rudder-transformer/issues/2652)) ([5c981e1](https://github.com/rudderlabs/rudder-transformer/commit/5c981e12c8e203c80229881a07704c6413c842a9))

## [1.42.0](https://github.com/rudderlabs/rudder-transformer/compare/v1.41.1...v1.42.0) (2023-09-18)


### Features

* added profiling endpoints to fetch profiles ([#2540](https://github.com/rudderlabs/rudder-transformer/issues/2540)) ([e537364](https://github.com/rudderlabs/rudder-transformer/commit/e537364841729f738e75bfbf859abad745f1f78f))
* google ads v14 upgrade ([#2578](https://github.com/rudderlabs/rudder-transformer/issues/2578)) ([f44a951](https://github.com/rudderlabs/rudder-transformer/commit/f44a951fc2a23135e3d0950d7a29421ca939de1a))
* introduce de-activation of authStatus for access_denied or inva… ([#2598](https://github.com/rudderlabs/rudder-transformer/issues/2598)) ([3b1fef6](https://github.com/rudderlabs/rudder-transformer/commit/3b1fef63c7aee376dd67c6b3235095f311d673fb))
* **mixpanel:** add incremental properties support ([#2550](https://github.com/rudderlabs/rudder-transformer/issues/2550)) ([e98ea84](https://github.com/rudderlabs/rudder-transformer/commit/e98ea84265ee37bfc6d3e99104af7bb4a3d78007))
* onboard fullstory cloud mode ([#2536](https://github.com/rudderlabs/rudder-transformer/issues/2536)) ([dfd6117](https://github.com/rudderlabs/rudder-transformer/commit/dfd6117fbba521941876bc9681858d4a6d32b0bf))
* onboard intercom to transformer proxy ([#2548](https://github.com/rudderlabs/rudder-transformer/issues/2548)) ([ed27a11](https://github.com/rudderlabs/rudder-transformer/commit/ed27a11799ded0e9f7f77401ddc58061a5908b37))
* onboard launchdarkly audience ([#2529](https://github.com/rudderlabs/rudder-transformer/issues/2529)) ([082e1d1](https://github.com/rudderlabs/rudder-transformer/commit/082e1d190f4df152cd7dc3141cc33b406720215f))


### Bug Fixes

* **INT-339:** marketo response handler to handle static list removed and skipped statuses ([#2606](https://github.com/rudderlabs/rudder-transformer/issues/2606)) ([e3fed49](https://github.com/rudderlabs/rudder-transformer/commit/e3fed49d2725a6c60409db00cfda2a997da78e71))
* **INT-339:** marketo response handler to handle static list removed and skipped statuses ([#2620](https://github.com/rudderlabs/rudder-transformer/issues/2620)) ([87d8216](https://github.com/rudderlabs/rudder-transformer/commit/87d82165089b706da1213cb3859f0f6d73f917db))
* **INT-523:** replaced flag with dropdown for datacenter selection ([#2575](https://github.com/rudderlabs/rudder-transformer/issues/2575)) ([735d5d1](https://github.com/rudderlabs/rudder-transformer/commit/735d5d1e4f1d84edaed488642eefe8d41bf6f20a))
* **INT-568:** slack send event to event specific channel based on channel webhook  ([#2563](https://github.com/rudderlabs/rudder-transformer/issues/2563)) ([0f3b39e](https://github.com/rudderlabs/rudder-transformer/commit/0f3b39e64f50cec54a5fcd59e0da298092ca0f22))
* **INT-591:** added support of id parameter for update events ([#2595](https://github.com/rudderlabs/rudder-transformer/issues/2595)) ([a2a9c37](https://github.com/rudderlabs/rudder-transformer/commit/a2a9c374517826738ba9677511c6247316fc836e))
* **iterable:** updated mappings ([#2602](https://github.com/rudderlabs/rudder-transformer/issues/2602)) ([23bb1f6](https://github.com/rudderlabs/rudder-transformer/commit/23bb1f64168f0e0a2ded4cbce8c99ef807fef9ad))
* pyroscope endpoints ([#2613](https://github.com/rudderlabs/rudder-transformer/issues/2613)) ([7d268f0](https://github.com/rudderlabs/rudder-transformer/commit/7d268f046f92d86f48ced06c586b0d098a913113))
* remove hashing on twclid for twitter ads ([#2605](https://github.com/rudderlabs/rudder-transformer/issues/2605)) ([6c984a4](https://github.com/rudderlabs/rudder-transformer/commit/6c984a4821124e1054be1c81a9bf110c36311f13))
* seperate build steps for ruddestack and rudderlabs repo ([#2625](https://github.com/rudderlabs/rudder-transformer/issues/2625)) ([fcafacd](https://github.com/rudderlabs/rudder-transformer/commit/fcafacd10be7f1c9c001a6a805b4cb9daafd4413))
* **transformation:** block ipv6 requests in user transformer ([#2618](https://github.com/rudderlabs/rudder-transformer/issues/2618)) ([fd81211](https://github.com/rudderlabs/rudder-transformer/commit/fd8121108594d6ca032c36c7b8d47d26c1b389e0))

### [1.41.1](https://github.com/rudderlabs/rudder-transformer/compare/v1.41.0...v1.41.1) (2023-09-14)


### Bug Fixes

* **redis:** add destination_id in the key ([55629d6](https://github.com/rudderlabs/rudder-transformer/commit/55629d6d871d275de601a11ec223e0c283641d7b))

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

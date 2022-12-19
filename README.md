[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![jest](https://jestjs.io/img/jest-badge.svg)](https://github.com/facebook/jest)
[![codecov](https://codecov.io/gh/rudderlabs/rudder-transformer/branch/master/graph/badge.svg)](https://codecov.io/gh/rudderlabs/rudder-transformer)

# RudderStack Transformer

RudderStack Transformer is a service which transforms the RudderStack events to destination-specific singular events. This feature is released under
under the [MIT license](https://github.com/rudderlabs/rudder-transformer/blob/master/LICENSE.md).

## Transformer Setup

### Docker

If you want to run the RudderStack Transformer inside a Docker container, follow these steps:

1. Clone this repository
2. Run `docker-compose up transformer`

### Native Installation

On Mac, if you don't have `make` and `g++`, you would have to install `Xcode Command Line Tools` using `xcode-select --install`.

On Linux, install the required dependencies `python`, `make` and `g++` and follow these steps:

1. Clone this repository
2. Run `npm run setup`
3. Start the server with `npm start`

## Transformer without User Functions

If you don't need user functions, you can skip those and run a destination-only transformer.

### Docker

If you want to run the RudderStack Transformer (without the user functions) inside a Docker container, follow these steps:

1. Clone this repository
2. Run `docker-compose up transformer-no-func`

### Native Installation

On Mac, if you don't have `make` and `g++`, you would have to install `Xcode Command Line Tools` using `xcode-select --install`.

On Linux, install the required dependencies `python`, `make` and `g++` and follow these steps:

1. Clone this repository
2. Run `npm run setup`
3. Start the server with `ENABLE_FUNCTIONS=false npm start`

## Contact Us

If you come across any issues while setting up or running the RudderStack Transformer, feel free to start a conversation on our [Slack](https://resources.rudderstack.com/join-rudderstack-slack) channel.

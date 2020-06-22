[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![jest](https://jestjs.io/img/jest-badge.svg)](https://github.com/facebook/jest)
[![codecov](https://codecov.io/gh/rudderlabs/rudder-transformer/branch/master/graph/badge.svg)](https://codecov.io/gh/rudderlabs/rudder-transformer)
# rudder-transformer

Transformer is a service which transforms Rudder events to destination specific singular events. This is released under
under [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)

## Setup

### Transformer

#### Docker

If you want to run this inside a Docker container

1. Clone the repository
2. Run `docker-compose up transformer`

#### Native Installation

On Mac, if you don't have `make` and `g++`, you would have to install `Xcode Command Line Tools` using `xcode-select --install`

On Linux, install the required dependencies `python`, `make` and `g++`

1. Clone the repository
2. Run `npm install`
3. Start the server with `npm start`

### Transformer without User Functions

If you don't need user functions, you can skip that and run a destination only transformer

#### Docker

If you want to run this inside a Docker container

1. Clone the repository
2. Run `docker-compose up transformer-no-func`

#### Native Installation

1. Clone the repository
2. Run `ENABLE_FUNCTIONS=false npm install`
3. Start the server with `ENABLE_FUNCTIONS=false npm start`

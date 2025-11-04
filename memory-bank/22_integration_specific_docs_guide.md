# Integration Documentation Guide Extended

## Role and Objective

You are a documentation engineer with reasoning, search and access to various repositories at rudderstack and you are tasked to create a detailed documentation of an integration with a guide. Reason if enough information is available to fill in accurate details of any section in the documentation; if there isn’t enough information or confidence, make sure to leave it blank with a note that it requires a review.

Combine this guide with [previous guide](https://github.com/rudderlabs/rs-ai/blob/main/memory-banks/rudder-transformer/15_integration_specific_docs.md) to create a comprehensive documentation.

## Examples

Use braze destination in rudder-transformer source code as an example to understand the documentation.

## Documentation Files and Folder structure

- README.md → Primary doc with majority of answers and links to supporting docs
- `docs/` → Folder to hold any other supporting docs ( these should be linked in `README.md` )
  - `retl.md`
  - `businesslogic.md`
- These files should be placed in the integration folder being documented

## README md ( Focus on Event stream functionality )

- **Integration Functionalities**
  - Destination config and their functionalities
    - Source them from `schema.json` in `rudder-integrations-config`
    - Pick only the ones being used in the destination source code. These are accessible in the code via `destination.Config`
  - Implemented in JS/TypeScript or CDK v2
    - Based on destination implemented in `src/cdk` folder vs `src/v<0|1>/destinations` folder
    - If `config.cdkV2Enabled == true` in `db-config.json` in `rudder-integrations-config`
  - Supported message types
    - `supported message types` in `rudder-integrations-config` ( also refer the implementation code in transformer )
  - Supports batching ? If yes, for what message types
    - From source code
  - Deals with intermediate calls. ? If yes, document these per event type flow, include end points and why these are necessary. This will also be helpful later in documenting business-logic.
    - From source code
  - Supports proxy delivery ? If yes, provide the source code path
    - `networkHandler.js` should be implemented in transformer ( This should be enough to know )
    - (If this is available in context) In `rudder-devops` repository > `global.serverConfigOverride.Router.<DESTINATION>.transformerProxy == true`
  - Supports user deletion ? If yes, provide the source code path
    - Verify by checking for `deleteUsers.js` under destination (e.g., `src/v0/destinations/{destination}/deleteUsers.js` or `src/v1/destinations/{destination}/deleteUsers.js`). If present, document support and the file path.
  - Supports oauth?
    - If `config.auth.type == OAuth` in `db-config.json` in `rudder-integrations-config`
  - Processor vs Router destination
    - If `config.transformAtV1` == "processor", then it is a processor destination
    - If `config.transformAtV1` == "router", then it is a router destination
  - Partial batching response handling is available or not?
    - Figure out from source code. If a `networkHandler.js` is present for the destination (e.g., `src/v0/destinations/{destination}/networkHandler.js` or `src/v1/destinations/{destination}/networkHandler.js`), then proxy delivery is supported. Partial batching response handling is available for v1 proxy destinations.
  - Any additional functionalities: like dedupe in braze
    - Source code ( transformer )
    - `schema.json` + `ui-config.json` from `rudder-integrations-config` should also give some insights based on destination configuration
  - Validations ( What are validations, restrictions, necessities imposed on various attributes of incoming events for each event type and business logic )
    - From source code
  - Rate Limits
    - From destination documentation ( search the internet )
- **General queries**
  - Event ordering required ?
    - This has to be decided for event type , business logic flow as it varies.
    - Events which are updating the user/customer/contact profile requires event ordering because we might risk updating the profile with stale data if they are not in order. ( Identify, alias, subscription related, etc )
    - Track based events which tend to have a requirement of some form of timestamp can be more flexible with event ordering
    - There might be exceptions, side-effects of other features like batching, deduplication, absence of timestamps etc to be considered while reasoning
    - Make sure to **search the internet** for the docs to support your reasoning.
  - Data Replay Feasibility ?
    - what if data is missing & need to replay ?
      - For each event type, if event ordering is not necessary, it is feasible to replay missing old data. Might have exceptions, so reason based on the destination.
    - what if data is already delivered & need to replay ?
      - For this to be possible, the integration itself should treat track events based on some unique id and overwrite it upon receiving events with the same unique id. This is a very rare case. Make sure to **search the internet** to support your reasoning.
  - Rate limits and Batch sizes
    - Search the internet in the api docs to find out the rate limits of each of the endpoints being utilised in the source code
    - Check if there are any batching possibilities of apis being used, batching limits (size, length etc). Also check the source code for the batching limits implemented.
  - Multiplexing
    - Does the integration multiplex? ( Multiplexing is when an integration generates multiple output events from a single input event. For example, creating both a track event and an identify event from a single source event. )
    - From source code, understand which event types, flows lead to multiplexed events and document them.
    - If an api call is made as an intermidiate call, document the reason for it.
- **Version Deprecation cadence**
  - what is the current version being used & end-of-life ?
    - Look for `config.js` file or patterns in api endpoints or any other clues associated with version of destination api.
    - Search the internet for docs around versions available, to get the deprecation date or tentative deprecation period or if deprecation will never happen
  - Is there a new version available ?
    - Search the internet for docs around new versions available
    - See if change log is available and add possible breaking changes between the version in use and the new version available.
  - Maintain all the documentation link references also
- **RETL section** —> redirect to **docs/retl.md**
- **Business logic** —> redirect to **docs/businesslogic.md**
- **FAQ section**
  - Any reference to the destination implementation to answer questions that are not directly available in the documentation but had to reasoned and researched about should be added in the FAQ section. (Not during the documentation creation though)

## docs/retl.md for retl functionalities

- Is RETL supported at all?
  - if `db-config.json > supportedSourceTypes > warehouse is missing` in the repository `rudder-integrations-config` then it is not supported

If RETL is supported, then answer the following questions: - Which type of retl support does it have? ( it can have multiple - JSON Mapper, VDM V1, VDM V2 ) - By default, it supports JSON Mapper unless `db-config.json > disableJsonMapper > true` is present in `rudder-integrations-config` - Does it have vdm support? - if `db-config.json > supportsVisualMapper > true` is present in `rudder-integrations-config`
VDM V1 is definitely supported. - Does it have vdm v2 support? ( if VDM support is there via supportsVisualMapper == true and ...) - if `db-config.json > supportedMessageTypes > record` is present in `rudder-integrations-config` - and transformer code has logic handling record event type in it - connection config - To document retl flow, go through logic which is under `mappedToDestination === true` or any handling of `record` event type.

## docs/businesslogic.md for business logics

- mappings
- Flow of logic
  - Can go into detail regarding how each event type is handled
  - Include validations section ( necessary fields, their types, formats etc )
- general use-cases of the ingested data

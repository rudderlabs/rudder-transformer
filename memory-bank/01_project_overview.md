# Project Overview

## Name

RudderStack Transformer

## Description

RudderStack Transformer is a service that handles both source and destination integrations in the RudderStack ecosystem. It acts as a middleware that:

1. Transforms data from external sources (webhooks, cloud apps) into [RudderStack's standard event](https://www.rudderstack.com/docs/event-spec/standard-events/) format
2. Transforms RudderStack events to destination-specific formats required by different destinations

This bidirectional transformation capability enables seamless data flow throughout the RudderStack ecosystem. This feature is released under the Elastic License 2.0.

## Objectives

- Transform data from external sources into [RudderStack's standard event](https://www.rudderstack.com/docs/event-spec/standard-events/) format
- Transform events from RudderStack format to integration-specific formats
- Support various destinations and sources for data integration
- Provide a scalable and reliable transformation service
- Enable custom transformations through user functions
- Support batch processing for efficient data handling
- Ensure high-performance event processing
- Maintain compatibility with the RudderStack ecosystem
- Facilitate cloud mode integrations

## Scope

The transformer handles bidirectional data transformation for all supported sources and destinations in the RudderStack ecosystem. It includes processing logic for different event types (identify, track, page, etc.) and supports both processor and router transformation modes.

Key responsibilities include:

- Receiving data from external sources and transforming to RudderStack format
- Receiving events from RudderStack server and transforming to destination formats
- Handling batching and rate limiting
- Error handling and reporting
- Supporting custom transformations
- Providing metrics and monitoring
- Managing integration-specific configurations and requirements

## Timeline

Ongoing development with regular version releases (current version: 1.96.0)

## Team Members

The RudderStack Transformer is maintained by the Integration Team at RudderStack. The Integration Team works closely with the SDK Team. The responsibilities are divided as follows:

**Integration Team is responsible for:**

- Building and maintaining cloud mode integrations in rudder-transformer
- Developing the core transformation functionality
- Improving transformation logic
- Fixing bugs and addressing issues
- Enhancing performance and reliability
- Developing JS SDK device mode integrations (located in the [rudder-sdk-js](https://github.com/rudderlabs/rudder-sdk-js) repository)

**SDK Team is responsible for:**

- Building various SDKs (JavaScript, Android, iOS, Kotlin, etc.)
- Developing device mode integrations for mobile platforms (Android, iOS, etc.) where data is sent directly from the device to destinations
- Maintaining SDK functionality and performance

## Integration with Event Stream Pipeline

The transformer is a critical component of RudderStack's Event Stream pipeline, which collects real-time user event data and sends it to integrations across the customer's stack. The transformer ensures that events collected from various sources (SDKs, cloud apps) are properly formatted for each destination.

## System Dependencies

RudderStack Transformer has dependencies on other repositories in the RudderStack ecosystem:

1. **rudder-server**: Makes API calls to rudder-transformer for event transformation and delivery
2. **rudder-ingestion-svc**: Makes API calls to rudder-transformer for source data transformation
3. **rudder-integrations-config**: Provides destination and source configurations that rudder-transformer implements

These dependencies are critical to the functioning of the RudderStack data pipeline, as they define how data flows between different components of the system. For more detailed information, see the System Dependencies document.

# System Dependencies

This document outlines the dependencies and interactions between rudder-transformer and other components in the RudderStack ecosystem.

## Direct Dependencies

### RudderStack Libraries

The rudder-transformer directly depends on several RudderStack libraries:

1. **@rudderstack/integrations-lib** (v0.2.25)

   - Provides common utilities and interfaces for integrations
   - Used for implementing destination and source integrations

2. **@rudderstack/json-template-engine** (v0.19.5)

   - Provides templating capabilities for transforming data
   - Used for dynamic transformations based on templates

3. **@rudderstack/workflow-engine** (v0.8.13)
   - Provides workflow management capabilities
   - Used for orchestrating complex transformation processes

## API Interactions

### rudder-server → rudder-transformer

The rudder-server has two main components that interact with rudder-transformer:

1. **Processor Component**

   - Responsible for processing events, including executing User Transformation functions
   - Makes API calls to rudder-transformer for destination transformation
   - Uses `POST /:version/destinations/:destination` endpoint
   - Transforms events to destination-specific format during the processing phase

2. **Router Component**

   - Responsible for delivering events to destinations
   - When delivery is delayed (e.g., due to slow destination response or high event volume), the initial transformation may contain stale information (like expired tokens)
   - Makes API calls to rudder-transformer for just-in-time transformation before delivery
   - Uses `POST /routerTransform` endpoint
   - Ensures events have fresh, valid information when they're finally delivered
   - Transforms events to destination-specific format for multiple destinations of the same type
   - Does not deliver events itself; only handles the transformation

3. **Batch Processing**

   - Used for efficient handling of large volumes of events
   - Makes API calls to rudder-transformer for batch transformation
   - Uses `POST /batch` endpoint
   - Transforms multiple events at once

4. **Delivery**

   - Responsible for delivering events to destinations
   - Makes API calls to rudder-transformer for proxying requests to destinations
   - Uses `POST /v0/destinations/:destination/proxy` and `POST /v1/destinations/:destination/proxy` endpoints
   - Handles the actual API calls to destination endpoints
   - Parses destination responses and converts them to standard HTTP status codes
   - Enables rudder-server to handle responses appropriately (e.g., retry on 500/429 errors, abort on 400 errors)

### rudder-ingestion-svc → rudder-transformer

The rudder-ingestion-service makes API calls to rudder-transformer for source transformations:

1. **Source Transformation** (`POST /:version/sources/:source`)
   - Called when data is received from external sources
   - Transforms source-specific data to [RudderStack's standard event](https://www.rudderstack.com/docs/event-spec/standard-events/) format
   - Used for ingesting data from various sources

## Configuration Dependencies

### rudder-integrations-config → rudder-transformer

The rudder-integrations-config repository provides configuration for destinations and sources:

1. **Destination Configurations**

   - Defines the configuration schema for destinations
   - Specifies required fields, validation rules, and default values
   - Used by rudder-transformer to validate and process destination configurations

2. **Source Configurations**

   - Defines the configuration schema for sources
   - Specifies required fields, validation rules, and default values
   - Used by rudder-transformer to validate and process source configurations

3. **Integration Metadata**
   - Provides metadata about integrations (display name, logo, documentation, etc.)
   - Used for UI rendering and documentation generation
   - Helps rudder-transformer identify and load the correct integration

## Compatibility Requirements

The rudder-transformer has specific compatibility requirements with other components:

1. **Server-Transformer Compatibility**

   - Each rudder-server release has a dependency on specific minimum required versions of rudder-transformer
   - Each rudder-transformer release has compatibility requirements with rudder-server versions
   - Breaking changes in either component require coordinated releases

2. **Integration Configuration Compatibility**
   - Changes to integration configurations in rudder-integrations-config must be compatible with the implementation in rudder-transformer
   - New fields or changes to validation rules must be reflected in both repositories

## System Flow

The overall flow of data through the RudderStack system involving rudder-transformer:

1. **Data Collection**

   - Data is collected from various sources (SDKs, webhooks, cloud apps)
   - For device mode: data flows directly from the device to destinations
   - For cloud mode: data is sent to rudder-server

2. **Data Processing (Cloud Mode)**

   - rudder-server receives the data
   - rudder-server's processor component calls rudder-transformer for initial transformation
   - rudder-transformer transforms the data based on destination requirements
   - rudder-server's router component may call rudder-transformer again for just-in-time transformation before delivery
   - rudder-server sends the transformed data to destinations

3. **Source Ingestion**
   - External sources send data to rudder-ingestion-svc
   - rudder-ingestion-svc calls rudder-transformer for source transformation
   - rudder-transformer converts source-specific data to [RudderStack's standard event](https://www.rudderstack.com/docs/event-spec/standard-events/) format
   - The standardized data is processed by rudder-server

## Deployment Considerations

When deploying rudder-transformer, consider the following:

1. **Version Compatibility**

   - Ensure compatibility with the deployed version of rudder-server
   - Check the Server-Transformer Compatibility documentation

2. **Configuration Updates**

   - Ensure that the integration configurations are up-to-date
   - Synchronize updates between rudder-integrations-config and rudder-transformer

3. **Scaling**

   - rudder-transformer should be scaled based on the volume of events
   - Consider horizontal scaling for high-volume deployments

4. **Monitoring**
   - Monitor API endpoints for errors and performance issues
   - Track transformation metrics for each destination and source

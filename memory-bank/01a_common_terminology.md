# 1a. Common Terminology in Rudder-Transformer

This document defines common terminology used in the context of rudder-transformer to establish a shared understanding of key concepts.

## Core Concepts

### Transformer

A service that handles bidirectional data transformation between different formats in the RudderStack ecosystem. It transforms data from external sources into RudderStack's standard event format and transforms RudderStack events into destination-specific formats.

### Batching

The process of grouping multiple events together to be processed as a single unit, improving efficiency and reducing API calls. Batching is used in both source and destination transformations to optimize performance and handle rate limiting requirements.

### Transform Proxy

A component that handles the communication between rudder-server and external destination APIs. It transforms events to destination-specific formats and handles responses from destinations, converting them to standardized formats that rudder-server can process.

### Deliver

The process of sending transformed events to their final destinations. This includes handling authentication, rate limiting, retries, and processing responses from destination APIs.

### Router

A component that routes events to appropriate destinations based on configuration. The router transformation mode converts events to destination-specific formats before delivery.

### Processor

A component that processes events before they are routed to destinations. The processor transformation mode applies transformations to events as they flow through the RudderStack pipeline.

### Multiplexing

The process of generating multiple output events from a single input event. For example, creating both a track event and an identify event from a single source event.

## Data Flow Components

### Source

An origin point for data in the RudderStack ecosystem. Sources can be SDKs, webhooks, cloud applications, or other data providers that send data to RudderStack.

### Destination

An endpoint where transformed data is delivered. Destinations can be analytics platforms, marketing tools, data warehouses, or other systems that receive data from RudderStack.

### Source Transformation

The process of converting data from external sources (like webhooks, cloud apps) into RudderStack's standard event format. This includes parsing, normalizing, and validating incoming data.

### Destination Transformation

The process of converting RudderStack's standard events into formats required by specific destinations. This includes formatting, validation, and applying destination-specific business logic.

### User Transformation

Custom code written by users to modify events as they flow through the RudderStack pipeline. User transformations can be applied to events before they are sent to destinations.

## Transformation Types

### Router Transformation

A transformation mode that converts events to destination-specific formats for client-side destinations. Router transformations are typically lighter and focus on formatting data correctly for the destination.

### Processor Transformation

A transformation mode that processes events for server-side destinations. Processor transformations can include more complex logic, such as batching, validation, and error handling.

### Batch Transformation

A transformation that processes multiple events at once, optimizing for efficiency and respecting destination-specific batching requirements.

## Technical Concepts

### Proxy V0/V1

Different versions of the transformation proxy implementation. Proxy V1 provides more granular error handling and supports partial batch failure handling, while Proxy V0 uses an all-or-nothing approach to batch processing.

### Transform Message

A data structure containing events to be transformed, along with metadata about the source, destination, and transformation requirements.

### Event Schema

The structure and format of event data as it flows through the RudderStack ecosystem. RudderStack uses a standardized event schema for internal processing.

### Integration

A connection between RudderStack and an external system (source or destination). Integrations define how data is transformed and transferred between systems.

### CDK (Connection Development Kit)

Framework for developing new destination integrations in a standardized way, providing templates and ensuring consistent behavior across integrations.

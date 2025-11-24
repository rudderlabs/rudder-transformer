# JavaScript User Transformation V1 Architecture

## Overview

The V1 user transformation system provides a secure, isolated environment for executing user-defined JavaScript code using **isolated-vm**. It creates brand new V8 isolate instances for each request, providing complete isolation from the Node.js main process while enabling controlled external API access.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Request Flow](#request-flow)
- [IVM (Isolated-VM)](#ivm-isolated-vm)
- [External API Architecture](#external-api-architecture)
- [Test Mode](#test-mode)

---

## Architecture Overview

### Core Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Main Node.js Process                    │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              User Transform Handler V1                │  │
│  │  - Extracts credentials from events                   │  │
│  │  - Selects factory                                    │  │
│  │  - Prepares transformation payload                    │  │
│  └───────────────┬───────────────────────────────────────┘  │
│                  │                                          │
│                  ▼                                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              IVM Factory (ivmFactory.js)              │  │
│  │  - getFactory() - Fresh isolate every time            │  │
│  └───────────────┬───────────────────────────────────────┘  │
│                  │                                          │
│                  ▼                                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │            createIvm() - Isolate Builder              │  │
│  │  1. Load external libraries                           │  │
│  │  2. Create isolate with memory limit                  │  │
│  │  3. Inject external APIs (fetch, geolocation, etc)    │  │
│  │  4. Compile user code as ES6 module                   │  │
│  │  5. Create transformation wrapper function            │  │
│  └───────────────┬───────────────────────────────────────┘  │
│                  │                                          │
└──────────────────┼──────────────────────────────────────────┘
                   │
                   ▼
    ┌──────────────────────────────────────────────┐
    │         V8 Isolate (Sandboxed)               │
    │                                              │
    │  ┌────────────────────────────────────────┐  │
    │  │   User Transformation Code             │  │
    │  │   - transformEvent(event, metadata)    │  │
    │  │   - OR transformBatch(events, meta)    │  │
    │  └────────────────────────────────────────┘  │
    │                                              │
    │  Available APIs:                             │
    │  - fetch(url, options) → Promise<any>        │
    │  - fetchV2(url, options) → Promise<Response> │
    │  - geolocation(ip) → Promise<GeoData>        │
    │  - getCredential(key) → string               │
    │  - metadata(event) → EventMetadata           │
    │  - log(...args) → void (test mode only)      │
    │                                              │
    └──────────────────────────────────────────────┘
```

### Key Characteristics

| Aspect                 | V1 Behavior                                                    |
| ---------------------- | -------------------------------------------------------------- |
| **Isolate Lifecycle**  | Created fresh per request                                      |
| **Memory Isolation**   | Complete - separate V8 heap                                    |
| **Memory Limit**       | 128MB (configurable via `ISOLATE_VM_MEMORY`)                   |
| **Timeout**            | Dual: IVM timeout (4s) + overall timeout (600s to be enforced) |
| **Module System**      | ES6 modules with import/export                                 |
| **External Libraries** | Loaded and compiled as isolate modules                         |
| **Stats Identifier**   | `V1` (uppercase)                                               |

---

## Request Flow

### Standard Request Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Request Arrives (userTransformHandlerV1)                 │
│    - events: Array of transformation requests               │
│    - userTransformation: fetch from database by versionId   |
|                          { code, versionId, language, ... } │
│    - libraryVersionIds: Array of library version IDs        │
│    - testMode: boolean                                      │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Extract Credentials                                      │
│    - credMap = extractCredentialsFromEvents(events)         │
│    - Maps credential keys to values for getCredential() API │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Initialize Factory                                       │
│    factory = await getFactory(                              │
│      code, libraryVersionIds, transformationId,             │
│      workspaceId, credMap, secrets, testMode,               │
│      transformationName, transformationVersionId            │
│    )                                                        │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Create fresh Isolate Instance                            │
│    isolatevm = await factory.create()                       │
│    Returns: { isolate, context, fnRef, fName, logs, ... }   │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Prepare Transformation Payload                           │
│    transformationPayload = {                                │
│      events: events,                                        │
│      transformationType: 'transformEvent' or                │
│                          'transformBatch'                   │
│    }                                                        │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Copy Data into Isolate                                   │
│    sharedPayload = new ivm.ExternalCopy(payload)            │
│                       .copyInto({ transferIn: true })       │
│    - Deep copy of data into isolate memory                  │
│    - transferIn: true = transfer ownership, no double mem   │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. Execute Transformation                                   │
│    await bootstrapScriptResult.apply(undefined, [           │
│      fnRef,                    // Function reference        │
│      new ivm.Reference(resolve), // Success callback        │
│      new ivm.Reference(reject),  // Error callback          │
│      sharedPayload               // Events to transform     │
│    ])                                                       │
│    - Enforced with IVM_EXECUTION_TIMEOUT (4s)               │
│    - Wrapped in USER_TRANSFORM_TIMEOUT (600s) Promise.race  │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. Collect Metrics                                          │
│    - Execution latency                                      │
│    - Event success / failure counts                         │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│ 9. Cleanup & Destroy                                        │
│     factory.destroy(isolatevm)                              │
│     - Release fnRef, customScriptModule, context            │
│     - Dispose isolate (invalidates all references obtained) │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│ 10. Return Results                                          │
│     { transformedEvents, logs }                             │
└─────────────────────────────────────────────────────────────┘
```

---

## IVM (Isolated-VM)

### What is Isolated-VM?

`isolated-vm` is a library for nodejs which gives you access to v8's `Isolate` interface. This allows you to create JavaScript environments which are completely _isolated_ from each other.

**Core Concept:**

An **isolate** is a separate instance of the V8 JavaScript engine with its own heap, garbage collector, and execution context. Think of it as a mini JavaScript runtime running inside your Node.js process, but completely sandboxed from the main process and other isolates.

**Architectural Benefits:**

| Aspect              | Description                         | Security Benefit                                       |
| ------------------- | ----------------------------------- | ------------------------------------------------------ |
| **Heap Isolation**  | Each isolate has its own V8 heap    | User code cannot access Node.js heap or other isolates |
| **Memory Limits**   | Per-isolate memory enforcement      | Prevents memory exhaustion attacks                     |
| **CPU Control**     | Timeout and execution limits        | Prevents infinite loops and CPU hogging                |
| **No Shared State** | Zero shared memory between isolates | No side-channel attacks via shared state               |
| **Thread Safety**   | Can run on separate threads         | Parallel execution without race conditions             |

---

### Isolate vs Context vs Jail

```
┌─────────────────────────────────────────────────────────┐
│                    V8 Isolate                           │
│  - Owns heap, garbage collector                         │
│  - Memory limit enforced at this level                  │
│  - Can contain multiple contexts                        │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │               Context #1                          │  │
│  │  - Execution environment                          │  │
│  │  - Separate global object                         │  │
│  │  - All JavaScript runs within a context           │  │
│  │                                                   │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │   context.global (aka "jail")               │  │  │
│  │  │  - Reference to context's global object     │  │  │
│  │  │  - Where we inject APIs (fetch, etc.)       │  │  │
│  │  │  - Accessible via jail.set(name, value)     │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │               Context #2 (optional)               │  │
│  │  - Could have different global object             │  │
│  │  - Shares same heap with Context #1               │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Key Differences:**

- **Isolate**: Container for entire V8 instance (heavyweight)
- **Context**: Execution environment within isolate (lightweight)
- **Jail**: Reference to context's global object (just a pointer)

**In Our Code:**

```javascript
const isolate = new ivm.Isolate({ memoryLimit: 128 }); // Create isolate
const context = await isolate.createContext(); // Create context within isolate
const jail = context.global; // Get reference to global
await jail.set('global', jail.derefInto()); // Make global accessible to user code
```

---

### Context Structure and References

**Isolate Context Contains:**

```
{
  isolate: <V8 Isolate>,              // The isolated VM instance
  context: <V8 Context>,              // Execution context within isolate
  bootstrapScriptResult: <Reference>, // Compiled bootstrap code
  fnRef: <Reference>,                 // Reference to transformWrapper function
  fName: <String>,                    // 'transformEvent' or 'transformBatch'
  logs: <Array>,                      // Console.log output (test mode)
  compiledModules: <Object>,          // Loaded library modules
}
```

---

### Data Copying Mechanism

#### ExternalCopy - Serialization and Transfer

```javascript
const sharedPayload = new ivm.ExternalCopy(transformationPayload).copyInto({ transferIn: true });
```

**How It Works:**

1. **Serialization (ExternalCopy)**

   - Data serialized using [structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)
   - Primitives copied as-is
   - Objects deep-cloned
   - ArrayBuffers copied in efficient binary format
   - Transferable objects (like References) preserved

2. **Transfer (copyInto)**
   - Deserializes data into target isolate
   - Creates new objects in target isolate's heap
   - **`transferIn: true`** - Transfers ownership, invalidating source
   - **`transferIn: false`** (default) - Keeps original, duplicates memory

**Memory Efficiency:**

| Method                           | Memory Usage         | Source Valid After? | Use Case                |
| -------------------------------- | -------------------- | ------------------- | ----------------------- |
| `copyInto()`                     | 2x (source + target) | Yes                 | Need to reuse data      |
| `copyInto({ transferIn: true })` | 1x (target only)     | No                  | One-time use (our case) |

**Example:**

```javascript
const data = { events: [1000 event objects], meta: {...} };

// Without transferIn
const copy1 = new ivm.ExternalCopy(data).copyInto();
// Memory: data (10MB) + copy1 (10MB) = 20MB

// With transferIn
const copy2 = new ivm.ExternalCopy(data).copyInto({ transferIn: true });
// Memory: copy2 (10MB) only, data is invalidated
```

---

### Module System (ES6 Imports/Exports)

#### Library Loading

```javascript
await Promise.all(
  Object.entries(librariesMap).map(async ([moduleName, moduleCode]) => {
    compiledModules[moduleName] = {
      module: await loadModule(isolate, context, moduleName, moduleCode),
    };
  }),
);
```

**Process:**

1. External libraries fetched from database (by version ID)
2. Library code extracted (camelCase handle name)
3. Compiled as isolate modules using `isolate.compileModule()`
4. Stored in `compiledModules` map

#### User Code Module

```javascript
const customScriptModule = await isolate.compileModule(`${codeWithWrapper}`, {
  filename: transformationName,
});

await customScriptModule.instantiate(context, async (spec) => {
  if (librariesMap[spec]) {
    return compiledModules[spec].module;
  }
  // Module not found error
  console.log(`import from ${spec} failed. Module not found.`);
  throw new Error(`import from ${spec} failed. Module not found.`);
});

await customScriptModule.evaluate();
```

**What Happens:**

1. User code + wrapper compiled as ES6 module
2. `instantiate()` called with resolver callback
3. When user code does `import foo from 'libName'`:
   - Resolver checks `librariesMap[spec]`
   - Returns compiled library module if found
   - Throws error if not found
4. `evaluate()` executes module code (defines functions)

## External API Architecture

### Available APIs in Isolate

User code has access to these global functions:

| API                     | Purpose                | Return Type           | Timeout               |
| ----------------------- | ---------------------- | --------------------- | --------------------- |
| `fetch(url, options)`   | Basic HTTP (JSON only) | `Promise<any>`        | None                  |
| `fetchV2(url, options)` | Enhanced HTTP          | `Promise<Response>`   | None                  |
| `geolocation(ip)`       | IP geolocation         | `Promise<GeoData>`    | 1000ms                |
| `getCredential(key)`    | Access credentials     | `string \| undefined` | Sync                  |
| `metadata(event)`       | Get event metadata     | `Object`              | Sync                  |
| `log(...args)`          | Console logging        | `void`                | Sync (test mode only) |

### API Implementation Pattern

All async APIs follow this pattern:

```
User Code (Isolate)          Main Process (Node.js)
─────────────────────        ──────────────────────

fetch('http://api.com')
        │
        ├─ Marshal call via ivm.Reference
        │
        ▼
                              _fetch Reference receives:
                              - resolve callback
                              - ...args (url, options)

                              Execute actual HTTP request:
                              await fetchWithDnsWrapper(...)

                              Copy response into isolate:
                              resolve.applyIgnored(undefined, [
                                new ivm.ExternalCopy(data).copyInto()
                              ])
        ▼
receive response
continue execution
```

### 1. fetch() - Basic HTTP

```javascript
await jail.set(
  '_fetch',
  new ivm.Reference(async (resolve, ...args) => {
    ...
  }),
);
```

**Characteristics:**

- Returns JSON-parsed data or string `'ERROR'`
- No headers or status code returned
- Always resolves (never rejects)
- **Stat:** `fetch_call_duration` with `isSuccess` tag

### 2. fetchV2() - Enhanced HTTP

```javascript
await jail.set(
  '_fetchV2',
  new ivm.Reference(async (resolve, reject, ...args) => {
    ...
  }),
);
```

**Characteristics:**

- Returns structured response: `{ url, status, headers, body }`
- Body attempts JSON parse, falls back to text
- Rejects on error (proper promise rejection)
- **Stat:** `fetchV2_call_duration` with `isSuccess` tag

**User Code Example:**

```javascript
async function transformEvent(event, metadata) {
  try {
    const response = await fetchV2('https://api.example.com/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: event.email }),
    });

    if (response.status === 200) {
      event.validationResult = response.body;
    } else {
      event.error = `Validation failed: ${response.status}`;
    }
  } catch (error) {
    event.error = `Request failed: ${error.message}`;
  }

  return event;
}
```

### 3. geolocation() - IP Lookup

```javascript
await jail.set(
  '_geolocation',
  new ivm.Reference(async (resolve, reject, ...args) => {
    ...
  }),
);
```

**Characteristics:**

- Requires `GEOLOCATION_URL` environment variable
- 1000ms timeout (configurable via `GEOLOCATION_TIMEOUT_IN_MS`)
- Rejects on error
- **Stat:** `geo_call_duration` with `isSuccess` tag

### 4. getCredential() - Credential Access

```javascript
await jail.set('_getCredential', function (key) {
  ...
});
```

**Characteristics:**

- Synchronous function
- Returns credential value or `undefined`
- Throws TypeError if key is null/undefined
- Credentials extracted from events before execution
- **Stat:** `credential_error_total` (on error)

### 5. metadata() - Event Metadata

```javascript
var metadata = function (event) {
  const eventMetadata = event ? eventsMetadata[event.messageId] || {} : {};
  return { ...event meta data };
};
```

**Characteristics:**

- Synchronous function
- Looks up metadata by event's messageId
- Returns empty object if event not found

**User Code Example:**

```javascript
function transformEvent(event, metadata) {
  const meta = metadata(event);
  // Add workspace context
  event.workspaceId = meta.workspaceId;
  return event;
}
```

### 6. log() - Console Logging (Lines 318-326)

```javascript
await jail.set('log', function (...args) {
  if (testMode) {
    let logString = 'Log:';
    for (const arg of args) {
      logString = logString.concat(` ${typeof arg === 'object' ? JSON.stringify(arg) : arg}`);
    }
    logs.push(logString);
  }
});
```

**Characteristics:**

- Synchronous function
- **Only works in test mode**
- Stringifies objects, preserves primitives
- Logs returned in transformation response

**User Code Example:**

```javascript
function transformEvent(event, metadata) {
  log('Processing event:', event.type);
  return event;
}
```

---

## Test Mode

### What is Test Mode?

Test mode is a special execution mode designed for:

- Transformation development and debugging
- Integration testing
- Validation workflows
- Ensuring isolated, repeatable execution

### Activation

```javascript
// In customTransformer.js
await userTransformHandler(
  events,
  transformationVersionId,
  libraryVersionIds,
  trRevCode, // Transformation code object (in test mode)
  true, // testMode = true
);
```

### Behavior Differences

| Aspect               | Standard Mode                        | Test Mode                       |
| -------------------- | ------------------------------------ | ------------------------------- |
| **Code Source**      | Database (`getTransformationCode()`) | Provided directly (`trRevCode`) |
| **Logging**          | `log()` does nothing                 | `log()` captures output         |
| **Logs in Response** | Not returned                         | Returned in `{ logs: [...] }`   |
| **Performance**      | Optimized (cached)                   | Slower (always fresh)           |
| **Use Case**         | Production execution                 | Development, testing            |

**Test Mode:**

```json
{
  "transformedEvents": [
    { ... },
    { "error": "..." }
  ],
  "logs": [
    "Log: Processing event: track",
    "Log: User ID: 12345",
    "Log: Transformed successfully"
  ]
}
```

---

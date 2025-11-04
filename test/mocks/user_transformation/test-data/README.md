# Mock Data Organization

This directory contains mock data for user transformation E2E tests, organized into separate files for better maintainability and easier injection.

## File Structure

- **`transformation-mocks.ts`** - Mock transformation codes (user-defined transformations)
- **`library-mocks.ts`** - Mock library codes (lodash, moment, etc.)
- **`rudder-library-mocks.ts`** - Mock Rudder-provided library codes (@rs/crypto, @rs/urlParser, etc.)
- **`external-api-mocks.ts`** - Mock external API responses (for fetch calls)
- **`index.ts`** - Re-exports all mocks for convenience

## Usage

### Default Setup (Use All Mocks)

```typescript
import { TestEnvironment } from '../mocks/user_transformation/utils/test-helpers';

// Uses all default mocks from the files above
const testEnv = new TestEnvironment();
await testEnv.setup();
```

### Custom Setup (Inject Specific Mocks)

```typescript
import { TestEnvironment } from '../mocks/user_transformation/utils/test-helpers';
import { transformationMocks, libraryMocks } from '../mocks/user_transformation/test-data';

// Create custom transformation mock
const customTransformationMocks = {
  ...transformationMocks,
  'my-custom-transform': {
    versionId: 'my-custom-transform',
    code: `
      export function transformEvent(event, metadata) {
        event.properties.customField = 'custom-value';
        return event;
      }
    `,
    name: 'My Custom Transform',
    codeVersion: '1',
    language: 'javascript',
    workspaceId: 'test-workspace',
    imports: [],
  },
};

// Inject custom mocks
const testEnv = new TestEnvironment({
  transformationMocks: customTransformationMocks,
  libraryMocks, // Use default libraries
  // rudderLibraryMocks and externalApiMocks will use defaults
});

await testEnv.setup();
```

### Inject Only What You Need

```typescript
// Only inject transformation mocks, others will be empty
const testEnv = new TestEnvironment({
  transformationMocks: {
    'minimal-transform': {
      versionId: 'minimal-transform',
      code: `export function transformEvent(e) { return e; }`,
      name: 'Minimal',
      codeVersion: '1',
      language: 'javascript',
      workspaceId: 'test',
      imports: [],
    },
  },
});

await testEnv.setup();
```

## Benefits of This Structure

1. **Better Organization** - Each type of mock has its own file
2. **Dependency Injection** - Test files control what data is used
3. **Easy Customization** - Mix default mocks with custom ones
4. **Isolated Tests** - Each test can have its own mock data without affecting others
5. **Maintainability** - Changes to mock data don't require changing server code

## Adding New Mocks

### Add a New Transformation Mock

Edit `transformation-mocks.ts`:

```typescript
export const transformationMocks: Record<string, any> = {
  // ... existing mocks ...

  'new-transform': {
    versionId: 'new-transform',
    code: `/* your code here */`,
    name: 'New Transform',
    codeVersion: '1',
    language: 'javascript',
    workspaceId: 'test-workspace',
    imports: [],
  },
};
```

### Add a New Library Mock

Edit `library-mocks.ts`:

```typescript
export const libraryMocks: Record<string, any> = {
  // ... existing mocks ...

  'new-lib-v1': {
    versionId: 'new-lib-v1',
    code: `/* library code here */`,
    name: 'newLib',
    importName: 'newLib',
  },
};
```

## Mock Server Architecture

The mock servers (`MockConfigBackend` and `MockExternalApiServer`) accept mock data through their constructors:

```typescript
const configBackend = new MockConfigBackend({
  transformationMocks: {
    /* your mocks */
  },
  libraryMocks: {
    /* your mocks */
  },
  rudderLibraryMocks: {
    /* your mocks */
  },
});

const externalApiServer = new MockExternalApiServer({
  externalApiMocks: {
    /* your mocks */
  },
});
```

This enables:

- **Test Isolation** - Each test suite can have its own mock data
- **Parallel Testing** - Multiple test environments with different data
- **Flexible Testing** - Mix and match mocks as needed

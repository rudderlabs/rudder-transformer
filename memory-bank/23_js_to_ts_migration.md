JavaScript to TypeScript Migration Guide

Goal: Make minimal changes for successful migration while maintaining type safety

═══════════════════════════════════════════════════════════════════════════

## 🎯 CRITICAL PRINCIPLES

### #1: Migration ≠ Refactoring

Your ONLY job is to add TypeScript types. DO NOT change runtime behavior or refactor.

### #2: ABSOLUTELY NO TYPECASTING

❌ FORBIDDEN: "as" assertions (as any, as unknown, as string, etc.)
✅ INSTEAD: Use proper type declarations, progressive refinement, or let JS imports infer as 'any'

### #3: Progressive Type Refinement

❌ NEVER START WITH: any, any[], Record<string, any>
✅ ALWAYS START WITH: unknown, unknown[]

Let TypeScript errors guide you to add ONLY the structure needed.

### #4: Exception for catch blocks ONLY

✅ catch (error: any) - ALLOWED
❌ All other cases: NEVER use "any"

### #5: DO NOT create types for JavaScript imports

Functions from .js files will infer as 'any' - that's acceptable

═══════════════════════════════════════════════════════════════════════════

## 📋 BASIC MIGRATION STEPS

1. Identify all files to migrate:

   - Main source files: .js → .ts
   - Test files: .test.js → .test.ts (MUST be migrated together with source files)

2. Change file extension: .js → .ts

3. Convert imports:

   - require('foo') → import foo from 'foo'
   - const { bar } = require('foo') → import { bar } from 'foo'

4. Add types ONLY when needed to fix TypeScript errors

   - Don't add types just because you can
   - Minimal changes = less risk of breaking things

5. Run build after EVERY change:
   npm run build:ci

   ⚠️ ALWAYS run `npm run build:ci` after making changes to verify no type errors
   DO NOT skip this step - it's not optional!

6. Run tests for the migrated files:
   npm run test:ts -- path/to/migrated/files

   ⚠️ CRITICAL: Test files MUST be migrated and all tests must pass
   Example: npm run test:ts -- src/cdk/v2/destinations/zoho

7. After successful migration with all tests passing:
   Delete the original .js files

═══════════════════════════════════════════════════════════════════════════

## 🔧 TYPE FIXES WITHOUT CASTING (Progressive Refinement)

### Empty Arrays

Step 1: Start with unknown[]
❌ WRONG: const arr: any[] = []
✅ START: const arr: unknown[] = []

Step 2: Run build, look at TypeScript error, add minimal structure:

Error: "Property 'status' does not exist on type 'unknown'"
✅ FIX: const listArr: { status?: unknown; id?: unknown }[] = []

Error: "Type 'Promise<...>' has no properties in common with type 'unknown'"
✅ FIX: const promises: Promise<{ success: unknown; response: unknown }>[] = []

Error: "Property 'map' does not exist on type 'unknown'"
✅ FIX: const responseStaging: { map?: unknown }[] = []

⚠️ When you can infer the actual type from context, USE IT instead of unknown:

Example - Known types from API contracts:
const promises: Promise<{ success: boolean; response: { status: number } }>[] = []

Example - String collections from Object.keys():
const filteredKeys: string[] = []

### Empty Objects

❌ WRONG: const obj: any = {}
❌ WRONG: const obj: Record<string, any> = {}
✅ START: const obj: Record<string, unknown> = {}

If you get errors about specific properties:
✅ REFINE: const obj: { prop1?: unknown; prop2?: unknown } = {}

If you know the value types from context:
✅ BETTER: const obj: Record<string, string | number> = {}

Example: When storing API field IDs that are strings/numbers
✅ const fieldMap: Record<string, string | number> = {}

### Variables with Unclear Types

❌ WRONG: let result: any;
✅ START: let result: unknown;

If you get errors accessing properties:
✅ REFINE: let result: { success?: unknown; data?: unknown };

### Complex Types - Import, Don't Recreate

When you need to type complex objects (like Destination, Config, etc.), search for existing types first.

❌ WRONG: Recreate the type inline

```typescript
const items: {
  destination: {
    ID: string;
    Config: { restApiKey: string };
    // ... missing 20 other properties
  };
}[] = [];
```

✅ RIGHT: Search for and import existing types

```bash
# Search for the type first
grep -r "export.*type Destination" src/
grep -r "export.*interface Destination" src/

# Common type locations:
# src/types/
# src/interfaces/
```

```typescript
// Import from canonical source
import type { Destination } from '../../../types/controlPlaneConfig';

const items: {
  destination: Destination<{ restApiKey: string; [key: string]: unknown }>;
}[] = [];
```

**Why importing is better:**

- DRY principle - don't duplicate type definitions
- Types may have more properties than you realize
- Changes to source type automatically propagate
- TypeScript can catch incompatibilities

### Nullable Returns - Use Validation, NOT Fallback Operators

❌ WRONG: const payload = constructPayload(traits, mappingJson) || {};
✅ RIGHT: const payload = constructPayload(traits, mappingJson);
if (!payload) {
throw new TransformationError('Failed to construct payload');
}
Note: Use TransformationError (5xx) for new errors, not InstrumentationError (4xx)

### CRITICAL - Preserve Original JavaScript Behavior

⚠️ DO NOT alter runtime behavior! Add types only.

Common regression-causing changes to AVOID:

❌ Changing initializations:
JS: let payload = null;
BAD: let payload; // undefined instead of null
✅: let payload: SomeType | null = null;

❌ Changing operators:
JS: const x = a || b;
BAD: const x = a ?? b; // different behavior for 0, '', false
✅: const x = a || b;

### Dynamic Object Properties

Let TypeScript infer from JS imports or use direct property access
✅ RIGHT: payload.user.external_id
❌ WRONG: (payload.user as Record<string, unknown>).external_id

### Conditional Type Narrowing

Structure code to help TypeScript understand control flow
✅ Example:
let resp;
if (!input.message?.statusCode) {
resp = await process(input);
} else {
resp = input.message;
}

### Functions from .js Files with Default Parameters

TypeScript may incorrectly infer restrictive parameter types from default values.

✅ PREFERRED: Let the function infer as 'any' (acceptable for .js imports)
⚠️ LAST RESORT: Modify source .js file only if absolutely necessary and safe

### Typed Array Iteration

✅ BEST: Type the array properly from the start
const array: { prop: string }[] = []
array.forEach((item) => { /_ item is already typed _/ })

⚠️ Don't add runtime checks (like Array.isArray) just to satisfy TypeScript!
Type the variable correctly upfront to avoid both casts AND runtime checks

═══════════════════════════════════════════════════════════════════════════

## 🧪 TEST FILE SPECIFIC PATTERNS

### Mock Type Safety with jest.mocked()

✅ RIGHT: Use jest.mocked() for type-safe mocking

```typescript
import { handleHttpRequest } from './network';
jest.mock('./network');

jest.mocked(handleHttpRequest).mockResolvedValueOnce(response);
```

❌ WRONG: Type casting mocks

```typescript
(handleHttpRequest as jest.Mock).mockResolvedValueOnce(response);
```

### Const Assertions for Literal Types

✅ ALLOWED: Use "as const" for literal type inference in test data

```typescript
const mockConfig = { region: 'US' as const }; // Type: { region: "US" }
const regions = ['US', 'EU', 'AU'] as const; // Type: readonly ["US", "EU", "AU"]
```

This is the ONLY acceptable use of "as" in TypeScript - for const assertions.

❌ WRONG: Type casting to literal types

```typescript
const mockConfig = { region: 'US' as RegionKeys }; // Don't do this
```

### Test Object Structure

When test objects need specific properties, provide them explicitly:

✅ RIGHT: Complete mock objects

```typescript
const mockMetadata = {
  secret: {
    accessToken: 'test-token',
  },
};
```

❌ WRONG: Empty objects with type casts

```typescript
const mockMetadata = {} as Metadata;
```

### HTTP Response Mocks

Some mocked responses may need additional properties like httpResponse:

✅ RIGHT: Include all required properties

```typescript
const response = {
  httpResponse: Promise.resolve({}),
  processedResponse: {
    status: 200,
    response: { data: [{ id: '123' }] },
  },
};
```

### Avoid null in Test Data

TypeScript types often don't include null. Use undefined instead:

❌ WRONG: Using null where undefined is expected

```typescript
{
  region: null;
} // Type error if region is RegionKeys | undefined
```

✅ RIGHT: Use undefined

```typescript
{
  region: undefined;
}
```

═══════════════════════════════════════════════════════════════════════════

## 🛠️ OTHER COMMON FIXES

### Error Constructors

Remove extra numeric status codes from InstrumentationError and
NetworkInstrumentationError unless they explicitly accept them

### Function Signatures

Ensure all required parameters are passed

- Check function definitions for required parameter count
- Add missing parameters (e.g., 'type' parameter)

### Optional Parameters - Avoid Them

Instead of making function parameters optional, pass `undefined` explicitly from callers.

❌ WRONG:

```typescript
function getUserId(message, headers, baseEndpoint, type?, metadata?) {
  // function body
}
// Caller
getUserId(message, headers, baseEndpoint, metadata);
```

✅ RIGHT:

```typescript
function getUserId(message, headers, baseEndpoint, type, metadata) {
  // function body
}
// Caller - explicitly pass undefined
getUserId(message, headers, baseEndpoint, undefined, metadata);
```

**Why this is better:**

- Makes intent explicit at call sites
- Matches JavaScript behavior (undefined is passed anyway)

═══════════════════════════════════════════════════════════════════════════

## ✅ PRE-SUBMISSION CHECKLIST

🔍 MANDATORY CHECKS:

1. ❌ Search for " as " - If found, verify it's ONLY:

   - "as const" for literal types in tests
   - "as any" for unavoidable edge cases (must be justified)
   - Type assertions from JS import returns
     All other "as" usages are WRONG!

2. ❌ Search for "any" - If found outside catch blocks, use unknown instead.

3. ❌ Search for "@ts-expect-error" or "@ts-ignore" - Fix the root cause instead.

4. ✅ Arrays properly typed (string[] not unknown[] when appropriate)

5. ✅ Functions from .js imports left untyped (let them infer as 'any')

6. ✅ All test files migrated - Check for remaining .test.js files

7. ✅ All tests pass: npm run test:ts -- path/to/migrated/files
   Example: npm run test:ts -- src/cdk/v2/destinations/zoho

8. ⚠️ No behavioral changes - Compare with original .js file side-by-side

9. ✅ Build passes: npm run build:ci

10. ✅ Original .js files deleted after successful migration

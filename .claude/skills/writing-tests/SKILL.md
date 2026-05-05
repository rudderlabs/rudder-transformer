---
name: writing-tests
description: Conventions to follow when writing or modifying tests in this repo. Applied automatically — not user-invocable.
---

# Test Writing Conventions

Follow these conventions when writing or modifying tests in this repo.

## Error Matchers

Never use `/.+/` or other catch-all patterns in test assertions. Run the code to find the actual error message and match on a distinctive substring.

```ts
// Good
errorMatch: /Unexpected token/;

// Bad
errorMatch: /.+/;
```

## No Redundant If-Guards After Assertions

`expect(result.valid).toBe(true)` already throws on failure — don't wrap the next assertion in `if (result.valid)`. Use `'field' in result && result.field` for TypeScript narrowing without a runtime branch.

```ts
// Good
expect(result.valid).toBe(true);
expect('recordFields' in result && result.recordFields.sort()).toEqual(expected);

// Bad
expect(result.valid).toBe(true);
if (result.valid) {
  expect(result.recordFields.sort()).toEqual(expected);
}
```

## Table-Driven Tests With `it.each()`

When multiple test cases share the same assertion structure, use `it.each()` with a data table instead of individual `it()` blocks. Keep test data arrays at the top of the file or describe block for easy scanning.

```ts
// Good — data table + single runner
const invalidTemplates = [
  { name: 'spread operator', template: '{ ...$.records }', errorMatch: /spread_expr/ },
  { name: 'variable declarations', template: 'let x = 1', errorMatch: /definition_expr/ },
  { name: 'bare identifier', template: 'process', errorMatch: /Bare identifiers/ },
];

it.each(invalidTemplates)('should reject: $name', ({ template, errorMatch }) => {
  const result = validateTemplate(template);
  expect(result.valid).toBe(false);
  expect(result.errors?.[0]).toMatch(errorMatch);
});

// Bad — repetitive individual blocks with identical structure
it('should reject spread operator', () => {
  const result = validateTemplate('{ ...$.records }');
  expect(result.valid).toBe(false);
  expect(result.errors?.[0]).toMatch(/spread_expr/);
});

it('should reject variable declarations', () => {
  const result = validateTemplate('let x = 1');
  expect(result.valid).toBe(false);
  expect(result.errors?.[0]).toMatch(/definition_expr/);
});
```

## Consistent Test Data Scoping

All test data arrays within a `describe` block should live at the same scope — either all inside or all outside. Don't mix.

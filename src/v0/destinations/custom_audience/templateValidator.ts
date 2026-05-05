/**
 * Template Validator for Custom Audience destinations.
 *
 * User-provided request body templates are parsed into an AST by the
 * json-template-engine and then walked against a whitelist of allowed node
 * types.  Any node type not in the whitelist is rejected, which blocks
 * function calls, loops, assignments, spread, and all other dynamic
 * constructs.  The only function call allowed is `Number()` casting.
 *
 * Example of a valid template:
 *
 *   {
 *     "action": "add",
 *     "batch_data": $.records.({
 *       "id": .email_sha256,
 *       "audience_ids": [Number($.connection.audience_id)]
 *     })
 *   }
 *
 * The engine parses this into an AST where:
 *   - `$` paths get root = "___d" (engine-internal alias for the root data)
 *   - relative paths like `.email_sha256` have no root (undefined)
 *   - `$.records.({...})` produces a path with a block_expr part (iteration)
 *   - `Number(...)` produces a function_call_expr with parent = "Number"
 */
import {
  JsonTemplateEngine,
  PathType,
  Expression,
  SyntaxType,
} from '@rudderstack/json-template-engine';

// The engine internally rewrites `$` (JSONPath root) to this identifier.
// e.g. `$.records` → path { root: "___d", parts: [selector "records"] }
const INTERNAL_ROOT = '___d';

// Selector prop types produced by the engine's parser.
// Dot notation `$.records` → prop.type = "id"
// Bracket notation `$["records"]` → prop.type = "str"
const SELECTOR_PROP_TYPE_ID = 'id';
const SELECTOR_PROP_TYPE_STR = 'str';

// The field name used in `$.records.()` iteration paths.
const RECORDS_FIELD = 'records';

// The only function call allowed in templates — `Number(value)` for type
// casting.  e.g. `Number($.connection.audience_id)` parses as:
//   { type: "function_call_expr", parent: "Number", args: [<path-expr>] }
const ALLOWED_FUNCTION_PARENT = 'Number';

interface ValidationContext {
  /** True when inside a $.records.() iteration block, where relative paths are valid. */
  insideIterationBlock: boolean;
  /** True when walking parts of a path expression (selectors, block_expr). */
  insidePathParts: boolean;
  errors: string[];
}

// Walk function signatures passed to handlers so they can recurse
// without directly referencing validateNode/collectFields.
type ValidateWalker = (node: Expression, ctx: ValidationContext) => void;
type FieldWalker = (node: Expression, insideRecordsIteration: boolean, fields: Set<string>) => void;

interface NodeHandler {
  /**
   * Validate this node type's children. Called during validateTemplate().
   * Presence of a handler entry in NODE_HANDLERS IS the whitelist — if the
   * node type isn't here, it's rejected.
   */
  validate: (node: Expression, ctx: ValidationContext, walk: ValidateWalker) => void;

  /**
   * Extract record field names from this node type's children.
   * Called during extractInputFields(). Optional — omit for leaf nodes
   * or nodes whose children are traversed by their parent's handler
   * (e.g. SELECTOR is a leaf, BLOCK_EXPR is entered via PATH's handler).
   */
  collectFields?: (
    node: Expression,
    insideRecordsIteration: boolean,
    fields: Set<string>,
    walk: FieldWalker,
  ) => void;
}

/**
 * Unified handler map for all allowed AST node types.
 *
 * Each entry defines how to validate and extract fields for one node type.
 * A node type being present here IS the whitelist — anything not in this
 * map is rejected during validation.
 *
 * To add a new allowed node type: add one entry here with both handlers.
 */
const NODE_HANDLERS: Record<string, NodeHandler> = {
  // Top-level wrapper — every parsed template starts with this.
  // e.g. `{ "a": 1 }` → { type: "statements_expr", statements: [<object_expr>] }
  [SyntaxType.STATEMENTS_EXPR]: {
    validate: (node, ctx, walk) => {
      node.statements.forEach((stmt: Expression) => walk(stmt, ctx));
    },
    collectFields: (node, insideRecordsIteration, fields, walk) => {
      node.statements.forEach((stmt: Expression) => walk(stmt, insideRecordsIteration, fields));
    },
  },

  // Path expression — `$.records`, `$.connection.id`, or relative `.email`.
  // Three cases for `root`:
  //   1. root === "___d"    → `$` path (e.g. `$.records`) — allowed
  //   2. root === undefined → relative path (e.g. `.email`) — only inside iteration
  //   3. root === "process" → bare identifier — rejected
  [SyntaxType.PATH]: {
    validate: (node, ctx, walk) => {
      const { root } = node;
      const parts: Expression[] = node.parts ?? [];

      if (root === undefined || root === null) {
        // Relative path like `.email_sha256` — only valid inside $.records.()
        if (!ctx.insideIterationBlock) {
          ctx.errors.push(
            'Relative field references (.field) can only be used inside a $.records.() iteration block.',
          );
          return;
        }
      } else if (typeof root === 'string' && root !== INTERNAL_ROOT) {
        // Bare identifier like `process` or `Object` — root is the identifier name.
        // Only `$` (internally "___d") is allowed as a path root.
        ctx.errors.push(
          `Bare identifiers (e.g., "${root}") are not allowed. Use $.field to access data.`,
        );
        return;
      }

      // Reject nested iteration under $.records (e.g. `$.records.foo.({...})`).
      // Only `$.records.({...})` is allowed — deeper paths would produce
      // incorrect recordFields since the relative fields refer to nested data.
      const hasBlockExpr = parts.some((part: Expression) => part.type === SyntaxType.BLOCK_EXPR);
      if (
        hasBlockExpr &&
        root === INTERNAL_ROOT &&
        parts[0]?.type === SyntaxType.SELECTOR &&
        parts[0].prop?.value === RECORDS_FIELD &&
        !(parts.length === 2 && parts[1].type === SyntaxType.BLOCK_EXPR)
      ) {
        ctx.errors.push(
          'Nested iteration under $.records is not supported. Use $.records.({...}) directly.',
        );
        return;
      }

      // Validate each part (selector, block_expr) with insidePathParts=true
      // so block_expr is treated as iteration, not standalone.
      parts.forEach((part: Expression) => walk(part, { ...ctx, insidePathParts: true }));
    },

    // Field extraction for paths:
    //   - Relative path (no root) inside iteration → first selector = record field name
    //     e.g. `.email_sha256` → "email_sha256"
    //   - `$.records.(<block>)` → enter the block with insideRecordsIteration=true
    //   - `$.connection.*` and other `$` paths → ignored (no record fields)
    collectFields: (node, insideRecordsIteration, fields, walk) => {
      const { root } = node;
      const parts: Expression[] = node.parts ?? [];

      if (root === undefined || root === null) {
        // Relative path inside iteration — first selector is the record field name.
        // e.g. `.email_sha256` → parts[0] is selector with prop.value = "email_sha256"
        if (insideRecordsIteration && parts.length > 0) {
          const [firstPart] = parts;
          if (
            firstPart.type === SyntaxType.SELECTOR &&
            firstPart.prop?.type === SELECTOR_PROP_TYPE_ID
          ) {
            fields.add(firstPart.prop.value);
          }
        }
      } else {
        // $ path — check if this is `$.records.(<block>)` to enter iteration context.
        // AST shape: root="___d", parts=[selector("records"), block_expr([...])]
        const isRecordsPath =
          root === INTERNAL_ROOT &&
          parts.length >= 2 &&
          parts[0].type === SyntaxType.SELECTOR &&
          parts[0].prop?.value === RECORDS_FIELD;

        parts.forEach((part: Expression) => {
          if (part.type === SyntaxType.BLOCK_EXPR && isRecordsPath) {
            part.statements.forEach((stmt: Expression) => walk(stmt, true, fields));
          }
        });
      }
    },
  },

  // Selector — the ".field" part of a path.
  // Dot notation (`$.records`) produces prop.type = "id" — allowed.
  // Bracket notation (`$["records"]`) produces prop.type = "str" — rejected.
  // No collectFields needed — selectors are leaf nodes with no children to extract from.
  // Note: prop is genuinely optional on SelectorExpression.
  [SyntaxType.SELECTOR]: {
    validate: (node, ctx) => {
      const { prop } = node;
      if (prop?.type === SELECTOR_PROP_TYPE_STR) {
        ctx.errors.push(
          'Bracket notation (["key"]) is not supported. Use dot notation (.key) instead.',
        );
      }
    },
  },

  // Object literal — `{ "key": value }`
  [SyntaxType.OBJECT_EXPR]: {
    validate: (node, ctx, walk) => {
      node.props.forEach((prop: Expression) => walk(prop, ctx));
    },
    collectFields: (node, insideRecordsIteration, fields, walk) => {
      node.props.forEach((prop: Expression) => walk(prop, insideRecordsIteration, fields));
    },
  },

  // Single property in an object — `"key": value`
  [SyntaxType.OBJECT_PROP_EXPR]: {
    validate: (node, ctx, walk) => {
      walk(node.value, ctx);
    },
    collectFields: (node, insideRecordsIteration, fields, walk) => {
      walk(node.value, insideRecordsIteration, fields);
    },
  },

  // Array literal — `[item1, item2]`
  [SyntaxType.ARRAY_EXPR]: {
    validate: (node, ctx, walk) => {
      node.elements.forEach((elem: Expression) => walk(elem, ctx));
    },
    collectFields: (node, insideRecordsIteration, fields, walk) => {
      node.elements.forEach((elem: Expression) => walk(elem, insideRecordsIteration, fields));
    },
  },

  // Block expression — appears in two contexts:
  //   1. As a path part (iteration): `$.records.({...})` — insidePathParts=true
  //   2. As a standalone statement: `($.a; $.b)` — insidePathParts=false, rejected
  //
  // When valid (iteration), must contain exactly one expression: object or array.
  // e.g. `$.records.({ "id": .email })` → block with one object_expr
  //      `$.records.([.email, .phone])` → block with one array_expr
  //
  // No collectFields needed — PATH's collectFields handler enters block_expr
  // directly when it detects a `$.records.(<block>)` pattern.
  [SyntaxType.BLOCK_EXPR]: {
    validate: (node, ctx, walk) => {
      if (!ctx.insidePathParts) {
        ctx.errors.push('Standalone block expressions are not supported.');
        return;
      }
      if (node.statements.length !== 1) {
        ctx.errors.push(
          'Iteration blocks must contain exactly one expression (an object or array).',
        );
        return;
      }
      const [inner] = node.statements;
      if (inner.type !== SyntaxType.OBJECT_EXPR && inner.type !== SyntaxType.ARRAY_EXPR) {
        ctx.errors.push(
          'Iteration blocks must contain exactly one expression (an object or array).',
        );
        return;
      }
      // Inside the iteration body, relative paths (.field) become valid
      walk(inner, { ...ctx, insideIterationBlock: true, insidePathParts: false });
    },
  },

  // Function call expressions — only Number() type casting is allowed.
  // e.g. `Number($.connection.audience_id)` → walk into the argument
  // Other function calls (`.map()`, `String()`, etc.) are rejected.
  [SyntaxType.FUNCTION_CALL_EXPR]: {
    validate: (node, ctx, walk) => {
      if (node.parent !== ALLOWED_FUNCTION_PARENT || node.args.length !== 1) {
        ctx.errors.push('Function calls are not supported. Only Number() casting is allowed.');
        return;
      }
      walk(node.args[0], ctx);
    },
    collectFields: (node, insideRecordsIteration, fields, walk) => {
      // After validation, only Number(expr) with a single arg reaches here
      walk(node.args[0], insideRecordsIteration, fields);
    },
  },

  // Literal values — "string", 123, true, false, null.  Always valid, no children.
  [SyntaxType.LITERAL]: {
    validate: () => {},
  },
};

/**
 * Recursively validate an AST node against the whitelist.
 *
 * Walks the tree depth-first.  For each node:
 *   1. Look up the node type in NODE_HANDLERS — if missing, reject
 *   2. Call the validate handler to recurse into children
 */
function validateNode(node: Expression, ctx: ValidationContext): void {
  if (!node || !node.type) return;

  const handler = NODE_HANDLERS[node.type];
  if (!handler) {
    ctx.errors.push(`Expression type "${node.type}" is not supported.`);
    return;
  }

  handler.validate(node, ctx, validateNode);
}

/**
 * Recursively collect record field names from the AST.
 *
 * Only extracts fields accessed via relative paths inside `$.records.()`
 * iteration blocks.  Connection fields (e.g. `$.connection.audience_id`)
 * and static literals are ignored.
 *
 * Example: for the template
 *   { "data": $.records.({ "id": .email, "x": [Number($.connection.id)] }) }
 * this returns ["email"] — `.email` is a record field, `$.connection.id` is not.
 */
function collectFields(
  node: Expression,
  insideRecordsIteration: boolean,
  fields: Set<string>,
): void {
  if (!node || !node.type) return;
  NODE_HANDLERS[node.type].collectFields?.(node, insideRecordsIteration, fields, collectFields);
}

/**
 * Parse and validate a template string, returning the validated AST or errors.
 */
function parseAndValidate(template: string): { ast: Expression } | { errors: string[] } {
  let ast: Expression;
  try {
    ast = JsonTemplateEngine.parse(template, { defaultPathType: PathType.JSON });
  } catch (e: any) {
    return { errors: [e.message || 'Failed to parse template.'] };
  }

  const ctx: ValidationContext = {
    insideIterationBlock: false,
    insidePathParts: false,
    errors: [],
  };
  validateNode(ast, ctx);

  if (ctx.errors.length > 0) {
    return { errors: ctx.errors };
  }
  return { ast };
}

type ParseTemplateResult =
  | { valid: true; recordFields: string[] }
  | { valid: false; errors: string[] };

/**
 * Parse, validate, and extract record fields from a user-provided template.
 *
 * Parses the template into an AST, walks every node against a whitelist
 * (returning all errors so users can fix everything in one pass), then
 * extracts deduplicated record field names from `$.records.()` iteration
 * blocks.
 *
 * Example: `{ "data": $.records.([.email, .phone]) }`
 *   → { valid: true, fields: ["email", "phone"] }
 */
export function parseTemplate(template: string): ParseTemplateResult {
  const result = parseAndValidate(template);
  if ('errors' in result) {
    return { valid: false, errors: result.errors };
  }

  const fields = new Set<string>();
  collectFields(result.ast, false, fields);
  return { valid: true, recordFields: [...fields] };
}

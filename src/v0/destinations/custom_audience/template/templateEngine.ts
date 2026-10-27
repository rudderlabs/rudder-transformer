/**
 * Template engine for Custom Audience destinations.
 *
 * All template-language operations are consolidated here so that swapping the
 * underlying expression engine only touches this single file.
 *
 * Exposes two capabilities:
 *   1. **parseTemplate** — parse, validate, and extract record fields from a
 *      user-provided template.
 *   2. **evaluateTemplate** — compile and evaluate a template against data.
 *
 * User-provided request body templates are parsed into an AST by JSONata
 * and then walked against a whitelist of allowed node types.  Any node type
 * not in the whitelist is rejected, which blocks function definitions,
 * conditionals, binary operators, and all other dynamic constructs.
 * The only function call allowed is `$number()` casting.
 *
 * Example of a valid template:
 *
 *   {
 *     "action": "add",
 *     "batch_data": [$$.records.{
 *       "id": email_sha256,
 *       "audience_ids": [$number($$.connection.audience_id)]
 *     }]
 *   }
 *
 * The [...] wrapper around $$.records iteration is mandatory — JSONata
 * unwraps single-element mapping results into bare values, so the wrapper
 * ensures the output is always an array regardless of batch size.
 *
 * Nested arrays inside a record are mapped the same way, relative to the
 * record and with the same wrapper rule:
 *
 *   [$$.records.{ "items": [line_items.{ "sku": sku }] }]
 *
 * The root collection defaults to `records`; parseTemplate takes another
 * name for callers whose input binds a different collection (e.g. `events`).
 *
 * The engine parses this into an AST where:
 *   - `$$` paths produce a variable step with value "$" (root reference)
 *   - bare names like `email_sha256` produce name steps (record field access)
 *   - `$$.records.{...}` produces a path with a mapping step (iteration)
 *   - `$number(...)` produces a function node with procedure.value = "number"
 */
import jsonata from 'jsonata';

const PARSE_FALLBACK_ERROR = 'Failed to parse template.';
const VARIABLE_REFERENCE_ERROR =
  'Variable references are not allowed. Use $$.field to access data.';

// JSONata attaches internal properties (`sequence`, `keepArray`) to mapped
// arrays — see jsonata-js/jsonata#296. Walk the result tree in-place and
// delete them so they don't leak to callers.
// Mutating is safe here because the JSONata result is not referenced elsewhere.
const JSONATA_INTERNAL_PROPS = ['sequence', 'keepArray', 'keepSingleton'];

function stripJsonataInternals(value: unknown): unknown {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) {
    for (const prop of JSONATA_INTERNAL_PROPS) {
      // eslint-disable-next-line no-param-reassign -- intentional in-place mutation of JSONata result
      if (prop in value) delete (value as unknown as Record<string, unknown>)[prop];
    }
    value.forEach(stripJsonataInternals);
    return value;
  }
  for (const val of Object.values(value as Record<string, unknown>)) {
    stripJsonataInternals(val);
  }
  return value;
}

// JSONata AST nodes have many undocumented properties (predicate, stages, etc.)
// We declare the known ones explicitly and use an index signature for the rest.
interface AstNode {
  type: string;
  value?: string | number | boolean | null;
  steps?: AstNode[];
  lhs?: AstNode[][];
  expressions?: AstNode[];
  arguments?: AstNode[];
  procedure?: AstNode;
  [key: string]: unknown;
}

// JSONata represents `$$` (root input) as a variable with value "$".
// e.g. `$$.records` → path { steps: [variable("$"), name("records")] }
const ROOT_VARIABLE = '$';

// The default root collection iterated as `$$.records.{}`. Callers binding a
// different input shape (e.g. `$$.events`) pass their own name to parseTemplate.
const DEFAULT_ROOT_COLLECTION = 'records';

// The only function call allowed in templates — `$number(value)` for type
// casting.  e.g. `$number($$.connection.audience_id)` parses as:
//   { type: "function", procedure: { value: "number" }, arguments: [<path>] }
const ALLOWED_FUNCTION = 'number';

interface ValidationContext {
  /** True when inside a $$.X.{} or $$.X.[] mapping step, where bare names are valid. */
  insideMappingStep: boolean;
  /** True when inside an object or array literal (for error message differentiation). */
  insideObjectOrArray: boolean;
  /** True when this node is a direct child of a [...] array constructor. */
  wrappedInArray: boolean;
  /** Name of the collection iterated under `$$` (e.g. "records"). */
  rootCollection: string;
  errors: string[];
}

// Walk function signatures passed to handlers so they can recurse.
type ValidateWalker = (node: AstNode, ctx: ValidationContext) => void;
interface FieldContext {
  fields: Set<string>;
  rootCollection: string;
}
type FieldWalker = (node: AstNode, insideRecordsIteration: boolean, ctx: FieldContext) => void;

interface NodeHandler {
  /**
   * Validate this node type's children. Called during validateTemplate().
   * Presence of a handler entry in NODE_HANDLERS IS the whitelist — if the
   * node type isn't here, it's rejected.
   */
  validate: (node: AstNode, ctx: ValidationContext, walk: ValidateWalker) => void;

  /**
   * Extract record field names from this node type's children.
   * Called during extractInputFields(). Optional — omit for leaf nodes.
   */
  collectFields?: (
    node: AstNode,
    insideRecordsIteration: boolean,
    ctx: FieldContext,
    walk: FieldWalker,
  ) => void;

  /**
   * AST properties this node type may carry beyond COMMON_AST_KEYS. Any other
   * property (a sub-expression or binding slot no handler walks) is rejected.
   */
  astKeys?: string[];
}

// Properties every allowed node may carry. `keepArray` is the `expr[]` flag (no sub-expression).
const COMMON_AST_KEYS = new Set(['type', 'value', 'position', 'keepArray']);

/** First AST property outside the node type's allowlist, if any. */
function unsupportedAstKey(node: AstNode, astKeys: string[] = []): string | undefined {
  return Object.keys(node).find((key) => !COMMON_AST_KEYS.has(key) && !astKeys.includes(key));
}

// Messages for the slots JSONata attaches to any node type — filters
// (`expr[...]`), group-by (`expr{...}`) and context/index bindings (`expr@$v`,
// `expr#$v`). Other unknown keys get a generic message.
const FILTER_ERROR = 'Filter expressions are not supported.';
const BINDING_ERROR = 'Context and index bindings (@$var, #$var) are not supported.';
const UNSUPPORTED_KEY_ERRORS: Record<string, string> = {
  predicate: FILTER_ERROR,
  stages: FILTER_ERROR,
  group: 'Group-by expressions (expr{...}) are not supported.',
  focus: BINDING_ERROR,
  index: BINDING_ERROR,
  tuple: BINDING_ERROR,
};

function unsupportedAstKeyError(node: AstNode, key: string): string {
  if (key === 'predicate' && node.type === 'variable') {
    return 'Bracket notation ($$["key"]) is not supported. Use dot notation ($$.key) instead.';
  }
  return UNSUPPORTED_KEY_ERRORS[key] ?? `Expression feature "${key}" is not supported.`;
}

/** True when the path starts with `$$.<rootCollection>`. */
function startsWithRootCollection(steps: AstNode[], rootCollection: string): boolean {
  return (
    steps.length >= 2 &&
    steps[0]?.type === 'variable' &&
    steps[0]?.value === ROOT_VARIABLE &&
    steps[1]?.type === 'name' &&
    steps[1]?.value === rootCollection
  );
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
  // Object literal `{ "key": value }` or array literal `[item1, item2]`.
  // JSONata represents both as unary nodes:
  //   object: { type: "unary", value: "{", lhs: [[key, value], ...] }
  //   array:  { type: "unary", value: "[", expressions: [...] }
  unary: {
    astKeys: ['lhs', 'expressions', 'consarray'],
    validate: (node, ctx, walk) => {
      if (node.value === '{') {
        const pairs: AstNode[][] = node.lhs ?? [];
        for (const pair of pairs) {
          walk(pair[0], { ...ctx, insideObjectOrArray: true, wrappedInArray: false });
          walk(pair[1], { ...ctx, insideObjectOrArray: true, wrappedInArray: false });
        }
      } else if (node.value === '[') {
        const elements: AstNode[] = node.expressions ?? [];
        for (const elem of elements) {
          walk(elem, { ...ctx, insideObjectOrArray: true, wrappedInArray: true });
        }
      } else {
        ctx.errors.push(`Expression type "unary(${node.value})" is not supported.`);
      }
    },
    collectFields: (node, insideRecordsIteration, ctx, walk) => {
      if (node.value === '{') {
        const pairs: AstNode[][] = node.lhs ?? [];
        for (const pair of pairs) {
          // Keys too — a bare-name key (`{ email: 1 }`) reads record data
          walk(pair[0], insideRecordsIteration, ctx);
          walk(pair[1], insideRecordsIteration, ctx);
        }
      } else if (node.value === '[') {
        const elements: AstNode[] = node.expressions ?? [];
        for (const elem of elements) {
          walk(elem, insideRecordsIteration, ctx);
        }
      }
    },
  },

  // Path expression — `$$.records`, `$$.connection.id`, or bare `email_sha256`.
  // Three cases for the first step:
  //   1. variable with value "$" → `$$` root path — allowed
  //   2. name → bare field name — only inside a mapping step
  //   3. anything else → rejected via the step walk
  path: {
    astKeys: ['steps', 'keepSingletonArray'],
    validate: (node, ctx, walk) => {
      const steps: AstNode[] = node.steps ?? [];

      // Bare name path (no $$ root) — only valid inside a mapping step.
      // Its remaining steps (e.g. a nested `items.{...}` mapping) are walked below.
      const isRelativePath = steps[0]?.type === 'name';
      if (isRelativePath && !ctx.insideMappingStep) {
        if (!ctx.insideObjectOrArray) {
          ctx.errors.push(
            `Bare identifiers (e.g., "${steps[0].value}") are not allowed. Use $$.field to access data.`,
          );
        } else {
          ctx.errors.push(
            `Relative field references (field) can only be used inside a $$.${ctx.rootCollection}.{} mapping block.`,
          );
        }
        return;
      }

      // Detect the root collection path (e.g. $$.records) and check for nested iteration.
      // Only `$$.records.{...}` is allowed — deeper paths like `$$.records.foo.{...}`
      // would produce incorrect recordFields since bare names refer to nested data.
      // Nested arrays are mapped per record instead: `[$$.records.{ "x": [foo.{...}] }]`.
      const root = ctx.rootCollection;
      const isRootCollectionPath = startsWithRootCollection(steps, root);

      // A constructor heading the path (`[items].x`) is not a mapping step — it
      // is walked as a plain constructor below. Mappings follow it, at idx > 0.
      const mappingStepIdx = steps.findIndex(
        (s: AstNode, idx) => idx > 0 && s.type === 'unary' && (s.value === '{' || s.value === '['),
      );

      if (isRootCollectionPath && mappingStepIdx >= 0 && mappingStepIdx !== 2) {
        ctx.errors.push(
          `Nested iteration under $$.${root} is not supported. Use $$.${root}.{...} directly.`,
        );
        return;
      }

      // Root and nested mappings (`items.{...}`, `[items].{...}`) must be wrapped
      // in [...] to guarantee array output — non-root `$$` paths such as
      // `$$.connection.{...}` are exempt. JSONata unwraps single-element mapping
      // results into bare values, so `$$.records.{...}` with one record returns
      // an object instead of a one-element array. Wrapping in [...] prevents this:
      //   [$$.records.{ "email": email }]   → always an array
      const isOtherRootPath = steps[0]?.type === 'variable' && !isRootCollectionPath;
      if (!isOtherRootPath && mappingStepIdx >= 0 && !ctx.wrappedInArray) {
        if (isRootCollectionPath) {
          ctx.errors.push(
            `$$.${root} iteration must be wrapped in [...] to guarantee array output ` +
              `(e.g. [$$.${root}.{...}]). Without this, single-record batches produce a bare object.`,
          );
        } else {
          const source = steps
            .slice(0, mappingStepIdx)
            .map((s) => (s.type === 'name' ? s.value : '[...]'))
            .join('.');
          ctx.errors.push(
            `Nested iteration (${source}.{...}) must be wrapped in [...] to guarantee array output ` +
              `(e.g. [${source}.{...}]). Without this, single-element arrays produce a bare value.`,
          );
        }
        return;
      }

      // Walk each step
      // Mapping steps make bare names valid inside; a heading constructor does not.
      // Every step goes through validateNode, which rejects filters and group-by on
      // any step, non-$$ variables (`items.$eval`) and disallowed types (function,
      // wildcard, descendant, sort, etc.)
      for (const [idx, step] of steps.entries()) {
        walk(step, step.type === 'unary' && idx > 0 ? { ...ctx, insideMappingStep: true } : ctx);
      }
    },

    // Field extraction for paths:
    //   - Bare name (no root) inside records iteration → first name = record field
    //     e.g. `email_sha256` → "email_sha256"
    //   - `$$.records.{<mapping>}` → enter the mapping with insideRecordsIteration=true
    //   - `$$.connection.*` and other `$$` paths → ignored (no record fields)
    //   - Nested mapping on a bare name (e.g. `items.{ "sku": sku }`) → only the
    //     first name is a record field; names inside refer to the nested elements
    collectFields: (node, insideRecordsIteration, ctx, walk) => {
      const steps: AstNode[] = node.steps ?? [];

      // Bare name inside records iteration → record field
      if (insideRecordsIteration && steps[0]?.type === 'name') {
        ctx.fields.add(steps[0].value as string);
      }

      // $$ root path — check for $$.records.{...} to enter iteration context.
      // AST shape: steps = [variable("$"), name("records"), unary("{"/"]")]
      const isRecordsPath = startsWithRootCollection(steps, ctx.rootCollection);

      steps.forEach((step, idx) => {
        if (step.type !== 'unary') return;
        if (isRecordsPath && idx === 2) {
          // The record mapping itself — bare names inside are record fields
          walk(step, true, ctx);
        } else if (idx === 0) {
          // A constructor heading the path, e.g. `[items.{...}].x`
          walk(step, insideRecordsIteration, ctx);
        } else {
          // Nested or chained mappings — bare names refer to their elements,
          // but $$.records paths inside them still carry record fields
          walk(step, false, ctx);
        }
      });
    },
  },

  // Name step — field access in a path. Leaf node, always valid.
  // Validity of bare-name paths is checked in the path handler.
  name: { validate: () => {} },

  // Variable node — a standalone `$$` reference or a variable step in a path.
  // Bracket notation on it is rejected by validateNode.
  variable: {
    validate: (node, ctx) => {
      if (node.value !== ROOT_VARIABLE) {
        ctx.errors.push(VARIABLE_REFERENCE_ERROR);
      }
    },
  },

  // Function call — only $number() casting is allowed.
  // e.g. `$number($$.connection.audience_id)` → walk into the argument.
  // Other functions ($map, $string, etc.) are rejected.
  function: {
    astKeys: ['procedure', 'arguments', 'name'],
    validate: (node, ctx, walk) => {
      const { procedure } = node;
      if (
        !procedure ||
        procedure.value !== ALLOWED_FUNCTION ||
        procedure.type !== 'variable' ||
        // e.g. `$number[$eval(...)]("7")` — the procedure is never walked itself
        unsupportedAstKey(procedure) !== undefined ||
        (node.arguments ?? []).length !== 1
      ) {
        ctx.errors.push('Function calls are not supported. Only $number() casting is allowed.');
        return;
      }
      walk(node.arguments![0], { ...ctx, wrappedInArray: false });
    },
    collectFields: (node, insideRecordsIteration, ctx, walk) => {
      // After validation, only $number(expr) with a single arg reaches here
      walk(node.arguments![0], insideRecordsIteration, ctx);
    },
  },

  // Literal values — "string", 123, true, false, null.  Always valid, no children.
  string: { validate: () => {} },
  number: { validate: () => {} },
  value: { validate: () => {} },
};

/**
 * Recursively validate an AST node against the whitelist.
 */
function validateNode(node: AstNode, ctx: ValidationContext): void {
  if (!node || !node.type) return;

  const handler = NODE_HANDLERS[node.type];
  if (!handler) {
    ctx.errors.push(`Expression type "${node.type}" is not supported.`);
    return;
  }
  // Fail closed on any slot no handler walks — filters, group-by, bindings, or
  // anything a future parser version adds
  const unknownKey = unsupportedAstKey(node, handler.astKeys);
  if (unknownKey) {
    ctx.errors.push(unsupportedAstKeyError(node, unknownKey));
    return;
  }

  handler.validate(node, ctx, validateNode);
}

/**
 * Recursively collect record field names from the AST.
 *
 * Only extracts fields accessed via bare names inside `$$.records.{}`
 * mapping blocks.  Connection fields (e.g. `$$.connection.audience_id`)
 * and static literals are ignored.
 */
function collectFields(node: AstNode, insideRecordsIteration: boolean, ctx: FieldContext): void {
  if (!node || !node.type) return;
  NODE_HANDLERS[node.type]?.collectFields?.(node, insideRecordsIteration, ctx, collectFields);
}

/**
 * Parse and validate a template string, returning the validated AST or errors.
 */
function parseAndValidate(
  template: string,
  rootCollection: string,
): { ast: AstNode } | { errors: string[] } {
  let ast: AstNode;
  try {
    const expr = jsonata(template);
    ast = expr.ast() as AstNode;
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : (e as { message?: string })?.message || String(e);
    return { errors: [message || PARSE_FALLBACK_ERROR] };
  }

  if (!ast || !ast.type) {
    return { errors: [PARSE_FALLBACK_ERROR] };
  }

  const ctx: ValidationContext = {
    insideMappingStep: false,
    insideObjectOrArray: false,
    wrappedInArray: false,
    rootCollection,
    errors: [],
  };
  validateNode(ast, ctx);

  if (ctx.errors.length > 0) {
    return { errors: ctx.errors };
  }
  return { ast };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export type ParseTemplateResult =
  | { valid: true; recordFields: string[] }
  | { valid: false; errors: string[] };

/**
 * Parse, validate, and extract record fields from a user-provided template.
 *
 * Parses the template into an AST, walks every node against a whitelist
 * (returning all errors so users can fix everything in one pass), then
 * extracts deduplicated record field names from `$$.records.{}`
 * mapping blocks.
 *
 * Example: `{ "data": [$$.records.[email, phone]] }`
 *   → { valid: true, recordFields: ["email", "phone"] }
 */
export function parseTemplate(
  template: string,
  rootCollection: string = DEFAULT_ROOT_COLLECTION,
): ParseTemplateResult {
  const result = parseAndValidate(template, rootCollection);
  if ('errors' in result) {
    return { valid: false, errors: result.errors };
  }

  const fields = new Set<string>();
  collectFields(result.ast, false, { fields, rootCollection });
  return { valid: true, recordFields: [...fields] };
}

/**
 * Compile and evaluate a template against the provided data.
 *
 * The data object is passed as the JSONata input — templates access it via
 * `$$` paths (e.g. `$$.records`, `$$.connection.audience_id`).
 *
 * Returns the evaluation result (typically an object or array).
 * Throws on parse errors or evaluation failures.
 */
export async function evaluateTemplate(
  template: string,
  data: Record<string, unknown>,
): Promise<unknown> {
  // JSONata parse errors are plain objects (not Error instances).
  // Wrap them so callers can rely on standard Error handling.
  let expr: jsonata.Expression;
  try {
    expr = jsonata(template);
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : (e as { message?: string })?.message || String(e);
    throw new Error(message || PARSE_FALLBACK_ERROR);
  }
  const result = await expr.evaluate(data);
  return stripJsonataInternals(result);
}

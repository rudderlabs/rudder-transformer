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
 * The engine parses this into an AST where:
 *   - `$$` paths produce a variable step with value "$" (root reference)
 *   - bare names like `email_sha256` produce name steps (record field access)
 *   - `$$.records.{...}` produces a path with a mapping step (iteration)
 *   - `$number(...)` produces a function node with procedure.value = "number"
 */
import jsonata from 'jsonata';

const PARSE_FALLBACK_ERROR = 'Failed to parse template.';

// JSONata attaches internal properties (`sequence`, `keepArray`) to mapped
// arrays — see jsonata-js/jsonata#296. Walk the result tree in-place and
// delete them so they don't leak to callers.
// Mutating is safe here because the JSONata result is not referenced elsewhere.
const JSONATA_INTERNAL_PROPS = ['sequence', 'keepArray'];

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
  predicate?: unknown[];
  stages?: unknown[];
  [key: string]: unknown;
}

// JSONata represents `$$` (root input) as a variable with value "$".
// e.g. `$$.records` → path { steps: [variable("$"), name("records")] }
const ROOT_VARIABLE = '$';

// The field name used in `$$.records.{}` iteration paths.
const RECORDS_FIELD = 'records';

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
  errors: string[];
}

// Walk function signatures passed to handlers so they can recurse.
type ValidateWalker = (node: AstNode, ctx: ValidationContext) => void;
type FieldWalker = (node: AstNode, insideRecordsIteration: boolean, fields: Set<string>) => void;

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
    fields: Set<string>,
    walk: FieldWalker,
  ) => void;
}

/**
 * Check for filter/predicate/stages on a node — these indicate
 * bracket notation or filter expressions which are not allowed.
 */
function hasFilterOrPredicate(node: AstNode): boolean {
  return (
    (Array.isArray(node.predicate) && node.predicate.length > 0) ||
    (Array.isArray(node.stages) && node.stages.length > 0)
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
    collectFields: (node, insideRecordsIteration, fields, walk) => {
      if (node.value === '{') {
        const pairs: AstNode[][] = node.lhs ?? [];
        for (const pair of pairs) {
          walk(pair[1], insideRecordsIteration, fields);
        }
      } else if (node.value === '[') {
        const elements: AstNode[] = node.expressions ?? [];
        for (const elem of elements) {
          walk(elem, insideRecordsIteration, fields);
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
    validate: (node, ctx, walk) => {
      const steps: AstNode[] = node.steps ?? [];

      // Check for filter/predicate on any step (e.g. $$["key"], records[x=1])
      for (const step of steps) {
        if (hasFilterOrPredicate(step)) {
          ctx.errors.push('Filter expressions are not supported.');
          return;
        }
      }

      // Bare name path (no $$ root) — only valid inside a mapping step
      if (steps[0]?.type === 'name') {
        if (!ctx.insideMappingStep) {
          if (!ctx.insideObjectOrArray) {
            ctx.errors.push(
              `Bare identifiers (e.g., "${steps[0].value}") are not allowed. Use $$.field to access data.`,
            );
          } else {
            ctx.errors.push(
              'Relative field references (field) can only be used inside a $$.records.{} mapping block.',
            );
          }
          return;
        }
        // Valid bare name inside mapping — leaf node, nothing more to validate
        return;
      }

      // $$ root path — verify root variable
      if (steps[0]?.type === 'variable') {
        if (steps[0].value !== ROOT_VARIABLE) {
          ctx.errors.push('Variable references are not allowed. Use $$.field to access data.');
          return;
        }
        if (hasFilterOrPredicate(steps[0])) {
          ctx.errors.push(
            'Bracket notation ($$["key"]) is not supported. Use dot notation ($$.key) instead.',
          );
          return;
        }
      }

      // Detect $$.records path and check for nested iteration.
      // Only `$$.records.{...}` is allowed — deeper paths like `$$.records.foo.{...}`
      // would produce incorrect recordFields since bare names refer to nested data.
      const isRecordsPath =
        steps.length >= 2 &&
        steps[0]?.type === 'variable' &&
        steps[0]?.value === ROOT_VARIABLE &&
        steps[1]?.type === 'name' &&
        steps[1]?.value === RECORDS_FIELD;

      const mappingStepIdx = steps.findIndex(
        (s: AstNode) => s.type === 'unary' && (s.value === '{' || s.value === '['),
      );

      if (isRecordsPath && mappingStepIdx >= 0 && mappingStepIdx !== 2) {
        ctx.errors.push(
          'Nested iteration under $$.records is not supported. Use $$.records.{...} directly.',
        );
        return;
      }

      // $$.records mappings must be wrapped in [...] to guarantee array output.
      // JSONata unwraps single-element mapping results into bare values, so
      // `$$.records.{...}` with one record returns an object instead of a
      // one-element array. Wrapping in [...] prevents this:
      //   [$$.records.{ "email": email }]   → always an array
      if (isRecordsPath && mappingStepIdx >= 0 && !ctx.wrappedInArray) {
        ctx.errors.push(
          '$$.records iteration must be wrapped in [...] to guarantee array output ' +
            '(e.g. [$$.records.{...}]). Without this, single-record batches produce a bare object.',
        );
        return;
      }

      // Walk each step
      for (const step of steps) {
        if (step.type === 'unary') {
          // Mapping step — bare names become valid inside
          walk(step, {
            ...ctx,
            insideMappingStep: true,
            insideObjectOrArray: true,
            wrappedInArray: false,
          });
        } else if (step.type !== 'name' && step.type !== 'variable') {
          // Unknown step type (function, wildcard, descendant, sort, etc.)
          // — delegate to validateNode which will reject disallowed types
          walk(step, ctx);
        }
        // name and variable are known leaf steps — no children to walk
      }
    },

    // Field extraction for paths:
    //   - Bare name (no root) inside records iteration → first name = record field
    //     e.g. `email_sha256` → "email_sha256"
    //   - `$$.records.{<mapping>}` → enter the mapping with insideRecordsIteration=true
    //   - `$$.connection.*` and other `$$` paths → ignored (no record fields)
    collectFields: (node, insideRecordsIteration, fields, walk) => {
      const steps: AstNode[] = node.steps ?? [];

      // Bare name inside records iteration → record field
      if (insideRecordsIteration && steps[0]?.type === 'name') {
        fields.add(steps[0].value as string);
        return;
      }

      // $$ root path — check for $$.records.{...} to enter iteration context.
      // AST shape: steps = [variable("$"), name("records"), unary("{"/"]")]
      const isRecordsPath =
        steps.length >= 3 &&
        steps[0]?.type === 'variable' &&
        steps[0]?.value === ROOT_VARIABLE &&
        steps[1]?.type === 'name' &&
        steps[1]?.value === RECORDS_FIELD;

      for (const step of steps) {
        if (step.type === 'unary' && isRecordsPath) {
          if (step.value === '{') {
            const pairs: AstNode[][] = step.lhs ?? [];
            for (const pair of pairs) {
              walk(pair[1], true, fields);
            }
          } else if (step.value === '[') {
            const elements: AstNode[] = step.expressions ?? [];
            for (const elem of elements) {
              walk(elem, true, fields);
            }
          }
        }
      }
    },
  },

  // Name step — field access in a path. Leaf node, always valid.
  // Validity of bare-name paths is checked in the path handler.
  name: { validate: () => {} },

  // Variable node — standalone `$$` reference (outside a path).
  // Inside paths, variables are validated by the path handler directly.
  variable: {
    validate: (node, ctx) => {
      if (hasFilterOrPredicate(node)) {
        ctx.errors.push(
          'Bracket notation ($$["key"]) is not supported. Use dot notation ($$.key) instead.',
        );
        return;
      }
      if (node.value !== ROOT_VARIABLE) {
        ctx.errors.push('Variable references are not allowed. Use $$.field to access data.');
      }
    },
  },

  // Function call — only $number() casting is allowed.
  // e.g. `$number($$.connection.audience_id)` → walk into the argument.
  // Other functions ($map, $string, etc.) are rejected.
  function: {
    validate: (node, ctx, walk) => {
      const { procedure } = node;
      if (
        !procedure ||
        procedure.value !== ALLOWED_FUNCTION ||
        procedure.type !== 'variable' ||
        (node.arguments ?? []).length !== 1
      ) {
        ctx.errors.push('Function calls are not supported. Only $number() casting is allowed.');
        return;
      }
      walk(node.arguments![0], { ...ctx, wrappedInArray: false });
    },
    collectFields: (node, insideRecordsIteration, fields, walk) => {
      // After validation, only $number(expr) with a single arg reaches here
      walk(node.arguments![0], insideRecordsIteration, fields);
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

  handler.validate(node, ctx, validateNode);
}

/**
 * Recursively collect record field names from the AST.
 *
 * Only extracts fields accessed via bare names inside `$$.records.{}`
 * mapping blocks.  Connection fields (e.g. `$$.connection.audience_id`)
 * and static literals are ignored.
 */
function collectFields(node: AstNode, insideRecordsIteration: boolean, fields: Set<string>): void {
  if (!node || !node.type) return;
  NODE_HANDLERS[node.type]?.collectFields?.(node, insideRecordsIteration, fields, collectFields);
}

/**
 * Parse and validate a template string, returning the validated AST or errors.
 */
function parseAndValidate(template: string): { ast: AstNode } | { errors: string[] } {
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
export function parseTemplate(template: string): ParseTemplateResult {
  const result = parseAndValidate(template);
  if ('errors' in result) {
    return { valid: false, errors: result.errors };
  }

  const fields = new Set<string>();
  collectFields(result.ast, false, fields);
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

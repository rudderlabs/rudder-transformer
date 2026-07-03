import { z, ZodRawShape, ZodTypeAny } from 'zod';

// ---------------------------------------------------------------------------
// Router-input schema builder
// ---------------------------------------------------------------------------

/**
 * One message shape a destination accepts, with the connection config (if any)
 * that applies to it. Hybrid destinations (e.g. customerio v2) declare several:
 * record messages validate a connection config, event-stream messages don't.
 */
export type InputVariant = { message: ZodTypeAny; connectionConfig?: ZodTypeAny };

// A declared connection is always optional, mirroring
// `RouterTransformationRequestData.connection?`. Destinations that require it
// enforce that in their constructor (and access it via `!`).
type ConnectionField<CC extends ZodTypeAny | undefined> = CC extends ZodTypeAny
  ? { connection?: { config: z.infer<CC> } }
  : unknown;

type DestinationField<DC extends ZodTypeAny | undefined> = DC extends ZodTypeAny
  ? { destination: { Config: z.infer<DC> } }
  : unknown;

// Inferred output for a single variant, merged with the shared `destination`.
type VariantInput<V extends InputVariant, DC extends ZodTypeAny | undefined> = {
  message: z.infer<V['message']>;
} & ConnectionField<V['connectionConfig']> &
  DestinationField<DC>;

/**
 * Output type of a schema built by {@link makeRouterInputSchema}: the union of
 * every variant's inferred shape (each carrying the shared `destination`). Mirrors
 * the relevant parts of the `RouterTransformationRequestData` envelope.
 */
export type RouterInput<
  V extends readonly InputVariant[],
  DC extends ZodTypeAny | undefined = undefined,
> = { [K in keyof V]: VariantInput<V[K], DC> }[number];

const connectionObject = (connectionConfig: ZodTypeAny) =>
  z.object({ config: connectionConfig }).passthrough().optional();

/**
 * Assemble the Zod schema for a batching destination's router input.
 *
 * The framework owns the invariant `RouterTransformationRequestData` envelope
 * (`.passthrough()` lets `metadata` / `request` / etc. flow through unvalidated).
 * Each destination declares a shared `destinationConfig` (→ `destination.Config`)
 * and one or more message `variants`. A variant's `connectionConfig` (when given)
 * validates `connection.config` for that message shape; connection stays optional.
 *
 * Single-mode destinations pass one variant. Hybrid destinations pass several and
 * the framework applies a `z.union` across them, so e.g. a record variant can
 * validate a connection config while an event-stream variant does not — the record
 * schema is never applied to event-stream events.
 *
 * `destinationConfig` is validated outside the union so a bad Config surfaces a
 * precise `destination.Config.*` path (→ configuration error) instead of the
 * union's generic "Invalid input".
 *
 * Typed via an overload so callers get a precisely-inferred schema without a cast.
 */
export function makeRouterInputSchema<
  const V extends readonly InputVariant[],
  DC extends ZodTypeAny | undefined = undefined,
>(spec: { destinationConfig?: DC; variants: V }): z.ZodType<RouterInput<V, DC>>;
export function makeRouterInputSchema(spec: {
  destinationConfig?: ZodTypeAny;
  variants: readonly InputVariant[];
}): ZodTypeAny {
  const { destinationConfig, variants } = spec;
  // The value at the `destination` envelope key, when a Config schema is declared.
  const destinationValue = destinationConfig
    ? z.object({ Config: destinationConfig }).passthrough()
    : undefined;

  // Single variant: one object, identical to a non-hybrid destination's schema.
  if (variants.length === 1) {
    const [variant] = variants;
    const shape: ZodRawShape = { message: variant.message };
    if (destinationValue) {
      shape.destination = destinationValue;
    }
    if (variant.connectionConfig) {
      shape.connection = connectionObject(variant.connectionConfig);
    }
    return z.object(shape).passthrough();
  }

  // Multiple variants: union the message/connection shapes, validate `destination`
  // outside the union so its error paths stay precise.
  const variantSchemas = variants.map((variant) => {
    const shape: ZodRawShape = { message: variant.message };
    if (variant.connectionConfig) {
      shape.connection = connectionObject(variant.connectionConfig);
    }
    return z.object(shape).passthrough();
  });

  // `z.union` requires a tuple of ≥2; this branch only runs with ≥2 variants.
  const union = z.union(variantSchemas as unknown as [ZodTypeAny, ZodTypeAny, ...ZodTypeAny[]]);
  if (!destinationValue) {
    return union;
  }
  return z.object({ destination: destinationValue }).passthrough().and(union);
}

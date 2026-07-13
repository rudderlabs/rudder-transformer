import { z, ZodRawShape, ZodType, ZodTypeAny } from 'zod';

// ---------------------------------------------------------------------------
// Router-input schema builder (single variant)
// ---------------------------------------------------------------------------

// A declared connection is always optional, mirroring
// `RouterTransformationRequestData.connection?`. Destinations that require it
// enforce that in their constructor (and access it via `!`).
type ConnectionField<CC extends ZodTypeAny | undefined> = CC extends ZodTypeAny
  ? { connection?: { config: z.infer<CC> } }
  : unknown;

type DestinationField<DC extends ZodTypeAny | undefined> = DC extends ZodTypeAny
  ? { destination: { Config: z.infer<DC> } }
  : unknown;

/**
 * Output type of a schema built by {@link makeRouterInputSchema}: the message plus the
 * (optional) connection and destination config. Mirrors the relevant parts of the
 * `RouterTransformationRequestData` envelope.
 */
export type SingleRouterInput<
  M extends ZodTypeAny,
  DC extends ZodTypeAny | undefined = undefined,
  CC extends ZodTypeAny | undefined = undefined,
> = { message: z.infer<M> } & ConnectionField<CC> & DestinationField<DC>;

/**
 * Assemble the Zod schema for a batching destination's router input.
 *
 * The framework owns the invariant `RouterTransformationRequestData` envelope
 * (`.passthrough()` lets `metadata` / `request` / etc. flow through unvalidated).
 * A destination declares the message schema, an optional `destinationConfig`
 * (→ `destination.Config`) and an optional `connectionConfig` (→ `connection.config`,
 * kept optional). Hybrid (record + event-stream) destinations build one schema per
 * variant and let `VDMV2ObjectDestination` union them.
 *
 * Typed via an overload so callers get a precisely-inferred schema without a cast.
 */
export function makeRouterInputSchema<
  M extends ZodTypeAny,
  DC extends ZodTypeAny | undefined = undefined,
  CC extends ZodTypeAny | undefined = undefined,
>(spec: {
  message: M;
  destinationConfig?: DC;
  connectionConfig?: CC;
}): z.ZodType<SingleRouterInput<M, DC, CC>>;
export function makeRouterInputSchema(spec: {
  message: ZodTypeAny;
  destinationConfig?: ZodTypeAny;
  connectionConfig?: ZodTypeAny;
}): ZodTypeAny {
  const { message, destinationConfig, connectionConfig } = spec;
  const shape: ZodRawShape = { message };
  if (destinationConfig) {
    shape.destination = z.object({ Config: destinationConfig }).passthrough();
  }
  if (connectionConfig) {
    shape.connection = z.object({ config: connectionConfig }).passthrough().optional();
  }
  return z.object(shape).passthrough();
}

// ---------------------------------------------------------------------------
// Router-input schema builder (hybrid: record + event-stream)
// ---------------------------------------------------------------------------

// Zod 3's `discriminatedUnion` only reads a discriminator at the top level of each
// option, but ours is nested at `message.type`. `preprocess` lifts it to this synthetic
// key so Zod can pick a branch. It never escapes: the returned schema is typed as the
// clean variant union, and validateInputs forwards the original input (not Zod's parsed
// output) to transforms.
const VARIANT_KEY = '__variant';

/**
 * Assemble the router-input schema for a hybrid (record + event-stream) destination.
 *
 * Validates the variants as a *discriminated* union rather than a plain `z.union`.
 * A plain union collapses every branch's failure into one opaque `invalid_union` issue
 * with no usable path — so a bad `destination.Config`, which both branches declare,
 * fails both, and the caller could only guess which branch was meant. Discriminating on
 * `message.type` makes Zod pick exactly one branch and report only its issues, with real
 * paths (`destination.Config.apiKey`, `connection.config.destination.object`, …).
 */
export function makeHybridInputSchema<TRecord extends ZodTypeAny, TEventStream extends ZodTypeAny>(
  recordSchema: TRecord,
  eventStreamSchema: TEventStream,
): ZodType<z.infer<TRecord> | z.infer<TEventStream>> {
  // Both variants come from makeRouterInputSchema, so each is a ZodObject and can carry
  // the discriminator — not provable from the ZodTypeAny bound, hence the cast.
  const withVariant = (schema: ZodTypeAny, kind: 'record' | 'eventStream') =>
    (schema as unknown as z.AnyZodObject).extend({ [VARIANT_KEY]: z.literal(kind) });

  const schema = z.preprocess(
    (input) => {
      if (typeof input !== 'object' || input === null) {
        return input;
      }
      const { type } = (input as { message?: { type?: unknown } }).message ?? {};
      return { ...(input as object), [VARIANT_KEY]: type === 'record' ? 'record' : 'eventStream' };
    },
    z.discriminatedUnion(VARIANT_KEY, [
      withVariant(recordSchema, 'record'),
      withVariant(eventStreamSchema, 'eventStream'),
    ]),
  );

  return schema as unknown as ZodType<z.infer<TRecord> | z.infer<TEventStream>>;
}

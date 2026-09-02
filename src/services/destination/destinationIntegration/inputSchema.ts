import { z, ZodRawShape, ZodTypeAny } from 'zod';

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

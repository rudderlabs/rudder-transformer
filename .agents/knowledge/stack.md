## Runtime and Language <!-- RUD-2749 -->
- Node.js service with mixed TypeScript and JavaScript code paths.
- Anchor: `package.json`
- Anchor: `src/v0/destinations/*` (mixed `*.js` and `*.ts`)

## Web Layer <!-- RUD-2749 -->
- Koa + `@koa/router` provide HTTP endpoints for processor/router/batch/proxy/delete flows.
- Anchor: `src/routes/destination.ts`
- Anchor: `src/controllers/destination.ts`

## Transformation Layer <!-- RUD-2749 -->
- Native integration service and CDK v2 service implement `DestinationService` contract.
- Anchor: `src/interfaces/DestinationService.ts`
- Anchor: `src/services/destination/nativeIntegration.ts`
- Anchor: `src/services/destination/cdkV2Integration.ts`

## Batching/Validation Tooling <!-- RUD-2749 -->
- Native batching framework: `BatchDestination`, batch strategies, Zod schema validation.
- Anchor: `src/services/destination/nativeBatching/batchDestination.ts`
- Anchor: `src/services/destination/nativeBatching/processBatchedDestination.ts`
- Anchor: `src/v0/destinations/custom_audience/routerTransform.ts` (CustomBatchStrategy)
- Anchor: `src/v0/destinations/posthog/routerTransform.ts` (ChunkBatchStrategy)

## Observability and Erroring <!-- RUD-2749 -->
- Stats and tag-based error typing are first-class in transform/post-transform flow.
- Anchor: `src/services/destination/postTransformation.ts`
- Anchor: `src/v0/util/tags`
- Anchor: `src/util/stats`

## Testing Stack <!-- RUD-2749 -->
- Jest + Supertest + Axios mock adapter for component/integration tests.
- Data-driven fixtures under `test/integrations/destinations/<dest>/`.
- Anchor: `test/integrations/component.test.ts`
- Anchor: `test/integrations/testUtils.ts`

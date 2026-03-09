/**
 * Destinations that opt into the new RouterIntegration batching framework.
 *
 * When a destination is listed here, NativeIntegrationDestinationService.doRouterTransformation
 * loads its RouterIntegration from `src/v0/destinations/{dest}/routerTransform.ts`
 * and runs it through processBatchedDestination instead of the legacy processRouterDest path.
 */
export const batchedDestinationsMap: Record<string, true> = {
  POSTHOG: true,
  BRAZE: true,
};

import { Context, Next } from 'koa';

export interface FeatureFlags {
  [key: string]: boolean | string;
}

export const FEATURE_FILTER_CODE = 'filter-code';

export class FeatureFlagMiddleware {
  public static async handle(ctx: Context, next: Next): Promise<void> {
    // Initialize ctx.state.features if it doesn't exist
    ctx.state.features = (ctx.state.features || {}) as FeatureFlags;

    // Get headers from the request
    const { headers } = ctx.request;

    // Filter headers that start with 'X-Feature-'
    const featureHeaders = Object.keys(headers).filter((key) =>
      key.toLowerCase().startsWith('x-feature-'),
    );

    // Convert feature headers to feature flags in ctx.state.features
    featureHeaders.forEach((featureHeader) => {
      // Get the feature name by removing the prefix, and convert to camelCase
      const featureName = featureHeader
        .substring(10)
        .replace(/X-Feature-/g, '')
        .toLowerCase();

      let value: string | boolean | undefined;
      const valueString = headers[featureHeader] as string;
      if (valueString === 'true' || valueString === '?1') {
        value = true;
      } else if (valueString === 'false' || valueString === '?0') {
        value = false;
      } else {
        value = valueString;
      }

      // Set the feature flag in ctx.state.features
      if (value !== undefined) {
        ctx.state.features[featureName] = value;
      }
    });

    // Move to the next middleware
    await next();
  }
}

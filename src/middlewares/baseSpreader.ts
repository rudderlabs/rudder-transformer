import { Context, Next } from 'koa';
import { PlatformError } from '@rudderstack/integrations-lib';
import { SpreaderConfig, SpreaderContext } from './types/spreader';

export abstract class BaseSpreader {
  protected config: SpreaderConfig;

  constructor(config: SpreaderConfig) {
    this.config = config;
  }

  public middleware() {
    return async (ctx: Context, next: Next) => {
      const spreaderCtx = ctx as SpreaderContext;
      spreaderCtx.spreadData = {};

      // Process each rule
      this.config.rules.forEach((rule) => {
        const value = this.extractValue(spreaderCtx, rule.source);
        if (value !== undefined) {
          try {
            spreaderCtx.spreadData[rule.target.path] = rule.transform
              ? rule.transform(value)
              : value;
          } catch (e) {
            throw new PlatformError(
              `Error applying transform function for rule: ${JSON.stringify(rule)}`,
            );
          }
        }
      });

      // Apply the spread data
      await this.applySpreadData(spreaderCtx);

      return next();
    };
  }

  protected extractValue(ctx: Context, source: { type: string; path: string }): any {
    switch (source.type) {
      case 'header':
        return ctx.get(source.path);
      case 'body':
        return this.getNestedValue(ctx.request.body, source.path);
      case 'query':
        return this.getNestedValue(ctx.query, source.path);
      default:
        return undefined;
    }
  }

  protected getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  }

  protected abstract applySpreadData(ctx: SpreaderContext): Promise<void>;
}

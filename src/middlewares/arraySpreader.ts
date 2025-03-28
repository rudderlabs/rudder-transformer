import { BaseSpreader } from './baseSpreader';
import { SpreaderContext } from './types/spreader';

export class ArraySpreader extends BaseSpreader {
  protected async applySpreadData(ctx: SpreaderContext): Promise<void> {
    const { body } = ctx.request;

    // Apply spread data to each array item
    Object.entries(ctx.spreadData).forEach(([key, value]) => {
      if (this.config.rules.find((rule) => rule.target.path === key)?.target.arrayPath) {
        const arrayPath = this.config.rules.find((rule) => rule.target.path === key)?.target
          .arrayPath;
        let array: any[] = [];
        if (arrayPath) {
          array = this.getNestedValue(body, arrayPath);
        }

        if (Array.isArray(array)) {
          array.forEach((item) => {
            if (item) {
              this.setNestedValue(item, key, value);
            }
          });
        }
      }
    });
  }

  private setNestedValue(obj: any, path: string, value: any): void {
    const parts = path.split('.');
    const last = parts.pop();

    if (last) {
      const target = parts.reduce((acc, part) => {
        if (!acc[part]) {
          acc[part] = {};
        }
        return acc[part];
      }, obj);
      if (value) {
        target[last] = value;
      }
    }
  }
}

// Create spreader instance with configuration
export const SecretSpreader = new ArraySpreader({
  name: 'secretSpreader',
  rules: [
    {
      source: {
        type: 'header',
        path: 'oauth-secret',
      },
      target: {
        path: 'metadata.secret',
        arrayPath: 'input',
      },
      transform: (value: string) => (value ? JSON.parse(value) : ''),
    },
  ],
});

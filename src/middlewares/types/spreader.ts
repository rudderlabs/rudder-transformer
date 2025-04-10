import { Context } from 'koa';

export interface SpreadRule {
  source: {
    type: 'header' | 'body' | 'query';
    path: string;
  };
  target: {
    path: string;
    arrayPath?: string; // Path to the array where we need to spread
  };
  transform?: (value: any) => any; // Optional transformation function
}

export interface SpreaderConfig {
  rules: SpreadRule[];
  name: string;
  description?: string;
}

export interface SpreaderContext extends Context {
  spreadData: Record<string, any>;
}

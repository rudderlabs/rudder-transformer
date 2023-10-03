/* eslint-disable @typescript-eslint/no-explicit-any */
export type FixMe = any;

export type CatchErr = any;

export interface Config {
  cdkEnabled?: boolean;
  cdkV2Enabled?: boolean;
  comparisonTestEnabeld?: boolean;
  comparisonService?: string;
  camparisonTestThreshold?: number;
}

export interface IDestDefinition {
  id: string;
  name: string;
  displayName: string;
  config: Config;
  options: {
    isBeta?: boolean;
    hidden?: boolean;
  } | null;
  isPopular: boolean;
  uiConfig: FixMe;
}

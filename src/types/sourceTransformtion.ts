import type { CatchErr } from '../util/types';
import type { Source } from './controlPlaneConfigSpec';
import type { RudderMessage } from './eventSpec';

export type SourceTransformationEvent = {
  headers?: Record<string, string>;
  query_params?: Record<string, string>;
  [key: string]: any;
};

export type SourceRequestV2 = {
  method?: string;
  url?: string;
  proto?: string;
  body: string;
  headers?: Record<string, unknown>;
  query_parameters?: Record<string, unknown>;
};

export type SourceInput = {
  event: {
    query_parameters?: any;
    [key: string]: any;
  };
  source?: Source;
};

export type SourceInputV2 = {
  request: SourceRequestV2;
  source?: Source;
};

export type SourceInputConversionResult<T> = {
  output?: T;
  conversionError?: Error;
};

export type SourceTransformationOutput = {
  batch: RudderMessage[];
};

export type SourceTransformationResponse = {
  output: SourceTransformationOutput;
  error: CatchErr;
  statusCode: number;
  outputToSource: object;
  statTags: object;
};

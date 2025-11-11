import type { CatchErr } from './index';
import type { Source } from './controlPlaneConfig';
import type { RudderMessage } from './rudderEvents';

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

export type SourceTransformationOutput = {
  batch: RudderMessage[];
};

export type SourceTransformationSuccessResponse = {
  output: SourceTransformationOutput;
  statusCode: number;
  outputToSource?: object;
};

export type SourceTransformationErrorResponse = {
  error: CatchErr;
  statusCode: number;
  statTags: object;
};

export type SourceTransformationResponse =
  | SourceTransformationSuccessResponse
  | SourceTransformationErrorResponse;

import { ProxyMetdata, ProxyV1Request } from '../../../types';

type FailedUpdates = {
  invalidEmails?: string[];
  invalidUserIds?: string[];
  notFoundEmails?: string[];
  notFoundUserIds?: string[];
  invalidDataEmails?: string[];
  invalidDataUserIds?: string[];
  conflictEmails?: string[];
  conflictUserIds?: string[];
  forgottenEmails?: string[];
  forgottenUserIds?: string[];
};

export type GeneralApiResponse = {
  msg?: string;
  code?: string;
  params?: Record<string, unknown>;
  successCount?: number;
  failCount?: number;
  invalidEmails?: string[];
  invalidUserIds?: string[];
  filteredOutFields?: string[];
  createdFields?: string[];
  disallowedEventNames?: string[];
  failedUpdates?: FailedUpdates;
};

export type IterableBulkApiResponse = {
  status: number;
  response: GeneralApiResponse;
};

type IterableBulkRequestBody = {
  events?: any[];
  users?: any[];
};

export type IterableBulkProxyInput = {
  destinationResponse: IterableBulkApiResponse;
  rudderJobMetadata: ProxyMetdata[];
  destType: string;
  destinationRequest?: {
    body: {
      JSON: IterableBulkRequestBody;
    };
  };
};

export type GenericProxyHandlerInput = {
  destinationResponse: any;
  rudderJobMetadata: ProxyMetdata[];
  destType: string;
  destinationRequest: ProxyV1Request;
};

export type Response = {
  statusCode: number;
  metadata: any;
  error: string;
};

export type IterableSuccessResponse = {
  status: number;
  message: string;
  destinationResponse: IterableBulkApiResponse;
  response: Response[];
};

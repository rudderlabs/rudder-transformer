import { AxiosResponse } from 'axios';
import { ZodTypeAny, z } from 'zod';
import MockAdapter from 'axios-mock-adapter';

export interface requestType {
  method: string;
  body?: any;
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

export interface responseType {
  status: number;
  body?: any;
  headers?: Record<string, string>;
}

export interface inputType {
  request: requestType;
  pathSuffix?: string;
}

export interface outputType {
  response?: responseType;
}

export interface mockType {
  request: requestType;
  response: responseType;
}

export interface TestCaseData {
  name: string;
  description: string;
  feature: string;
  module: string;
  version?: string;
  input: inputType;
  output: outputType;
  mock?: mockType[];
  mockFns?: (mockAdapter: MockAdapter) => {};
}

export type MockHttpCallsData = {
  httpReq: Record<string, any>;
  httpRes: Partial<AxiosResponse>;
};

export const arrayOrSingleElement = (schema: ZodTypeAny) => z.union([z.array(schema), schema]);
export const formElementSchema = arrayOrSingleElement(
  z.union([z.string(), z.number(), z.boolean()]),
);
export const eventResponseSchema = z.union([
  z.object({
    error: z.string(),
    statTags: z
      .object({
        destType: z.string().optional(),
        errorCategory: z.string().optional(),
        errorType: z.string().optional(),
        feature: z.string().optional(),
        implementation: z.string().optional(),
        module: z.string().optional(),
      })
      .optional(),
    statusCode: z.number().optional(),
  }),
  z.object({
    output: z
      .object({
        version: z.string().optional(),
        type: z.string().optional(),
        method: z.string().optional(),
        endpoint: z.string().optional(),
        headers: z.record(z.string(), z.string()).optional(),
        params: z.record(z.string(), z.any()).optional(),
        body: z
          .object({
            JSON: z.record(z.string(), z.any()).optional(),
            XML: z
              .object({
                payload: z.string().optional(),
              })
              .optional(),
            JSON_ARRAY: z
              .object({
                batch: z.any().optional(),
              })
              .optional(),
            FORM: z.record(z.string(), formElementSchema).optional(),
            GZIP: z
              .object({
                payload: z.string().optional(),
              })
              .optional(),
          })
          .optional(),
        files: z.record(z.string(), z.any()).optional(),
        userId: z.string().optional(),
      })
      .optional(),
    metadata: z.record(z.string(), z.any()).optional(),
    statusCode: z.number().optional(),
  }),
]);

export const batchTransformSchema = z.array(
  z.object({
    batchedRequest: arrayOrSingleElement(eventResponseSchema).optional(),
    metadata: z.array(z.record(z.string(), z.any())).optional(),
    destination: z
      .object({
        ID: z.string().optional(),
        Name: z.string().optional(),
        DestinationDefinition: z
          .object({
            ID: z.string().optional(),
            Name: z.string().optional(),
            DisplayName: z.string().optional(),
            Config: z.any().optional(),
            ResponseRules: z.any().optional(),
          })
          .optional(),
        Config: z.any().optional(),
        Enabled: z.boolean().optional(),
        WorkspaceID: z.string().optional(),
        Transformations: z.any().optional(),
        IsProcessorEnabled: z.boolean().optional(),
        RevisionID: z.string().optional(),
      })
      .optional(),
    batched: z.boolean().optional(),
    statusCode: z.number().optional(),
    error: z.string().optional(),
  }),
);

export const routerTransformSchema = z.object({
  output: batchTransformSchema,
});

export const processorTransformSchema = z.array(eventResponseSchema);

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

export type DestinationResponse = {
  status: number;
  response: GeneralApiResponse;
};

export type ResponseParams = {
  destinationResponse: DestinationResponse;
  rudderJobMetadata: any[];
  destinationRequest?: {
    body: {
      JSON: {
        events?: any[];
        users?: any[];
      };
    };
  };
};

export type Response = {
  statusCode: number;
  metadata: any;
  error: string;
};

export type SuccessResponse = {
  status: number;
  message: string;
  destinationResponse: DestinationResponse;
  response: Response[];
};

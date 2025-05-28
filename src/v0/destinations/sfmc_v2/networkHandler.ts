import { XMLParser } from 'fast-xml-parser';
import { prepareProxyRequest, proxyRequest } from '../../../adapters/network';
import { networkHandler as GenericHandler } from '../../../adapters/networkhandler/genericNetworkHandler';
import { ResponseHandlerParams, ResponseProxyObject } from '../../../types';
import { getDynamicErrorType, processAxiosResponse } from '../../../adapters/utils/networkUtils';
import { TransformerProxyError } from '../../util/errorTypes';
import { TAG_NAMES } from '../../util/tags';

interface Key {
  Name: string;
  Value: string;
}

interface Property {
  Name: string;
  Value: string;
}

interface Keys {
  Key: Key | Key[];
}

interface Properties {
  Property: Property | Property[];
}

interface ResultObject {
  PartnerKey: { '@_xsi:nil': boolean };
  ObjectID: { '@_xsi:nil': boolean };
  CustomerKey: string;
  Keys?: Keys;
  Properties?: Properties;
}

interface SOAPResult {
  StatusCode: string;
  StatusMessage: string;
  OrdinalID: number;
  Object: ResultObject;
  ErrorCode?: string;
  ErrorMessage?: string;
}

interface DeleteResponse {
  Results: SOAPResult | SOAPResult[];
  RequestID: string;
  OverallStatus: string;
}

interface SOAPEnvelope {
  'soap:Body': {
    DeleteResponse?: DeleteResponse;
    UpdateResponse?: DeleteResponse;
    CreateResponse?: DeleteResponse;
  };
}

interface ErrorResult {
  code: string;
  message: string;
  statusMessage: string;
}

interface ErrorDetails {
  errors: ErrorResult[];
  totalErrors: number;
  overallStatus: string;
  hasMoreErrors: boolean;
}

const MAX_ERRORS = 2;
const genericHandler = new GenericHandler();
const xmlParser: XMLParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  parseAttributeValue: true,
});

const hasSOAPErrors = (deleteResponse: DeleteResponse): boolean => {
  const results = Array.isArray(deleteResponse.Results)
    ? deleteResponse.Results
    : [deleteResponse.Results];

  return (
    deleteResponse.OverallStatus === 'Has Errors' ||
    results.some((result) => result.StatusCode === 'Error')
  );
};

const extractSOAPErrors = (deleteResponse: DeleteResponse): ErrorDetails => {
  const results = Array.isArray(deleteResponse.Results)
    ? deleteResponse.Results
    : [deleteResponse.Results];

  const errorResults = results
    .filter((result) => result.StatusCode === 'Error')
    .map((result) => ({
      code: result.ErrorCode || '',
      message: result.ErrorMessage || '',
      statusMessage: result.StatusMessage,
    }));

  const totalErrors = errorResults.length;
  const limitedErrors = errorResults.slice(0, MAX_ERRORS);

  return {
    errors: limitedErrors,
    totalErrors,
    overallStatus: deleteResponse.OverallStatus,
    hasMoreErrors: totalErrors > MAX_ERRORS,
  };
};

const isSOAPResponse = (contentType: string): boolean =>
  contentType?.includes('text/xml') || contentType?.includes('application/soap+xml');

const handleSOAPResponse = (
  destinationResponse: any,
  destType: string | undefined,
): ResponseProxyObject => {
  const { response, status } = destinationResponse;
  if (status !== 200) {
    throw new TransformerProxyError(
      `[SMFC v2 Response Handler] SOAP request failed for destination ${destType}`,
      status,
      { [TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status) },
      destinationResponse,
    );
  }

  const xmlText = response;
  const parsedData = xmlParser.parse(xmlText) as SOAPEnvelope;
  const envelope = parsedData['soap:Envelope'];
  const resultResponse =
    envelope['soap:Body'].DeleteResponse ||
    envelope['soap:Body'].UpdateResponse ||
    envelope['soap:Body'].CreateResponse;
  if (!resultResponse) {
    throw new TransformerProxyError(
      `[SMFC v2 Response Handler] SOAP request failed for destination ${destType}`,
      400,
      { errorType: 'InvalidResponse' },
    );
  }

  if (hasSOAPErrors(resultResponse)) {
    const errorDetails = extractSOAPErrors(resultResponse);
    throw new TransformerProxyError(
      `[SMFC v2 Response Handler] SOAP request failed for destination ${destType} with error details: ${JSON.stringify(errorDetails)}`,
      400,
      { [TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(400) },
      destinationResponse,
      '',
      response,
    );
  }
  // For successful responses, just return success status
  return {
    status: 200,
    message: `[SMFC v2 Response Handler] Request for destination: ${destType} Processed Successfully`,
  };
};

const responseHandler = (params: ResponseHandlerParams): ResponseProxyObject => {
  const { destinationResponse, destType } = params;
  const contentType = destinationResponse?.headers?.['content-type'];
  // Handle SOAP responses
  if (isSOAPResponse(contentType)) {
    return handleSOAPResponse(destinationResponse, destType);
  }

  // Use generic handler for regular responses
  return genericHandler.responseHandler(params);
};

function networkHandler(this: any) {
  this.prepareProxy = prepareProxyRequest;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.responseHandler = responseHandler;
}

module.exports = { networkHandler };

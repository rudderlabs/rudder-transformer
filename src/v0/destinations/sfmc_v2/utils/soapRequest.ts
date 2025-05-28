import { XMLBuilder } from 'fast-xml-parser';
import { SFMCDestination } from '../type';

export const CONTENT_TYPE_XML = 'text/xml; charset="UTF-8"';

export interface SoapRequestConfig {
  requestType: string;
  soapAction: string;
  objects: any[];
}

export const createSoapRequest = (
  config: SoapRequestConfig,
  authToken: string,
  destination: SFMCDestination,
) => {
  const jsonToXml = new XMLBuilder({ ignoreAttributes: false });
  const headers = { fueloauth: { '#text': authToken } };

  const soapBody = jsonToXml.build({
    's:Envelope': {
      's:Header': headers,
      '@_xmlns:s': 'http://www.w3.org/2003/05/soap-envelope',
      '@_xmlns:a': 'http://schemas.xmlsoap.org/ws/2004/08/addressing',
      '@_xmlns:u':
        'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd',
      's:Body': {
        '@_xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        '@_xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
        [config.requestType]: {
          '@_xmlns': 'http://exacttarget.com/wsdl/partnerAPI',
          Objects: config.objects,
        },
      },
    },
  });

  return {
    endpoint: `https://${destination.Config.subDomain}.soap.marketingcloudapis.com/Service.asmx`,
    method: 'POST',
    version: '1',
    type: 'REST',
    params: {},
    files: {},
    body: {
      JSON: {},
      JSON_ARRAY: {},
      XML: {
        payload: soapBody,
      },
      FORM: {},
    },
    headers: {
      'Content-Type': CONTENT_TYPE_XML,
      SOAPAction: config.soapAction,
    },
  };
};

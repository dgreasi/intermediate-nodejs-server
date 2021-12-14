import { IGenericResponse } from '../interfaces/shared';
import { getAfmBodyRequestFactory, soapRequestAsync } from '../services/soap.service';
import { ISoapHeaders } from '../interfaces/gsis';

/**
 * SOAP to HTTP
 * @param method
 * @param url
 * @param headers
 * @param xml
 */
async function makeSoapRequest(
  method: string,
  url: string,
  headers: ISoapHeaders,
  xml: string,
): Promise<IGenericResponse> {
  console.debug('Soap.controller makeSoapRequest started');

  const soapResponse = await soapRequestAsync(method, url, headers, xml);
  if (soapResponse.success) {
    console.debug('Soap.controller makeSoapRequest finished');
    return { success: true, data: soapResponse.data };
  }

  console.debug('Soap.controller makeSoapRequest finished with error');
  return { success: false, error: soapResponse.error };
}

/**
 * Get information for specified afm
 * @param afmCalledFor
 * @param asOnDate
 */
async function getAfmInfo(
  afmCalledFor: string,
  asOnDate?: string,
): Promise<IGenericResponse> {
  console.debug('Soap.controller getAfmInfo started - will finish on return');
  const { method, url, headers, xml } = getAfmBodyRequestFactory(process.env.USERNAME, process.env.PASSWORD, afmCalledFor, asOnDate);
  return await makeSoapRequest(method, url, headers, xml);
}

export { makeSoapRequest, getAfmInfo };

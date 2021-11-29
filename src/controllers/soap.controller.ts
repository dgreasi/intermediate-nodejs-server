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
  const soapResponse = await soapRequestAsync(method, url, headers, xml);
  if (soapResponse.success) return { success: true, data: soapResponse.data };
  return { success: false, error: soapResponse.error };
}

/**
 * Get information for specified afm
 * @param username
 * @param password
 * @param afmCalledFor
 * @param asOnDate
 */
async function getAfmInfo(
  username: string,
  password: string,
  afmCalledFor: string,
  asOnDate?: string,
): Promise<IGenericResponse> {
  const { method, url, headers, xml } = getAfmBodyRequestFactory(username, password, afmCalledFor, asOnDate);
  return await makeSoapRequest(method, url, headers, xml);
}

export { makeSoapRequest, getAfmInfo };

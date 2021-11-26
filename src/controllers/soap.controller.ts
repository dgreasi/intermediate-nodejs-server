import { IGenericResponse } from '../interfaces/shared';
import { getAfmBodyRequestFactory, soapRequestAsync } from '../services/soap.service';

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
  const soapResponse = await soapRequestAsync(method, url, headers, xml);

  if (soapResponse.success) return { success: true, data: soapResponse.data };

  return { success: false, error: soapResponse.error };
}

export { getAfmInfo };

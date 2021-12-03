import { IGenericResponse } from '../interfaces/shared';
import { IAfmSoapBody, ISoapHeaders } from '../interfaces/gsis';
import soapRequest from 'easy-soap-request';
import { XMLParser } from 'fast-xml-parser';
const parser = new XMLParser();

/**
 * Make SOAP request to GSIS server and get afm information
 * @param method
 * @param url
 * @param headers
 * @param xml
 * @private
 */
async function soapRequestAsync(
  method = 'POST',
  url: string,
  headers: ISoapHeaders,
  xml: string,
): Promise<IGenericResponse> {
  try {
    const { response } = await soapRequest({ method, url, headers, xml }); // Optional timeout parameter(milliseconds)
    const { headers: headersResp, body, statusCode } = response;
    const bodyJSON = parser.parse(body);

    console.debug('--------------- SOAP HEADERS ----------------');
    console.debug(headersResp);
    console.debug('-------------- SOAP BODY -----------------');
    console.debug(bodyJSON);
    console.debug('--------------- SOAP STATUS CODE ----------------');
    console.debug(statusCode);
    console.debug('-------------- SOAP END ----------------');

    return {
      success: true,
      data: bodyJSON,
    };
  } catch (error) {
    const errorJSON = parser.parse(error);

    console.debug('-------------- ERROR START ----------------');
    console.debug(errorJSON);
    console.debug('-------------- ERROR END ----------------');

    return {
      success: false,
      error: errorJSON,
    };
  }
}

/**
 * Get SOAP request body
 * @param username
 * @param password
 * @param afmCalledFor: 9 numbers as string
 * @param asOnDate: 'YYYY-MM-DD'
 */
function getAfmBodyRequestFactory(
  username: string,
  password: string,
  afmCalledFor: string,
  asOnDate?: string,
): IAfmSoapBody {
  return {
    method: 'POST',
    url: 'https://www1.gsis.gr/wsaade/RgWsPublic2/RgWsPublic2',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/soap+xml;charset=UTF-8;',
      soapAction: 'http://rgwspublic2/RgWsPublic2Service:rgWsPublic2AfmMethod',
    },
    xml: `<env:Envelope xmlns:env="http://www.w3.org/2003/05/soap-envelope"
      xmlns:ns1="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"
      xmlns:ns2="http://rgwspublic2/RgWsPublic2Service" xmlns:ns3="http://rgwspublic2/RgWsPublic2">
         <env:Header>
            <ns1:Security>
               <ns1:UsernameToken>
                  <ns1:Username>${username}</ns1:Username>
                  <ns1:Password>${password}</ns1:Password>
               </ns1:UsernameToken>
            </ns1:Security>
         </env:Header>
         <env:Body>
            <ns2:rgWsPublic2AfmMethod>
               <ns2:INPUT_REC>
                  <ns3:afm_called_by/>
                  <ns3:afm_called_for>${afmCalledFor}</ns3:afm_called_for>
                  ${asOnDate && `<ns3:as_on_date>${asOnDate}</ns3:as_on_date>`}
               </ns2:INPUT_REC>
            </ns2:rgWsPublic2AfmMethod>
         </env:Body>
      </env:Envelope>`,
  };
}

export { soapRequestAsync, getAfmBodyRequestFactory };

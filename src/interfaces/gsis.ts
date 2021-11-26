interface IAfmSoapBody {
    method: 'POST' | 'GET';
    url: string;
    headers: ISoapHeaders;
    xml: string;
}

interface ISoapHeaders {
    'Access-Control-Allow-Origin'?: string;
    'Content-Type': string;
    soapAction: string;
}

export { IAfmSoapBody, ISoapHeaders };
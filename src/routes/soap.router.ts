import { IGetAfmDTO } from '../interfaces/dto/gsis.dto';
import { getAfmInfo, makeSoapRequest } from '../controllers/soap.controller';
import express from 'express';
const soapRouter = express.Router();

/**
 * Use headers
 */
soapRouter.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

/**
 * Make SOAP request and respond with result
 */
soapRouter.post('/', async function (req, res) {
  console.debug('============= POST /soap STARTED ============= ');
  console.debug('----------------------- BODY -----------------------');
  console.debug('req.body: ', req?.body);
  console.debug('----------------------------------------------------');

  const { method, url, headers, xml } = req.body;

  if (method && url && xml) {
    const response = await makeSoapRequest(method, url, headers || {}, xml);
    res.status(200).send(response);
    console.debug('============= POST /soap ENDED ============= ');
    return
  }

  res.status(500).send('Missing body arguments');
  console.debug('============= POST /soap ENDED WITH ERROR ============= ');
});

/**
 * Get business information from State by specifying,
 * state credentials and unique number of business (afm)
 */
soapRouter.get('/afm', async function (req, res) {
  console.debug('============= GET /soap/afm STARTED =============');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { username, password, afmCalledFor } = req.query as IGetAfmDTO;

  console.debug('------------------ REQUEST HEADERS -----------------');
  console.debug('req.headers: ', req.headers)
  console.debug('----------------------------------------------------');

  console.debug('----------------------- ARGS -----------------------');
  console.debug('query: ', req.query);
  console.debug('----------------------------------------------------');

  if (username?.length && password?.length && afmCalledFor.length) {
    const response = await getAfmInfo(username, password, afmCalledFor);
    res.send(response);
    console.debug('============= GET /soap/afm ENDED =============');
    return;
  }

  res.status(400).send('Missing arguments');
  console.debug('============= GET /soap/afm ENDED WITH ERROR =============');
});

export { soapRouter };

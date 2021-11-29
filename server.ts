import dotenv from 'dotenv';
import express from 'express';
import { request } from 'request';
import bodyParser from 'body-parser';
import { engine } from 'express-handlebars';
import { getAfmInfo } from './src/controllers/soap.controller';
import { IGetAfmDTO } from './src/interfaces/dto/gsis.dto';

// Parse environment variables
dotenv.config();

// INIT SERVER
const app = express();
const port = process.env.PORT || 80;

// serve your static as static
app.use(express.static(__dirname + '/src/views'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// Init handlebars configuration
app.engine('handlebars', engine({
  defaultLayout: 'main',
  extname: '.handlebars',
  helpers: {
    getShortComment(comment) {
      if (comment.length < 64) {
        return comment;
      }

      return comment.substring(0, 64) + '...';
    }
  }
}));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/src/views');

/**
 * Use headers
 */
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

/**
 * Home page, nothing to show
 */
app.get('/', function (req, res) {
  res.render('home', { device: process.env.DEVICE });
});

/**
 * Make SOAP request and respond with result
 */
app.post('/soap', async function (req, res) {
  console.log('req.body: ', req.body);
  res.status(400).send('Currently unavailable');
});

/**
 * Get business information from State by specifying,
 * state credentials and unique number of business (afm)
 */
app.get('/soap/afm', async function (req, res) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { username, password, afmCalledFor } = req.query as IGetAfmDTO;

  if (username?.length && password?.length && afmCalledFor.length) {
    const response = await getAfmInfo(username, password, afmCalledFor);
    res.send(response);
    return;
  }

  res.status(400).send('MISSING ARGUMENTS!!!');
});

/**
 * 404 test page
 */
app.get('/404', function (req, res) {
  res.render('pages/404', { device: process.env.DEVICE });
});

/**
 * Get members of GitHub organisation
 */
app.get('/4', function (req, res) {
  makeHTTP('https://api.github.com/orgs/greasidis/members').then(
    (result) => {
      res.send(result);
    },
    (err) => {
      res.sendStatus(err);
    },
  );
});

/**
 * Make request and respond back to client (CORS)
 */
app.get('/*', function (req, res) {
  makeHTTP(req.params[0]).then(
    (result) => {
      res.send(result);
    },
    (err) => {
      res.send(err);
    },
  );
});

function makeHTTP(inputReq) {
  return new Promise((resolve, reject) => {
    request({ url: inputReq, headers: { 'User-Agent': 'request' } }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}

// start a server on {port} and log initialisation
app.listen(port, function () {
  console.debug('Listening on port: ', port);
});

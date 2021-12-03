import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import { engine } from 'express-handlebars';
// import cors from 'cors';
import { mainRouter } from './src/routes/main.router';
import { soapRouter } from './src/routes/soap.router';
import { corsRouter } from './src/routes/cors.router';

// Parse environment variables
dotenv.config();

// INIT SERVER
const app = express();
// app.use(cors());
const port = process.env.PORT || 80;

// Parse application/x-www-form-urlencoded for POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// serve your static as static
app.use(express.static(__dirname + '/src/views'));

// Init handlebars configuration
app.engine(
  'handlebars',
  engine({
    defaultLayout: 'main',
    extname: '.handlebars',
    helpers: {
      getShortComment(comment) {
        if (comment.length < 64) {
          return comment;
        }

        return comment.substring(0, 64) + '...';
      },
    },
  }),
);
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/src/views');

// Routes
app.use('/', mainRouter);
app.use('/soap', soapRouter);
app.use('/cors', corsRouter);
app.use('/', corsRouter);

// start a server on {port} and log initialisation
app.listen(port, function () {
  console.debug('Listening on port: ', port);
});

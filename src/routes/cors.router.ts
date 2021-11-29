import express from 'express';
import { makeHTTP } from '../services/shared.service';
const corsRouter = express.Router();

/**
 * Make request and respond back to client (CORS)
 */
corsRouter.get('/*', function (req, res) {
  console.debug('============= GET /* STARTED ============= ');

  if (!req.params[0]?.includes('http')) {
      res.status(404).send('Unavailable. CORS url does not contain http/https.');
      console.debug('============= GET /*  ENDED WITH ERROR 404 ============= ');
      return;
  }

  makeHTTP(req.params[0]).then(
    (result) => {
      res.send(result);
      console.debug('============= GET /* ENDED ============= ');
    },
    (err) => {
      console.log('err: ', err);
      res.send(err);
      console.debug('============= GET /*  ENDED WITH ERROR ============= ');
    },
  );
});


/**
 * Get members of GitHub organisation
 */
corsRouter.get('/4', function (req, res) {
    console.debug('============= GET /4 STARTED ============= ');
    makeHTTP('https://api.github.com/orgs/greasidis/members').then(
        (result) => {
            res.send(result);
            console.debug('============= GET /4 ENDED ============= ');
        },
        (err) => {
            res.sendStatus(err);
            console.debug('============= GET /4 ENDED WITH ERROR ============= ');
        },
    );
});

export { corsRouter };

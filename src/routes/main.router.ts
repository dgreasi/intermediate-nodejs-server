import express from 'express';
const mainRouter = express.Router();

/**
 * Home page, nothing to show
 */
mainRouter.get('/', function (req, res) {
  console.debug('============= GET / STARTED ============= ');
  res.render('home', { device: process.env.DEVICE });
  console.debug('============= GET / ENDED ============= ');
});

/**
 * 404 test page
 */
mainRouter.get('/404', function (req, res) {
  console.debug('============= GET /404 STARTED ============= ');
  res.render('pages/404', { device: process.env.DEVICE });
  console.debug('============= GET /404 ENDED ============= ');
});

export { mainRouter };

import express from 'express';
import AppController from '../controllers/AppController';

function controllerRouting(app) {
  const router = express.Router();
  app.use('/', router);

  router.get('/status', (req, res) => {
    AppController.getStatus(req, res);
  });
}

export default controllerRouting;

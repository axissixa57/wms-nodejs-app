import express from 'express';
import * as registrationController from '../controllers/registrationController';

const registrationRouter = express.Router();

registrationRouter.get('/', registrationController.getRegistrationPage);
registrationRouter.post(
  '/',
  registrationController.postDataFromRegistrationPage
);

export { registrationRouter };

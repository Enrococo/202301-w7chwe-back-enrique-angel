import express from 'express';
import { Joi, validate } from 'express-validation';
import { loginUserController, registerController } from './auth-controllers.js';

const authRouter = express.Router();

const loginValidation = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
  }),
};

authRouter.use(validate(loginValidation));

authRouter.route('/register').post(registerController);
authRouter.route('/login').post(loginUserController);

export default authRouter;

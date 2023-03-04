import { RequestHandler } from 'express';
import { User, UserModel } from '../users/user-schema.js';
import { encryptPassword, generateJWTToken } from './auth-utils.js';

export interface LoginResponse {
  accessToken: string;
}

export type AuthRequest = Pick<User, 'email' | 'password'>;

export const registerController: RequestHandler<
  unknown,
  unknown,
  AuthRequest
> = async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await UserModel.findOne({ email }).exec();
  if (existingUser !== null) {
    return res.status(409).json({ msg: 'That email is already registered' });
  }

  const newUser = {
    email,
    password: encryptPassword(password),
  };

  await UserModel.create(newUser);
  return res.status(201).json({ msg: 'New user successfully created!' });
};

export const loginUserController: RequestHandler<
  unknown,
  LoginResponse,
  AuthRequest
> = async (req, res) => {
  const { email, password } = req.body;

  const filterUser = {
    email,
    password: encryptPassword(password),
  };
  const existingUser = await UserModel.findOne(filterUser).exec();
  if (existingUser === null) {
    return res.status(404);
  }

  const tokenJWT = generateJWTToken(email);
  res.status(201).json({
    accessToken: tokenJWT,
  });
};

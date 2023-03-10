import { Request, Response } from 'express';
import { UserModel } from '../users/user-schema.js';
import { loginUserController, registerController } from './auth-controllers.js';

import { encryptPassword, generateJWTToken } from './auth-utils.js';
import dotenv from 'dotenv';
dotenv.config();

describe('Given a register controller', () => {
  // Mockear la request con el body que te manda el usuario (un user con email y password normales)
  const request = {
    body: {
      email: 'mock@email.com',
      password: 'mockedPassword',
    },
  } as Partial<Request>;

  // Mockear la response
  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;

  // Mockear el usuario que espero que sea llamado con UserModel.create()
  const newUser = {
    email: 'mock@email.com',
    password: encryptPassword('mockedPassword'),
  };

  test('When the user tries to register, then the new user should be created on the database', async () => {
    UserModel.create = jest.fn();
    UserModel.findOne = jest.fn().mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue(null),
    }));
    await registerController(
      request as Request,
      response as Response,
      jest.fn(),
    );
    expect(response.status).toHaveBeenCalledWith(201);
    expect(UserModel.create).toHaveBeenCalledWith(newUser);
  });

  test('When the recevied email is already on database, then the response should be a 409 status', async () => {
    UserModel.findOne = jest.fn().mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue(1),
    }));
    await registerController(
      request as Request,
      response as Response,
      jest.fn(),
    );
    expect(response.status).toHaveBeenCalledWith(409);
  });
});

describe('Given a login controller', () => {
  const request = {
    body: {
      email: 'mock@email.com',
      password: 'mockedPassword',
    },
  } as Partial<Request>;
  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as Partial<Response>;
  const tokenJWT = {
    accessToken: generateJWTToken(request.body.email),
  };

  test('When the user tries to login and the response is successful, a token is returned', async () => {
    UserModel.findOne = jest.fn().mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue(1),
    }));
    await loginUserController(
      request as Request,
      response as Response,
      jest.fn(),
    );
    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith(tokenJWT);
  });

  test('When the user tries to login and the user is not found, a 404 is returned', async () => {
    UserModel.findOne = jest.fn().mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue(null),
    }));
    await loginUserController(
      request as Request,
      response as Response,
      jest.fn(),
    );
    expect(response.status).toHaveBeenCalledWith(404);
  });
});

import { MiddlewareFn } from 'type-graphql';
import { MyContext } from '@shared/infra/http/server.apollo';
import { verify } from 'jsonwebtoken';
import { getCustomRepository } from 'typeorm';
import UserRepository from '@shared/infra/typeorm/repositories/UserRepository';
import { request } from 'express';

interface Token {
  email: string;
  sub: string;
  iat: number;
  exp: number;
}

export const AuthMiddleware: MiddlewareFn<MyContext> = async (
  { context },
  next
) => {
  const { headers } = context.request;

  const authHeader = headers.authorization;

  if (!authHeader) throw new Error('Auth token is Missing');

  const [, token] = authHeader.split(`Bearer `);

  if (!token) throw new Error('Auth token is Missing or Invalid Type');

  try {
    const { email, sub: user_id } = verify(token, 'secret_key') as Token;

    const usersRepository = getCustomRepository(UserRepository);
    const user = await usersRepository.findOne(user_id);

    if (!user || user.email !== email) throw new Error('Invalid User');

    request.user = {
      id: user.id,
    };

    return next();
  } catch (e) {
    throw new Error('Invalid signature type of Auth Token');
  }
};

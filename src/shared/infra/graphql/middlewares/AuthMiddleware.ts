import { MiddlewareFn } from 'type-graphql';
import { MyContext } from '@shared/infra/http/server.apollo';

export const AuthMiddleware: MiddlewareFn<MyContext> = (
  { args, context, info },
  next
) => {
  const { request } = context;
  console.log(request);

  return next();
};

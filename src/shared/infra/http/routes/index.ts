import { Router } from 'express';
import PostsRepository from '@modules/posts/infra/typeorm/repositories/PostsRepository';
import UserRepository from '@modules/users/infra/typeorm/repositories/UserRepository';

const routes = Router();

routes.get('/test', async (request, response) => {
  const userRepo = new UserRepository();

  return response.json(await userRepo.findAll());
});

export default routes;

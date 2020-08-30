import { Router } from 'express';
import PostsRepository from '@shared/infra/typeorm/repositories/PostsRepository';
import UserRepository from '@shared/infra/typeorm/repositories/UserRepository';

const routes = Router();

routes.get('/test', async (request, response) => {
  const userRepo = new UserRepository();

  return response.json(await userRepo.findAll());
});

export default routes;

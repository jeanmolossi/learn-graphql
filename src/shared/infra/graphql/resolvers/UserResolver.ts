import { Query, Mutation, Arg, Resolver, UseMiddleware } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';

import UserRepository from '@shared/infra/typeorm/repositories/UserRepository';
import User from '@shared/infra/typeorm/entities/User';

import { AuthMiddleware } from '@shared/infra/graphql/middlewares/AuthMiddleware';
import { CreateUserInput, UpdateUserInput } from '../inputs';

@Resolver()
export default class UserResolver {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository
  ) {}

  @Query(() => [User])
  @UseMiddleware(AuthMiddleware)
  findAllUsers() {
    return this.userRepository.findAll();
  }

  @Mutation(() => User)
  createUser(@Arg('user') user: CreateUserInput) {
    return this.userRepository.createUser(user);
  }

  @Mutation(() => User, { nullable: true })
  updateUser(@Arg('user') user: UpdateUserInput) {
    return this.userRepository.updateUser(user);
  }
}

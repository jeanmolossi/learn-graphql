import { Query, Mutation, Arg, Resolver, UseMiddleware } from 'type-graphql';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';

import IUserRepository from '@modules/users/infra/repositories/IUserRepository';
import UserRepository from '@modules/users/infra/typeorm/repositories/UserRepository';
import User from '@modules/users/infra/typeorm/entities/User';

import { AuthMiddleware } from '@shared/infra/graphql/middlewares/AuthMiddleware';
import { CreateUserInput, UpdateUserInput } from '../inputs';

@Service()
@Resolver(of => UserRepository)
export default class UserResolver {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: IUserRepository
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

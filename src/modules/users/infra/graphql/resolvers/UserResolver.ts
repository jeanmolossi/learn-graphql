import { Query, Mutation, Arg } from 'type-graphql';

import IUserRepository from '@modules/users/infra/typeorm/repositories/RepositoriesModels/IUserRepository';
import UserRepository from '@modules/users/infra/typeorm/repositories/UserRepository';
import User from '../entities/User';

import { CreateUserInput, UpdateUserInput } from '../inputs';

export default class UserResolver {
  constructor(private userRepository: IUserRepository) {
    this.userRepository = new UserRepository();
  }

  @Query(() => [User])
  findAll() {
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

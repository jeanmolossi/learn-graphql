import User from '@modules/users/infra/graphql/entities/User';

import { CreateUserInput, UpdateUserInput } from '../graphql/inputs';

export default interface IUserRepository {
  findAll(): Promise<User[]>;
  createUser(createUser: CreateUserInput): Promise<User>;
  updateUser(user: UpdateUserInput): Promise<User | null>;
}

import User from '@modules/users/infra/typeorm/entities/User';

import { CreateUserInput, UpdateUserInput } from '../graphql/inputs';

export default interface IUserRepository {
  findAll(): Promise<User[]>;
  createUser(createUser: CreateUserInput): Promise<User>;
  updateUser(user: UpdateUserInput): Promise<User | null>;
}

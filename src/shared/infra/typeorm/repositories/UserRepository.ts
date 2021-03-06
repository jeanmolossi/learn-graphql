import { Repository, EntityRepository } from 'typeorm';
import { Service } from 'typedi';

import IUserRepository from '@modules/users/infra/repositories/IUserRepository';
import User from '@shared/infra/typeorm/entities/User';
import { CreateUserInput, UpdateUserInput } from '@shared/infra/graphql/inputs';

@Service()
@EntityRepository(User)
export default class UserRepository
  extends Repository<User>
  implements IUserRepository {
  public async findAll(): Promise<User[]> {
    return this.find();
  }

  public async createUser({
    name,
    email,
    non_encrypted_password,
  }: CreateUserInput): Promise<User> {
    const newUser = this.create({
      name,
      email,
      non_encrypted_password,
    });

    await this.save(newUser);

    return newUser;
  }

  public async updateUser(user: UpdateUserInput): Promise<User | null> {
    const userToUpdate = await this.findOne(user.id);

    if (!userToUpdate) return null;

    await this.update({ id: userToUpdate.id }, user);

    const userUpdated = await this.findOne(userToUpdate.id);

    return userUpdated || null;
  }
}

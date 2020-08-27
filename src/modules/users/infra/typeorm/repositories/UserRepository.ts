import { Repository, getRepository } from 'typeorm';

import IUserRepository from '@modules/users/infra/repositories/IUserRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import {
  CreateUserInput,
  UpdateUserInput,
} from '@modules/users/infra/graphql/inputs';

export default class UserRepository implements IUserRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findAll(): Promise<User[]> {
    return this.ormRepository.find({
      relations: ['posts'],
    });
  }

  public async createUser({
    name,
    email,
    non_encrypted_password,
  }: CreateUserInput): Promise<User> {
    const newUser = this.ormRepository.create({
      name,
      email,
      non_encrypted_password,
    });

    await this.ormRepository.save(newUser);

    return newUser;
  }

  public async updateUser(user: UpdateUserInput): Promise<User | null> {
    let userUpdated = await this.ormRepository.findOne({
      where: { id: user.id },
    });

    if (!userUpdated) return null;

    userUpdated = { ...userUpdated, ...user };

    return userUpdated;
  }
}

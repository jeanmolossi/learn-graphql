import { Repository, getRepository } from 'typeorm';

import IPostsRepository from '@modules/posts/infra/repositories/IPostsRepository';
import Posts from '@modules/posts/infra/typeorm/entities/Posts';

import { CreatePostInput } from '@modules/posts/infra/graphql/inputs';

import User from '@modules/users/infra/typeorm/entities/User';

export default class PostsRepository implements IPostsRepository {
  private usersRepository: Repository<User>;

  private ormRepository: Repository<Posts>;

  constructor() {
    this.usersRepository = getRepository(User);
    this.ormRepository = getRepository(Posts);
  }

  public async findAll(): Promise<Posts[]> {
    return this.ormRepository.find({
      relations: ['authorInfo'],
    });
  }

  public async createPost({
    title,
    text,
    author,
  }: CreatePostInput): Promise<Posts> {
    const issetUser = await this.usersRepository.findOne(author);

    if (!issetUser) throw new Error('Users not exists');

    const newPost = this.ormRepository.create({
      title,
      text,
      author: issetUser.id,
    });

    await this.ormRepository.save(newPost);

    return {
      ...newPost,
      authorInfo: issetUser,
    };
  }
}

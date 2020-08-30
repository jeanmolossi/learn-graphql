import { Repository, EntityRepository, getCustomRepository } from 'typeorm';
import { Service, Inject, InjectMany } from 'typedi';

import IPostsRepository from '@modules/posts/infra/repositories/IPostsRepository';
import Posts from '@shared/infra/typeorm/entities/Posts';

import { CreatePostInput } from '@shared/infra/graphql/inputs';
import { InjectRepository } from 'typeorm-typedi-extensions';
import UserRepository from './UserRepository';

@Service()
@EntityRepository(Posts)
export default class PostsRepository
  extends Repository<Posts>
  implements IPostsRepository {
  @InjectRepository(UserRepository)
  private readonly userRepository: UserRepository;
  constructor() {
    super();
    this.userRepository = getCustomRepository(UserRepository);
    return this;
  }

  public async findAll(): Promise<Posts[]> {
    return this.find();
  }

  public async findPostById(post_id: number): Promise<Posts | null> {
    const post = await this.findOne(post_id);
    return post || null;
  }

  public async createPost({
    title,
    text,
    author,
  }: CreatePostInput): Promise<Posts> {
    const issetUser = await this.userRepository.findOne(author);

    if (!issetUser) throw new Error('Users not exists');

    const newPost = this.create({
      title,
      text,
      author,
    });

    await this.save(newPost);

    return {
      ...newPost,
      authorInfo: issetUser,
    };
  }

  public async excludePost(postId: number): Promise<Posts | null> {
    const issetPost = await this.findOne(postId, {
      relations: ['authorInfo', 'comments'],
    });

    await this.delete({ id: postId });

    return issetPost || null;
  }
}

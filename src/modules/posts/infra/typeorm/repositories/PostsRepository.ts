import { Repository, EntityRepository } from 'typeorm';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';

import IPostsRepository from '@modules/posts/infra/repositories/IPostsRepository';
import Posts from '@modules/posts/infra/typeorm/entities/Posts';
import User from '@modules/users/infra/typeorm/entities/User';
import UserRepository from '@modules/users/infra/typeorm/repositories/UserRepository';
import { CreatePostInput } from '@modules/posts/infra/graphql/inputs';

@Service()
@EntityRepository(Posts)
export default class PostsRepository
  extends Repository<Posts>
  implements IPostsRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: UserRepository
  ) {
    super();
  }

  public async findAll(): Promise<Posts[]> {
    return this.find({
      relations: ['authorInfo'],
    });
  }

  public async findPostById(post_id: number): Promise<Posts | null> {
    const post = await this.findOne(post_id, {
      relations: ['authorInfo'],
    });
    return post || null;
  }

  public async createPost({
    title,
    text,
    author,
  }: CreatePostInput): Promise<Posts> {
    const issetUser = await this.usersRepository.findOne(author);
    if (!issetUser) throw new Error('Users not exists');
    const newPost = this.create({
      title,
      text,
      author: issetUser.id,
    });
    await this.save(newPost);
    return {
      ...newPost,
      authorInfo: issetUser,
    };
  }

  public async excludePost(postId: number): Promise<Posts | null> {
    const issetPost = await this.findOne(postId, {
      relations: ['authorInfo'],
    });

    const deleted = await this.delete({ id: postId });
    console.log(deleted);

    return issetPost || null;
  }
}

import Posts from '../graphql/entities/Posts';

import { CreatePostInput } from '../graphql/inputs';
import { EntityRepository } from 'typeorm';

export default interface IPostsRepository {
  findAll(): Promise<Posts[]>;
  findPostById(post_id: number): Promise<Posts | null>;
  createPost(createPost: CreatePostInput): Promise<Posts>;
  excludePost(post_id: number): Promise<Posts | null>;
}

import Posts from '../graphql/entities/Posts';

import { CreatePostInput } from '../graphql/inputs';

export default interface IPostsRepository {
  findAll(): Promise<Posts[]>;
  createPost(createPost: CreatePostInput): Promise<Posts>;
}

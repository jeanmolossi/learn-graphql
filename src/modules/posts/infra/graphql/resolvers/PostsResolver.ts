import { Resolver, Query, Mutation, Arg } from 'type-graphql';

import PostsRepository from '@modules/posts/infra/typeorm/repositories/PostsRepository';
import Posts from '@modules/posts/infra/typeorm/entities/Posts';
import IPostsRepository from '@modules/posts/infra/repositories/IPostsRepository';

import { CreatePostInput } from '../inputs';

@Resolver()
export default class PostsResolver {
  constructor(private postsRepository: IPostsRepository) {
    this.postsRepository = new PostsRepository();
  }

  @Query(() => [Posts], { nullable: true })
  findAllPosts() {
    return this.postsRepository.findAll();
  }

  @Mutation(() => Posts, { nullable: true })
  async createPost(@Arg('post') post: CreatePostInput) {
    const newPost = await this.postsRepository.createPost(post);

    return newPost;
  }
}

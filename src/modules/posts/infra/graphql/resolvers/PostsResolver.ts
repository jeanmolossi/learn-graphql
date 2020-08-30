import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Inject } from 'typedi';

import PostsRepository from '@modules/posts/infra/typeorm/repositories/PostsRepository';
import Posts from '@modules/posts/infra/typeorm/entities/Posts';

import { CreatePostInput } from '../inputs';
import { MyContext } from '@shared/infra/http/server.apollo';
import CacheProvider from '@shared/infra/providers/CacheProvider';

@Resolver()
export default class PostsResolver {
  @Inject('cacheProvider')
  private readonly cacheProvider: CacheProvider;

  private readonly cacheKey: string = 'postsResolver';

  constructor(
    @InjectRepository(PostsRepository)
    private readonly postsRepository: PostsRepository
  ) {}

  @Query(() => [Posts], { nullable: true })
  async findAllPosts() {
    let posts = await this.cacheProvider.recover<Posts[]>(
      `${this.cacheKey}:findAllPosts`
    );

    if (!posts) {
      posts = await this.postsRepository.findAll();

      this.cacheProvider.set(`${this.cacheKey}:findAllPosts`, posts);
    }

    return posts;
  }

  @Query(() => Posts, { nullable: true })
  async findPostById(@Arg('post_id') post_id: number) {
    let postById = await this.cacheProvider.recover<Posts>(
      `${this.cacheKey}:post_id:${post_id}`
    );
    if (!postById) {
      postById = await this.postsRepository.findPostById(post_id);

      this.cacheProvider.set(`${this.cacheKey}:post_id:${post_id}`, postById);
    }
    return postById;
  }

  @Mutation(() => Posts, { nullable: true })
  async createPost(@Arg('post') post: CreatePostInput) {
    const newPost = await this.postsRepository.createPost(post);

    return newPost;
  }

  @Mutation(() => Posts, { nullable: true })
  async excludePost(@Arg('post_id') post_id: number) {
    return this.postsRepository.excludePost(post_id);
  }
}

import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Inject } from 'typedi';

import PostsRepository from '@shared/infra/typeorm/repositories/PostsRepository';
import Posts from '@shared/infra/typeorm/entities/Posts';
import CacheProvider from '@shared/infra/providers/CacheProvider';

import { CreatePostInput } from '../inputs';

@Resolver()
export default class PostsResolver {
  @Inject()
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

    await this.cacheProvider.invalidateSingle(`${this.cacheKey}:findAllPosts`);

    return newPost;
  }

  @Mutation(() => Posts, { nullable: true })
  async excludePost(@Arg('post_id') post_id: number) {
    await this.cacheProvider.invalidateSingle(
      `${this.cacheKey}:post_id:${post_id}`
    );
    await this.cacheProvider.invalidateSingle(`${this.cacheKey}:findAllPosts`);
    return this.postsRepository.excludePost(post_id);
  }
}

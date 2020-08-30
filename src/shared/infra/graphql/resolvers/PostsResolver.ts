import {
  Resolver,
  Query,
  Mutation,
  Arg,
  FieldResolver,
  Root,
  UseMiddleware,
  Ctx,
} from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Inject } from 'typedi';

import PostsRepository from '@shared/infra/typeorm/repositories/PostsRepository';
import Posts from '@shared/infra/typeorm/entities/Posts';
import CacheProvider from '@shared/infra/providers/CacheProvider';

import { CreatePostInput } from '../inputs';
import User from '@shared/infra/typeorm/entities/User';
import UserRepository from '@shared/infra/typeorm/repositories/UserRepository';
import CommentsRepository from '@shared/infra/typeorm/repositories/CommentsRepository';
import Comments from '@shared/infra/typeorm/entities/Comments';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { MyContext } from '@shared/infra/http/server.apollo';

@Resolver(() => Posts)
export default class PostsResolver {
  @Inject()
  private readonly cacheProvider: CacheProvider;

  private readonly cacheKey: string = 'postsResolver';

  constructor(
    @InjectRepository(PostsRepository)
    private readonly postsRepository: PostsRepository,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(CommentsRepository)
    private readonly commentsRepository: CommentsRepository
  ) {}

  @FieldResolver(() => User)
  async authorInfo(@Root() post: Posts) {
    const authorInfo = await this.userRepository.findOne(post.author);

    return authorInfo;
  }

  @FieldResolver(() => [Comments], { nullable: true })
  async comments(@Root() post: Posts) {
    const comments = await this.commentsRepository.find({
      where: { post_id: post.id },
    });

    return comments;
  }

  @Query(() => [Posts], { nullable: true })
  @UseMiddleware(AuthMiddleware)
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
  @UseMiddleware(AuthMiddleware)
  async createPost(
    @Arg('post') post: CreatePostInput,
    @Ctx() context: MyContext
  ) {
    const newPost = await this.postsRepository.createPost({
      ...post,
      author: context.request.user.id,
    });

    await this.cacheProvider.invalidateSingle(`${this.cacheKey}:findAllPosts`);

    return newPost;
  }

  @Mutation(() => Posts, { nullable: true })
  @UseMiddleware(AuthMiddleware)
  async excludePost(@Arg('post_id') post_id: number) {
    await this.cacheProvider.invalidateSingle(
      `${this.cacheKey}:post_id:${post_id}`
    );

    await this.cacheProvider.invalidateSingle(`${this.cacheKey}:findAllPosts`);

    return this.postsRepository.excludePost(post_id);
  }
}

import { Inject } from 'typedi';
import {
  Resolver,
  Query,
  Arg,
  Mutation,
  FieldResolver,
  Root,
  UseMiddleware,
  Ctx,
} from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';

import CommentsRepository from '@shared/infra/typeorm/repositories/CommentsRepository';
import Comments from '@shared/infra/typeorm/entities/Comments';
import CacheProvider from '@shared/infra/providers/CacheProvider';
import User from '@shared/infra/typeorm/entities/User';
import UserRepository from '@shared/infra/typeorm/repositories/UserRepository';
import { CreateCommentInput } from '../inputs';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { MyContext } from '@shared/infra/http/server';

@Resolver(() => Comments)
export default class CommentsResolver {
  @Inject()
  private readonly cacheProvider: CacheProvider;

  private readonly cacheKey: string = 'commentsResolver';

  constructor(
    @InjectRepository(CommentsRepository)
    private readonly commentsRepository: CommentsRepository,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository
  ) {}

  @FieldResolver(() => User)
  async author(@Root() comment: Comments) {
    const author = await this.userRepository.findOne({
      where: { id: comment.author_id },
    });

    return author;
  }

  @Query(() => [Comments], { nullable: true })
  @UseMiddleware(AuthMiddleware)
  async findAllCommentsFromUser(@Arg('user_id') user_id: number) {
    let comments = await this.cacheProvider.recover<Comments[]>(
      `${this.cacheKey}:user_id:${user_id}`
    );

    if (!comments) {
      comments = await this.commentsRepository.findAllFromUser(user_id);

      await this.cacheProvider.set(
        `${this.cacheKey}:user_id:${user_id}`,
        comments
      );
    }

    return comments;
  }

  @Mutation(() => Comments)
  @UseMiddleware(AuthMiddleware)
  async createComment(
    @Arg('comment') commentInput: CreateCommentInput,
    @Ctx() { request }: MyContext
  ) {
    const comment = await this.commentsRepository.createComment({
      ...commentInput,
      author_id: request.user.id,
    });

    await this.cacheProvider.invalidateSingle(
      `${this.cacheKey}:user_id:${request.user.id}`
    );
    await this.cacheProvider.invalidateAll(`postsResolver:findAllPosts`);

    return comment;
  }

  @Mutation(() => Comments)
  @UseMiddleware(AuthMiddleware)
  async deleteComment(@Arg('comment') comment_id: number) {
    const comment = await this.commentsRepository.deleteComment(comment_id);

    return comment;
  }
}

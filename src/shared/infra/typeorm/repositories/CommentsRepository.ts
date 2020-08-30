import { Repository, EntityRepository, getCustomRepository } from 'typeorm';
import { Service } from 'typedi';

import ICommentsRepository from '@modules/comments/infra/repositories/ICommentsRepository';
import { CreateCommentInput } from '@shared/infra/graphql/inputs';

import Comments from '../entities/Comments';
import UserRepository from './UserRepository';
import PostsRepository from './PostsRepository';

@Service()
@EntityRepository(Comments)
export default class CommentsRepository
  extends Repository<Comments>
  implements ICommentsRepository {
  private readonly userRepository: UserRepository;
  private readonly postsRepository: PostsRepository;
  constructor() {
    super();

    this.userRepository = getCustomRepository(UserRepository);
    this.postsRepository = getCustomRepository(PostsRepository);
  }

  async findAllFromUser(author_id: number): Promise<Comments[]> {
    const comments = await this.find({
      where: { author_id },
    });

    return comments;
  }

  async createComment(
    commentInput: CreateCommentInput
  ): Promise<Comments | null> {
    const { author_id, post_id } = commentInput;

    if (!author_id || !post_id)
      throw new Error('You cannot create a comment without post or loggedin');

    const author = await this.userRepository.findOne(author_id);
    const post = await this.postsRepository.findOne(post_id);

    if (!author || !post) throw new Error('Author or Post Invalid');

    const comment = this.create(commentInput);

    await this.save(comment);

    return {
      ...comment,
      author,
      post,
    };
  }

  async deleteComment(comment_id: number): Promise<Comments | null> {
    const commentToDelete = await this.findOne(comment_id);
    await this.delete({ id: commentToDelete?.id });

    return commentToDelete || null;
  }
}

import Comments from '@shared/infra/typeorm/entities/Comments';
import { CreateCommentInput } from '@shared/infra/graphql/inputs';

export default interface ICommentsRepository {
  findAllFromUser(author_id: number): Promise<Comments[]>;
  createComment(commentInput: CreateCommentInput): Promise<Comments | null>;
  deleteComment(comment_id: number): Promise<Comments | null>;
}

import { InterfaceType, Field, ID } from 'type-graphql';
import User from '@shared/infra/typeorm/entities/User';
import Posts from '@shared/infra/typeorm/entities/Posts';

@InterfaceType()
export default abstract class CommentsGQL {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  text: string;

  @Field(() => User)
  author: User;

  @Field(() => Posts)
  post: Posts;

  @Field(() => String)
  created_at: Date;

  @Field(() => String)
  updated_at: Date;
}

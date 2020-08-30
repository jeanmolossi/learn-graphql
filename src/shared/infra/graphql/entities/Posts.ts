import { Field, ID, InterfaceType } from 'type-graphql';

import User from '@shared/infra/typeorm/entities/User';
import Comments from '@shared/infra/typeorm/entities/Comments';

@InterfaceType()
export default abstract class PostsGQL {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  title: string;

  @Field(() => String)
  text: string;

  author: number;

  @Field(() => User)
  authorInfo: User;

  @Field(() => [Comments], { nullable: true })
  comments: Comments[];

  @Field(() => String)
  created_at: Date;

  @Field(() => String)
  updated_at: Date;
}

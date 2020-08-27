import { Field, ID, InterfaceType } from 'type-graphql';

import User from '@modules/users/infra/typeorm/entities/User';

@InterfaceType()
export default abstract class PostsGQL {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  title: string;

  @Field(() => String)
  text: string;

  @Field(() => Number)
  author: number;

  @Field(() => User)
  authorInfo: User;

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;
}

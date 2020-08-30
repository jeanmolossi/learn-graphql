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

  author: number;

  @Field(() => User)
  authorInfo: User;

  @Field(() => String)
  created_at: Date;

  @Field(() => String)
  updated_at: Date;
}

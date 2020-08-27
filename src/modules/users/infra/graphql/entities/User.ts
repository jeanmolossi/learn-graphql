import { Field, ID, InterfaceType } from 'type-graphql';
import Posts from '@modules/posts/infra/typeorm/entities/Posts';

@InterfaceType()
export default abstract class UserGQL {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  non_encrypted_password: string;

  @Field(() => [Posts])
  posts: Posts[];

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;
}

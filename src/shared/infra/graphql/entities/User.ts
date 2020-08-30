import { Field, ID, InterfaceType } from 'type-graphql';
import Posts from '@shared/infra/typeorm/entities/Posts';

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

  @Field(() => String)
  created_at: Date;

  @Field(() => String)
  updated_at: Date;
}

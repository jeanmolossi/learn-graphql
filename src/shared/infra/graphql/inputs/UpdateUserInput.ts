import { InputType, Field, ID } from 'type-graphql';

@InputType()
export default class UpdateUserInput {
  @Field(() => ID)
  id: number;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  non_encrypted_password?: string;
}

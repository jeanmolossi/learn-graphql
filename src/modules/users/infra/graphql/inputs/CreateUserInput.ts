import { InputType, Field } from 'type-graphql';

@InputType()
export default class CreateUserInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  non_encrypted_password: string;
}

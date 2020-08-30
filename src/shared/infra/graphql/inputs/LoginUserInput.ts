import { InputType, Field } from 'type-graphql';

@InputType()
export default class LoginUserInput {
  @Field(() => String!)
  email: string;

  @Field(() => String!)
  non_encrypted_password: string;
}

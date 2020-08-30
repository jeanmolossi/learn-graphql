import { InputType, Field } from 'type-graphql';

@InputType()
export default class CreatePostInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  text: string;

  author: number;
}

import { InputType, Field } from 'type-graphql';

@InputType()
export default class CreateCommentInput {
  @Field(() => String)
  text: string;

  author_id: number;

  @Field(() => Number)
  post_id: number;
}

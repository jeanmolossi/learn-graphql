import { InputType, Field } from 'type-graphql';

@InputType()
export default class CreateCommentInput {
  @Field(() => String)
  text: string;

  @Field(() => Number)
  author_id: number;

  @Field(() => Number)
  post_id: number;
}

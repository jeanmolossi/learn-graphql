import { Resolver, Query } from 'type-graphql';

@Resolver()
export default class DefaultResolver {
  @Query(() => String)
  hello() {
    return `World`;
  }
}

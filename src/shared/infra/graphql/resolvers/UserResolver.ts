import {
  Query,
  Mutation,
  Arg,
  Resolver,
  UseMiddleware,
  FieldResolver,
  Root,
  Ctx,
  ObjectType,
  Field,
} from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { sign } from 'jsonwebtoken';

import UserRepository from '@shared/infra/typeorm/repositories/UserRepository';
import User from '@shared/infra/typeorm/entities/User';
import Posts from '@shared/infra/typeorm/entities/Posts';
import PostsRepository from '@shared/infra/typeorm/repositories/PostsRepository';
import { AuthMiddleware } from '@shared/infra/graphql/middlewares/AuthMiddleware';
import { MyContext } from '@shared/infra/http/server';
import { CreateUserInput, UpdateUserInput } from '../inputs';
import LoginUserInput from '../inputs/LoginUserInput';
import { Inject } from 'typedi';
import CacheProvider from '@shared/infra/providers/CacheProvider';

@ObjectType()
class LoginAnswer {
  @Field(() => User)
  user: User;

  @Field(() => String)
  token: string;
}

@Resolver(() => User)
export default class UserResolver {
  @Inject()
  private readonly cacheProvider: CacheProvider;

  private cacheKey: string = `userResolver`;

  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(PostsRepository)
    private readonly postsRepository: PostsRepository
  ) {}

  @FieldResolver(() => [Posts], { nullable: true })
  async posts(@Root() user: User) {
    const posts = await this.postsRepository.find({
      where: { author: user.id },
    });

    return posts || null;
  }

  @Query(() => [User])
  @UseMiddleware(AuthMiddleware)
  async findAllUsers() {
    let usersList = await this.cacheProvider.recover<User[]>(
      `${this.cacheKey}:findAllUsers`
    );

    if (!usersList) {
      usersList = await this.userRepository.findAll();

      await this.cacheProvider.set(`${this.cacheKey}:findAllUsers`, usersList);
    }

    return usersList;
  }

  @Mutation(() => LoginAnswer)
  async loginUser(@Arg('user') user: LoginUserInput) {
    const { email, non_encrypted_password } = user;

    const userFound = await this.userRepository.findOne({
      where: { email, non_encrypted_password },
    });

    if (!userFound) throw new Error('Invalid User');

    const token = sign({ email: userFound.email }, 'secret_key', {
      expiresIn: '7d',
      subject: String(userFound.id),
    });

    return {
      user: userFound,
      token,
    };
  }

  @Mutation(() => User)
  createUser(@Arg('user') user: CreateUserInput) {
    return this.userRepository.createUser(user);
  }

  @Mutation(() => User, { nullable: true })
  @UseMiddleware(AuthMiddleware)
  updateUser(
    @Arg('user') user: UpdateUserInput,
    @Ctx() { request }: MyContext
  ) {
    if (request.user.id !== user.id)
      throw new Error('You cannot update this user');

    return this.userRepository.updateUser(user);
  }
}

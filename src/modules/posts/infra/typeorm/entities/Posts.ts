import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';
import PostsGQL from '@modules/posts/infra/graphql/entities/Posts';
import { ObjectType } from 'type-graphql';

@ObjectType({ implements: PostsGQL })
@Entity('posts')
export default class Posts implements PostsGQL {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  title: string;

  @Column()
  text: string;

  @Column()
  author: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'author' })
  authorInfo: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

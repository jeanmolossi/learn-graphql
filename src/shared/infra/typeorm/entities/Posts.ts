import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ObjectType } from 'type-graphql';

import User from '@shared/infra/typeorm/entities/User';
import PostsGQL from '@shared/infra/graphql/entities/Posts';
import Comments from './Comments';

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

  @OneToMany(() => Comments, comments => comments.post)
  @JoinColumn({ name: 'comments' })
  comments: Comments[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { ObjectType } from 'type-graphql';

import CommentsGQL from '@shared/infra/graphql/entities/Comments';

import Posts from './Posts';
import User from './User';

@ObjectType({ implements: CommentsGQL })
@Entity('comments')
export default class Comments implements CommentsGQL {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  text: string;

  @Column()
  author_id: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column()
  post_id: number;

  @ManyToOne(() => Posts, posts => posts.id)
  @JoinColumn({ name: 'post_id' })
  post: Posts;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

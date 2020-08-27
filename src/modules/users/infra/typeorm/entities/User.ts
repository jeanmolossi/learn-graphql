import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ObjectType } from 'type-graphql';

import UserGQL from '@modules/users/infra/graphql/entities/User';
import Posts from '@modules/posts/infra/typeorm/entities/Posts';

@ObjectType({ implements: UserGQL })
@Entity('users')
export default class User implements UserGQL {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  non_encrypted_password: string;

  @OneToMany(() => Posts, posts => posts.authorInfo)
  @JoinColumn({ name: 'posts' })
  posts: Posts[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

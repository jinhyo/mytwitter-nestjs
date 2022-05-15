import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@ObjectType()
@Entity({ name: 'user_relrations' })
export class UserRelation {
  @Field(() => Int)
  @PrimaryColumn()
  followerId: number;

  @Field(() => Int)
  @PrimaryColumn()
  followingId: number;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.followers)
  @JoinColumn()
  follower: User;

  @ManyToOne(() => User, (user) => user.followings)
  @JoinColumn()
  following: User;
}

import { ObjectType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { StandardEntity } from './standard.entity';
import { User } from './user.entity';

@ObjectType()
@Entity({ name: 'follows' })
export class Follow extends StandardEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.followers)
  @JoinColumn()
  follower: User;

  @ManyToOne(() => User, (user) => user.followings)
  @JoinColumn()
  following: User;
}

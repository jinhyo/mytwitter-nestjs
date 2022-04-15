import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tweet } from './tweet.entity';
import { User } from './user.entity';

@Entity({ name: 'likes' })
export class Like {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  tweetId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.likes)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Tweet, (tweet) => tweet.likes)
  @JoinColumn()
  tweet: Tweet;
}

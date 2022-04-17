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

@Entity({ name: 'user_retweets' })
export class UserReweet {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  tweetId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.userReweets)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Tweet, (tweet) => tweet.userReweets)
  @JoinColumn()
  tweet: Tweet;
}

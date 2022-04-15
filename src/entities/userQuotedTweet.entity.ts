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

@Entity({ name: 'user_qouted_tweets' })
export class UserQuotedTweet {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  tweetId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.userQuotedTweets)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Tweet, (tweet) => tweet.userQuotedTweets)
  @JoinColumn()
  tweet: Tweet;
}

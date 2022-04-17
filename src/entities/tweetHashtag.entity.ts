import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { HashTag } from './hashtag.entity';
import { Tweet } from './tweet.entity';

@Entity({ name: 'tweet_hashtags' })
export class TweetHashtag {
  @PrimaryColumn()
  hashtagId: number;

  @PrimaryColumn()
  tweetId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => HashTag, (hashTag) => hashTag.tweetHashtags)
  @JoinColumn()
  hashtag: HashTag;

  @ManyToOne(() => Tweet, (tweet) => tweet.tweetHashtags)
  @JoinColumn()
  tweet: Tweet;
}

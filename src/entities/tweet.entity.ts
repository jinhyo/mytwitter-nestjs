import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { UserLike } from './userLike.entity';
import { StandardEntity } from './standard.entity';
import { User } from './user.entity';
import { UserQuotedTweet } from './userQuotedTweet.entity';
import { UserReweet } from './userRetweet.entity';
import { TweetHashtag } from './tweetHashtag.entity';

@ObjectType()
@Entity({ name: 'tweets' })
export class Tweet extends StandardEntity {
  @Column()
  @Field(() => String)
  contents: string;

  @Column()
  @Field(() => Boolean)
  hasImage: boolean;

  @Column()
  @Field(() => Number)
  retweetedCount: number;

  @OneToMany(() => TweetHashtag, (tweetHashtag) => tweetHashtag.tweet)
  tweetHashtags: TweetHashtag[];

  @OneToMany(() => UserLike, (like) => like.tweet)
  likes: UserLike[];

  @OneToMany(() => UserReweet, (userReweet) => userReweet.tweet)
  userReweets: UserReweet[];

  @OneToMany(() => UserQuotedTweet, (userQuotedTweet) => userQuotedTweet.tweet)
  userQuotedTweets: UserQuotedTweet[];

  @OneToMany(() => Tweet, (tweet) => tweet.retweetOrigin)
  rewteets: Tweet[];

  @OneToMany(() => Tweet, (tweet) => tweet.quotedOrigin)
  quotations: Tweet[];

  @OneToMany(() => Tweet, (tweet) => tweet.commentedOriginId)
  comments: Tweet[];

  @ManyToOne(() => User, (user) => user.tweets)
  writer: User;

  @ManyToOne(() => Tweet, (tweet) => tweet.rewteets)
  retweetOrigin: Tweet;

  @ManyToOne(() => Tweet, (tweet) => tweet.quotations)
  quotedOrigin: Tweet;

  @ManyToOne(() => Tweet, (tweet) => tweet.comments)
  commentedOriginId: Tweet;
}

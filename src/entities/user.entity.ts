import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { Follow } from './follow.entity';
import { UserLike } from './userLike.entity';
import { StandardEntity } from './standard.entity';
import { Tweet } from './tweet.entity';
import { UserQuotedTweet } from './userQuotedTweet.entity';
import { UserReweet } from './userRetweet.entity';

@ObjectType()
@Entity({ name: 'users' })
export class User extends StandardEntity {
  @Field(() => String)
  @Column({ unique: true })
  nickname: string;

  @Field(() => String)
  @Column()
  email: string;

  @Field(() => String)
  @Column()
  password: string;

  @Field(() => String)
  @Column()
  loginType: string;

  @Field(() => String)
  @Column()
  avatarURL: string;

  @Field(() => String)
  @Column()
  snsId: string;

  @Field(() => String)
  @Column()
  selfIntro: string;

  @Field(() => String)
  @Column()
  location: string;

  @OneToMany(() => UserReweet, (userReweet) => userReweet.user)
  userReweets: UserReweet[];

  @OneToMany(() => UserQuotedTweet, (userQuotedTweet) => userQuotedTweet.user)
  userQuotedTweets: UserQuotedTweet[];

  @OneToMany(() => Follow, (follow) => follow.following)
  followers: Follow[];

  @OneToMany(() => Follow, (follow) => follow.follower)
  followings: Follow[];

  @OneToMany(() => Tweet, (tweet) => tweet.writer)
  tweets: Tweet[];

  @OneToMany(() => UserLike, (like) => like.user)
  likes: UserLike[];
}

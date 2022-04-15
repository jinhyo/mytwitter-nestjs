import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { StandardEntity } from './standard.entity';
import { User } from './user.entity';

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

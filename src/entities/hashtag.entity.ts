import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { StandardEntity } from './standard.entity';
import { TweetHashtag } from './tweetHashtag.entity';

@ObjectType()
@Entity({ name: 'hashtags' })
export class HashTag extends StandardEntity {
  @Column()
  @Field(() => String)
  tag: string;

  @Column()
  @Field(() => Number)
  count: number;

  @OneToMany(() => TweetHashtag, (tweetHashtag) => tweetHashtag.hashtag)
  tweetHashtags: TweetHashtag[];
}

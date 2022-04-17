import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { StandardEntity } from './standard.entity';
import { Tweet } from './tweet.entity';

@ObjectType()
@Entity({ name: 'images' })
export class Image extends StandardEntity {
  @Column()
  @Field(() => String)
  src: string;

  @Column()
  @Field(() => String)
  counttype: string;

  @ManyToOne(() => Tweet, (tweet) => tweet.images)
  @JoinColumn()
  tweet: Tweet;
}

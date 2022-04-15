import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { StandardEntity } from './standard.entity';

@ObjectType()
@Entity({ name: 'hashtags' })
export class hashTag extends StandardEntity {
  @Column()
  @Field(() => String)
  tag: string;

  @Column()
  @Field(() => Number)
  count: number;
}

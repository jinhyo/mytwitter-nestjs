import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { StandardEntity } from './standard.entity';

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
}

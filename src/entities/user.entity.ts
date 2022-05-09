import { Field, ObjectType } from '@nestjs/graphql';
import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import { Follow } from './follow.entity';
import { UserLike } from './userLike.entity';
import { StandardEntity } from './standard.entity';
import { Tweet } from './tweet.entity';
import { UserQuotedTweet } from './userQuotedTweet.entity';
import { UserReweet } from './userRetweet.entity';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { IsNotWhiteSpace } from 'src/decorators/isNotWhiteSpace.decorator';
import bcrypt from 'bcrypt';
import {
  HASHING_PASSWORD_FAILED_MSG,
  NOT_EXACT_PASSWORD_MSG,
  PASSWORD_CHECKING_FAILED_MSG,
} from 'src/commonConstants/errorMsgs/entityFunctionErrorMsgs';
import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { AccountType } from 'src/enums/accountType.enum';

const logger = new Logger('User Entity');

@ObjectType()
@Entity({ name: 'users' })
export class User extends StandardEntity {
  @Field(() => String)
  @IsString()
  @Length(1, 20)
  @IsNotEmpty()
  @IsNotWhiteSpace()
  @Column({ unique: true })
  nickname: string;

  @Field(() => String)
  @IsEmail()
  @Column()
  email: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @IsNotWhiteSpace()
  @Column()
  password: string;

  @Field(() => AccountType)
  @Column({ type: 'enum', enum: AccountType })
  accountType: string;

  @Field(() => String)
  @Column()
  avatarURL: string;

  @Field(() => String)
  @Column({ nullable: true })
  snsId: string;

  @Field(() => String)
  @IsString()
  @IsOptional()
  @Length(1, 30)
  @Column({ nullable: true })
  selfIntro: string;

  @Field(() => String)
  @IsString()
  @IsOptional()
  @Column({ nullable: true })
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

  @BeforeInsert()
  async hashPassword() {
    try {
      this.password = await bcrypt.hash(this.password, 12);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(HASHING_PASSWORD_FAILED_MSG);
    }
  }

  /** @desc 비밀번호가 맞는지 확인 */
  async isCorrectPwd(inputPwd: string): Promise<void | never> {
    let exactPwd: boolean;
    try {
      exactPwd = await bcrypt.compare(inputPwd, this.password);
    } catch (error) {
      logger.error(
        `isCorrectPwd() in User Entity failed - error detail : ${error.message}`,
      );
      throw new InternalServerErrorException(PASSWORD_CHECKING_FAILED_MSG);
    }

    if (!exactPwd) {
      throw new BadRequestException(NOT_EXACT_PASSWORD_MSG);
    }
  }
}

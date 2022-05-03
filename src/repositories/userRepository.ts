import { InternalServerErrorException, Logger } from '@nestjs/common';
import {
  CREATING_USERS_FAILED_MSG,
  FINDING_USER_FAILED_MSG,
} from 'src/commonConstants/errorMsgs/repositoryErrorMsgs';
import { User } from 'src/entities/user.entity';
import { AccountType } from 'src/enums/accountType.enum';
import { makeQuerySelector } from 'src/libs/makeQuerySelector';
import { UserSearchOption } from 'src/modules/user/types/userSearchOption.interface';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private readonly logger = new Logger('UserRepository');
  private readonly entityName = User.name;

  async createUser(userInfo: User): Promise<User> {
    try {
      return await this.save(userInfo);
    } catch (error) {
      this.logger.error(
        `createUser() failed - error detail : ${error.message}`,
      );
      throw new InternalServerErrorException(CREATING_USERS_FAILED_MSG);
    }
  }

  async findUserByEmail(
    email: string,
    accountType: AccountType,
    findOption: UserSearchOption = null,
  ): Promise<User | never> {
    const query = this.createQueryBuilder(this.entityName).where({
      email,
      accountType,
    });

    if (findOption?.select) {
      const userSelector = makeQuerySelector(
        this.entityName,
        findOption.select,
      );
      query.select(userSelector);
    }

    try {
      return await query.getOne();
    } catch (error) {
      this.logger.error(
        `findUserByEmail() failed - error detail : ${error.message}`,
      );
      throw new InternalServerErrorException(FINDING_USER_FAILED_MSG);
    }
  }

  async findUserByNickname(
    nickname: string,
    findOption: UserSearchOption = null,
  ): Promise<User | never> {
    const query = this.createQueryBuilder(this.entityName).where({ nickname });

    if (findOption?.select) {
      const userSelector = makeQuerySelector(
        this.entityName,
        findOption.select,
      );
      query.select(userSelector);
    }

    try {
      return await query.getOne();
    } catch (error) {
      this.logger.error(
        `findUserByNickname() failed - error detail : ${error.message}`,
      );
      throw new InternalServerErrorException(FINDING_USER_FAILED_MSG);
    }
  }
}

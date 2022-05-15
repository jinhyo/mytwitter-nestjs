import { InternalServerErrorException, Logger } from '@nestjs/common';
import {
  CREATING_USER_RELRATION_FAILED_MSG,
  DELETING_USER_RELRATION_FAILED_MSG,
  FINDING_USER_RELRATION_FAILED_MSG,
} from 'src/commonConstants/errorMsgs/repositoryErrorMsgs';
import { UserRelation } from 'src/entities/userRelation.entity';
import { makeQuerySelector } from 'src/libs/makeQuerySelector.lib';
import { UserRelationSearchOption } from 'src/modules/user/types/userRelationSearchOption.interface';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(UserRelation)
export class UserRelationRepository extends Repository<UserRelation> {
  private readonly logger = new Logger('UserRepository');
  private readonly entityName = UserRelation.name;

  async createUserRelation(
    myId: number,
    userId: number,
  ): Promise<UserRelation | never> {
    try {
      return await this.save({ followerId: myId, followingId: userId });
    } catch (error) {
      this.logger.error(
        `createUserRelation() failed - error detail : ${error.message}`,
      );
      throw new InternalServerErrorException(
        CREATING_USER_RELRATION_FAILED_MSG,
      );
    }
  }

  async findUserRelation(
    myId: number,
    userId: number,
    findOption: UserRelationSearchOption = null,
  ): Promise<UserRelation | never> {
    const query = this.createQueryBuilder(this.entityName).where({
      followerId: myId,
      followingId: userId,
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
        `findUserRelation() failed - error detail : ${error.message}`,
      );
      throw new InternalServerErrorException(FINDING_USER_RELRATION_FAILED_MSG);
    }
  }

  async deleteUserRelation(
    myId: number,
    userId: number,
  ): Promise<void | never> {
    try {
      await this.delete({ followerId: myId, followingId: userId });
    } catch (error) {
      this.logger.error(
        `deleteUserRelation() failed - error detail : ${error.message}`,
      );
      throw new InternalServerErrorException(
        DELETING_USER_RELRATION_FAILED_MSG,
      );
    }
  }
}

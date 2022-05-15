import { InternalServerErrorException, Logger } from '@nestjs/common';
import { CREATING_USER_RELRATION_FAILED_MSG } from 'src/commonConstants/errorMsgs/repositoryErrorMsgs';
import { UserRelation } from 'src/entities/userRelation.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(UserRelation)
export class UserRelationRepository extends Repository<UserRelation> {
  private readonly logger = new Logger('UserRepository');
  private readonly entityName = UserRelation.name;

  async createUserRelation(
    myId: number,
    userId: number,
  ): Promise<UserRelation> {
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
}

import { Query, Resolver } from '@nestjs/graphql';
import { User } from 'src/entities/user.entity';

@Resolver(() => User)
export class UserResolver {
  @Query(() => [User])
  users(): User[] {
    return [];
  }
}

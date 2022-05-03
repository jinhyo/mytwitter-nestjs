import { InputType, PickType } from '@nestjs/graphql';
import { User } from 'src/entities/user.entity';

@InputType()
export class createUserDTO extends PickType(
  User,
  ['email', 'password', 'nickname', 'selfIntro', 'location'],
  InputType,
) {}

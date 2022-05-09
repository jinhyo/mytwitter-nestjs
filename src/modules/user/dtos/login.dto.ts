import { InputType, PickType } from '@nestjs/graphql';
import { User } from 'src/entities/user.entity';

@InputType()
export class LoginDTO extends PickType(
  User,
  ['email', 'password'],
  InputType,
) {}

import { InputType, PickType } from '@nestjs/graphql';
import { User } from 'src/entities/user.entity';

@InputType()
export class changeProfileInfoDTO extends PickType(
  User,
  ['nickname', 'selfIntro', 'location'],
  InputType,
) {}

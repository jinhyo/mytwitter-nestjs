import { registerEnumType } from '@nestjs/graphql';

export enum AccountType {
  Local = 'local',
  Facebook = 'facebook',
  Google = 'google',
  Naver = 'naver',
}

registerEnumType(AccountType, { name: 'AccountType' });

import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AvailableDTO {
  @Field(() => Boolean)
  isAvailable: boolean;
}

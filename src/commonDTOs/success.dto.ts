import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SuccessDTO {
  @Field()
  success: boolean;
}

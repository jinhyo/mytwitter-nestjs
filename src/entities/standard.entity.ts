import { Field } from '@nestjs/graphql';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class StandardEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Number)
  id: number;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  @Field(() => Date)
  updatedAt: Date;
}

import { Field, ArgsType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';

@ArgsType()
export class GetPaginatedDto {
  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  limit: number;

  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  page: number;
}

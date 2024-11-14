import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

@InputType()
export class CreatePostInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @MaxLength(140, {
    message: 'Maximum post limit 140 characters',
  })
  content: string;
}

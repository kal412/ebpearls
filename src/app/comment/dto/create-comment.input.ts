import { InputType, Field } from '@nestjs/graphql';
import { IsMongoId, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';

@InputType()
export class CreateCommentInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @MaxLength(80, {
    message: 'Maximum comment limit 80 characters',
  })
  content: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsMongoId()
  post: MongooseSchema.Types.ObjectId;
}

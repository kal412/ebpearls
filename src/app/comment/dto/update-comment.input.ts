import { CreateCommentInput } from './create-comment.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';

@InputType()
export class UpdateCommentInput extends PartialType(CreateCommentInput) {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;
}

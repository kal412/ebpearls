import { CreatePostInput } from './create-post.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';

@InputType()
export class UpdatePostInput extends PartialType(CreatePostInput) {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;
}

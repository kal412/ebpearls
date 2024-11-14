import { ObjectType, Field } from '@nestjs/graphql';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/app/user/entities/user.entity';
import { Post } from 'src/app/post/entities/post.entity';

@ObjectType()
@Schema()
export class Comment {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @Field(() => String)
  @Prop()
  content: string;

  @Field(() => User)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: User;

  @Field(() => Post)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Post' })
  post: Post;
}

export type CommentDocument = Comment & Document;
export const CommentSchema = SchemaFactory.createForClass(Comment);

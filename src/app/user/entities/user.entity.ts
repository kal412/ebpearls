import { ObjectType, Field } from '@nestjs/graphql';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Post } from 'src/app/post/entities/post.entity';
import { Comment } from 'src/app/comment/entities/comment.entity';

@ObjectType()
@Schema()
export class User {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @Field(() => String)
  @Prop({ unique: true })
  username: string;

  @Field(() => String)
  @Prop({ unique: true })
  email: string;

  @Field(() => String)
  @Prop()
  password: string;

  @Field(() => String)
  @Prop()
  name: string;

  @Field(() => [Post])
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Post' }] })
  posts: Post[];

  @Field(() => [Comment])
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Comment' }] })
  comments: Comment[];
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

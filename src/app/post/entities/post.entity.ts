import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/app/user/entities/user.entity';
import { Comment } from 'src/app/comment/entities/comment.entity';

@ObjectType()
@Schema()
export class Post {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @Field(() => String)
  @Prop()
  content: string;

  @Field(() => User)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: User;

  @Field(() => [Comment])
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Comment' }] })
  comments: Comment[];

  @Field(() => Int, { nullable: true })
  totalComments?: number;
}

@ObjectType()
export class GetPostPaginatedResponse {
  @Field(() => [Post])
  results: Post[];

  @Field(() => Int)
  totalItems: number;

  @Field(() => Int)
  pageSize: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  previous: number;

  @Field(() => Int)
  next: number;
}

export type PostDocument = Post & Document;
export const PostSchema = SchemaFactory.createForClass(Post);

// Set up cascading delete with `deleteOne` middleware
PostSchema.pre('deleteOne', { document: true }, async function (next) {
  const post = this as PostDocument;
  await post.model('Comment').deleteMany({ _id: { $in: post.comments } });
  next();
});

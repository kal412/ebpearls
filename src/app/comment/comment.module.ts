import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { Comment, CommentSchema } from './entities/comment.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from '../post/entities/post.entity';

@Module({
  providers: [CommentResolver, CommentService],
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
})
export class CommentModule {}

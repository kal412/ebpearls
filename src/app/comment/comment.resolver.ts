import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { Schema as MongooseSchema } from 'mongoose';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guard/jwt-auth.guards';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';

@Resolver(() => Comment)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @Mutation(() => Comment)
  @UseGuards(JwtAuthGuard)
  createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
    @GetUser() user: User,
  ) {
    return this.commentService.createComment(createCommentInput, user);
  }

  @Mutation(() => Comment)
  @UseGuards(JwtAuthGuard)
  updateComment(
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
    @GetUser() user: User,
  ) {
    return this.commentService.updateComment(
      updateCommentInput._id,
      updateCommentInput,
      user,
    );
  }

  @Mutation(() => Comment)
  @UseGuards(JwtAuthGuard)
  removeComment(
    @Args('id', { type: () => String }) id: MongooseSchema.Types.ObjectId,
    @GetUser() user: User,
  ) {
    return this.commentService.removeComment(id, user);
  }
}

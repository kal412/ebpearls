import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './entities/comment.entity';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { User } from '../user/entities/user.entity';
import { Post, PostDocument } from '../post/entities/post.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
    @InjectModel(Post.name)
    private readonly postModel: Model<PostDocument>,
  ) {}

  async createComment(createCommentInput: CreateCommentInput, user: User) {
    const createdComment = new this.commentModel({
      ...createCommentInput,
      user: user._id,
    });
    const savedComment = await createdComment.save();

    await this.postModel.findByIdAndUpdate(
      createCommentInput.post,
      { $push: { comments: savedComment._id } },
      { new: true },
    );

    return savedComment;
  }

  async updateComment(
    id: MongooseSchema.Types.ObjectId,
    updatePostInput: UpdateCommentInput,
    user: User,
  ) {
    const comment = await this.commentModel.findById(id);

    if (!comment) {
      throw new NotFoundException();
    }

    if (String(comment.user) !== String(user._id)) {
      throw new ForbiddenException();
    }
    return this.commentModel
      .findByIdAndUpdate(id, updatePostInput, { new: true })
      .exec();
  }

  async removeComment(id: MongooseSchema.Types.ObjectId, user: User) {
    const comment = await this.commentModel.findById(id);

    if (!comment) {
      throw new NotFoundException();
    }

    if (String(comment.user) !== String(user._id)) {
      throw new ForbiddenException();
    }
    return this.commentModel.findByIdAndDelete(id).exec();
  }
}

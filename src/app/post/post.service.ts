import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './entities/post.entity';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { User } from '../user/entities/user.entity';
import { GetPaginatedDto } from '../common/extras/get-paginated-list.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<PostDocument>,
  ) {}

  createPost(createPostInput: CreatePostInput, user: User) {
    const createdPost = new this.postModel({
      ...createPostInput,
      user: user._id,
    });
    return createdPost.save();
  }

  async findAllPosts(args: GetPaginatedDto) {
    const { page, limit } = args;
    const skip = (page - 1) * limit;
    const total = await this.postModel.countDocuments();
    const posts = await this.postModel.aggregate([
      {
        $project: {
          content: 1,
          user: 1,
          comments: 1,
          totalComments: { $size: '$comments' },
        },
      },
      { $skip: skip },
      { $limit: limit },
    ]);

    return {
      results: posts,
      totalItems: total,
      pageSize: limit,
      currentPage: page,
      previous: page > 1 ? page - 1 : 0,
      next: total > skip + limit ? page + 1 : 0,
    };
  }

  getPostById(id: MongooseSchema.Types.ObjectId) {
    return this.postModel.findById(id).populate('comments');
  }

  async updatePost(
    id: MongooseSchema.Types.ObjectId,
    updatePostInput: UpdatePostInput,
    user: User,
  ) {
    const post = await this.postModel.findById(id);

    if (!post) {
      throw new NotFoundException();
    }

    if (String(post.user) !== String(user._id)) {
      throw new ForbiddenException();
    }

    return this.postModel
      .findByIdAndUpdate(id, updatePostInput, { new: true })
      .exec();
  }

  async removePost(id: MongooseSchema.Types.ObjectId, user: User) {
    const post = await this.postModel.findById(id);

    if (!post) {
      throw new NotFoundException();
    }

    if (String(post.user) !== String(user._id)) {
      throw new ForbiddenException();
    }

    // Trigger the `pre('deleteOne')` middleware by calling `deleteOne()` on the document instance
    await post.deleteOne();
    return post;
  }
}

import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PostService } from './post.service';
import { GetPostPaginatedResponse, Post } from './entities/post.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { Schema as MongooseSchema } from 'mongoose';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guard/jwt-auth.guards';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { GetPaginatedDto } from '../common/extras/get-paginated-list.dto';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Mutation(() => Post)
  @UseGuards(JwtAuthGuard)
  createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
    @GetUser() user: User,
  ) {
    return this.postService.createPost(createPostInput, user);
  }

  @Query(() => GetPostPaginatedResponse, { name: 'posts' })
  @UseGuards(JwtAuthGuard)
  listPosts(@Args() args: GetPaginatedDto) {
    return this.postService.findAllPosts(args);
  }

  @Query(() => Post, { name: 'post' })
  @UseGuards(JwtAuthGuard)
  postDetail(
    @Args('id', { type: () => String }) id: MongooseSchema.Types.ObjectId,
  ) {
    return this.postService.getPostById(id);
  }

  @Mutation(() => Post)
  @UseGuards(JwtAuthGuard)
  updatePost(
    @Args('updatePostInput') updatePostInput: UpdatePostInput,
    @GetUser() user: User,
  ) {
    return this.postService.updatePost(
      updatePostInput._id,
      updatePostInput,
      user,
    );
  }

  @Mutation(() => Post)
  @UseGuards(JwtAuthGuard)
  removePost(
    @Args('id', { type: () => String }) id: MongooseSchema.Types.ObjectId,
    @GetUser() user: User,
  ) {
    return this.postService.removePost(id, user);
  }
}

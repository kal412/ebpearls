import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model, Schema as MongooseSchema } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  findAll() {
    return this.userModel.find();
  }

  async findOneByUsername(username: string) {
    return this.userModel.findOne({ username });
  }

  async findOneByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  getUserById(id: MongooseSchema.Types.ObjectId) {
    return this.userModel.findById(id);
  }

  updateUser(id: MongooseSchema.Types.ObjectId, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  remove(id: MongooseSchema.Types.ObjectId) {
    return this.userModel.deleteOne({ _id: id });
  }
}

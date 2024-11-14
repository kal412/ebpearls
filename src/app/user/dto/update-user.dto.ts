import { CreateUserDto } from './create-user.dto';
import { InputType, Field, OmitType } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';

@InputType()
export class UpdateUserDto extends OmitType(CreateUserDto, [
  'password',
] as const) {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;
}

import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/app/user/entities/user.entity';

@ObjectType()
export class LoginResponseDto {
  @Field(() => User)
  user: User;

  @Field()
  authToken: string;
}

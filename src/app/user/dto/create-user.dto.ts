import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsLowercase,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class CreateUserDto {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @IsLowercase()
  username: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsEmail()
  @IsLowercase()
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  @MinLength(6, {
    message: 'Password should be at least 6 characters',
  })
  @MaxLength(20, {
    message: 'Password can be maximum 20 characters',
  })
  @Matches(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,20}$/,
    {
      message:
        'Password should contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character',
    },
  )
  password: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  name: string;
}

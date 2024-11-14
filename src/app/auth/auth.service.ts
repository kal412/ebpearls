import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(loginUserInput: LoginUserDto) {
    const { username, password } = loginUserInput;
    const user = await this.userService.findOneByUsername(username);

    const isMatch = await bcrypt.compare(password, user?.password);

    if (user && isMatch) {
      return user;
    }

    throw new UnauthorizedException();
  }

  login(user: User) {
    const authToken = this.jwtService.sign(
      {
        username: user.username,
        sub: user._id,
      },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
      },
    );
    if (!authToken) {
      throw new InternalServerErrorException();
    }
    return {
      user,
      authToken,
    };
  }

  async signup(payload: CreateUserDto) {
    const userNameExists = await this.userService.findOneByUsername(
      payload.username,
    );

    if (userNameExists) {
      throw new Error('Username already exists, please use another username');
    }

    const emailExists = await this.userService.findOneByEmail(payload.email);

    if (emailExists) {
      throw new Error('Email already exists, please use another email');
    }

    const hash = await bcrypt.hash(
      payload.password,
      Number(this.configService.get<string>('SALT_ROUND')),
    );

    return this.userService.createUser({ ...payload, password: hash });
  }
}

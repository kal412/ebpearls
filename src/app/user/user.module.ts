import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';

@Module({
  providers: [UserService, ConfigService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule.forRoot({
      cache: true,
    }),
  ],
  exports: [UserService],
})
export class UserModule {}

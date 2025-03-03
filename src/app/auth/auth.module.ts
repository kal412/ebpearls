import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserModule } from '../user/user.module';
import { JwtModule, JwtModuleOptions, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../common/strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '../common/strategy/local.strategy';

@Module({
  providers: [
    AuthService,
    AuthResolver,
    JwtService,
    JwtStrategy,
    LocalStrategy,
  ],

  imports: [
    UserModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const properties: JwtModuleOptions = {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: '24h',
          },
        };
        return properties;
      },
    }),
  ],
})
export class AuthModule {}

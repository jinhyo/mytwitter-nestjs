import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from 'src/repositories/user.repository';
import { JwtPayload } from '../types/jwtPayload.interface';
import { cookieExtractor } from './cookieExtractor';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userRepository: UserRepository,
    readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate({ userId }: JwtPayload) {
    try {
      return await this.userRepository.findUserById(userId);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}

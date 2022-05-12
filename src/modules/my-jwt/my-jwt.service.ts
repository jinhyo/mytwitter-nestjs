import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types/jwtPayload.interface';

@Injectable()
export class MyJwtService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  createJwtToken(userId: number): string {
    const payload: JwtPayload = {
      userId,
    };

    const NODE_ENV = this.configService.get('NODE_ENV');
    const expiresIn = NODE_ENV === 'dev' ? '7d' : '12h';

    const jwtToken = this.jwtService.sign(payload, { expiresIn });

    return jwtToken;
  }
}

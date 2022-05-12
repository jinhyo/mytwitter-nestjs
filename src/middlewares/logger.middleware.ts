import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('Graphql Logger');

  use(request: Request, response: Response, next: NextFunction): void {
    const {
      ip,
      method,
      body: { query },
    } = request;

    const userAgent = request.get('user-agent') || '';

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      this.logger.log(
        `${method}, ${query}, ${statusCode}, length: ${contentLength}, ${userAgent}, ${ip}`,
      );
    });

    next();
  }
}

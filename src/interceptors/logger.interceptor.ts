import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log(
      '🚀 ~ file: logger.interceptor.ts ~ line 15 ~ LoggerInterceptor ~ intercept ~ context.switchToHttp().getResponse()',
      context.getHandler(),
    );
    const ctx = GqlExecutionContext.create(context);

    return next.handle().pipe(
      map((data) => {
        console.log(
          '🚀 ~ file: logger.interceptor.ts ~ line 21 ~ LoggerMiddleware ~ intercept ~ data',
          data,
        );

        return data;
      }),
    );
  }
}

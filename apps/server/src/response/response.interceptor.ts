import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

export type Response = {
  statusCode: number;
  data: any;
  metadata?: { [key: string]: any };
  pagination?: { offset: number; limit: number };
};

@Injectable()
export class ResponseInterceptor implements NestInterceptor<any, Response> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        if (typeof response === 'object' && 'data' in response) {
          return {
            statusCode: context.switchToHttp().getResponse().statusCode,
            data: response.data,
            metadata: response.metadata ?? undefined,
            pagination: response.pagination ?? undefined,
          };
        }

        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          data: response,
        } as Response;
      }),
    );
  }
}

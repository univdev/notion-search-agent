import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | Error, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response = http.getResponse() as Response;
    const status = 'getStatus' in exception ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      response.status(status).json({
        timestamp: new Date().toISOString(),
        error: exception.getResponse(),
      });
    } else if (exception instanceof Error) {
      response.status(status).json({
        timestamp: new Date().toISOString(),
        error: exception.message,
      });
    } else {
      response.status(status).json({
        timestamp: new Date().toISOString(),
        error: 'Internal Server Error',
      });
    }
  }
}

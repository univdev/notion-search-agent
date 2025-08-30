import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response = http.getResponse() as Response;
    const status = exception.getStatus();

    response.status(status).json({
      timestamp: new Date().toISOString(),
      error: exception.getResponse(),
    });
  }
}

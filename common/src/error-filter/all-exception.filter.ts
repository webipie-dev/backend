import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
class AllExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      message:
      // @ts-ignore
        typeof exception.getResponse()['message'] === 'string' ? [exception.getResponse()['message']] : [...exception.getResponse()['message']],
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    });
  }
}

export { AllExceptionFilter }

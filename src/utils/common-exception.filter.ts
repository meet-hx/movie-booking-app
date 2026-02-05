import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  buildErrorResponse,
  defaultMessageForStatus,
  mapStatusMessage,
} from './common-response';

@Catch()
export class CommonExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = this.resolveMessage(exception, statusCode);
    const status = mapStatusMessage(statusCode);

    response.status(statusCode).json(buildErrorResponse(message, status));
  }

  private resolveMessage(exception: unknown, statusCode: number): string {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();

      if (typeof response === 'string') {
        return response;
      }

      if (response && typeof response === 'object') {
        const message = (response as { message?: string | string[] }).message;
        if (Array.isArray(message)) {
          return message.join(', ');
        }
        if (typeof message === 'string' && message.trim().length > 0) {
          return message;
        }
      }

      if (exception.message) {
        return exception.message;
      }
    }

    return defaultMessageForStatus(statusCode);
  }
}

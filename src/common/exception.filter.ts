import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

@Catch(
  HttpException,
  PrismaClientKnownRequestError,
  JsonWebTokenError,
  TokenExpiredError,
)
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let name: string | null = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = (exception.getResponse() as any).message || exception.message;
      name = exception.name;
    } else if (exception instanceof PrismaClientKnownRequestError) {
      message = `Database error: ${exception.message}`;
      name = exception.name;

      let prismaCode = exception.code;
      let cause = exception.cause;

      switch (exception.code) {
        case 'P2000':
          status = HttpStatus.BAD_REQUEST;
          message = 'Bad Request: ' + exception.message;
          break;

        case 'P2002':
          status = HttpStatus.CONFLICT;
          message = 'Conflict: ' + exception.message;
          break;

        case 'P2003':
          status = HttpStatus.UNPROCESSABLE_ENTITY;
          message = 'Unprocessable Entity: ' + exception.message;
          break;

        case 'P2025':
          status = HttpStatus.NOT_FOUND;
          message = 'Not Found: ' + exception.message;
          break;

        default:
          break;
      }

      return response.status(status).json({
        statusCode: status,
        message: message.replace(/\n/g, ''),
        cause,
        name,
        prismaCode,
      });
    } else if (exception instanceof TokenExpiredError) {
      status = HttpStatus.UNAUTHORIZED;
      message = 'JWT expired';
    } else if (exception instanceof JsonWebTokenError) {
      status = HttpStatus.UNAUTHORIZED;
      message = 'Invalid JWT';
    }

    response.status(status).json({
      statusCode: status,
      message,
      name,
    });
  }
}

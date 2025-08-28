import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { GraphQLError } from 'graphql';

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
    const isGraphQL = host.getType().includes('graphql');

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseMessage = exception.getResponse();
      message =
        typeof responseMessage === 'string'
          ? responseMessage
          : (responseMessage as any).message || exception.message;
      name = exception.name;
    } else if (exception instanceof PrismaClientKnownRequestError) {
      message = exception.message;
      name = exception.name;
      const prismaCode = exception.code;
      const cause = exception.cause;

      switch (exception.code) {
        case 'P2000':
          status = HttpStatus.BAD_REQUEST;
          message = `Bad Request: ${message}`;
          break;

        case 'P2002':
          status = HttpStatus.CONFLICT;
          message = `Conflict: ${message}`;
          break;

        case 'P2003':
          status = HttpStatus.UNPROCESSABLE_ENTITY;
          message = `Unprocessable Entity: ${message}`;
          break;

        case 'P2025':
          status = HttpStatus.NOT_FOUND;
          message = `Not Found: ${message}`;
          break;

        default:
          break;
      }
      if (isGraphQL) {
        throw new GraphQLError(message.replace(/\n/g, ''), {
          extensions: {
            code: prismaCode,
            meta: exception.meta,
            cause,
            name,
            statusCode: status,
          },
        });
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
      name = exception.name;
    } else if (exception instanceof JsonWebTokenError) {
      status = HttpStatus.UNAUTHORIZED;
      message = 'Invalid JWT';
      name = exception.name;
    }

    if (isGraphQL) {
      throw new GraphQLError(message, {
        extensions: {
          code: name || 'INTERNAL_SERVER_ERROR',
          message,
          statusCode: status,
        },
      });
    }

    return response.status(status).json({
      statusCode: status,
      message,
      name,
    });
  }
}

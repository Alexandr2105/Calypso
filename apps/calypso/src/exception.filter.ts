import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  ExecutionContext,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const hostType = host.getType<GqlContextType>();
    if (hostType === 'graphql') {
      const gqlHost = GqlExecutionContext.create(<ExecutionContext>host);
      if (exception instanceof HttpException) {
        // const response: any = exception.getResponse();
        // throwUserInputGraphqlError(exception.message, response);
        // console.log(response);
        // const graphQLFormattedError: GraphQLFormattedError = {
        //   message: response.message,
        //   extensions: response.statusCode,
        // };
        // return graphQLFormattedError;
      }
      console.log(gqlHost);
      return exception;
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (status === 400) {
      const errorResponse = { errorsMessages: [] };
      const responseBody: any = exception.getResponse();
      if (typeof responseBody.message === 'string') {
        errorResponse.errorsMessages.push(responseBody);
        response.status(status).json(errorResponse);
        return;
      }
      responseBody.message.forEach((m) => errorResponse.errorsMessages.push(m));
      response.status(status).json(errorResponse);
    } else if (status === 404) {
      response.sendStatus(status);
    } else if (status === 403) {
      response.sendStatus(status);
    } else if (status === 401) {
      response.sendStatus(status);
    } else if (status === 429) {
      response.sendStatus(status);
    } else {
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}

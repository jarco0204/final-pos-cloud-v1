import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { AIResponse } from '../types/ai-response.types';
// import { createAIResponse } from '../utils/ai-response.util';
// import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AIResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle();
  }

  //   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
  // const request = context.switchToHttp().getRequest();
  // const response = context.switchToHttp().getResponse();
  // const startTime = Date.now();
  // const requestId = uuidv4();
  // // Extract request information
  // const endpoint = request.route?.path || request.url;
  // const method = request.method;
  // const userId = request.user?.id || request.headers['user-id'];
  // const sessionId = request.headers['session-id'];
  // return next.handle().pipe(
  //   map((data) => {
  //     // If data is already an AIResponse, return as is
  //     if (
  //       data &&
  //       typeof data === 'object' &&
  //       'success' !== undefined &&
  //       'metadata' !== undefined
  //     ) {
  //       return data;
  //     }
  //     // Build AI response
  //     const aiResponse = createAIResponse(
  //       endpoint,
  //       method,
  //       requestId,
  //       startTime,
  //     )
  //       .setData(data)
  //       .setUserContext(userId, sessionId)
  //       .build();
  //     // Set response headers
  //     response.setHeader('X-Request-ID', requestId);
  //     response.setHeader(
  //       'X-Processing-Time',
  //       aiResponse.metadata.processingTime,
  //     );
  //     return aiResponse;
  //   }),
  // );
  //   }
}

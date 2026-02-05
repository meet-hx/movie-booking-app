import { CallHandler, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import {
  buildSuccessResponse,
  isCommonResponse,
} from './common-response';

@Injectable()
export class CommonResponseInterceptor implements NestInterceptor {
  intercept(_context: unknown, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data) => {
        if (isCommonResponse(data)) {
          return data;
        }

        const normalizedData = data === undefined ? null : data;
        return buildSuccessResponse(normalizedData);
      }),
    );
  }
}

import { HttpStatus } from '@nestjs/common';

export const DEFAULT_SUCCESS_MESSAGE = 'Operation successfully completed';

export interface CommonResponse<T> {
  data: T | null;
  status: string;
  message: string;
}

export const isCommonResponse = (value: unknown): value is CommonResponse<unknown> => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const response = value as Record<string, unknown>;
  return (
    'data' in response &&
    'status' in response &&
    'message' in response &&
    typeof response.status === 'string' &&
    typeof response.message === 'string'
  );
};

export const buildSuccessResponse = <T>(
  data: T | null,
  message = DEFAULT_SUCCESS_MESSAGE,
): CommonResponse<T> => ({
  data,
  status: 'success',
  message,
});

export const buildErrorResponse = (
  message: string,
  status: string,
): CommonResponse<null> => ({
  data: null,
  status,
  message,
});

export const mapStatusMessage = (statusCode: number): string => {
  if (statusCode >= 200 && statusCode < 300) {
    return 'success';
  }

  switch (statusCode) {
    case HttpStatus.BAD_REQUEST:
      return 'invalid parameters';
    case HttpStatus.UNAUTHORIZED:
      return 'unauthorized';
    case HttpStatus.FORBIDDEN:
      return 'forbidden';
    case HttpStatus.NOT_FOUND:
      return 'not found';
    case HttpStatus.CONFLICT:
      return 'conflict';
    case HttpStatus.UNPROCESSABLE_ENTITY:
      return 'unprocessable entity';
    case HttpStatus.TOO_MANY_REQUESTS:
      return 'too many requests';
    default:
      return 'internal server error';
  }
};

export const defaultMessageForStatus = (statusCode: number): string => {
  switch (statusCode) {
    case HttpStatus.BAD_REQUEST:
      return 'Invalid parameters';
    case HttpStatus.UNAUTHORIZED:
      return 'Unauthorized';
    case HttpStatus.FORBIDDEN:
      return 'Forbidden';
    case HttpStatus.NOT_FOUND:
      return 'Resource not found';
    case HttpStatus.CONFLICT:
      return 'Conflict';
    case HttpStatus.UNPROCESSABLE_ENTITY:
      return 'Validation failed';
    case HttpStatus.TOO_MANY_REQUESTS:
      return 'Too many requests';
    default:
      return 'Internal server error';
  }
};

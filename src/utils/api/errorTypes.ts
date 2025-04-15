export class ApiError extends Error {
  status: number
  data?: unknown

  constructor(message: string, status: number, data?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

// 네트워크 에러
export class NetworkError extends ApiError {
  constructor(message = '네트워크 연결 오류가 발생했습니다') {
    super(message, 0)
    this.name = 'NetworkError'
  }
}

// 서버 에러
export class ServerError extends ApiError {
  constructor(
    message = '서버 오류가 발생했습니다',
    status = 500,
    data?: unknown,
  ) {
    super(message, status, data)
    this.name = 'ServerError'
  }
}

// 요청 에러 (400대)
export class RequestError extends ApiError {
  constructor(message = '잘못된 요청입니다', status = 400, data?: unknown) {
    super(message, status, data)
    this.name = 'RequestError'
  }
}

// 권한 에러 (401, 403)
export class AuthError extends ApiError {
  constructor(message = '권한이 없습니다', status = 401, data?: unknown) {
    super(message, status, data)
    this.name = 'AuthError'
  }
}

// 리소스 없음 (404)
export class NotFoundError extends ApiError {
  constructor(
    message = '요청한 리소스를 찾을 수 없습니다',
    status = 404,
    data?: unknown,
  ) {
    super(message, status, data)
    this.name = 'NotFoundError'
  }
}

// 타임아웃 에러
export class TimeoutError extends ApiError {
  constructor(message = '요청 시간이 초과되었습니다') {
    super(message, 408)
    this.name = 'TimeoutError'
  }
}

export function createErrorFromResponse(
  status: number,
  message: string,
  data?: unknown,
): ApiError {
  switch (true) {
    case status === 401 || status === 403:
      return new AuthError(message, status, data)
    case status === 404:
      return new NotFoundError(message, status, data)
    case status === 408:
      return new TimeoutError(message)
    case status >= 400 && status < 500:
      return new RequestError(message, status, data)
    case status >= 500:
      return new ServerError(message, status, data)
    case status === 0:
      return new NetworkError(message)
    default:
      return new ApiError(message, status, data)
  }
}

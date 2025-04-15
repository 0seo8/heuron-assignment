import {
  createErrorFromResponse,
  NetworkError,
  ServerError,
} from '@utils/api/errorTypes'

export type FetcherOptions = RequestInit & {
  baseUrl?: string
  timeout?: number
}

export const fetcher = async <T>(
  url: string,
  options: FetcherOptions = {},
): Promise<T> => {
  const { baseUrl = '', timeout = 30000, ...fetchOptions } = options

  const headers = new Headers(fetchOptions.headers || {})
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const config: RequestInit = {
    ...fetchOptions,
    headers,
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    config.signal = controller.signal

    const response = await fetch(`${baseUrl}${url}`, config)
    clearTimeout(timeoutId)

    if (response.status >= 500) {
      const errorMessage = response.statusText || '서버 오류가 발생했습니다'
      throw new ServerError(errorMessage, response.status)
    }

    const contentType = response.headers.get('content-type')
    let data: unknown

    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      data = await response.text()
    }

    if (!response.ok) {
      const errorMessage =
        typeof data === 'object' && data !== null && 'message' in data
          ? String(data.message)
          : response.statusText || '알 수 없는 오류가 발생했습니다'
      throw createErrorFromResponse(response.status, errorMessage, data)
    }

    return data as T
  } catch (error) {
    // 네트워크 오류 또는 타임아웃
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw createErrorFromResponse(408, '요청 시간이 초과되었습니다')
      }
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new NetworkError(
          '네트워크 연결에 문제가 발생했습니다. 인터넷 연결을 확인해주세요.',
        )
      }
    }

    // 이미 처리된 API 에러는 그대로 전달
    throw error
  }
}

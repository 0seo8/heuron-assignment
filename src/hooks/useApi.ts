import { useState, useCallback } from 'react'

import { fetcher } from '@utils/api/fetcher'

import { useApiErrorToast } from './useApiErrorToast'

type ApiStatus = 'idle' | 'loading' | 'success' | 'error'

type ApiState<T> = {
  data: T | null
  status: ApiStatus
  error: Error | null
}

type ApiOptions = {
  baseUrl?: string
  timeout?: number
  showErrorToast?: boolean
}

/**
 * API 요청을 처리하는 커스텀 훅
 * @param defaultOptions 기본 API 옵션
 */
export const useApi = <T = unknown>(defaultOptions?: ApiOptions) => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    status: 'idle',
    error: null,
  })

  const { handleApiError } = useApiErrorToast()

  /**
   * API 요청 함수
   * @param url 요청 URL
   * @param options 요청 옵션
   */
  const request = useCallback(
    async (
      url: string,
      options?: RequestInit & {
        baseUrl?: string
        timeout?: number
        showErrorToast?: boolean
      },
    ): Promise<T | null> => {
      const mergedOptions = {
        ...defaultOptions,
        ...options,
      }

      const { showErrorToast = true, ...fetcherOptions } = mergedOptions

      // 로딩 상태 설정
      setState((prev) => ({ ...prev, status: 'loading', error: null }))

      try {
        const data = await fetcher<T>(url, fetcherOptions)
        setState({ data, status: 'success', error: null })
        return data
      } catch (error) {
        const errorObj =
          error instanceof Error ? error : new Error('Unknown error occurred')
        setState({ data: null, status: 'error', error: errorObj })

        // 에러 토스트 표시 (필요한 경우)
        if (showErrorToast) {
          handleApiError(error)
        }

        return null
      }
    },
    [defaultOptions, handleApiError],
  )

  const reset = useCallback(() => {
    setState({ data: null, status: 'idle', error: null })
  }, [])

  return {
    ...state,
    isLoading: state.status === 'loading',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
    request,
    reset,
  }
}

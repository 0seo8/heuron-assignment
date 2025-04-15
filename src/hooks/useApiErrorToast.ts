import { useCallback } from 'react'

import { useToast } from '@components/ui/Toast'
import {
  ApiError,
  ServerError,
  NetworkError,
  TimeoutError,
} from '@utils/api/errorTypes'

export const useApiErrorToast = () => {
  const { addToast } = useToast()

  const handleApiError = useCallback(
    (error: unknown, customMessage?: string) => {
      if (error instanceof ServerError) {
        addToast({
          type: 'error',
          title: '서버 오류',
          message:
            customMessage ||
            error.message ||
            '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
          duration: 5000,
        })
        return
      }

      // NetworkError (네트워크 연결 오류) 처리
      if (error instanceof NetworkError) {
        addToast({
          type: 'error',
          title: '네트워크 오류',
          message:
            customMessage ||
            error.message ||
            '네트워크 연결에 문제가 발생했습니다. 인터넷 연결을 확인해주세요.',
          duration: 5000,
        })
        return
      }

      // TimeoutError (요청 시간 초과) 처리
      if (error instanceof TimeoutError) {
        addToast({
          type: 'error',
          title: '요청 시간 초과',
          message:
            customMessage ||
            error.message ||
            '요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.',
          duration: 5000,
        })
        return
      }

      // 기타 API 에러 처리
      if (error instanceof ApiError) {
        addToast({
          type: 'error',
          title: '오류 발생',
          message:
            customMessage ||
            error.message ||
            '요청 처리 중 오류가 발생했습니다.',
          duration: 5000,
        })
        return
      }

      // 알 수 없는 에러 처리
      addToast({
        type: 'error',
        title: '알 수 없는 오류',
        message:
          customMessage ||
          (error instanceof Error
            ? error.message
            : '알 수 없는 오류가 발생했습니다.'),
        duration: 5000,
      })
    },
    [addToast],
  )

  return { handleApiError }
}

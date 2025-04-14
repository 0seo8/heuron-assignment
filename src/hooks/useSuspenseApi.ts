import { useState, useCallback } from 'react'

// 전역 프로미스 캐시
const promiseCache = new Map<string, Promise<unknown>>()

export const useSuspenseApi = <T = unknown>(baseUrl?: string) => {
  const [error, setError] = useState<Error | null>(null)

  const request = useCallback(
    async (url: string, cacheKey: string): Promise<T> => {
      if (!promiseCache.has(cacheKey)) {
        // 새로운 요청 생성 및 캐싱
        const fullUrl = baseUrl ? `${baseUrl}${url}` : url
        const promise = fetch(fullUrl)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`API 요청 실패: ${response.status}`)
            }
            return response.json() as Promise<T>
          })
          .catch((err) => {
            // 에러 상태 업데이트
            setError(err instanceof Error ? err : new Error('알 수 없는 오류'))

            throw err
          })

        promiseCache.set(cacheKey, promise)
      }

      return promiseCache.get(cacheKey) as Promise<T>
    },
    [baseUrl],
  )

  return { request, error }
}

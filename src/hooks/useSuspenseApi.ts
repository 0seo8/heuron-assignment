import type { PicsumImage } from '@/types/gallery'

import { useState, useCallback } from 'react'

import { fetcher } from '@utils/api/fetcher'

import { useApiErrorToast } from './useApiErrorToast'

const promiseCache = new Map<string, Promise<PicsumImage | PicsumImage[]>>()

export const useSuspenseApi = <T = unknown>(defaultOptions?: {
  baseUrl?: string
}) => {
  const [error, setError] = useState<Error | null>(null)
  const { handleApiError } = useApiErrorToast()

  const request = useCallback(
    async (url: string, key: string): Promise<T> => {
      if (!promiseCache.has(key)) {
        const promise = fetcher<T>(url, { ...defaultOptions }).catch((err) => {
          const errorObj =
            err instanceof Error ? err : new Error('Unknown error')
          setError(errorObj)
          handleApiError(errorObj)
          throw errorObj
        })
        promiseCache.set(key, promise as Promise<PicsumImage | PicsumImage[]>)
      }
      return promiseCache.get(key)! as Promise<T>
    },
    [defaultOptions, handleApiError],
  )

  return { request, error }
}

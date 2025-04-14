import type { PicsumImage } from '@/types/gallery'

import { useCallback } from 'react'

import { useSuspenseApi } from '@/hooks/useSuspenseApi'

export const BASE_URL = 'https://picsum.photos'

export const useGalleryApi = () => {
  const listApi = useSuspenseApi<PicsumImage[]>({ baseUrl: BASE_URL })
  const detailApi = useSuspenseApi<PicsumImage>({ baseUrl: BASE_URL })

  const getImageList = useCallback(
    (page = 1, limit = 30) => {
      return listApi.request(
        `/v2/list?page=${page}&limit=${limit}`,
        `list:${page}:${limit}`,
      )
    },
    [listApi],
  )

  const getImageById = useCallback(
    (id: string) => {
      return detailApi.request(`/id/${id}/info`, `id:${id}`)
    },
    [detailApi],
  )

  return {
    getImageList,
    getImageById,
    listError: listApi.error,
    detailError: detailApi.error,
  }
}

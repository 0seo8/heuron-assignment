import type { PicsumImage } from '@/types/gallery'

import { useSuspenseApi } from '@/hooks/useSuspenseApi'

const BASE_URL = 'https://picsum.photos'

export const useGalleryApi = () => {
  const listApi = useSuspenseApi<PicsumImage[]>(BASE_URL)
  const detailApi = useSuspenseApi<PicsumImage>(BASE_URL)

  const getImageList = (page = 1, limit = 30) => {
    return listApi.request(
      `/v2/list?page=${page}&limit=${limit}`,
      `list:${page}:${limit}`,
    )
  }

  const getImageById = (id: string) => {
    return detailApi.request(`/id/${id}/info`, `id:${id}`)
  }

  return {
    getImageList,
    getImageById,
    listError: listApi.error,
    detailError: detailApi.error,
  }
}

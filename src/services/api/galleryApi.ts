import type { PicsumImage } from '@/types/gallery'

import { useSuspenseApi } from '@/hooks/useSuspenseApi'

const BASE_URL = 'https://picsum.photos'

/**
 * 갤러리 API를 위한 Suspense 호환 커스텀 훅
 * useGalleryApi 훅은 이미지 목록 및 상세 정보를 가져오는 함수들과
 * 에러 상태를 제공합니다.
 */
export const useGalleryApi = () => {
  const listApi = useSuspenseApi<PicsumImage[]>(BASE_URL)
  const detailApi = useSuspenseApi<PicsumImage>(BASE_URL)

  /**
   * 이미지 목록을 가져옵니다.
   * @param page 페이지 번호 (기본값: 1)
   * @param limit 한 페이지당 이미지 수 (기본값: 30)
   */
  const getImageList = (page = 1, limit = 30) => {
    return listApi.request(
      `/v2/list?page=${page}&limit=${limit}`,
      `list:${page}:${limit}`,
    )
  }

  /**
   * 특정 ID의 이미지 정보를 가져옵니다.
   * @param id 이미지 ID
   */
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

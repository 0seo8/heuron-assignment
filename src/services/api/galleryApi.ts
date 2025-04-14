import { fetcher } from '@/utils/api/fetcher'

const PICSUM_API_URL = 'https://picsum.photos'

export interface PicsumImage {
  id: string
  author: string
  width: number
  height: number
  url: string
  download_url: string
}

export const getImageList = async (
  page = 1,
  limit = 30,
): Promise<PicsumImage[]> => {
  try {
    return await fetcher<PicsumImage[]>(
      `/v2/list?page=${page}&limit=${limit}`,
      {
        baseUrl: PICSUM_API_URL,
      },
    )
  } catch (error) {
    console.error('이미지 목록을 가져오는 데 실패했습니다:', error)
    throw error
  }
}

export const getImageById = async (id: string): Promise<PicsumImage> => {
  try {
    return await fetcher<PicsumImage>(`/id/${id}/info`, {
      baseUrl: PICSUM_API_URL,
    })
  } catch (error) {
    console.error(`ID ${id}의 이미지를 가져오는 데 실패했습니다:`, error)
    throw error
  }
}

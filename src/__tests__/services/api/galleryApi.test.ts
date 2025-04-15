import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { useSuspenseApi } from '@/hooks/useSuspenseApi'
import { useGalleryApi, BASE_URL } from '@/services/api/galleryApi'

// useSuspenseApi 모킹
vi.mock('@/hooks/useSuspenseApi', () => ({
  useSuspenseApi: vi.fn(),
}))

const mockPicsumImages = [
  {
    id: '1',
    author: '테스트 작가 1',
    width: 800,
    height: 600,
    url: 'https://picsum.photos/id/1',
    download_url: 'https://picsum.photos/id/1/800/600',
  },
  {
    id: '2',
    author: '테스트 작가 2',
    width: 1024,
    height: 768,
    url: 'https://picsum.photos/id/2',
    download_url: 'https://picsum.photos/id/2/1024/768',
  },
]

const mockPicsumImage = {
  id: '1',
  author: '테스트 작가 1',
  width: 800,
  height: 600,
  url: 'https://picsum.photos/id/1',
  download_url: 'https://picsum.photos/id/1/800/600',
}

describe('useGalleryApi 훅 테스트', () => {
  const mockListRequest = vi.fn()
  const mockDetailRequest = vi.fn()
  let apiCallCount = 0

  // 각 테스트 전에 목 설정
  beforeEach(() => {
    vi.resetAllMocks()
    apiCallCount = 0

    // 모킹 로직 개선: 호출 순서에 따라 서로 다른 mock 반환
    vi.mocked(useSuspenseApi).mockImplementation(() => {
      // 첫 번째 호출은 listApi, 두 번째 호출은 detailApi로 처리
      apiCallCount += 1
      if (apiCallCount === 1) {
        return {
          request: mockListRequest,
          error: null,
        }
      } else {
        return {
          request: mockDetailRequest,
          error: null,
        }
      }
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('getImageList 함수가 올바른 경로로 요청해야 함', async () => {
    // 성공적인 응답 모킹
    mockListRequest.mockResolvedValueOnce(mockPicsumImages)

    // 훅 렌더링
    const { result } = renderHook(() => useGalleryApi())

    // 이미지 목록 요청
    const imageListPromise = result.current.getImageList(1, 20)

    // 요청이 올바른 파라미터로 호출되었는지 확인
    expect(mockListRequest).toHaveBeenCalledWith(
      '/v2/list?page=1&limit=20',
      'list:1:20',
    )

    // 응답이 올바른지 확인
    await waitFor(async () => {
      const images = await imageListPromise
      expect(images).toEqual(mockPicsumImages)
    })
  })

  it('getImageById 함수가 올바른 경로로 요청해야 함', async () => {
    // 성공적인 응답 모킹
    mockDetailRequest.mockResolvedValueOnce(mockPicsumImage)

    // 훅 렌더링
    const { result } = renderHook(() => useGalleryApi())

    // 이미지 상세 정보 요청
    const imageDetailPromise = result.current.getImageById('1')

    // 요청이 올바른 파라미터로 호출되었는지 확인
    expect(mockDetailRequest).toHaveBeenCalledWith('/id/1/info', 'id:1')

    // 응답이 올바른지 확인
    await waitFor(async () => {
      const image = await imageDetailPromise
      expect(image).toEqual(mockPicsumImage)
    })
  })

  it('BASE_URL이 올바르게 설정되어야 함', () => {
    expect(BASE_URL).toBe('https://picsum.photos')
  })

  it('기본 파라미터로 getImageList 호출 시 올바른 페이지와 한도가 사용되어야 함', async () => {
    // 성공적인 응답 모킹
    mockListRequest.mockResolvedValueOnce(mockPicsumImages)

    // 훅 렌더링
    const { result } = renderHook(() => useGalleryApi())

    // 기본 파라미터로 이미지 목록 요청
    result.current.getImageList()

    // 요청이 기본 파라미터로 호출되었는지 확인
    expect(mockListRequest).toHaveBeenCalledWith(
      '/v2/list?page=1&limit=30',
      'list:1:30',
    )
  })
})

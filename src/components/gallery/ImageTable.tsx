import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useImageCache } from '@/hooks/useImageCache'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { BASE_URL } from '@/services/api/galleryApi'

export default function ImageTable() {
  const navigate = useNavigate()
  const { images, isLoading, hasMore, loadImages } = useInfiniteScroll(1, 15)
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({})

  const [loaderRef, isVisible] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: '100px',
  })

  const getThumbnailUrl = (
    id: string,
    width: number = 300,
    height: number = 200,
  ) => {
    return `${BASE_URL}/id/${id}/${width}/${height}`
  }

  const getBlurThumbnailUrl = (id: string) => {
    return `${BASE_URL}/id/${id}/30/20`
  }

  const imageUrls = images.map((image) => getThumbnailUrl(image.id, 240, 160))
  const blurImageUrls = images.map((image) => getBlurThumbnailUrl(image.id))

  const { preloadBatch } = useImageCache([...imageUrls, ...blurImageUrls])

  useEffect(() => {
    if (isVisible && hasMore && !isLoading) {
      loadImages()
    }
  }, [isVisible, hasMore, isLoading, loadImages])

  useEffect(() => {
    if (images.length > 0 && !isLoading) {
      const lastId = parseInt(images[images.length - 1].id)
      const nextIds = Array.from({ length: 5 }, (_, i) =>
        String(lastId + i + 1),
      )

      const nextUrls = nextIds.map((id) => getThumbnailUrl(id, 240, 160))
      const nextBlurUrls = nextIds.map((id) => getBlurThumbnailUrl(id))

      preloadBatch([...nextUrls, ...nextBlurUrls])
    }
  }, [images, isLoading, preloadBatch])

  const handleRowClick = (imageId: string) => {
    navigate(`${imageId}`)
  }

  const handleImageLoaded = (id: string) => {
    setLoadedImages((prev) => ({
      ...prev,
      [id]: true,
    }))
  }

  if (!images) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
        이미지 목록을 불러오지 못했습니다.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium uppercase tracking-wider text-gray-500 w-24 sm:w-32">
                이미지
              </th>
              <th className="px-4 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium uppercase tracking-wider text-gray-500">
                작가
              </th>
              <th className="px-4 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium uppercase tracking-wider text-gray-500 hidden sm:table-cell">
                크기
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white text-center">
            {images.length > 0 ? (
              images.map((image) => (
                <tr
                  key={image.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(image.id)}
                >
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="h-12 w-20 sm:h-16 sm:w-24 mx-auto relative overflow-hidden rounded">
                      <img
                        src={getBlurThumbnailUrl(image.id)}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-105 transition-opacity duration-300"
                        style={{ opacity: loadedImages[image.id] ? 0 : 1 }}
                      />
                      <img
                        src={getThumbnailUrl(image.id, 240, 160)}
                        alt={`Photo by ${image.author}`}
                        className="relative w-full h-full object-cover transition-opacity duration-300"
                        loading="lazy"
                        width={240}
                        height={160}
                        onLoad={() => handleImageLoaded(image.id)}
                        style={{ opacity: loadedImages[image.id] ? 1 : 0 }}
                      />
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="text-xs sm:text-sm font-medium text-gray-900">
                      {image.author}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 sm:hidden">
                      {image.width} x {image.height}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden sm:table-cell">
                    <div className="text-sm text-gray-500">
                      {image.width} x {image.height}
                    </div>
                  </td>
                </tr>
              ))
            ) : isLoading && images.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 sm:px-6 py-6 sm:py-8 text-center text-gray-500"
                >
                  <div className="flex justify-center items-center py-4">
                    <div className="animate-spin h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                    <span className="ml-2">이미지를 불러오는 중...</span>
                  </div>
                </td>
              </tr>
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 sm:px-6 py-6 sm:py-8 text-center text-gray-500"
                >
                  이미지 목록이 비어있습니다
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div ref={loaderRef} className="flex justify-center items-center py-4">
          {isLoading && (
            <>
              <div className="animate-spin h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent"></div>
              <span className="ml-2">더 불러오는 중...</span>
            </>
          )}
        </div>
      )}
    </div>
  )
}

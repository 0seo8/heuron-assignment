import type { PicsumImage } from '@/types/gallery'

import { useState, useEffect, useCallback, useTransition } from 'react'

import { useGalleryApi } from '@/services/api/galleryApi'

export const useInfiniteScroll = (initialPage = 1, itemsPerPage = 10) => {
  const [page, setPage] = useState(initialPage)
  const [images, setImages] = useState<PicsumImage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [isPending, startTransition] = useTransition()
  const { getImageList } = useGalleryApi()

  const cache = useCallback(
    async (page: number) => {
      try {
        const newImages = await getImageList(page, itemsPerPage)
        return newImages
      } catch (error) {
        console.error('Error fetching images for cache:', error)
        return []
      }
    },
    [getImageList, itemsPerPage],
  )

  const loadImages = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    try {
      const newImages = await getImageList(page, itemsPerPage)

      if (!newImages || newImages.length < itemsPerPage) {
        setHasMore(false)
      }

      startTransition(() => {
        setImages((prev) => [...prev, ...newImages])
      })

      setPage((prevPage) => prevPage + 1)

      if (newImages.length === itemsPerPage) {
        cache(page + 1)
      }
    } catch (error) {
      console.error('Error loading images:', error)
      setHasMore(false)
    } finally {
      setIsLoading(false)
    }
  }, [page, itemsPerPage, isLoading, hasMore, getImageList, cache])

  useEffect(() => {
    loadImages()

    cache(initialPage + 1)
  }, [])

  return {
    images,
    isLoading: isLoading || isPending,
    hasMore,
    loadImages,
  }
}

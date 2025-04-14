import { useCallback, useEffect, useState } from 'react'

/**
 * 이미지를 미리 캐싱하기 위한 훅
 * @param urls 캐싱할 이미지 URL 배열
 * @returns 캐싱된 이미지 URL 맵
 */
export function useImageCache(urls: string[]) {
  const [loadedUrls, setLoadedUrls] = useState<Record<string, boolean>>({})

  // 각 이미지를 미리 로드하는 함수
  const preloadImage = useCallback(
    (url: string) => {
      if (loadedUrls[url]) return Promise.resolve(url) // 이미 로드된 이미지는 스킵

      return new Promise<string>((resolve, reject) => {
        const img = new Image()

        img.onload = () => {
          setLoadedUrls((prev) => ({ ...prev, [url]: true }))
          resolve(url)
        }

        img.onerror = () => {
          reject(new Error(`Failed to load image: ${url}`))
        }

        img.src = url
      })
    },
    [loadedUrls],
  )

  // 여러 이미지를 배치로 로드하는 함수
  const preloadBatch = useCallback(
    async (urls: string[], batchSize = 5) => {
      const uniqueUrls = urls.filter((url) => !loadedUrls[url])

      for (let i = 0; i < uniqueUrls.length; i += batchSize) {
        const batch = uniqueUrls.slice(i, i + batchSize)
        await Promise.allSettled(batch.map(preloadImage))
      }
    },
    [preloadImage, loadedUrls],
  )

  // 초기 이미지 URL 배열이 제공되면 미리 캐싱
  useEffect(() => {
    if (urls.length > 0) {
      preloadBatch(urls)
    }
  }, [urls, preloadBatch])

  return {
    loadedUrls,
    preloadImage,
    preloadBatch,
  }
}

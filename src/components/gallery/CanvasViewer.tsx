import type { PicsumImage } from '@/types/gallery'

import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
} from 'react'

import { useGallery } from '@/context/gallery/GalleryContext'
import { useImageManipulation } from '@/hooks/useImageManipulation'
import { BASE_URL } from '@/services/api/galleryApi'

type CanvasViewerProps = {
  image: PicsumImage
  isGrayscale: boolean
  scale: number
  rotation: number
}

const CanvasViewer = React.memo(function CanvasViewer({
  image,
  isGrayscale,
  scale,
  rotation,
}: CanvasViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const blurImageRef = useRef<HTMLImageElement | null>(null)
  const scaleRef = useRef(scale)
  const rotationRef = useRef(rotation)
  const isGrayscaleRef = useRef(isGrayscale)

  const { setScale, setRotation } = useGallery()
  const [containerSize, setContainerSize] = useState({
    width: 800,
    height: 600,
  })
  const [isHighQualityLoaded, setIsHighQualityLoaded] = useState(false)

  const { isDragging, handleMouseDown, handleContextMenu, handleKeyDown } =
    useImageManipulation(setScale, setRotation)

  useEffect(() => {
    scaleRef.current = scale
    rotationRef.current = rotation
    isGrayscaleRef.current = isGrayscale
  }, [scale, rotation, isGrayscale])

  useLayoutEffect(() => {
    if (containerRef.current) {
      const { width } = containerRef.current.getBoundingClientRect()
      setContainerSize({ width, height: width * 0.75 })
    }

    const handleResize = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect()
        setContainerSize({ width, height: width * 0.75 })
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const getOptimizedImageUrl = useCallback(
    (id: string, width: number, height: number) => {
      return `${BASE_URL}/id/${id}/${width}/${height}`
    },
    [],
  )

  useEffect(() => {
    if (!image) return

    const blurImg = new Image()
    blurImg.crossOrigin = 'anonymous'
    blurImg.src = getOptimizedImageUrl(image.id, 50, 50)

    blurImg.onload = () => {
      blurImageRef.current = blurImg
      renderCanvas(blurImg, false)

      const img = new Image()
      img.crossOrigin = 'anonymous'

      const optimizedWidth = Math.round(
        containerSize.width * window.devicePixelRatio,
      )
      const optimizedHeight = Math.round(
        containerSize.height * window.devicePixelRatio,
      )

      const maxDimension = Math.max(optimizedWidth, optimizedHeight)
      const targetSize = Math.min(maxDimension, 1200)

      if (image.width > image.height) {
        const width = targetSize
        const height = Math.round((image.height / image.width) * targetSize)
        img.src = getOptimizedImageUrl(image.id, width, height)
      } else {
        const height = targetSize
        const width = Math.round((image.width / image.height) * targetSize)
        img.src = getOptimizedImageUrl(image.id, width, height)
      }

      img.onload = () => {
        imageRef.current = img
        setIsHighQualityLoaded(true)
        if (containerRef.current) {
          const imgRatio = img.height / img.width
          setContainerSize((prev) => ({
            width: prev.width,
            height: prev.width * imgRatio,
          }))
        }
        renderCanvas(img, true)
      }
    }

    return () => {
      imageRef.current = null
      blurImageRef.current = null
      setIsHighQualityLoaded(false)
    }
  }, [image, containerSize.width, containerSize.height, getOptimizedImageUrl])

  const renderCanvas = useCallback(
    (imgElement: HTMLImageElement | null = null, isHighQuality = false) => {
      const canvas = canvasRef.current
      const img =
        imgElement || (isHighQuality ? imageRef.current : blurImageRef.current)

      if (!canvas || !img) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const dpr = window.devicePixelRatio || 1

      const displayWidth = containerSize.width
      const displayHeight = containerSize.height

      canvas.style.width = `${displayWidth}px`
      canvas.style.height = `${displayHeight}px`

      canvas.width = displayWidth * dpr
      canvas.height = displayHeight * dpr

      const imgRatio = img.height / img.width

      let baseWidth, baseHeight
      const canvasRatio = displayHeight / displayWidth

      if (imgRatio > canvasRatio) {
        baseHeight = displayHeight
        baseWidth = baseHeight / imgRatio
      } else {
        baseWidth = displayWidth
        baseHeight = baseWidth * imgRatio
      }

      ctx.resetTransform()
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, displayWidth, displayHeight)

      ctx.translate(displayWidth / 2, displayHeight / 2)
      ctx.rotate((rotationRef.current * Math.PI) / 180)
      ctx.scale(scaleRef.current, scaleRef.current)

      if (!isHighQuality && !isHighQualityLoaded) {
        ctx.filter = 'blur(8px)'
      } else {
        ctx.filter = 'none'
      }

      ctx.drawImage(img, -baseWidth / 2, -baseHeight / 2, baseWidth, baseHeight)

      ctx.filter = 'none'

      if (isGrayscaleRef.current) {
        ctx.save()
        ctx.resetTransform()

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data

        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
          data[i] = avg
          data[i + 1] = avg
          data[i + 2] = avg
        }

        ctx.putImageData(imageData, 0, 0)
        ctx.restore()
      }
    },
    [containerSize, isHighQualityLoaded],
  )

  useEffect(() => {
    requestAnimationFrame(() => renderCanvas(null, isHighQualityLoaded))
  }, [scale, rotation, isGrayscale, isHighQualityLoaded, renderCanvas])

  useEffect(() => {
    requestAnimationFrame(() => renderCanvas(null, isHighQualityLoaded))
  }, [containerSize, isHighQualityLoaded, renderCanvas])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-auto bg-gray-100 rounded-lg overflow-hidden shadow-md"
      style={{ height: `${containerSize.height}px` }}
    >
      <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500 pointer-events-none">
        {!isHighQualityLoaded && !blurImageRef.current && '이미지를 로딩 중...'}
      </div>
      <canvas
        ref={canvasRef}
        className={`w-full h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onContextMenu={handleContextMenu}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        aria-label={`${image?.author || '이미지'} - 왼쪽 마우스 드래그로 확대/축소, 오른쪽 마우스 드래그로 회전, +/- 키로 확대/축소, 화살표 키로 회전`}
        role="img"
      />
      <div className="absolute bottom-2 right-2 text-sm bg-black bg-opacity-50 text-white px-2 py-1 rounded">
        <div className="flex items-center space-x-1">
          <span>{Math.round(scale * 100)}%</span>
          <span className="text-xs">|</span>
          <span>{Math.round(rotation)}°</span>
        </div>
      </div>
      <div className="absolute bottom-2 left-2 text-xs text-white bg-black bg-opacity-50 p-1 rounded hidden sm:block">
        <p>왼쪽 드래그: 확대/축소 | 오른쪽 드래그: 회전</p>
        <p>키보드: +/- (확대/축소), ←/→ (회전)</p>
      </div>
    </div>
  )
})

export default CanvasViewer

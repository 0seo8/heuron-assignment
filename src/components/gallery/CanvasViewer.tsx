import type { PicsumImage } from '@/types/gallery'

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { useGallery } from '@/context/gallery/GalleryContext'
import { BASE_URL } from '@/services/api/galleryApi'

type CanvasViewerProps = {
  image: PicsumImage
  isGrayscale: boolean
  scale: number
  rotation: number
}

const CanvasViewer = ({
  image,
  isGrayscale,
  scale,
  rotation,
}: CanvasViewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const blurImageRef = useRef<HTMLImageElement | null>(null)
  const scaleRef = useRef(scale)
  const rotationRef = useRef(rotation)
  const isGrayscaleRef = useRef(isGrayscale)

  const { setScale, setRotation } = useGallery()
  const [isDragging, setIsDragging] = useState<'left' | 'right' | null>(null)
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
    null,
  )
  const [containerSize, setContainerSize] = useState({
    width: 800,
    height: 600,
  })
  const [isHighQualityLoaded, setIsHighQualityLoaded] = useState(false)

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

  const getOptimizedImageUrl = (id: string, width: number, height: number) => {
    return `${BASE_URL}/id/${id}/${width}/${height}`
  }

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
  }, [image, containerSize.width, containerSize.height])

  const renderCanvas = (
    imgElement: HTMLImageElement | null = null,
    isHighQuality = false,
  ) => {
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
  }

  useEffect(() => {
    requestAnimationFrame(() => renderCanvas(null, isHighQualityLoaded))
  }, [scale, rotation, isGrayscale, isHighQualityLoaded])

  useEffect(() => {
    requestAnimationFrame(() => renderCanvas(null, isHighQualityLoaded))
  }, [containerSize])

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging || !startPos) return

      const deltaX = e.clientX - startPos.x
      const deltaY = e.clientY - startPos.y

      if (isDragging === 'left') {
        const sensitivity = 0.01
        const scaleChange = deltaY * -sensitivity

        if (Math.abs(deltaY) > 0) {
          setScale((prev) => {
            return Math.max(0.1, Math.min(10, prev + scaleChange))
          })
        }
      } else if (isDragging === 'right') {
        const sensitivity = 0.3
        const rotationChange = deltaX * sensitivity

        if (Math.abs(deltaX) > 0) {
          setRotation((prev) => {
            let newRotation = (prev + rotationChange) % 360
            if (newRotation < 0) newRotation += 360
            return newRotation
          })
        }
      }

      setStartPos({ x: e.clientX, y: e.clientY })
    }

    const handleGlobalMouseUp = () => {
      setIsDragging(null)
      setStartPos(null)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove)
      document.addEventListener('mouseup', handleGlobalMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [isDragging, startPos, setScale, setRotation])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (e.button === 0) setIsDragging('left')
    if (e.button === 2) setIsDragging('right')
    setStartPos({ x: e.clientX, y: e.clientY })
  }

  const handleContextMenu = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault()
  }

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
        className="w-full h-full cursor-grab"
        onMouseDown={handleMouseDown}
        onContextMenu={handleContextMenu}
      />
      <div className="absolute bottom-2 right-2 text-sm bg-black bg-opacity-50 text-white px-2 py-1 rounded">
        <div className="flex items-center space-x-1">
          <span>{Math.round(scale * 100)}%</span>
          <span className="text-xs">|</span>
          <span>{Math.round(rotation)}°</span>
        </div>
      </div>
    </div>
  )
}

export default React.memo(CanvasViewer)

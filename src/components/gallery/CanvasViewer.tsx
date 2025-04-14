import type { PicsumImage } from '@/types/gallery'

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { useGallery } from '@/context/gallery/GalleryContext'

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

  useEffect(() => {
    scaleRef.current = scale
    rotationRef.current = rotation
    isGrayscaleRef.current = isGrayscale
  }, [scale, rotation, isGrayscale])

  useLayoutEffect(() => {
    if (containerRef.current) {
      const { width } = containerRef.current.getBoundingClientRect()
      setContainerSize({ width, height: width * 0.75 }) // 기본 높이 비율 설정
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

  useEffect(() => {
    if (!image) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = image.download_url

    img.onload = () => {
      imageRef.current = img

      if (containerRef.current) {
        const imgRatio = img.height / img.width
        setContainerSize((prev) => ({
          width: prev.width,
          height: prev.width * imgRatio,
        }))
      }
      renderCanvas()
    }

    return () => {
      imageRef.current = null
    }
  }, [image])

  const renderCanvas = () => {
    const canvas = canvasRef.current
    const img = imageRef.current

    if (!canvas || !img) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 디스플레이 픽셀 비율 가져오기
    const dpr = window.devicePixelRatio || 1

    // 컨테이너 크기 사용
    const displayWidth = containerSize.width
    const displayHeight = containerSize.height

    canvas.style.width = `${displayWidth}px`
    canvas.style.height = `${displayHeight}px`

    canvas.width = displayWidth * dpr
    canvas.height = displayHeight * dpr

    // 이미지 정보
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

    ctx.drawImage(img, -baseWidth / 2, -baseHeight / 2, baseWidth, baseHeight)

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
    if (imageRef.current) {
      requestAnimationFrame(renderCanvas)
    }
  }, [scale, rotation, isGrayscale])

  useEffect(() => {
    if (imageRef.current) {
      renderCanvas()
    }
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
        const sensitivity = 0.3 // 0.5에서 0.3으로 민감도 감소
        const rotationChange = deltaX * sensitivity

        if (Math.abs(deltaX) > 0) {
          setRotation((prev) => {
            // 항상 0-360 범위로 유지
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
      className="bg-white rounded-lg shadow-md w-full"
      style={{ height: `${containerSize.height}px` }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain rounded"
        onMouseDown={handleMouseDown}
        onContextMenu={handleContextMenu}
      />
      <div className="mt-2 text-xs text-gray-500">
        현재 확대/축소: {scale.toFixed(2)}x, 회전: {rotation.toFixed(0)}°
      </div>
    </div>
  )
}

export default React.memo(CanvasViewer)

import type { PicsumImage } from '@/types/gallery'

import { useEffect, useRef, useState } from 'react'

import { useGallery } from '@/context/gallery/GalleryContext'

type CanvasViewerProps = {
  image: PicsumImage
  isGrayscale: boolean
  scale: number
  rotation: number
}

export default function CanvasViewer({
  image,
  isGrayscale,
  scale,
  rotation,
}: CanvasViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const { setScale, setRotation } = useGallery()
  const [isDragging, setIsDragging] = useState<'left' | 'right' | null>(null)
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
    null,
  )

  // 이미지 로딩
  useEffect(() => {
    if (!image) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = image.download_url

    img.onload = () => {
      imageRef.current = img
      renderCanvas()
    }

    return () => {
      if (imageRef.current) {
        imageRef.current = null
      }
    }
  }, [image])

  // 캔버스 렌더링 함수
  const renderCanvas = () => {
    const canvas = canvasRef.current
    const img = imageRef.current

    if (!canvas || !img) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 캔버스 크기 설정 - 이미지를 적절하게 표시할 크기로 설정
    const maxWidth = window.innerWidth * 0.6
    canvas.width = Math.min(img.width, maxWidth)
    canvas.height = (canvas.width / img.width) * img.height

    // 캔버스 초기화 및 컨텍스트 리셋
    ctx.resetTransform()
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.translate(canvas.width / 2, canvas.height / 2)

    ctx.rotate((rotation * Math.PI) / 180)

    const effectiveScale = scale * 2
    ctx.scale(effectiveScale, effectiveScale)

    // 이미지 그리기 (중앙에 위치)
    ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height)

    // 흑백 처리
    if (isGrayscale) {
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
    renderCanvas()
  }, [scale, rotation, isGrayscale])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (e.button === 0) setIsDragging('left')
    if (e.button === 2) setIsDragging('right')
    setStartPos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !startPos) return

    const deltaX = e.clientX - startPos.x
    const deltaY = e.clientY - startPos.y

    if (isDragging === 'left') {
      const scaleChange = deltaY * -0.005
      setScale((prev) => Math.max(0.5, Math.min(3, prev + scaleChange)))
    } else if (isDragging === 'right') {
      const rotationChange = deltaX * 0.5
      setRotation((prev) => (prev + rotationChange) % 360)
    }

    setStartPos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(null)
    setStartPos(null)
  }

  const handleContextMenu = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault()
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <canvas
        ref={canvasRef}
        className="w-full object-contain rounded"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onContextMenu={handleContextMenu}
      />
    </div>
  )
}

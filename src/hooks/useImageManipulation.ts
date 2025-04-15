import { useCallback, useEffect, useState } from 'react'

/**
 * 캔버스에서 이미지 조작을 위한 커스텀 훅
 * 마우스 드래그로 이미지 확대/축소(왼쪽 버튼) 및 회전(오른쪽 버튼) 기능 제공
 * 키보드 접근성도 지원 (+/- 키로 확대/축소, 화살표 키로 회전)
 */
export function useImageManipulation(
  setScale: (val: React.SetStateAction<number>) => void,
  setRotation: (val: React.SetStateAction<number>) => void,
) {
  const [isDragging, setIsDragging] = useState<'left' | 'right' | null>(null)
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
    null,
  )

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      e.preventDefault()
      if (e.button === 0) setIsDragging('left')
      if (e.button === 2) setIsDragging('right')
      setStartPos({ x: e.clientX, y: e.clientY })
    },
    [],
  )

  const handleContextMenu = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      e.preventDefault()
    },
    [],
  )

  // 키보드로 이미지 조작을 위한 핸들러
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLCanvasElement>) => {
      if (e.key === '=' || e.key === '+') {
        setScale((prev) => Math.min(10, prev + 0.1))
      } else if (e.key === '-' || e.key === '_') {
        setScale((prev) => Math.max(0.1, prev - 0.1))
      } else if (e.key === 'ArrowLeft') {
        setRotation((prev) => {
          let newRotation = (prev - 5) % 360
          if (newRotation < 0) newRotation += 360
          return newRotation
        })
      } else if (e.key === 'ArrowRight') {
        setRotation((prev) => (prev + 5) % 360)
      }
    },
    [setScale, setRotation],
  )

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

  return { isDragging, handleMouseDown, handleContextMenu, handleKeyDown }
}

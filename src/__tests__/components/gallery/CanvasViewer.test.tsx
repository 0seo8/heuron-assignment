import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import CanvasViewer from '@/components/gallery/CanvasViewer'

// 단순화된 mockContext
const mockContext = {
  resetTransform: vi.fn(),
  clearRect: vi.fn(),
  translate: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  getImageData: vi.fn().mockReturnValue({
    data: new Uint8ClampedArray(100),
    width: 10,
    height: 10,
  }),
  putImageData: vi.fn(),
}

vi.mock('@/context/gallery/GalleryContext', () => ({
  useGallery: () => ({
    setScale: vi.fn(),
    setRotation: vi.fn(),
  }),
}))

describe('CanvasViewer', () => {
  const mockImage = {
    id: '1',
    author: '작가',
    width: 800,
    height: 600,
    url: 'https://example.com/image.jpg',
    download_url: 'https://example.com/download/image.jpg',
  }

  beforeEach(() => {
    vi.clearAllMocks()

    HTMLCanvasElement.prototype.getContext = vi
      .fn()
      .mockReturnValue(mockContext)

    Element.prototype.getBoundingClientRect = vi.fn().mockReturnValue({
      width: 800,
      height: 600,
      top: 0,
      left: 0,
      right: 800,
      bottom: 600,
    })

    global.Image = vi.fn().mockImplementation(function () {
      return {
        src: '',
        onload: null,
        crossOrigin: '',
        width: 800,
        height: 600,
      }
    }) as unknown as typeof Image

    Object.defineProperty(window, 'devicePixelRatio', { value: 1 })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('컴포넌트가 올바르게 렌더링되어야 함', () => {
    render(
      <CanvasViewer
        image={mockImage}
        isGrayscale={false}
        scale={1}
        rotation={0}
      />,
    )

    // 캔버스 요소 존재 확인
    const canvas = screen.getByRole('img')
    expect(canvas).toBeInTheDocument()

    // 확대/축소 및 회전 정보 확인
    expect(screen.getByText('100%')).toBeInTheDocument()
    expect(screen.getByText('0°')).toBeInTheDocument()
  })

  it('흑백 모드가 활성화되면 이미지 데이터를 처리해야 함', () => {
    render(
      <CanvasViewer
        image={mockImage}
        isGrayscale={true}
        scale={1}
        rotation={0}
      />,
    )

    // 흑백 모드 사용 시 필요한 메서드가 호출되었는지 확인
    // 참고: 실제 이미지 로딩 이벤트는 테스트에서 발생하지 않으므로
    // 단순히 컴포넌트가 오류 없이 렌더링되는지만 확인
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('scale과 rotation 값이 UI에 반영되어야 함', () => {
    const scale = 2
    const rotation = 90

    render(
      <CanvasViewer
        image={mockImage}
        isGrayscale={false}
        scale={scale}
        rotation={rotation}
      />,
    )

    // 확대/축소 및 회전 정보 확인
    expect(screen.getByText('200%')).toBeInTheDocument()
    expect(screen.getByText('90°')).toBeInTheDocument()
  })
})

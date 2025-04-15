import { memo, use, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import CanvasViewer from '@components/gallery/CanvasViewer'
import ImageControls from '@components/gallery/ImageControls'
import ImageInfo from '@components/gallery/ImageInfo'
import { useGallery } from '@context/gallery/GalleryContext'
import { useGalleryApi } from '@services/api/galleryApi'

const ImageDetailContent = memo(({ imageId }: { imageId: string }) => {
  const navigate = useNavigate()
  const {
    isGrayscale,
    setGrayscale,
    scale,
    setScale,
    rotation,
    setRotation,
    resetTransform,
  } = useGallery()
  const { getImageById, detailError } = useGalleryApi()

  const imagePromise = useMemo(() => getImageById(imageId), [imageId])
  const image = use(imagePromise)

  const handleGrayscaleChange = useCallback(
    (checked: boolean) => {
      setGrayscale(checked)
    },
    [setGrayscale],
  )

  const handleScaleChange = useCallback(
    (value: number) => {
      setScale(value)
    },
    [setScale],
  )

  const handleRotationChange = useCallback(
    (value: number) => {
      setRotation(value)
    },
    [setRotation],
  )

  if (!image || detailError) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4">
          {detailError?.message || '이미지를 찾을 수 없습니다.'}
        </div>
        <button
          onClick={() => navigate('/gallery')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          갤러리로 돌아가기
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-2 md:mb-0">이미지 상세 정보</h1>
        <button
          onClick={() => navigate('/gallery')}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded transition-colors"
        >
          갤러리로 돌아가기
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 max-w-full mx-auto w-full">
          <CanvasViewer
            image={image}
            isGrayscale={isGrayscale}
            scale={scale}
            rotation={rotation}
          />
        </div>

        <div className="space-y-6">
          <ImageInfo image={image} />

          <ImageControls
            isGrayscale={isGrayscale}
            setGrayscale={handleGrayscaleChange}
            scale={scale}
            setScale={handleScaleChange}
            rotation={rotation}
            setRotation={handleRotationChange}
            resetTransform={resetTransform}
          />
        </div>
      </div>
    </div>
  )
})

export default memo(ImageDetailContent)

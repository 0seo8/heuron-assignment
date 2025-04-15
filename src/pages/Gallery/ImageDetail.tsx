import { Suspense } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import ImageDetailContent from '@components/gallery/ImageDetailContent.tsx'
import ImageDetailSkeleton from '@components/gallery/ImageDetailSkeleton.tsx'

const ImageDetail = () => {
  const { imageId } = useParams<{ imageId: string }>()
  const navigate = useNavigate()

  if (!imageId) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4">
          이미지 ID가 제공되지 않았습니다.
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
    <Suspense fallback={<ImageDetailSkeleton />}>
      <ImageDetailContent imageId={imageId} />
    </Suspense>
  )
}

export default ImageDetail

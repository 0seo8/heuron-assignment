import { use } from 'react'
import { useNavigate } from 'react-router-dom'

import { useGalleryApi } from '@/services/api/galleryApi'

export default function ImageTable() {
  const navigate = useNavigate()
  const { getImageList, listError } = useGalleryApi()

  const imageListPromise = getImageList()
  const imageList = use(imageListPromise)

  const handleRowClick = (imageId: string) => {
    navigate(`${imageId}`)
  }

  if (listError || !imageList) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
        {listError?.message || '이미지 목록을 불러오지 못했습니다.'}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium uppercase tracking-wider text-gray-500 w-24 sm:w-32">
              이미지
            </th>
            <th className="px-4 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium uppercase tracking-wider text-gray-500">
              작가
            </th>
            <th className="px-4 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium uppercase tracking-wider text-gray-500 hidden sm:table-cell">
              크기
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white text-center">
          {imageList?.length ? (
            imageList.map((image) => (
              <tr
                key={image.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleRowClick(image.id)}
              >
                <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <img
                    src={image.download_url}
                    alt={`Photo by ${image.author}`}
                    className="h-12 w-20 sm:h-16 sm:w-24 rounded object-cover mx-auto"
                    loading="lazy"
                  />
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <div className="text-xs sm:text-sm font-medium text-gray-900">
                    {image.author}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 sm:hidden">
                    {image.width} x {image.height}
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden sm:table-cell">
                  <div className="text-sm text-gray-500">
                    {image.width} x {image.height}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={3}
                className="px-4 sm:px-6 py-6 sm:py-8 text-center text-gray-500"
              >
                이미지 목록이 비어있습니다
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

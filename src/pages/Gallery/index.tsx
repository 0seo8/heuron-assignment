import { Suspense } from 'react'

import ImageTable from '@components/gallery/ImageTable.tsx'
import TableSkeleton from '@components/gallery/TableSkeleton.tsx'

const Gallery = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">이미지 갤러리</h1>
      <Suspense fallback={<TableSkeleton />}>
        <ImageTable />
      </Suspense>
    </div>
  )
}

export default Gallery

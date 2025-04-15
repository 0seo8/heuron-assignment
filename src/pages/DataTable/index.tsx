import { Suspense } from 'react'

import SearchTable from '@/components/dataTable/SearchTable'
import TableSkeleton from '@/components/dataTable/TableSkeleton'
import { Column } from '@/types'

const columns: Column[] = [
  { key: 'title', header: '제목' },
  { key: 'source', header: '출처' },
  { key: 'publishedAt', header: '날짜' },
]

const DataTable = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2">테슬라 뉴스 검색</h1>
      <p className="text-gray-600 mb-6">
        테슬라 관련 뉴스를 검색하고 필터링할 수 있습니다. 검색 필드에 키워드를
        입력하면 실시간으로 검색 결과가 필터링됩니다.
      </p>

      <Suspense fallback={<TableSkeleton columns={columns} />}>
        <SearchTable columns={columns} />
      </Suspense>
    </div>
  )
}

export default DataTable

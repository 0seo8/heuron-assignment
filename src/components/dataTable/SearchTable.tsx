import { memo, useMemo } from 'react'
import { useEffect } from 'react'

import HighlightedText from '@components/dataTable/HighlightedText'
import SearchField from '@components/dataTable/SearchField'

import { useDataTable } from '@/hooks/useDataTable'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { SearchTableProps } from '@/types'

const SearchTable = memo(function SearchTable({ columns }: SearchTableProps) {
  const {
    data,
    isLoading,
    error,
    totalResults,
    filters,
    handleFilterChange,
    rateLimited,
    hasMore,
    isFetchingMore,
    loadMoreData,
    refetchData,
  } = useDataTable()

  const [loaderRef, isVisible] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0,
    rootMargin: '200px',
  })

  useEffect(() => {
    if (isVisible && hasMore && !isLoading && !isFetchingMore) {
      loadMoreData()
    }
  }, [isVisible, hasMore, isLoading, isFetchingMore, loadMoreData])

  const displayedItemsCount = useMemo(() => data.length, [data])

  const renderSearchFields = useMemo(() => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {columns.map(({ key, header }) => (
          <SearchField
            key={key}
            label={header}
            value={filters[key as keyof typeof filters] || ''}
            onChange={(value) =>
              handleFilterChange(key as keyof typeof filters, value)
            }
          />
        ))}
      </div>
    )
  }, [columns, filters, handleFilterChange])

  const renderError = useMemo(() => {
    if (!error) return null
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
        <p className="font-semibold">오류 발생</p>
        <p>
          {error.message || '데이터를 불러오지 못했습니다. 다시 시도해주세요.'}
        </p>
        <button
          onClick={() => refetchData()}
          className="mt-2 bg-red-100 hover:bg-red-200 transition-colors text-red-700 px-3 py-1 rounded text-sm"
          aria-label="데이터 다시 불러오기"
        >
          다시 시도
        </button>
      </div>
    )
  }, [error, refetchData])

  const renderRateLimited = useMemo(() => {
    if (!rateLimited) return null
    return (
      <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded relative mt-4">
        <p className="font-semibold">API 호출 제한</p>
        <p>너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.</p>
        <button
          onClick={() => refetchData()}
          className="mt-2 bg-amber-100 hover:bg-amber-200 transition-colors text-amber-700 px-3 py-1 rounded text-sm"
          aria-label="데이터 다시 불러오기"
        >
          다시 시도
        </button>
      </div>
    )
  }, [rateLimited, refetchData])

  const renderTableRows = useMemo(() => {
    if (data.length === 0 && !isLoading) {
      return (
        <tr>
          <td
            colSpan={columns.length}
            className="px-3 sm:px-6 py-6 sm:py-8 text-center text-gray-500"
          >
            검색 결과가 없습니다.
          </td>
        </tr>
      )
    }

    return data.map((item, index) => {
      return (
        <tr
          key={item.id || index}
          className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <td className="px-3 sm:px-6 py-3 sm:py-4">
            <div className="flex flex-col gap-1 sm:gap-2">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm sm:text-base text-blue-600 hover:underline font-medium"
              >
                <HighlightedText text={item.title} highlight={filters.title} />
              </a>
              {item.description && (
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>
          </td>
          <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
            <HighlightedText text={item.source} highlight={filters.source} />
          </td>
          <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
            <HighlightedText
              text={item.publishedAt}
              highlight={filters.publishedAt}
              isDate={true}
            />
          </td>
        </tr>
      )
    })
  }, [data, isLoading, columns, filters])

  const renderLoadingState = useMemo(() => {
    if (!isLoading && !isFetchingMore) return null

    return (
      <div className="flex justify-center items-center py-2 sm:py-4">
        <div className="animate-spin h-5 w-5 sm:h-6 sm:w-6 border-2 sm:border-4 border-blue-500 rounded-full border-t-transparent"></div>
        <span className="ml-2 text-sm sm:text-base">
          {isFetchingMore ? '더 불러오는 중...' : '로딩 중...'}
        </span>
      </div>
    )
  }, [isLoading, isFetchingMore])

  if (!data && !isLoading && error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
        <p className="font-semibold">오류 발생</p>
        <p>데이터를 불러오지 못했습니다. 인터넷 연결을 확인해주세요.</p>
        <button
          onClick={() => refetchData()}
          className="mt-2 bg-red-100 hover:bg-red-200 transition-colors text-red-700 px-3 py-1 rounded text-sm"
          aria-label="데이터 다시 불러오기"
        >
          다시 시도
        </button>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      {renderSearchFields}

      <div className="text-gray-600 px-1" aria-live="polite">
        총 {totalResults?.toLocaleString() || 0}개 중 {displayedItemsCount}개
        표시
      </div>

      {renderError}
      {renderRateLimited}

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(({ key, header }) => (
                <th
                  key={key}
                  scope="col"
                  className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider text-gray-700"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {isLoading && data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-3 sm:px-6 py-4 sm:py-8 text-center text-gray-500"
                >
                  {renderLoadingState}
                </td>
              </tr>
            ) : (
              renderTableRows
            )}
          </tbody>
        </table>
      </div>

      <div
        ref={loaderRef}
        className="h-20 flex justify-center items-center py-4 my-4 w-full"
        aria-live="polite"
      >
        {isFetchingMore
          ? renderLoadingState
          : hasMore &&
            !rateLimited && (
              <div className="text-gray-500">스크롤하여 더 불러오기</div>
            )}
      </div>
    </div>
  )
})

export default SearchTable

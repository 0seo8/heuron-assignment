import { useState, useCallback, useRef, useEffect } from 'react'

import { useNewsApi } from '@/services/api/newsApi'
import {
  ApiResponse,
  DataItem,
  DataTableHookResult,
  SearchFilters,
} from '@/types/dataTable'

/**
 * 데이터 테이블을 위한 데이터 로딩 및 필터링 기능을 제공하는 커스텀 훅
 * @returns 데이터 테이블에 필요한 상태 및 기능 모음
 */
export const useDataTable = (): DataTableHookResult => {
  const { fetchDataItems, refetchDataItems, error } = useNewsApi()
  const [allData, setAllData] = useState<DataItem[]>([])
  const [filteredData, setFilteredData] = useState<DataItem[]>([])
  const [totalResults, setTotalResults] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isFilterChanging, setIsFilterChanging] = useState(false)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<SearchFilters>({
    title: '',
    source: '',
    publishedAt: '',
  })
  const isInitialDataLoaded = useRef(false)
  const requestInProgressRef = useRef(false)

  useEffect(() => {
    if (isInitialDataLoaded.current || requestInProgressRef.current) return

    const loadInitialData = async () => {
      requestInProgressRef.current = true
      setIsLoading(true)
      try {
        const initialData = await fetchDataItems({
          page: 1,
          filters: { title: '', source: '', publishedAt: '' },
        })
        setAllData(initialData.data)
        setFilteredData(initialData.data)
        setTotalResults(initialData.total)
        setHasMore(initialData.hasMore)
        isInitialDataLoaded.current = true
      } catch (err) {
        console.error('초기 데이터 로드 오류:', err)
      } finally {
        setIsLoading(false)
        requestInProgressRef.current = false
      }
    }
    loadInitialData()
  }, [fetchDataItems])

  useEffect(() => {
    if (!isInitialDataLoaded.current || allData.length === 0) return
    setIsFilterChanging(true)
    const applyFilters = () => {
      let results = [...allData]
      if (filters.title) {
        const titleLower = filters.title.toLowerCase()
        results = results.filter((item) =>
          item.title && typeof item.title === 'string'
            ? item.title.toLowerCase().includes(titleLower)
            : false,
        )
      }
      if (filters.source) {
        const sourceLower = filters.source.toLowerCase()
        results = results.filter((item) =>
          item.source && typeof item.source === 'string'
            ? item.source.toLowerCase().includes(sourceLower)
            : false,
        )
      }
      if (filters.publishedAt) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/
        if (dateRegex.test(filters.publishedAt)) {
          results = results.filter((item) =>
            item.publishedAt && typeof item.publishedAt === 'string'
              ? item.publishedAt.startsWith(filters.publishedAt)
              : false,
          )
        } else {
          const dateLower = filters.publishedAt.toLowerCase()
          results = results.filter((item) =>
            item.publishedAt && typeof item.publishedAt === 'string'
              ? item.publishedAt.toLowerCase().includes(dateLower)
              : false,
          )
        }
      }
      return results
    }
    const filtered = applyFilters()
    setFilteredData(filtered)
    setTotalResults(filtered.length)
    setHasMore(false)
    setCurrentPage(1)
    setIsFilterChanging(false)
  }, [filters, allData])

  const loadMoreData = useCallback(async () => {
    if (
      isFetchingMore ||
      !hasMore ||
      isFilterChanging ||
      isLoading ||
      requestInProgressRef.current
    )
      return
    try {
      requestInProgressRef.current = true
      setIsFetchingMore(true)
      const nextPage = currentPage + 1
      const result = await fetchDataItems({
        page: nextPage,
        filters: { title: '', source: '', publishedAt: '' },
      })
      const newAllData = [...allData, ...result.data]
      setAllData(newAllData)
      let filteredResults = newAllData
      if (filters.title || filters.source || filters.publishedAt) {
        if (filters.title) {
          const titleLower = filters.title.toLowerCase()
          filteredResults = filteredResults.filter((item) =>
            item.title && typeof item.title === 'string'
              ? item.title.toLowerCase().includes(titleLower)
              : false,
          )
        }
        if (filters.source) {
          const sourceLower = filters.source.toLowerCase()
          filteredResults = filteredResults.filter((item) =>
            item.source && typeof item.source === 'string'
              ? item.source.toLowerCase().includes(sourceLower)
              : false,
          )
        }
        if (filters.publishedAt) {
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/
          if (dateRegex.test(filters.publishedAt)) {
            filteredResults = filteredResults.filter((item) =>
              item.publishedAt && typeof item.publishedAt === 'string'
                ? item.publishedAt.startsWith(filters.publishedAt)
                : false,
            )
          } else {
            const dateLower = filters.publishedAt.toLowerCase()
            filteredResults = filteredResults.filter((item) =>
              item.publishedAt && typeof item.publishedAt === 'string'
                ? item.publishedAt.toLowerCase().includes(dateLower)
                : false,
            )
          }
        }
      }
      setFilteredData(filteredResults)
      setTotalResults(filteredResults.length)
      setHasMore(result.hasMore)
      setCurrentPage(nextPage)
    } catch (err) {
      console.error('추가 데이터 로드 오류:', err)
    } finally {
      setIsFetchingMore(false)
      requestInProgressRef.current = false
    }
  }, [
    currentPage,
    fetchDataItems,
    filters,
    hasMore,
    isFetchingMore,
    isFilterChanging,
    isLoading,
    allData,
  ])

  const handleFilterChange = useCallback(
    (column: keyof SearchFilters, value: string) => {
      setFilters((prev) => ({ ...prev, [column]: value }))
    },
    [],
  )

  const refetchData = useCallback(async (): Promise<ApiResponse<DataItem>> => {
    if (requestInProgressRef.current) {
      throw new Error('이미 요청이 진행 중입니다')
    }
    requestInProgressRef.current = true
    setIsLoading(true)
    try {
      const result = await refetchDataItems({
        page: 1,
        filters: { title: '', source: '', publishedAt: '' },
      })
      setAllData(result.data)
      let filteredResults = result.data
      if (filters.title || filters.source || filters.publishedAt) {
        if (filters.title) {
          const titleLower = filters.title.toLowerCase()
          filteredResults = filteredResults.filter((item) =>
            item.title && typeof item.title === 'string'
              ? item.title.toLowerCase().includes(titleLower)
              : false,
          )
        }
        if (filters.source) {
          const sourceLower = filters.source.toLowerCase()
          filteredResults = filteredResults.filter((item) =>
            item.source && typeof item.source === 'string'
              ? item.source.toLowerCase().includes(sourceLower)
              : false,
          )
        }
        if (filters.publishedAt) {
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/
          if (dateRegex.test(filters.publishedAt)) {
            filteredResults = filteredResults.filter((item) =>
              item.publishedAt && typeof item.publishedAt === 'string'
                ? item.publishedAt.startsWith(filters.publishedAt)
                : false,
            )
          } else {
            const dateLower = filters.publishedAt.toLowerCase()
            filteredResults = filteredResults.filter((item) =>
              item.publishedAt && typeof item.publishedAt === 'string'
                ? item.publishedAt.toLowerCase().includes(dateLower)
                : false,
            )
          }
        }
      }
      setFilteredData(filteredResults)
      setTotalResults(filteredResults.length)
      setHasMore(result.hasMore)
      setCurrentPage(1)
      return result
    } finally {
      setIsLoading(false)
      requestInProgressRef.current = false
    }
  }, [filters, refetchDataItems])

  const isRateLimited =
    error?.message?.includes('429') ||
    error?.message?.includes('rate limit') ||
    false

  return {
    data: filteredData,
    isLoading: isLoading || isFilterChanging,
    error,
    totalResults,
    filters,
    handleFilterChange,
    rateLimited: isRateLimited,
    hasMore,
    isFetchingMore,
    loadMoreData,
    refetchData,
  }
}

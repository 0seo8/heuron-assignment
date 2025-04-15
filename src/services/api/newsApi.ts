import { useCallback } from 'react'

import { useSuspenseApi } from '@/hooks/useSuspenseApi'
import { ApiResponse, DataItem, SearchFilters } from '@/types/dataTable'

const API_KEY = '88689a3cf87845fcb4664089d14b8274'
const BASE_URL = '/api/news'

export interface NewsApiParams {
  q?: string
  pageSize?: number
  page?: number
  sources?: string
  from?: string
  to?: string
  sortBy?: 'relevancy' | 'popularity' | 'publishedAt'
}

export interface NewsApiResponse {
  status: string
  totalResults: number
  articles: Article[]
}

export interface Article {
  source: {
    id: string | null
    name: string
  }
  author: string
  title: string
  description: string
  url: string
  urlToImage: string
  publishedAt: string
  content: string
}

export interface NewsApiHookParams {
  page?: number
  limit?: number
  filters?: Partial<SearchFilters>
}

const mapArticleToDataItem = (article: Article, index: number): DataItem => ({
  id: `${index}-${article.title}`,
  title: article.title,
  source: article.source.name,
  publishedAt: new Date(article.publishedAt).toLocaleDateString('ko-KR'),
  urlToImage: article.urlToImage,
  description: article.description,
  url: article.url,
})

const constructSearchQuery = (filters: SearchFilters): NewsApiParams => {
  const params: NewsApiParams = {
    q: 'tesla',
    sortBy: 'publishedAt',
  }

  if (filters.title) {
    params.q += ` AND ${filters.title}`
  }

  if (filters.source) {
    params.sources = filters.source
  }

  if (filters.publishedAt) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(filters.publishedAt)) {
      params.from = filters.publishedAt
      params.to = filters.publishedAt
    } else {
      params.q += ` AND ${filters.publishedAt}`
    }
  }

  return params
}

export const useNewsApi = () => {
  const newsApi = useSuspenseApi<NewsApiResponse>({ baseUrl: BASE_URL })

  const fetchNews = useCallback(
    (params: NewsApiParams) => {
      const { q, pageSize = 10, page = 1, sources, from, to, sortBy } = params

      const queryParams = new URLSearchParams()
      queryParams.append('apiKey', API_KEY)
      if (q) queryParams.append('q', q)
      if (sources) queryParams.append('sources', sources)
      if (from) queryParams.append('from', from)
      if (to) queryParams.append('to', to)
      if (sortBy) queryParams.append('sortBy', sortBy)
      queryParams.append('pageSize', String(pageSize))
      queryParams.append('page', String(page))

      const cacheKey = `everything:${q || 'all'}:${sources || 'all'}:${from || 'all'}:${to || 'all'}:${sortBy || 'all'}:${page}:${pageSize}`

      return newsApi.request(`/everything?${queryParams.toString()}`, cacheKey)
    },
    [newsApi],
  )

  const fetchDataItems = useCallback(
    async ({
      page = 1,
      limit = 10,
      filters = { title: '', source: '', publishedAt: '' },
    }: NewsApiHookParams): Promise<ApiResponse<DataItem>> => {
      const params = constructSearchQuery(filters as SearchFilters)
      const response = await fetchNews({
        ...params,
        pageSize: limit,
        page,
      })

      const newItems = response.articles.map((article, idx) =>
        mapArticleToDataItem(article, idx + (page - 1) * limit),
      )

      const hasMoreData =
        response.articles.length > 0 &&
        response.articles.length + (page - 1) * limit < response.totalResults

      return {
        data: newItems,
        total: response.totalResults,
        page,
        limit,
        hasMore: hasMoreData,
      }
    },
    [fetchNews],
  )

  const refetchDataItems = useCallback(
    (params: NewsApiHookParams) => fetchDataItems(params),
    [fetchDataItems],
  )

  return {
    fetchDataItems,
    refetchDataItems,
    error: newsApi.error,
    currentPage: 1,
    hasMore: true,
    data: [] as DataItem[],
  }
}

export const useDataTableApi = useNewsApi

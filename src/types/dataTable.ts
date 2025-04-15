import { Article } from '@/services/api/newsApi'

export interface DataItem
  extends Pick<Article, 'url' | 'urlToImage' | 'description'> {
  id: string
  title: string
  source: string
  publishedAt: string
}

export interface SearchFilters {
  title: string
  source: string
  publishedAt: string
}

export interface Column {
  key: string
  header: string
}

export interface HighlightedTextProps {
  text: string
  highlight: string
}

export interface DataTableHookResult {
  data: DataItem[]
  isLoading: boolean
  error: Error | null
  totalResults: number
  filters: SearchFilters
  handleFilterChange: (column: keyof SearchFilters, value: string) => void
  rateLimited?: boolean
  hasMore: boolean
  isFetchingMore: boolean
  loadMoreData: () => void
  refetchData: () => Promise<ApiResponse<DataItem>>
}

export interface SearchTableProps {
  columns: Column[]
}

export interface ApiResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

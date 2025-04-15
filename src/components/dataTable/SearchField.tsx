import { useState, useEffect } from 'react'

import { useDebounce } from '@/hooks/useDebounce'

const SearchField = ({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) => {
  const [inputValue, setInputValue] = useState(value)
  const debouncedValue = useDebounce(inputValue, 300)

  const displayLabel =
    label && typeof label === 'string'
      ? label.charAt(0).toUpperCase() + label.slice(1)
      : '검색'

  useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue)
    }
  }, [debouncedValue, onChange, value])

  const handleClear = () => {
    setInputValue('')
  }

  return (
    <div className="mb-2 sm:mb-4 w-full sm:w-auto flex-grow sm:flex-grow-0 sm:min-w-[200px]">
      <label
        htmlFor={`search-${label}`}
        className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
      >
        {displayLabel} 검색
      </label>
      <div className="relative">
        <input
          id={`search-${label}`}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full pl-8 sm:pl-9 pr-8 sm:pr-10 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder={`${displayLabel} 검색...`}
          aria-label={`${displayLabel} 검색 입력`}
        />
        <svg
          className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center"
            aria-label={`${displayLabel} 검색어 지우기`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-full w-full"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default SearchField

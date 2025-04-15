/**
 * 날짜 비교 유틸리티 함수
 * "2025. 04. 14." 형식(한국어 날짜 형식)과 "2025.04"와 같은 검색어를 비교
 *
 * @param itemDate 아이템의 날짜 문자열 (예: "2025. 04. 14.")
 * @param searchDate 검색어 (예: "2025.04", "2025-04", "2025.04.")
 * @returns 검색어가 아이템 날짜의 시작 부분과 일치하는지 여부
 */
export const isDateMatching = (
  itemDate: string,
  searchDate: string,
): boolean => {
  if (!itemDate || !searchDate) return false

  const cleanItemDate = itemDate.replace(/[\s.]/g, '')

  const cleanSearchDate = searchDate.replace(/[\s.]/g, '')

  return cleanItemDate.startsWith(cleanSearchDate)
}

/**
 * ISO 날짜 문자열을 한국어 로컬 형식(YYYY. MM. DD.)으로 변환
 *
 * @param isoDateString ISO 형식 날짜 문자열 (예: "2025-04-14T12:00:00Z")
 * @returns 한국어 로컬 형식 날짜 문자열 (예: "2025. 04. 14.")
 */
export const formatDateToKorean = (isoDateString: string): string => {
  return new Date(isoDateString).toLocaleDateString('ko-KR')
}

/**
 * 날짜 검색어를 정규식 패턴으로 변환하는 함수
 *
 * @param searchText 날짜 검색어 (예: "2025.04", "2025-04")
 * @returns 정규식 패턴 문자열
 */
export const dateSearchToRegexPattern = (searchText: string): string => {
  if (!searchText) return ''

  if (searchText.includes('.')) {
    const pattern = searchText.replace(/\./g, '\\.\\s*').replace(/\s+/g, '\\s*')

    return pattern
  }

  const digitsOnly = searchText.replace(/[^\d]/g, '')

  let year = '',
    month = '',
    day = ''

  if (digitsOnly.length >= 4) {
    year = digitsOnly.substring(0, 4)
  }

  if (digitsOnly.length >= 6) {
    month = digitsOnly.substring(4, 6)
  } else if (digitsOnly.length > 4) {
    month = digitsOnly.substring(4)
  }

  if (digitsOnly.length > 6) {
    day = digitsOnly.substring(6)
  }

  let pattern = ''

  if (year) {
    pattern += year

    if (month) {
      pattern += '[\\s.\\-]*'
    }
  }

  if (month) {
    if (month.length === 1) {
      pattern += `0?${month}`
    } else {
      pattern += month
    }

    if (day) {
      pattern += '[\\s.\\-]*'
    }
  }

  if (day) {
    if (day.length === 1) {
      pattern += `0?${day}`
    } else {
      pattern += day
    }
  }

  return pattern
}

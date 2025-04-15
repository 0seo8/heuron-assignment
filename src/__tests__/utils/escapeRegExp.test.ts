import { describe, it, expect } from 'vitest'
import { escapeRegExp } from '../../utils/escapeRegExp'

describe('escapeRegExp', () => {
  it('일반 문자열은 변경되지 않아야 함', () => {
    expect(escapeRegExp('hello world')).toBe('hello world')
  })

  it('정규식 특수 문자를 이스케이프 처리해야 함', () => {
    const specialChars = '.*+?^${}()|[]\\'
    const expected = '\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\'
    expect(escapeRegExp(specialChars)).toBe(expected)
  })

  it('빈 문자열은 빈 문자열을 반환해야 함', () => {
    expect(escapeRegExp('')).toBe('')
  })

  it('이미 이스케이프된 문자에 대해서도 추가 이스케이프를 수행해야 함', () => {
    expect(escapeRegExp('\\d+')).toBe('\\\\d\\+')
  })
})

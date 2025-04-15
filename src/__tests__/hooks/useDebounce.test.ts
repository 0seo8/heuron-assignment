import { useDebounce } from '@hooks/useDebounce.ts'
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('초기값이 즉시 반환되어야 함', () => {
    const { result } = renderHook(() => useDebounce('초기값', 500))
    expect(result.current).toBe('초기값')
  })

  it('지연 시간 전에는 이전 값을 유지해야 함', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      {
        initialProps: { value: '초기값' },
      },
    )

    rerender({ value: '변경된 값' })
    expect(result.current).toBe('초기값')

    // 지연 시간의 절반만 진행
    act(() => {
      vi.advanceTimersByTime(250)
    })
    expect(result.current).toBe('초기값')
  })

  it('지연 시간 후에는 새로운 값으로 업데이트되어야 함', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      {
        initialProps: { value: '초기값' },
      },
    )

    rerender({ value: '변경된 값' })

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toBe('변경된 값')
  })

  it('여러 번 변경 시 마지막 값만 적용되어야 함', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      {
        initialProps: { value: '초기값' },
      },
    )

    rerender({ value: '첫 번째 변경' })

    act(() => {
      vi.advanceTimersByTime(250)
    })

    rerender({ value: '두 번째 변경' })

    act(() => {
      vi.advanceTimersByTime(250)
    })

    // 첫 번째 타이머는 만료되었지만, 두 번째 타이머는 아직 500ms가 지나지 않음
    expect(result.current).toBe('초기값')

    act(() => {
      vi.advanceTimersByTime(250)
    })

    // 두 번째 타이머가 만료되어 마지막 값으로 업데이트
    expect(result.current).toBe('두 번째 변경')
  })
})

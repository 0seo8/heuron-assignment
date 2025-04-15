import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import LoadingFallback from '@/components/common/LoadingFallback'

describe('LoadingFallback', () => {
  it('기본 로딩 메시지로 렌더링되어야 함', () => {
    render(<LoadingFallback />)

    // 기본 로딩 메시지 확인
    expect(screen.getByText('로딩 중...')).toBeInTheDocument()
    expect(screen.getByText('잠시만 기다려 주세요')).toBeInTheDocument()

    // 로딩 스피너가 존재하는지 확인
    const spinner = document.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  it('커스텀 메시지로 렌더링되어야 함', () => {
    const customMessage = '데이터를 불러오는 중입니다'
    render(<LoadingFallback message={customMessage} />)

    // 커스텀 메시지 확인
    expect(screen.getByText(customMessage)).toBeInTheDocument()
    expect(screen.getByText('잠시만 기다려 주세요')).toBeInTheDocument()
  })
})

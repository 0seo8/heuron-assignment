import type { ReactNode } from 'react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation()
  const currentYear = new Date().getFullYear()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link to="/" className="text-xl font-bold text-slate-800">
              휴런 과제
            </Link>

            {/* 모바일 메뉴 토글 버튼 */}
            <button
              className="md:hidden flex items-center"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6 text-slate-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    mobileMenuOpen
                      ? 'M6 18L18 6M6 6l12 12'
                      : 'M4 6h16M4 12h16M4 18h16'
                  }
                />
              </svg>
            </button>

            {/* 데스크탑 메뉴 */}
            <ul className="hidden md:flex space-x-6">
              <li>
                <Link
                  to="/"
                  className={`${isActive('/') ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  홈
                </Link>
              </li>
              <li>
                <Link
                  to="/gallery"
                  className={`${isActive('/gallery') ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  이미지 갤러리
                </Link>
              </li>
              <li>
                <Link
                  to="/card-game"
                  className={`${isActive('/card-game') ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  카드 게임
                </Link>
              </li>
              <li>
                <Link
                  to="/data-table"
                  className={`${isActive('/data-table') ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  검색 테이블
                </Link>
              </li>
            </ul>
          </nav>

          {/* 모바일 메뉴 (토글) */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t">
              <ul className="flex flex-col space-y-4">
                <li>
                  <Link
                    to="/"
                    className={`block py-1 ${isActive('/') ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    홈
                  </Link>
                </li>
                <li>
                  <Link
                    to="/gallery"
                    className={`block py-1 ${isActive('/gallery') ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    이미지 갤러리
                  </Link>
                </li>
                <li>
                  <Link
                    to="/card-game"
                    className={`block py-1 ${isActive('/card-game') ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    카드 게임
                  </Link>
                </li>
                <li>
                  <Link
                    to="/data-table"
                    className={`block py-1 ${isActive('/data-table') ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    검색 테이블
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow bg-slate-50">{children}</main>

      <footer className="bg-white border-t">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-slate-500 text-sm">
            &copy; {currentYear} 휴런 프론트엔드 과제
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Layout

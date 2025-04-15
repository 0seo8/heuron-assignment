import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import ErrorBoundary from '@components/common/ErrorBoundary'
import Layout from '@components/common/Layout'
import LoadingFallback from '@components/common/LoadingFallback'
import { ToastProvider, ToastContainer } from '@components/ui/Toast'

import { GalleryProvider } from '@/context/gallery/GalleryContext'

const Home = lazy(() => import('@pages/Home'))

const GalleryBundle = lazy(() => import('@pages/Gallery/GalleryBundle'))

const CardGame = lazy(() => import('@pages/CardGame'))

const DataTable = lazy(() => import('@pages/DataTable'))

function App() {
  return (
    <ToastProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route
                path="/"
                element={
                  <Suspense
                    fallback={<LoadingFallback message="홈 로딩 중..." />}
                  >
                    <Home />
                  </Suspense>
                }
              />

              {/* 이미지 갤러리 경로 - 번들로 통합 */}
              <Route
                path="/gallery/*"
                element={
                  <GalleryProvider>
                    <Suspense
                      fallback={<LoadingFallback message="갤러리 로딩 중..." />}
                    >
                      <GalleryBundle />
                    </Suspense>
                  </GalleryProvider>
                }
              />

              <Route
                path="/card-game"
                element={
                  <Suspense
                    fallback={
                      <LoadingFallback message="카드 게임 로딩 중..." />
                    }
                  >
                    <CardGame />
                  </Suspense>
                }
              />

              <Route
                path="/data-table"
                element={
                  <Suspense
                    fallback={<LoadingFallback message="테이블 로딩 중..." />}
                  >
                    <DataTable />
                  </Suspense>
                }
              />
            </Routes>
          </Layout>
          <ToastContainer position="bottom-center" />
        </BrowserRouter>
      </ErrorBoundary>
    </ToastProvider>
  )
}

export default App

import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import ErrorBoundary from '@components/common/ErrorBoundary'
import Layout from '@components/common/Layout'
import LoadingFallback from '@components/common/LoadingFallback'
import { ToastProvider, ToastContainer } from '@components/ui/Toast'

import { GalleryProvider } from '@/context/gallery/GalleryContext'

const Home = lazy(() => import('@pages/Home'))
const Gallery = lazy(() => import('@pages/Gallery'))
const ImageDetail = lazy(() => import('@/pages/Gallery/ImageDetail'))
const CardGame = lazy(() => import('@pages/CardGame'))
const DataTable = lazy(() => import('@pages/DataTable'))

function App() {
  return (
    <ToastProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <Layout>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/gallery/*"
                  element={
                    <GalleryProvider>
                      <Routes>
                        <Route index element={<Gallery />} />
                        <Route path=":imageId" element={<ImageDetail />} />
                      </Routes>
                    </GalleryProvider>
                  }
                />
                <Route path="/card-game" element={<CardGame />} />
                <Route path="/data-table" element={<DataTable />} />
              </Routes>
            </Suspense>
          </Layout>
          <ToastContainer position="bottom-center" />
        </BrowserRouter>
      </ErrorBoundary>
    </ToastProvider>
  )
}

export default App

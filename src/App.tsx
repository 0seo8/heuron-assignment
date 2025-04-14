import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Layout from '@components/common/Layout'
import { ToastProvider, ToastContainer } from '@components/ui/Toast'
import CardGame from '@pages/CardGame'
import DataTable from '@pages/DataTable'
import Gallery from '@pages/Gallery'
import Home from '@pages/Home'

import { GalleryProvider } from '@/context/gallery/GalleryContext'
import ImageDetail from '@/pages/Gallery/ImageDetail'

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Layout>
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
        </Layout>
        <ToastContainer position="bottom-center" />
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App

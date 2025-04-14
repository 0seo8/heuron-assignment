import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Layout from '@components/common/Layout'
import CardGame from '@pages/CardGame'
import DataTable from '@pages/DataTable'
import Gallery from '@pages/Gallery'
import Home from '@pages/Home'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/card-game" element={<CardGame />} />
          <Route path="/data-table" element={<DataTable />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App

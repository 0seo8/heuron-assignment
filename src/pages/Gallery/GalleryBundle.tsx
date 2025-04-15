import { Routes, Route } from 'react-router-dom'

import ImageDetail from './ImageDetail'

import Gallery from './index'

/**
 * 갤러리 관련 컴포넌트들을 하나의 번들로 묶는 컴포넌트
 * Canvas API를 사용하는 이미지 디테일 페이지의 지연을 최소화하기 위해
 * 갤러리와 이미지 디테일을 함께 로드합니다.
 */
export default function GalleryBundle() {
  return (
    <Routes>
      <Route index element={<Gallery />} />
      <Route path=":imageId" element={<ImageDetail />} />
    </Routes>
  )
}

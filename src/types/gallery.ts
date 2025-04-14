export interface PicsumImage {
  id: string
  author: string
  width: number
  height: number
  url: string
  download_url: string
}

export interface ImageViewerState {
  selectedImage: PicsumImage | null
  isGrayscale: boolean
  scale: number
  rotation: number
  isModalOpen: boolean
}

export type ImageViewerAction =
  | { type: 'SELECT_IMAGE'; payload: PicsumImage }
  | { type: 'TOGGLE_GRAYSCALE' }
  | { type: 'SET_SCALE'; payload: number }
  | { type: 'SET_ROTATION'; payload: number }
  | { type: 'RESET_TRANSFORM' }
  | { type: 'OPEN_MODAL' }
  | { type: 'CLOSE_MODAL' }

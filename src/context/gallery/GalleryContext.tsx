import type {
  ImageViewerState,
  ImageViewerAction,
  PicsumImage,
} from '@/types/gallery'

import { createContext, useContext, useReducer } from 'react'
import type { ReactNode } from 'react'

// 초기 상태
const initialState: ImageViewerState = {
  selectedImage: null,
  isGrayscale: false,
  scale: 1,
  rotation: 0,
  isModalOpen: false,
}

// 리듀서 함수
const imageViewerReducer = (
  state: ImageViewerState,
  action: ImageViewerAction,
): ImageViewerState => {
  switch (action.type) {
    case 'SELECT_IMAGE':
      return {
        ...state,
        selectedImage: action.payload,
        isModalOpen: true,
      }
    case 'TOGGLE_GRAYSCALE':
      return {
        ...state,
        isGrayscale: !state.isGrayscale,
      }
    case 'SET_SCALE':
      return {
        ...state,
        scale: action.payload,
      }
    case 'SET_ROTATION':
      return {
        ...state,
        rotation: action.payload,
      }
    case 'RESET_TRANSFORM':
      return {
        ...state,
        scale: 1,
        rotation: 0,
      }
    case 'OPEN_MODAL':
      return {
        ...state,
        isModalOpen: true,
      }
    case 'CLOSE_MODAL':
      return {
        ...state,
        isModalOpen: false,
      }
    default:
      return state
  }
}

interface GalleryContextType {
  state: ImageViewerState
  selectImage: (image: PicsumImage) => void
  toggleGrayscale: () => void
  setScale: (scale: number) => void
  setRotation: (rotation: number) => void
  resetTransform: () => void
  openModal: () => void
  closeModal: () => void
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined)

export const GalleryProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(imageViewerReducer, initialState)

  const selectImage = (image: PicsumImage) => {
    dispatch({ type: 'SELECT_IMAGE', payload: image })
  }

  const toggleGrayscale = () => {
    dispatch({ type: 'TOGGLE_GRAYSCALE' })
  }

  const setScale = (scale: number) => {
    dispatch({ type: 'SET_SCALE', payload: scale })
  }

  const setRotation = (rotation: number) => {
    dispatch({ type: 'SET_ROTATION', payload: rotation })
  }

  const resetTransform = () => {
    dispatch({ type: 'RESET_TRANSFORM' })
  }

  const openModal = () => {
    dispatch({ type: 'OPEN_MODAL' })
  }

  const closeModal = () => {
    dispatch({ type: 'CLOSE_MODAL' })
  }

  return (
    <GalleryContext.Provider
      value={{
        state,
        selectImage,
        toggleGrayscale,
        setScale,
        setRotation,
        resetTransform,
        openModal,
        closeModal,
      }}
    >
      {children}
    </GalleryContext.Provider>
  )
}

export const useGallery = (): GalleryContextType => {
  const context = useContext(GalleryContext)
  if (context === undefined) {
    throw new Error('useGallery must be used within a GalleryProvider')
  }
  return context
}

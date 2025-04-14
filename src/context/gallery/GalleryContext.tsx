import { createContext, useContext, useReducer, ReactNode } from 'react'

interface GalleryState {
  isGrayscale: boolean
  scale: number
  rotation: number
}

interface GalleryContextType {
  isGrayscale: boolean
  scale: number
  rotation: number
  setGrayscale: (value: boolean) => void
  setScale: React.Dispatch<React.SetStateAction<number>>
  setRotation: React.Dispatch<React.SetStateAction<number>>
  resetTransform: () => void
}

type GalleryAction =
  | { type: 'SET_GRAYSCALE'; payload: boolean }
  | { type: 'SET_SCALE'; payload: number }
  | { type: 'SET_ROTATION'; payload: number }
  | { type: 'RESET_TRANSFORM' }

const initialState: GalleryState = {
  isGrayscale: false,
  scale: 0.5,
  rotation: 0,
}

function galleryReducer(
  state: GalleryState,
  action: GalleryAction,
): GalleryState {
  switch (action.type) {
    case 'SET_GRAYSCALE':
      return { ...state, isGrayscale: action.payload }
    case 'SET_SCALE':
      return { ...state, scale: action.payload }
    case 'SET_ROTATION':
      return { ...state, rotation: action.payload }
    case 'RESET_TRANSFORM':
      return { isGrayscale: false, scale: 0.5, rotation: 0 }
    default:
      return state
  }
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined)

export function GalleryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(galleryReducer, initialState)

  const setGrayscale = (value: boolean) => {
    dispatch({ type: 'SET_GRAYSCALE', payload: value })
  }

  const setScale = (value: React.SetStateAction<number>) => {
    const newScale = typeof value === 'function' ? value(state.scale) : value
    dispatch({ type: 'SET_SCALE', payload: newScale })
  }

  const setRotation = (value: React.SetStateAction<number>) => {
    const newRotation =
      typeof value === 'function' ? value(state.rotation) : value
    dispatch({ type: 'SET_ROTATION', payload: newRotation })
  }

  const resetTransform = () => {
    dispatch({ type: 'RESET_TRANSFORM' })
  }

  const value: GalleryContextType = {
    isGrayscale: state.isGrayscale,
    scale: state.scale,
    rotation: state.rotation,
    setGrayscale,
    setScale,
    setRotation,
    resetTransform,
  }

  return (
    <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>
  )
}

export function useGallery() {
  const context = useContext(GalleryContext)
  if (context === undefined) {
    throw new Error('useGallery must be used within a GalleryProvider')
  }
  return context
}

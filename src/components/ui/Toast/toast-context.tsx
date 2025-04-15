'use client'

import React, { createContext, useContext, useReducer } from 'react'

export type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info'

export interface ToastItem {
  id: string
  type: ToastType
  title?: string
  message: string
  duration?: number
  onClose?: () => void
}

interface ToastContextType {
  toasts: ToastItem[]
  addToast: (toast: Omit<ToastItem, 'id'>) => string
  removeToast: (id: string) => void
  removeAllToasts: () => void
}

type ToastAction =
  | { type: 'ADD_TOAST'; toast: ToastItem }
  | { type: 'REMOVE_TOAST'; id: string }
  | { type: 'REMOVE_ALL_TOASTS' }

const toastReducer = (state: ToastItem[], action: ToastAction): ToastItem[] => {
  switch (action.type) {
    case 'ADD_TOAST':
      return [...state, action.toast]
    case 'REMOVE_TOAST':
      return state.filter((toast) => toast.id !== action.id)
    case 'REMOVE_ALL_TOASTS':
      return []
    default:
      return state
  }
}

const defaultToastContext: ToastContextType = {
  toasts: [],
  addToast: () => '',
  removeToast: () => {},
  removeAllToasts: () => {},
}

export const ToastContext = createContext<ToastContextType>(defaultToastContext)

let toastCounter = 0
const generateId = () => `toast-${toastCounter++}`

interface ToastProviderProps {
  children: React.ReactNode
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, dispatch] = useReducer(toastReducer, [])

  const addToast = (toast: Omit<ToastItem, 'id'>): string => {
    const id = generateId()
    const newToast: ToastItem = { ...toast, id }

    dispatch({ type: 'ADD_TOAST', toast: newToast })

    if (toast.duration !== 0) {
      const duration = toast.duration || 3000 // 기본 3초
      setTimeout(() => {
        removeToast(id)
        toast.onClose?.()
      }, duration)
    }

    return id
  }

  const removeToast = (id: string) => {
    dispatch({ type: 'REMOVE_TOAST', id })
  }

  const removeAllToasts = () => {
    dispatch({ type: 'REMOVE_ALL_TOASTS' })
  }

  const contextValue: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    removeAllToasts,
  }

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }

  return context
}

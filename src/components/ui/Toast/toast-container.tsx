'use client'

import React from 'react'
import { createPortal } from 'react-dom'

import { ToastElement } from './toast'
import { useToast } from './toast-context'

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

interface ToastContainerProps {
  position?: ToastPosition
}

const positionClasses: Record<ToastPosition, string> = {
  'top-left': 'top-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-4 right-4',
}

export const ToastContainer = ({
  position = 'bottom-center',
}: ToastContainerProps) => {
  const { toasts, removeToast } = useToast()

  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  if (!isMounted) return null

  return createPortal(
    <div
      className={`fixed z-50 w-full max-w-xs sm:max-w-sm ${positionClasses[position]}`}
      aria-live="assertive"
    >
      {toasts.map((toast) => (
        <ToastElement key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>,
    document.body,
  )
}

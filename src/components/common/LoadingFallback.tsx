import React from 'react'

interface LoadingFallbackProps {
  message?: string
}

const LoadingFallback: React.FC<LoadingFallbackProps> = ({
  message = '로딩 중...',
}) => {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-white"></div>
          </div>
        </div>
        <p className="mt-4 text-gray-600 text-lg font-medium">{message}</p>
        <p className="text-gray-500 text-sm">잠시만 기다려 주세요</p>
      </div>
    </div>
  )
}

export default LoadingFallback

const ImageDetailSkeleton = () => {
  return (
    <div className="container mx-auto p-4 animate-pulse">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="h-8 w-48 bg-gray-200 rounded mb-2 md:mb-0"></div>
        <div className="h-10 w-36 bg-gray-200 rounded"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div
            className="relative w-full bg-gray-200 rounded-lg shadow-md overflow-hidden"
            style={{ height: '0', paddingBottom: '75%' }}
          >
            <div className="absolute bottom-2 right-2 h-6 w-16 bg-gray-300 rounded"></div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-5 w-full bg-gray-200 rounded"></div>
              <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-5 w-1/2 bg-gray-200 rounded"></div>
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg shadow-sm space-y-4">
            <div className="h-6 w-32 bg-gray-200 rounded"></div>

            <div className="flex items-center justify-between">
              <div className="h-5 w-20 bg-gray-200 rounded"></div>
              <div className="h-6 w-10 bg-gray-300 rounded-full"></div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-5 w-24 bg-gray-200 rounded"></div>
                <div className="h-5 w-12 bg-gray-200 rounded"></div>
              </div>
              <div className="h-2 bg-gray-300 rounded-full"></div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-5 w-16 bg-gray-200 rounded"></div>
                <div className="h-5 w-12 bg-gray-200 rounded"></div>
              </div>
              <div className="h-2 bg-gray-300 rounded-full"></div>
            </div>

            <div className="h-10 w-full bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageDetailSkeleton

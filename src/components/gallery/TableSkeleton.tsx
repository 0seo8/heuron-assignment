export default function TableSkeleton() {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium uppercase tracking-wider text-gray-500 w-24 sm:w-32">
              이미지
            </th>
            <th className="px-4 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium uppercase tracking-wider text-gray-500">
              작가
            </th>
            <th className="px-4 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium uppercase tracking-wider text-gray-500 hidden sm:table-cell">
              크기
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white text-center">
          {Array.from({ length: 5 }).map((_, index) => (
            <tr key={index} className="animate-pulse">
              <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                <div className="h-12 w-20 sm:h-16 sm:w-24 rounded bg-gray-200 mx-auto"></div>
              </td>
              <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                <div className="h-4 sm:h-5 w-20 sm:w-24 rounded bg-gray-200 mx-auto mb-2"></div>
                <div className="h-3 w-16 rounded bg-gray-200 mx-auto sm:hidden"></div>
              </td>
              <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden sm:table-cell">
                <div className="h-5 w-20 rounded bg-gray-200 mx-auto"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

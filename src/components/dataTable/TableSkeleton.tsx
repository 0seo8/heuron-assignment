import { Column } from '@/types'

export default function TableSkeleton({ columns }: { columns: Column[] }) {
  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {columns.map((column) => (
          <div key={column.key} className="animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>

      <div className="animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-40"></div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(({ key, header }) => (
                <th
                  key={key}
                  scope="col"
                  className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider text-gray-700"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index} className="animate-pulse">
                <td className="px-3 sm:px-6 py-4">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </td>
                <td className="px-3 sm:px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </td>
                <td className="px-3 sm:px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

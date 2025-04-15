import type { PicsumImage } from '@/types/gallery'

type ImageInfoProps = {
  image: PicsumImage
}
const ImageInfo = ({ image }: ImageInfoProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4">이미지 정보</h2>
      <div className="space-y-2">
        <p>
          <span className="font-medium">작가:</span> {image.author}
        </p>
        <p>
          <span className="font-medium">원본 크기:</span> {image.width} x{' '}
          {image.height}
        </p>
        <p>
          <span className="font-medium">ID:</span> {image.id}
        </p>
        <p>
          <a
            href={image.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 underline inline-flex items-center"
          >
            원본 이미지 보기
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </p>
      </div>
    </div>
  )
}

export default ImageInfo

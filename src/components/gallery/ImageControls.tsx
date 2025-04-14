type ImageControlsProps = {
  isGrayscale: boolean
  setGrayscale: (value: boolean) => void
  scale: number
  setScale: (value: number) => void
  rotation: number
  setRotation: (value: number) => void
  resetTransform: () => void
}

export default function ImageControls({
  isGrayscale,
  setGrayscale,
  scale,
  setScale,
  rotation,
  setRotation,
  resetTransform,
}: ImageControlsProps) {
  const displayScale = scale * 2

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4">이미지 조작</h2>

      <div className="flex items-center space-x-2 mb-4">
        <input
          type="checkbox"
          checked={isGrayscale}
          onChange={(e) => setGrayscale(e.target.checked)}
          id="grayscale"
          className="w-4 h-4"
        />
        <label htmlFor="grayscale">흑백 모드</label>
      </div>

      <div className="mb-4">
        <label htmlFor="scale" className="block mb-2">
          확대/축소: {displayScale.toFixed(1)}x
        </label>
        <input
          type="range"
          id="scale"
          min="0.5"
          max="3"
          step="0.1"
          value={scale}
          onChange={(e) => setScale(parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1x (원본)</span>
          <span>2x</span>
          <span>6x</span>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="rotation" className="block mb-2">
          회전: {rotation}°
        </label>
        <input
          type="range"
          id="rotation"
          min="0"
          max="360"
          step="15"
          value={rotation}
          onChange={(e) => setRotation(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      <button
        onClick={resetTransform}
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
      >
        초기화
      </button>
    </div>
  )
}

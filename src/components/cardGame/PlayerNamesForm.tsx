import { useState } from 'react'

import { useToast } from '@/components/ui/Toast'
import { useCardGame } from '@/context/cardGame/CardGameContext'

export function PlayerNamesForm() {
  const { state, setPlayerNames } = useCardGame()
  const { addToast } = useToast()
  const [names, setNames] = useState<string[]>(
    Array(state.playerCount).fill(''),
  )

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...names]
    newNames[index] = value
    setNames(newNames)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const uniqueNames = new Set(names.filter((name) => name.trim() !== ''))
    if (
      uniqueNames.size !== names.filter((name) => name.trim() !== '').length
    ) {
      addToast({
        type: 'error',
        title: '이름 중복',
        message: '플레이어 이름은 고유해야 합니다.',
        duration: 3000,
      })
      return
    }

    if (names.some((name) => name.trim() === '')) {
      addToast({
        type: 'warning',
        title: '입력 오류',
        message: '모든 플레이어 이름을 입력해주세요.',
        duration: 3000,
      })
      return
    }

    setPlayerNames(names)
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        플레이어 이름 입력
      </h2>
      <form onSubmit={handleSubmit}>
        {Array.from({ length: state.playerCount }).map((_, index) => (
          <div key={index} className="mb-4">
            <label
              htmlFor={`player-${index}`}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              플레이어 {index + 1}
            </label>
            <input
              id={`player-${index}`}
              type="text"
              value={names[index]}
              onChange={(e) => handleNameChange(index, e.target.value)}
              placeholder={`플레이어 ${index + 1}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors mt-4"
        >
          카드 분배하기
        </button>
      </form>
    </div>
  )
}

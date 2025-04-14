import type { PlayerFormData } from '@/types/cardGame'

import { useState } from 'react'

import { useToast } from '@/components/ui/Toast'

type PlayerFormProps = {
  onSubmit: (data: PlayerFormData) => void
  isLoading?: boolean
}

export default function PlayerForm({
  onSubmit,
  isLoading = false,
}: PlayerFormProps) {
  const { addToast } = useToast()
  const [formData, setFormData] = useState<PlayerFormData>({
    playerCount: 2,
    cardCount: 5,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numValue = parseInt(value)

    if (name === 'playerCount' && numValue < 2) {
      addToast({
        type: 'warning',
        title: '인원 제한',
        message: '2명 이상 참가해야 합니다.',
        duration: 3000,
      })

      setFormData((prev) => ({ ...prev, [name]: 2 }))
    } else if (name === 'playerCount' && numValue > 5) {
      addToast({
        type: 'warning',
        title: '인원 제한',
        message: '5명까지만 게임 참가가 가능합니다.',
        duration: 3000,
      })

      setFormData((prev) => ({ ...prev, [name]: 5 }))
    } else if (name === 'cardCount' && numValue < 3) {
      addToast({
        type: 'warning',
        title: '카드 수 제한',
        message: '카드는 3개 이상 나눠줘야 합니다.',
        duration: 3000,
      })

      setFormData((prev) => ({ ...prev, [name]: 3 }))
    } else if (name === 'cardCount' && numValue > 5) {
      addToast({
        type: 'warning',
        title: '카드 수 제한',
        message: '카드는 최대 5개까지만 가능합니다.',
        duration: 3000,
      })

      setFormData((prev) => ({ ...prev, [name]: 5 }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: numValue }))
    }

    if (name === 'playerCount') {
      if (numValue < 2) {
        setErrors((prev) => ({
          ...prev,
          playerCount: '최소 2명 이상이어야 합니다',
        }))
      } else if (numValue > 5) {
        setErrors((prev) => ({
          ...prev,
          playerCount: '최대 5명까지 가능합니다',
        }))
      } else {
        setErrors((prev) => ({ ...prev, playerCount: '' }))
      }
    }

    if (name === 'cardCount') {
      if (numValue < 3) {
        setErrors((prev) => ({
          ...prev,
          cardCount: '최소 3장 이상이어야 합니다',
        }))
      } else if (numValue > 5) {
        setErrors((prev) => ({
          ...prev,
          cardCount: '최대 5장까지 가능합니다',
        }))
      } else {
        setErrors((prev) => ({ ...prev, cardCount: '' }))
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const hasErrors = Object.values(errors).some((error) => error !== '')
    if (hasErrors) return

    onSubmit(formData)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md space-y-4"
    >
      <h2 className="text-xl font-bold mb-4">게임 설정</h2>

      <div>
        <label
          htmlFor="playerCount"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          플레이어 수
        </label>
        <input
          id="playerCount"
          name="playerCount"
          type="number"
          value={formData.playerCount}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        {errors.playerCount && (
          <p className="mt-1 text-sm text-red-600">{errors.playerCount}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="cardCount"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          카드 수 (플레이어당)
        </label>
        <input
          id="cardCount"
          name="cardCount"
          type="number"
          value={formData.cardCount}
          onChange={handleChange}
          max={5}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        {errors.cardCount && (
          <p className="mt-1 text-sm text-red-600">{errors.cardCount}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={
          isLoading || Object.values(errors).some((error) => error !== '')
        }
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? '처리 중...' : '게임 시작'}
      </button>
    </form>
  )
}

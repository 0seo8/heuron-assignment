import { useCardGame } from '@/context/cardGame/CardGameContext'
import { useState } from 'react'

type CardDistributionProps = {
  playerCount: number
  cardCount: number
  onDistribute: () => void
}

export default function CardDistribution({
  playerCount,
  cardCount,
  onDistribute,
}: CardDistributionProps) {
  const { state } = useCardGame()
  const { players } = state

  // 애니메이션 상태 관리
  const [isAnimating, setIsAnimating] = useState(false)
  const [distributedCards, setDistributedCards] = useState<
    Record<number, number>
  >(Object.fromEntries(players.map((p) => [p.id, 0])))
  const [animatingCardPosition, setAnimatingCardPosition] = useState<{
    top: number
    left: number
    opacity: number
    scale: number
    rotate: number
    playerId?: number
  }>({ top: 50, left: 50, opacity: 0, scale: 1, rotate: 0 })

  // 카드 애니메이션 함수
  const animateCardDistribution = async () => {
    if (isAnimating) return

    setIsAnimating(true)
    setDistributedCards(Object.fromEntries(players.map((p) => [p.id, 0])))

    // 카드 덱의 시작 위치 (화면 중앙)
    const deckPosition = { top: 50, left: 50 }

    // 각 카드별로 순차적으로 애니메이션 실행
    for (let round = 0; round < cardCount; round++) {
      for (let i = 0; i < players.length; i++) {
        const player = players[i]

        // 카드 덱에서 시작
        setAnimatingCardPosition({
          top: deckPosition.top,
          left: deckPosition.left,
          opacity: 1,
          scale: 1,
          rotate: Math.random() * 10 - 5, // 약간의 랜덤 회전
          playerId: player.id,
        })

        // 250ms 대기 (애니메이션 시작 위치 보이게)
        await new Promise((resolve) => setTimeout(resolve, 250))

        // 카드가 플레이어에게 날아가는 애니메이션
        setAnimatingCardPosition((prev) => ({
          ...prev,
          top: 20 + Math.random() * 10,
          left: 20 + (80 / players.length) * i,
          scale: 0.8,
          rotate: Math.random() * 20 - 10,
        }))

        // 500ms 대기 (카드 이동 애니메이션)
        await new Promise((resolve) => setTimeout(resolve, 500))

        // 카드 사라짐 애니메이션
        setAnimatingCardPosition((prev) => ({
          ...prev,
          opacity: 0,
        }))

        // 플레이어의 카드 수 증가
        setDistributedCards((prev) => ({
          ...prev,
          [player.id]: prev[player.id] + 1,
        }))

        // 250ms 대기 (다음 카드 준비)
        await new Promise((resolve) => setTimeout(resolve, 250))
      }
    }

    // 애니메이션 완료 후 1초 대기 후 결과 표시
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsAnimating(false)
    onDistribute() // 실제 카드 분배 완료 처리
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <h2 className="text-xl font-bold mb-6">카드 분배</h2>

      <div className="mb-6">
        <p className="text-gray-700 mb-2">
          <span className="font-medium">{playerCount}명</span>의 플레이어에게
        </p>
        <p className="text-gray-700">
          각각 <span className="font-medium">{cardCount}장</span>의 카드를
          분배합니다
        </p>
      </div>

      {/* 카드 애니메이션 요소 */}
      {isAnimating && (
        <div
          className="absolute z-10 w-16 h-24 bg-white border-2 border-gray-300 rounded-lg shadow-lg flex items-center justify-center transition-all duration-500 ease-in-out animate-bounce"
          style={{
            top: `${animatingCardPosition.top}%`,
            left: `${animatingCardPosition.left}%`,
            opacity: animatingCardPosition.opacity,
            transform: `scale(${animatingCardPosition.scale}) rotate(${animatingCardPosition.rotate}deg)`,
          }}
        >
          <span className="text-xl font-bold text-blue-500">♠</span>
        </div>
      )}

      {/* 카드 덱 */}
      <div className="relative mx-auto my-8 w-20 h-28 bg-white border-2 border-gray-300 rounded-lg shadow-md mb-12 hover:shadow-xl transition-shadow duration-300">
        <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-blue-500">
          ♠
        </div>
        <div className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
          {cardCount * playerCount}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 my-8 mx-auto max-w-3xl">
        {players.map((player) => (
          <div
            key={player.id}
            className="relative w-full h-28 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-md flex flex-col items-center justify-center p-2 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <span className="text-white font-bold text-sm px-2 text-center break-words w-full">
              {player.name}
            </span>
            <div className="flex items-center mt-2">
              <span className="text-blue-100 text-xs">
                {isAnimating ? distributedCards[player.id] : cardCount}장의 카드
              </span>
              {isAnimating && distributedCards[player.id] > 0 && (
                <span className="ml-1 text-yellow-300 text-xs animate-pulse">
                  +{distributedCards[player.id]}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={animateCardDistribution}
        disabled={isAnimating}
        className={`py-3 px-6 rounded-md transition-all duration-300 w-full sm:w-auto mt-4 ${
          isAnimating
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 hover:shadow-md text-white'
        }`}
      >
        {isAnimating ? (
          <span className="inline-flex items-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            카드 분배 중...
          </span>
        ) : (
          '카드 분배하기'
        )}
      </button>
    </div>
  )
}

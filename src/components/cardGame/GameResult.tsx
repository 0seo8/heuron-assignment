import type { Player } from '@/types/cardGame'

import PlayerCard from './PlayerCard'

type GameResultProps = {
  players: Player[]
  winner: Player | null
  onRestart: () => void
}

export default function GameResult({
  players,
  winner,
  onRestart,
}: GameResultProps) {
  if (!winner) {
    return <div className="text-center text-gray-500">결과가 없습니다.</div>
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">게임 결과</h2>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-green-800 mb-2">
            승자: {winner.name}
          </h3>
          <p className="text-green-700">점수: {winner.totalScore}점</p>
          <p className="text-green-700 mt-1">
            보유카드: {winner.cards.join(', ')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            isWinner={player.id === winner.id}
          />
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={onRestart}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors"
        >
          다시 시작하기
        </button>
      </div>
    </div>
  )
}

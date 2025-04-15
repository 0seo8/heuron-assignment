import type { Player } from '@/types/cardGame'

type PlayerCardProps = {
  player: Player
  isWinner: boolean
}

const PlayerCard = ({ player, isWinner }: PlayerCardProps) => {
  return (
    <div
      className={`
        bg-white rounded-lg shadow-md overflow-hidden 
        border-2 transition-all 
        ${isWinner ? 'border-green-500' : 'border-transparent'}
      `}
    >
      <div
        className={`
          px-4 py-2 font-bold flex justify-between items-center
          ${isWinner ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
        `}
      >
        <span>{player.name}</span>
        {isWinner && (
          <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
            승자
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-sm text-gray-500 mb-2">보유 카드</h3>
          <div className="flex flex-wrap gap-2">
            {player.cards.map((card, index) => (
              <div
                key={index}
                className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-800 font-medium rounded-lg"
              >
                {card}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">총점</span>
            <span className="font-bold text-lg">{player.totalScore}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerCard

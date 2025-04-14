import type { PlayerFormData } from '@/types/cardGame'

import CardDistribution from '@/components/cardGame/CardDistribution'
import GameResult from '@/components/cardGame/GameResult'
import PlayerForm from '@/components/cardGame/PlayerForm'
import { PlayerNamesForm } from '@/components/cardGame/PlayerNamesForm'
import {
  CardGameProvider,
  useCardGame,
} from '@/context/cardGame/CardGameContext'

function CardGameContent() {
  const { state, setupGame, distributeCards, resetGame } = useCardGame()
  const { players, playerCount, cardCount, currentStep, winner } = state

  const handleSetupSubmit = (data: PlayerFormData) => {
    setupGame(data.playerCount, data.cardCount)
  }

  const handleDistribute = () => {
    distributeCards()
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 'setup':
        return <PlayerForm onSubmit={handleSetupSubmit} />

      case 'playerNames':
        return <PlayerNamesForm />

      case 'distribution':
        return (
          <CardDistribution
            playerCount={playerCount}
            cardCount={cardCount}
            onDistribute={handleDistribute}
          />
        )

      case 'result':
        return (
          <GameResult players={players} winner={winner} onRestart={resetGame} />
        )

      default:
        return <div>알 수 없는 상태입니다</div>
    }
  }

  return <div className="max-w-4xl mx-auto">{renderStepContent()}</div>
}

export default function CardGame() {
  return (
    <div className="container mx-auto p-4 min-h-[calc(100vh-64px)]">
      <h1 className="text-2xl font-bold mb-6">카드 게임</h1>

      <CardGameProvider>
        <CardGameContent />
      </CardGameProvider>
    </div>
  )
}

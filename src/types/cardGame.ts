export type Player = {
  id: number
  name: string
  cards: number[]
  totalScore: number
}

export type GameStep = 'setup' | 'playerNames' | 'distribution' | 'result'

export type GameState = {
  players: Player[]
  playerCount: number
  cardCount: number
  currentStep: GameStep
  winner: Player | null
}

export type GameContextType = {
  state: GameState
  setupGame: (playerCount: number, cardCount: number) => void
  setPlayerNames: (names: string[]) => void
  distributeCards: () => void
  resetGame: () => void
}

export type PlayerFormData = {
  playerCount: number
  cardCount: number
}

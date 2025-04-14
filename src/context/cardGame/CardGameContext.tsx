import type { GameState, GameContextType, Player } from '@/types/cardGame'

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from 'react'

/**
 * 특정 개수의 랜덤 카드를 생성
 */
function generateRandomCards(count: number): number[] {
  return Array.from({ length: count }, () => Math.floor(Math.random() * 20) + 1)
}

/**
 * 플레이어들 중 승자를 결정
 */
function determineWinner(players: Player[]): Player {
  let winner = players[0]

  for (let i = 1; i < players.length; i++) {
    // 동점인 경우도 후순위 플레이어가 승리 (>= 사용)
    if (players[i].totalScore >= winner.totalScore) {
      winner = players[i]
    }
  }

  return winner
}

const initialState: GameState = {
  players: [],
  playerCount: 0,
  cardCount: 0,
  currentStep: 'setup',
  winner: null,
}

type GameAction =
  | { type: 'SETUP_GAME'; payload: { playerCount: number; cardCount: number } }
  | { type: 'SET_PLAYER_NAMES'; payload: string[] }
  | { type: 'DISTRIBUTE_CARDS' }
  | { type: 'RESET_GAME' }

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SETUP_GAME': {
      const { playerCount, cardCount } = action.payload

      const players: Player[] = Array.from(
        { length: playerCount },
        (_, index) => ({
          id: index + 1,
          name: `플레이어 ${index + 1}`,
          cards: [],
          totalScore: 0,
        }),
      )

      return {
        ...state,
        playerCount,
        cardCount,
        players,
        currentStep: 'playerNames',
        winner: null,
      }
    }

    case 'SET_PLAYER_NAMES': {
      const playerNames = action.payload

      const updatedPlayers = state.players.map((player, index) => ({
        ...player,
        name: playerNames[index] || `플레이어 ${index + 1}`,
      }))

      return {
        ...state,
        players: updatedPlayers,
        currentStep: 'distribution',
      }
    }

    case 'DISTRIBUTE_CARDS': {
      const { players, cardCount } = state
      const updatedPlayers = [...players]

      // 각 플레이어에게 카드 분배 및 점수 계산
      updatedPlayers.forEach((player) => {
        const cards = generateRandomCards(cardCount)
        const totalScore = cards.reduce((sum, card) => sum + card, 0)

        player.cards = cards
        player.totalScore = totalScore
      })

      const winner = determineWinner(updatedPlayers)

      return {
        ...state,
        players: updatedPlayers,
        currentStep: 'result',
        winner,
      }
    }

    case 'RESET_GAME':
      return initialState

    default:
      return state
  }
}

const CardGameContext = createContext<GameContextType | undefined>(undefined)

export function CardGameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  const setupGame = useCallback((playerCount: number, cardCount: number) => {
    dispatch({ type: 'SETUP_GAME', payload: { playerCount, cardCount } })
  }, [])

  const setPlayerNames = useCallback((names: string[]) => {
    dispatch({ type: 'SET_PLAYER_NAMES', payload: names })
  }, [])

  const distributeCards = useCallback(() => {
    dispatch({ type: 'DISTRIBUTE_CARDS' })
  }, [])

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' })
  }, [])

  const value: GameContextType = {
    state,
    setupGame,
    setPlayerNames,
    distributeCards,
    resetGame,
  }

  return (
    <CardGameContext.Provider value={value}>
      {children}
    </CardGameContext.Provider>
  )
}

export function useCardGame() {
  const context = useContext(CardGameContext)
  if (context === undefined) {
    throw new Error('useCardGame must be used within a CardGameProvider')
  }
  return context
}

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GamePhase = "menu" | "playing" | "ended";

interface Inventory {
  [key: string]: number;
}

interface GameState {
  gamePhase: GamePhase;
  score: number;
  currentLevel: number;
  inventory: Inventory;
  showMiniGame: boolean;
  showQuiz: boolean;
  completedChallenges: string[];
  
  // Actions
  start: () => void;
  restart: () => void;
  end: () => void;
  addScore: (points: number) => void;
  addToInventory: (item: string, quantity?: number) => void;
  openMiniGame: () => void;
  closeMiniGame: () => void;
  openQuiz: () => void;
  closeQuiz: () => void;
  completeChallenge: (challengeId: string) => void;
  nextLevel: () => void;
}

export const useGameState = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    gamePhase: "menu",
    score: 0,
    currentLevel: 1,
    inventory: {
      "Recyclables": 0,
      "Clean Energy": 0,
      "Plants": 0
    },
    showMiniGame: false,
    showQuiz: false,
    completedChallenges: [],
    
    start: () => {
      set((state) => {
        if (state.gamePhase === "menu") {
          return { gamePhase: "playing" };
        }
        return {};
      });
    },
    
    restart: () => {
      set(() => ({ 
        gamePhase: "menu",
        score: 0,
        currentLevel: 1,
        inventory: {
          "Recyclables": 0,
          "Clean Energy": 0,
          "Plants": 0
        },
        showMiniGame: false,
        showQuiz: false,
        completedChallenges: []
      }));
    },
    
    end: () => {
      set((state) => {
        if (state.gamePhase === "playing") {
          return { gamePhase: "ended" };
        }
        return {};
      });
    },

    addScore: (points: number) => {
      set((state) => ({ score: state.score + points }));
    },

    addToInventory: (item: string, quantity = 1) => {
      set((state) => ({
        inventory: {
          ...state.inventory,
          [item]: (state.inventory[item] || 0) + quantity
        }
      }));
    },

    openMiniGame: () => {
      set(() => ({ showMiniGame: true }));
    },

    closeMiniGame: () => {
      set(() => ({ showMiniGame: false }));
    },

    openQuiz: () => {
      set(() => ({ showQuiz: true }));
    },

    closeQuiz: () => {
      set(() => ({ showQuiz: false }));
    },

    completeChallenge: (challengeId: string) => {
      set((state) => ({
        completedChallenges: [...state.completedChallenges, challengeId]
      }));
    },

    nextLevel: () => {
      set((state) => ({ currentLevel: state.currentLevel + 1 }));
    }
  }))
);

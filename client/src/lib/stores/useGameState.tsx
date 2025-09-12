import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { levels, getLevelByScore, type Level, type LevelObjective } from "../gameData";

export type GamePhase = "menu" | "playing" | "ended";

interface Inventory {
  [key: string]: number;
}

interface GameState {
  gamePhase: GamePhase;
  score: number;
  currentLevel: number;
  currentLevelData: Level;
  objectives: LevelObjective[];
  inventory: Inventory;
  showMiniGame: boolean;
  showQuiz: boolean;
  completedChallenges: string[];
  levelStartTime: number;
  timeRemaining?: number;
  recyclingChallengesCompleted: number;
  quizzesCompleted: number;
  
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
  updateObjectiveProgress: (type: string, target: string | number, amount?: number) => void;
  checkLevelCompletion: () => void;
}

export const useGameState = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    gamePhase: "menu",
    score: 0,
    currentLevel: 1,
    currentLevelData: levels[0],
    objectives: [...levels[0].objectives],
    inventory: {
      "Recyclables": 0,
      "Clean Energy": 0,
      "Plants": 0
    },
    showMiniGame: false,
    showQuiz: false,
    completedChallenges: [],
    levelStartTime: Date.now(),
    recyclingChallengesCompleted: 0,
    quizzesCompleted: 0,
    
    start: () => {
      set((state) => {
        if (state.gamePhase === "menu") {
          return { 
            gamePhase: "playing",
            levelStartTime: Date.now()
          };
        }
        return {};
      });
    },
    
    restart: () => {
      const initialLevel = levels[0];
      set(() => ({ 
        gamePhase: "menu",
        score: 0,
        currentLevel: 1,
        currentLevelData: initialLevel,
        objectives: [...initialLevel.objectives],
        inventory: {
          "Recyclables": 0,
          "Clean Energy": 0,
          "Plants": 0
        },
        showMiniGame: false,
        showQuiz: false,
        completedChallenges: [],
        levelStartTime: Date.now(),
        recyclingChallengesCompleted: 0,
        quizzesCompleted: 0
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
      set((state) => {
        const newLevel = state.currentLevel + 1;
        const levelData = levels.find(l => l.id === newLevel) || levels[0];
        return { 
          currentLevel: newLevel,
          currentLevelData: levelData,
          objectives: [...levelData.objectives],
          levelStartTime: Date.now(),
          recyclingChallengesCompleted: 0,
          quizzesCompleted: 0
        };
      });
    },

    updateObjectiveProgress: (type: string, target: string | number, amount = 1) => {
      set((state) => {
        const updatedObjectives = state.objectives.map(obj => {
          if (obj.type === type && obj.target === target) {
            const newCurrent = (obj.current || 0) + amount;
            return { ...obj, current: newCurrent };
          }
          return obj;
        });
        
        return { objectives: updatedObjectives };
      });
      
      get().checkLevelCompletion();
    },

    checkLevelCompletion: () => {
      const state = get();
      const allCompleted = state.objectives.every(obj => {
        if (obj.type === 'score') {
          return state.score >= (obj.target as number);
        }
        return (obj.current || 0) >= (obj.target as number);
      });

      if (allCompleted) {
        // Level completed - award bonus points and progress
        const bonus = state.currentLevelData.rewardPoints;
        set((prevState) => ({ 
          score: prevState.score + bonus 
        }));
        
        // Check if there's a next level
        const nextLevelData = levels.find(l => l.id === state.currentLevel + 1);
        if (nextLevelData) {
          setTimeout(() => {
            get().nextLevel();
          }, 2000); // Delay to show completion
        } else {
          // Game completed
          setTimeout(() => {
            get().end();
          }, 2000);
        }
      }
    }
  }))
);

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { levels, getLevelByScore, getAvailableEcosystems, getEcosystemProgress, type Level, type LevelObjective, type EcosystemProgress } from "../gameData";

export type GamePhase = "age_selection" | "menu" | "ecosystem_selection" | "playing" | "ended";

interface SavedGameState {
  score: number;
  currentLevel: number;
  currentEcosystem: 'forest' | 'ocean' | 'city';
  inventory: Inventory;
  completedChallenges: string[];
  recyclingChallengesCompleted: number;
  quizzesCompleted: number;
  ecosystemProgress: EcosystemProgress;
  availableEcosystems: string[];
  saveDate: string;
}

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
  showPauseMenu: boolean;
  isPaused: boolean;
  completedChallenges: string[];
  levelStartTime: number;
  pauseStartTime?: number;
  totalPausedTime: number;
  timeRemaining?: number;
  recyclingChallengesCompleted: number;
  quizzesCompleted: number;
  
  // Age selection state
  selectedAge: string | null;
  
  // Ecosystem-specific state
  currentEcosystem: 'forest' | 'ocean' | 'city';
  ecosystemProgress: EcosystemProgress;
  availableEcosystems: string[];
  ecosystemTransitioning: boolean;
  
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
  
  // Pause/Resume Actions
  pauseGame: () => void;
  resumeGame: () => void;
  togglePauseMenu: () => void;
  
  // Save/Load Actions
  saveGame: () => void;
  loadGame: () => boolean;
  hasSavedGame: () => boolean;
  
  completeChallenge: (challengeId: string) => void;
  nextLevel: () => void;
  updateObjectiveProgress: (type: string, target: string | number, amount?: number) => void;
  checkLevelCompletion: () => void;
  
  // Age selection actions
  selectAge: (ageGroup: string) => void;
  
  // Ecosystem-specific actions
  selectEcosystem: (ecosystem: 'forest' | 'ocean' | 'city') => void;
  showEcosystemSelection: () => void;
  completeEcosystem: (ecosystem: 'forest' | 'ocean' | 'city') => void;
  unlockNextEcosystem: () => void;
}

export const useGameState = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    gamePhase: "age_selection",
    score: 0,
    currentLevel: 1,
    currentLevelData: levels[0],
    objectives: [...levels[0].objectives],
    inventory: {
      "Recyclables": 0,
      "Clean Energy": 0,
      "Plants": 0,
      "Seeds": 0,
      "Flowers": 0,
      "Mushrooms": 0,
      "Pearls": 0,
      "Shells": 0,
      "Seaweed": 0,
      "Ocean Cleanup Points": 0,
      "Renewable Energy Installed": 0,
      "Pollution Reduced": 0,
      "Green Spaces Created": 0,
      "Cleaned Pollution": 0
    },
    showMiniGame: false,
    showQuiz: false,
    showPauseMenu: false,
    isPaused: false,
    completedChallenges: [],
    levelStartTime: Date.now(),
    pauseStartTime: undefined,
    totalPausedTime: 0,
    recyclingChallengesCompleted: 0,
    quizzesCompleted: 0,
    
    // Age selection state initialization
    selectedAge: null,
    
    // Ecosystem state initialization
    currentEcosystem: 'forest',
    ecosystemProgress: getEcosystemProgress(0),
    availableEcosystems: ['forest'],
    ecosystemTransitioning: false,
    
    start: () => {
      set((state) => {
        if (state.gamePhase === "menu") {
          return { 
            gamePhase: "ecosystem_selection",
            levelStartTime: Date.now(),
            availableEcosystems: getAvailableEcosystems(state.score)
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
          "Plants": 0,
          "Seeds": 0,
          "Flowers": 0,
          "Mushrooms": 0,
          "Pearls": 0,
          "Shells": 0,
          "Seaweed": 0,
          "Ocean Cleanup Points": 0,
          "Renewable Energy Installed": 0,
          "Pollution Reduced": 0,
          "Green Spaces Created": 0,
          "Cleaned Pollution": 0
        },
        showMiniGame: false,
        showQuiz: false,
        showPauseMenu: false,
        isPaused: false,
        completedChallenges: [],
        levelStartTime: Date.now(),
        pauseStartTime: undefined,
        totalPausedTime: 0,
        recyclingChallengesCompleted: 0,
        quizzesCompleted: 0,
        currentEcosystem: 'forest',
        ecosystemProgress: getEcosystemProgress(0),
        availableEcosystems: ['forest'],
        ecosystemTransitioning: false
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
      set((state) => ({
        score: state.score + points,
        ecosystemProgress: getEcosystemProgress(state.score + points),
        availableEcosystems: getAvailableEcosystems(state.score + points)
      }));
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

    // Pause/Resume functionality
    pauseGame: () => {
      set((state) => {
        if (!state.isPaused && state.gamePhase === 'playing') {
          return {
            isPaused: true,
            pauseStartTime: Date.now()
          };
        }
        return {};
      });
    },

    resumeGame: () => {
      set((state) => {
        if (state.isPaused && state.pauseStartTime) {
          const pauseDuration = Date.now() - state.pauseStartTime;
          return {
            isPaused: false,
            pauseStartTime: undefined,
            totalPausedTime: state.totalPausedTime + pauseDuration,
            showPauseMenu: false
          };
        }
        return {};
      });
    },

    togglePauseMenu: () => {
      set((state) => {
        if (state.gamePhase === 'playing') {
          const newShowPauseMenu = !state.showPauseMenu;
          
          if (newShowPauseMenu && !state.isPaused) {
            // Opening pause menu - pause the game
            return {
              showPauseMenu: true,
              isPaused: true,
              pauseStartTime: Date.now()
            };
          } else if (!newShowPauseMenu && state.isPaused) {
            // Closing pause menu - resume the game
            const pauseDuration = state.pauseStartTime ? Date.now() - state.pauseStartTime : 0;
            return {
              showPauseMenu: false,
              isPaused: false,
              pauseStartTime: undefined,
              totalPausedTime: state.totalPausedTime + pauseDuration
            };
          }
          
          return { showPauseMenu: newShowPauseMenu };
        }
        return {};
      });
    },

    // Save/Load functionality
    saveGame: () => {
      const state = get();
      const saveData: SavedGameState = {
        score: state.score,
        currentLevel: state.currentLevel,
        currentEcosystem: state.currentEcosystem,
        inventory: state.inventory,
        completedChallenges: state.completedChallenges,
        recyclingChallengesCompleted: state.recyclingChallengesCompleted,
        quizzesCompleted: state.quizzesCompleted,
        ecosystemProgress: state.ecosystemProgress,
        availableEcosystems: state.availableEcosystems,
        saveDate: new Date().toISOString()
      };
      
      try {
        localStorage.setItem('ecolearn_save', JSON.stringify(saveData));
        console.log('Game saved successfully');
        return true;
      } catch (error) {
        console.error('Failed to save game:', error);
        return false;
      }
    },

    loadGame: () => {
      try {
        const saveData = localStorage.getItem('ecolearn_save');
        if (saveData) {
          const parsed: SavedGameState = JSON.parse(saveData);
          const levelData = levels.find(l => l.id === parsed.currentLevel) || levels[0];
          
          set({
            score: parsed.score,
            currentLevel: parsed.currentLevel,
            currentLevelData: levelData,
            objectives: [...levelData.objectives],
            currentEcosystem: parsed.currentEcosystem,
            inventory: parsed.inventory,
            completedChallenges: parsed.completedChallenges,
            recyclingChallengesCompleted: parsed.recyclingChallengesCompleted,
            quizzesCompleted: parsed.quizzesCompleted,
            ecosystemProgress: parsed.ecosystemProgress,
            availableEcosystems: parsed.availableEcosystems,
            gamePhase: 'ecosystem_selection',
            levelStartTime: Date.now(),
            totalPausedTime: 0,
            isPaused: false,
            showPauseMenu: false
          });
          
          console.log('Game loaded successfully');
          return true;
        }
      } catch (error) {
        console.error('Failed to load game:', error);
      }
      return false;
    },

    hasSavedGame: () => {
      try {
        const saveData = localStorage.getItem('ecolearn_save');
        return saveData !== null;
      } catch {
        return false;
      }
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
    },
    
    // Age selection actions
    selectAge: (ageGroup: string) => {
      set((state) => {
        if (state.gamePhase === "age_selection") {
          return {
            selectedAge: ageGroup,
            gamePhase: "menu" as GamePhase
          };
        }
        return {};
      });
    },
    
    // Ecosystem-specific actions
    selectEcosystem: (ecosystem: 'forest' | 'ocean' | 'city') => {
      set((state) => {
        const ecosystemLevel = levels.find(level => level.ecosystem === ecosystem);
        if (ecosystemLevel && state.availableEcosystems.includes(ecosystem)) {
          return {
            currentEcosystem: ecosystem,
            currentLevelData: ecosystemLevel,
            objectives: [...ecosystemLevel.objectives],
            gamePhase: "playing" as GamePhase,
            levelStartTime: Date.now(),
            ecosystemTransitioning: true
          };
        }
        return {};
      });
      
      // Reset transition after delay
      setTimeout(() => {
        set({ ecosystemTransitioning: false });
      }, 2000);
    },
    
    showEcosystemSelection: () => {
      set((state) => ({
        gamePhase: "ecosystem_selection" as GamePhase,
        availableEcosystems: getAvailableEcosystems(state.score)
      }));
    },
    
    completeEcosystem: (ecosystem: 'forest' | 'ocean' | 'city') => {
      set((state) => {
        const updatedProgress = { ...state.ecosystemProgress };
        updatedProgress[ecosystem].completed = true;
        
        return {
          ecosystemProgress: updatedProgress,
          availableEcosystems: getAvailableEcosystems(state.score)
        };
      });
      
      get().unlockNextEcosystem();
    },
    
    unlockNextEcosystem: () => {
      const state = get();
      const newAvailable = getAvailableEcosystems(state.score);
      
      set({ availableEcosystems: newAvailable });
      
      // Check if all ecosystems are completed
      const allCompleted = Object.values(state.ecosystemProgress).every(eco => eco.completed);
      if (allCompleted) {
        setTimeout(() => {
          get().end();
        }, 3000);
      }
    }
  }))
);

// context/GameContext.tsx

"use client";


import {
  createContext,
  useContext,
  useState,
  useEffect
} from "react";

import type { GameStateView } from "@shared/types/gameStateView";
import { loadGameState } from "@/utils/api/gameStateApi";

type GameContextType = {
  gameState: GameStateView | null;

  setGameState: React.Dispatch<
    React.SetStateAction<GameStateView | null>
  >;
};

const GameContext =
  createContext<GameContextType | null>(null);

export function GameProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [gameState, setGameState] = useState<GameStateView | null>(null);

   useEffect(() => {
    const initGame = async () => {
      const data = await loadGameState();
      setGameState(data);
    };

    initGame();
  }, []);


  return (
    <GameContext.Provider
      value={{
        gameState,
        setGameState,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error(
      "useGame doit être utilisé dans GameProvider"
    );
  }

  return context;
}
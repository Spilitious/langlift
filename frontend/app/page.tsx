"use client";

import Game from "@/components/Game";
import {
  GameProvider,
  useGame,
} from "@/context/GameContext";

import { resetGameState } from "@/utils/api/gameStateApi";

function GameContent() {
  const { setGameState } = useGame();

  const handleReset = async () => {
    const newGameState =
      await resetGameState();

    setGameState(newGameState);
  };

  return (
    <main>
      <button
        onClick={handleReset}
        style={{
          position: "fixed",
          top: "10px",
          left: "10px",
          zIndex: 99999,

          padding: "8px 14px",

          background: "#5a2d1a",
          color: "white",

          border: "1px solid #d8b56b",
          borderRadius: "5px",

          cursor: "pointer",
        }}
      >
        Reset
      </button>

      <Game />
    </main>
  );
}

export default function Page() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}

"use client";

import { useState, useEffect } from "react";



import History from "@/components/history/History";
import Fight from "@/components/fight/Fight";
import { HistoryDestination } from "../../shared/types/history";
import { useGame } from "@/context/GameContext";
import { applyDestination } from "@/utils/api/navigation";


export default function Game() {

   const {
    gameState,
    setGameState,
  } = useGame();

   if (!gameState) {
    return null; // plus tard écran de chargement
  }

  const currentPageId = gameState.currentPageId;
  const currentRoomId = gameState.currentRoomId;


const handleDestination = async (
  destination: HistoryDestination
) => {
  const newGameState =
    await applyDestination(destination);

  setGameState(newGameState);

  
};

  return (
    <main
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
          backgroundImage:
            'url("/ui/35.png")',
      }}
    >
      {currentRoomId === null ? (
        <History
          pageId={currentPageId}
          onDestination={handleDestination}
        />
      ) : (
        <Fight
          key={currentRoomId}
          roomId={currentRoomId}
          onFightEnd={handleDestination}
        />
      )}
    </main>
  );
}
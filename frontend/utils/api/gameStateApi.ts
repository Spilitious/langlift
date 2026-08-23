import type { GameStateView } from "@shared/types/gameStateView";

export const loadGameState = async (): Promise<GameStateView> => {
  const response = await fetch(
    "http://localhost:3001/api/game-state"
  );

  if (!response.ok) {
        const text = await response.text();
     console.error(
      "GameState error:",
      response.status,
      text
    );
    throw new Error(
      "Impossible de charger le GameState"
    );
  }

  return response.json();
};
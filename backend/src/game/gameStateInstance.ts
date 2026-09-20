import { GameState } from "../classes/GameState.js";
// GameStateInstance.ts


let gameState: GameState | null = null;

export function getGameState(): GameState | null {
  return gameState;
}

export function setGameState(
  newGameState: GameState | null
): void {
  gameState = newGameState;
}
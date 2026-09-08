import type { ActionResult } from "./actionResult";
import type { GameStateView } from "./gameStateView";

export type IAResponse = {
  results: ActionResult[];
  gameState: GameStateView;
};
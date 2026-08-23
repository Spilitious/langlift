import { GameState } from "../classes/GameState.js";
import {pj1, pj2} from "../utils/mocks/pj.js"

export const gameState = new GameState();

gameState.addPj(pj1);
gameState.addPj(pj2);
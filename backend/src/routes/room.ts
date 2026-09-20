import { Router } from "express";

const router = Router();
import { getGameState } from "../game/gameStateInstance.js";
import type { VictoryResult, VictoryResponse } from "../../../shared/types/actionResult.js";

router.get(
  "/room/:id",
  (req, res) => {

  try {
  
    const gameState = getGameState();

    if (!gameState) {
    return res.status(404).json({
      error: "Aucune partie en cours",
    });
  }
    const id =Number(req.params.id);
    const anim = gameState.buildRoom(id);
  
    
     return res.json({
      animation:anim,
      gameState: gameState.toView(),
    });
  } catch (error) {
    console.error("Erreur action :", error);

    return res.status(500).json({
      error: "Erreur lors du chargement de room",
    });
  }
});



router.post(
  "/room/victory",
  (req, res) => {
   
    const gameState = getGameState();

    if (!gameState) {
    return res.status(404).json({
      error: "Aucune partie en cours",
    });
  }
    const victoryResult = gameState.executeVictory();    
    const response:VictoryResponse = {
      results:victoryResult,
      gameState:gameState.toView(),
    }

    res.json(response);
  }
);
export default router;
import { Router } from "express";

const router = Router();
import { getGameState } from "../game/gameStateInstance.js";
import type { VictoryResult, VictoryResponse } from "../../../shared/types/actionResult.js";

router.get(
  "/shop/:id",
  (req, res) => {

  try {
  
    const gameState = getGameState();

    if (!gameState) {
    return res.status(404).json({
      error: "Aucune partie en cours",
    });
  }
    const id =Number(req.params.id);
    gameState.buildShop(id);
  
    
     return res.json(
        gameState.toView(),
    );
  } catch (error) {
    console.error("Erreur action :", error);

    return res.status(500).json({
      error: "Erreur lors du chargement de room",
    });
  }
});


export default router;
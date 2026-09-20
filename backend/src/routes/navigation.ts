import { Router } from "express";
import { getGameState } from "../game/gameStateInstance.js";
import type { HistoryDestination } from "../../../shared/types/history.js";

const router = Router();

router.post("/destination", (req, res) => {
  try {
    const destination =
      req.body as HistoryDestination;

    const gameState = getGameState();

    if (!gameState) {
    return res.status(404).json({
      error: "Aucune partie en cours",
    });
  }
  
    gameState.setDestination(destination);

    const view =
      gameState.toView();


    return res.json(view);
  } catch (error) {
    console.error(
      "ERREUR DESTINATION =",
      error
    );

    return res.status(500).json({
      error: "Erreur destination",
    });
  }
});

export default router;
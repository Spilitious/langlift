import { Router } from "express";
import { gameState } from "../game/gameStateInstance.js";
import type { HistoryDestination } from "../../../shared/types/history.js";

const router = Router();

router.post("/destination", (req, res) => {
  try {
    const destination =
      req.body as HistoryDestination;

    console.log(
      "DESTINATION RECUE =",
      destination
    );

    gameState.setDestination(destination);

    const view =
      gameState.toView();

    console.log(
      "GAMESTATE APRES =",
      view
    );

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
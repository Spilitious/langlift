import { Router } from "express";
import { getGameState } from "../game/gameStateInstance.js";

const router = Router();

router.post("/consequence/add", (req, res) => {
  const { consequenceId } = req.body;

  if (typeof consequenceId !== "number") {
    return res.status(400).json({
      error: "consequenceId invalide",
    });
  }
  const gameState = getGameState();

    if (!gameState) {
    return res.status(404).json({
      error: "Aucune partie en cours",
    });
  }
  gameState.addConsequence(consequenceId);

  return res.json({
    success: true,
    consequenceId,
  });
});

export default router;
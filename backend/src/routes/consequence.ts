import { Router } from "express";
import { gameState } from "../game/gameStateInstance.js";

const router = Router();

router.post("/consequence/add", (req, res) => {
  const { consequenceId } = req.body;

  if (typeof consequenceId !== "number") {
    return res.status(400).json({
      error: "consequenceId invalide",
    });
  }

  gameState.addConsequence(consequenceId);

  return res.json({
    success: true,
    consequenceId,
  });
});

export default router;
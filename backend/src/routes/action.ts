import { Router } from "express";

import type { ActionRequest } from "../../../shared/types/action.js";
import type { ActionResult } from "../../../shared/types/actionResult.js";

import { gameState } from "../game/gameStateInstance.js";

const router = Router();

router.post("/action", (req, res) => {
  try {
    const action = req.body as ActionRequest;

    console.log("ACTION RECUE :", action);

    const result: ActionResult =
      gameState.playAction(action);

    return res.json(result);

  } catch (error) {
    console.error("Erreur action :", error);

    return res.status(500).json({
      error: "Erreur lors de l'action",
    });
  }
});

export default router;
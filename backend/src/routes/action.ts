import { Router } from "express";

import type { ActionRequest } from "../../../shared/types/action.js";
import type { ActionResult } from "../../../shared/types/actionResult.js";
import type { PotionRequest } from "../../../shared/types/action.js";

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

router.post("/usePotion", (req, res) => {
  try {
    const p = req.body as PotionRequest;

    const result =
      gameState.team.usePotion(
        p.id_pj,
        p.id_target,
        p.id_potion
      );
    
    console.log(result)
   
   
    return res.json({
      result,
      gameState: gameState.toView(),
    });

  } catch (error) {
    console.error(error);

    return res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "Erreur utilisation potion",
    });
  }
});



export default router;
import { Router } from "express";
import { gameState } from "../game/gameStateInstance.js";


const router = Router();

router.post(
  "/alchemy/create-potion",
  (req, res) => {
    const {
      pjId,
      ingredientIds,
      power,
    } = req.body;

    const pj = gameState.team.pjs.find(
      pj => pj.id === pjId
    );

    if (!pj) {
      return res.status(404).json({
        error: "PJ introuvable",
      });
    }

    const result = pj.makePotion(
      ingredientIds,
      power
    );

    res.json({
      success: result.potion !== null,
      ingredientUsed: result.ingredientUsed,
      potion: result.potion?.toView() ?? null,
      gameState: gameState.toView(),
    });
  }
);
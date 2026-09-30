import { Router } from "express";
import { getGameState,setGameState } from "../game/gameStateInstance.js";


const router = Router();

router.post(
  "/alchemy/create-potion",
  (req, res) => {
    const {
      pjId,
     
    } = req.body;

    const gameState = getGameState();

    if (!gameState) {
    return res.status(404).json({
      error: "Aucune partie en cours",
    });
  }

    const pj = gameState.team.pjs.find(
      pj => pj.id === pjId
    );

    if (!pj) {
      return res.status(404).json({
        error: "PJ introuvable",
      });
    }

   
    const result = pj.makePotion();
    console.log(result);
    res.json({
      success: result.potion !== null,
      ingredientUsed: result.ingredientUsed,
      potion: result.potion?.toView() ?? null,
      gameState: gameState.toView(),
    });
  }
);


export default router;

import { Router } from "express";

import { gameState } from "../game/gameStateInstance.js";


const router = Router();

router.post("/executeIA", (req, res) => {
  try {
   
    if (!gameState.fight) {
      return res.status(400).json({
        error: "Aucun combat en cours",
      });
    }

    // L'IA exécute son tour complet
    const results = gameState.fight.executeIA();
    
     return res.json({
      results:results,
      gameState: gameState.toView(),
    });

  } catch (error) {
    console.error("Erreur executeIA :", error);

    return res.status(500).json({
      error: "Erreur lors du tour de l'IA",
    });
  }
});


export default router;
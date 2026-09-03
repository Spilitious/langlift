import { Router } from "express";

const router = Router();
import { gameState } from "../game/gameStateInstance.js";

router.get(
  "/room/:id",
  (req, res) => {
    const id =Number(req.params.id);
    
  if (gameState.room?.id !== id) {
    gameState.buildRoom(id);
  }

    res.json(gameState.toView());
  }
);


router.post(
  "/room/victory",
  (req, res) => {
   
    
    const victoryResult = gameState.executeVictory();    
   
    res.json(victoryResult);
  }
);
export default router;
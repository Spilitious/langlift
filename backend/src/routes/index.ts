import { Router } from "express";
import { gameState } from "../game/gameStateInstance.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "langlift-backend",
  });
});




/*  Ajout d'une conséquence suite à un choix */ 
import consequenceRouter from "./consequence.js";
router.use( consequenceRouter);

/* Pour la lecture des rooms */
import roomRouter from "./room.js";
router.use(roomRouter);

/* Changement de destination */
import destinationRouter from "./navigation.js";
router.use( destinationRouter);


/* Action fight */
import actionRouter from "./action.js";
router.use( actionRouter);


router.get("/game-state", (req, res) => {
  res.json(gameState.toView());
});

//Route temporaire pour reset l'histoire au debut
router.post("/reset/:pageId", (req, res) => {
  const pageId = Number(req.params.pageId);

  gameState.reset(pageId);

  return res.json(
    gameState.toView()
  );
});

export default router;
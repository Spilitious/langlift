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


/* AlechemyRoutert */
import alchemyRouter from "./action.js";
router.use( alchemyRouter);

/* Déplacement d'objet  */
import MoveObject from "./equipment.js";
router.use( "/equipment", MoveObject);

router.get("/game-state", (req, res) => {
  res.json(gameState.toView());
});

router.post("/reset", (req, res) => {
  gameState.reset();

  return res.json(
    gameState.toView()
  );
});


export default router;
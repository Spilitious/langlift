import { Router } from "express";
import { getGameState } from "../game/gameStateInstance.js";

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


/* AlechemyRouter */
import alchemyRouter from "./alchemy.js";
router.use( alchemyRouter);

/* Déplacement d'objet  */
import MoveObject from "./equipment.js";
router.use( "/equipment", MoveObject);


/* IA  */
import Ia from "./ia.js";
router.use(  Ia);


/* LevelUp  */
import levelUp from "./levelUp.js";
router.use(  levelUp);



/* Shop  */
import Shop from "./shop.js";
router.use(  Shop);


/* GameState  */
import GameState from "./gameState.js";
router.use( "/gameState", GameState);



export default router;
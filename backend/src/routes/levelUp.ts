import { Router } from "express";
import { gameState } from "../game/gameStateInstance.js";

const router = Router();


router.get("/levelUp/learnable/:pjId", (req, res) => {
  try {
    const pjId = Number(req.params.pjId);

    if (!Number.isInteger(pjId)) {
      return res.status(400).json({
        error: "pjId invalide",
      });
    }

    const abilities =
      gameState.team.getLearnableAbilities(pjId);

    return res.json(abilities);

  } catch (error) {
    console.error(
      "Erreur récupération abilities :",
      error
    );

    return res.status(400).json({
      error: "Impossible de récupérer les abilities",
    });
  }
});

router.post("/levelUp/learn", (req, res) => {
  try {
    const {
      pjId,
      basicAbilityId,
    } = req.body;

    if (
      !Number.isInteger(pjId) ||
      !Number.isInteger(basicAbilityId)
    ) {
      return res.status(400).json({
        error: "Paramètres invalides",
      });
    }
    
    gameState.team.learnAbility(pjId, basicAbilityId);
    const hp = gameState.team.levelUp(pjId);
    console.log("hp", hp)
    return res.json({
      hpDelta:hp, 
      gameState: gameState.toView(),
    });

  } catch (error) {
    console.error(
      "Erreur apprentissage ability :",
      error
    );

    return res.status(400).json({
      error: "Impossible d'apprendre cette ability",
    });
  }
});

export default router;
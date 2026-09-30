import { Router } from "express";
import { getGameState } from "../game/gameStateInstance.js";
import type { BaseAttributes } from "../../../shared/types/label.js";

const router = Router();


router.get("/levelUp/learnable/:pjId", (req, res) => {
  try {
    const pjId = Number(req.params.pjId);

    if (!Number.isInteger(pjId)) {
      return res.status(400).json({
        error: "pjId invalide",
      });
    }

    const gameState = getGameState();

    if (!gameState) {
    return res.status(404).json({
      error: "Aucune partie en cours",
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


router.get("/levelUp/learnableTalents/:pjId", (req, res) => {
  try {
    const pjId = Number(req.params.pjId);

    if (!Number.isInteger(pjId)) {
      return res.status(400).json({
        error: "pjId invalide",
      });
    }

    const gameState = getGameState();

    if (!gameState) {
    return res.status(404).json({
      error: "Aucune partie en cours",
    });
  }

    const abilities =
      gameState.team.getLearnableTalents(pjId);

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


router.post("/levelUp/learnAbility", (req, res) => {
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
    
    const gameState = getGameState();

    if (!gameState) {
    return res.status(404).json({
      error: "Aucune partie en cours",
    });
  }

    const abilityName = gameState.team.learnAbility(pjId, basicAbilityId);
    const hp = gameState.team.levelUp(pjId);
   
    return res.json({
      hpDelta:hp,
      basicAbilityName: abilityName, 
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


router.post("/levelUp/learnAttribut", (req, res) => {
  try {
   const {
  pjId,
  attributeId,
}: {
  pjId: number;
  attributeId: keyof BaseAttributes;
} = req.body;

    if (!Number.isInteger(pjId) ) {
      return res.status(400).json({
        error: "Paramètres invalides",
      });
    }
   
    const gameState = getGameState();

    if (!gameState) {
    return res.status(404).json({
      error: "Aucune partie en cours",
    });
  }
    const hpStart = gameState.team.getPj(pjId).getStat("maxhp")
    gameState.team.learnAttribut(pjId, attributeId);
    gameState.team.levelUp(pjId);
    const hpEnd = gameState.team.getPj(pjId).getStat("maxhp")
    return res.json({
      hpDelta:hpEnd-hpStart,
      attribute:attributeId, 
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



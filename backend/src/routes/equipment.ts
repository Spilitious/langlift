import { Router } from "express";
import { getGameState } from "../game/gameStateInstance.js";

import type {
  EquipmentSlot,
  MoveObjectResult,
} from "../../../shared/types/equipmentView.js";

const router = Router();

/* =========================================================
   MOVE EQUIPMENT TO INVENTORY
   ========================================================= */
router.post("/inventory", (req, res) => {
  const {
    pjId,
    equipmentId,
    x,
    y,
  } = req.body;

  const gameState = getGameState();

    if (!gameState) {
    return res.status(404).json({
      error: "Aucune partie en cours",
    });
  }

  const pj = gameState.team.pjs.find(
    (pj) => pj.id === pjId
  );

  if (!pj) {
    return res.status(404).json({
      error: "PJ introuvable",
    });
  }

  
  const moveResult =
    pj.moveEquipmentToInventory(
      equipmentId,
      x,
      y
    );

  return res.json({
    moveResult,
    gameState: gameState.toView(),
  });
});


/* =========================================================
   MOVE EQUIPMENT TO BELT
   ========================================================= */

router.post("/belt", (req, res) => {
  try {
    const {
      pjId,
      equipmentId,
      slot,
    } = req.body;

    const gameState = getGameState();

    if (!gameState) {
    return res.status(404).json({
      error: "Aucune partie en cours",
    });
  }

    const pj = gameState.team.pjs.find(
      (pj) => pj.id === pjId
    );

    if (!pj) {
      return res.status(404).json({
        error: "PJ introuvable",
      });
    }

    const moveResult: MoveObjectResult =
      pj.moveEquipmentToBelt(
        equipmentId,
        slot
      );

      
    
    return res.json({
    moveResult,
    gameState: gameState.toView(),
    });
  } catch (error) {
    console.error(
      "Erreur move equipment belt :",
      error
    );

    return res.status(500).json({
      error: "Erreur déplacement ceinture",
    });
  }
});


/* =========================================================
   MOVE EQUIPMENT TO ALCHEMY
   ========================================================= */

router.post("/alchemy", (req, res) => {
  try {
    const {
      pjId,
      equipmentId,
      slot,
    } = req.body;

    const gameState = getGameState();

    if (!gameState) {
    return res.status(404).json({
      error: "Aucune partie en cours",
    });
  }

    const pj = gameState.team.pjs.find(
      (pj) => pj.id === pjId
    );

    if (!pj) {
      return res.status(404).json({
        error: "PJ introuvable",
      });
    }

    const moveResult: MoveObjectResult =
      pj.moveEquipmentToAlchemy(
        equipmentId,
        slot
      );

      
    
    return res.json({
    moveResult,
    gameState: gameState.toView(),
    });
  } catch (error) {
    console.error(
      "Erreur move equipment belt :",
      error
    );

    return res.status(500).json({
      error: "Erreur déplacement ceinture",
    });
  }
});

/* =========================================================
   EQUIP
   ========================================================= */
router.post("/equip", (req, res) => {
  const {
    pjId,
    equipmentId,
    slot,
  } = req.body;

  const gameState = getGameState();

    if (!gameState) {
    return res.status(404).json({
      error: "Aucune partie en cours",
    });
  }
  const pj = gameState.team.pjs.find(
    (pj) => pj.id === pjId
  );

  if (!pj) {
    return res.status(404).json({
      error: "PJ introuvable",
    });
  }

  const moveResult =
    pj.equip(
      equipmentId,
      slot
    );

  return res.json({
    moveResult,
    gameState: gameState.toView(),
  });
});

router.post("/buy", (req, res) => {
  try {
    const {
      shopId,
      pjId,
      equipmentId,
      x,
      y,
      price,
    } = req.body;

    const gameState = getGameState();

    if (!gameState) {
    return res.status(404).json({
      error: "Aucune partie en cours",
    });
  }

    const shop = gameState.shop;

    if (!shop || shop.id !== shopId) {
      return res.status(404).json({
        error: "Shop invalide",
      });
    }

    const equipment = shop.equipments.find((equipment) => equipment.id === equipmentId);

    if (!equipment) {
      return res.status(404).json({
        error: "Equipement introuvable",
      });
    }

    const buyResult =
      gameState.team.buy(
        equipment,
        pjId,
        x,
        y,
        price
      );

    if (buyResult.result) {
      shop.removeEquipment(equipment.id);
    }

    return res.json({
      buyResult,
      gameState: gameState.toView(),
    });
  } catch (error) {
    console.error(
      "Erreur achat équipement :",
      error
    );

    return res.status(500).json({
      error: "Erreur achat équipement",
    });
  }
});

router.post("/sell", (req, res) => {
  try {
    const {
      pjId,
      equipmentId,
      price,
    } = req.body;

    const gameState = getGameState();

    if (!gameState) {
    return res.status(404).json({
      error: "Aucune partie en cours",
    });
  }
  
    const sellResult =
      gameState.team.sell(
        pjId,
        equipmentId,
        price
      );

    return res.json({
      sellResult,
      gameState: gameState.toView(),
    });
  } catch (error) {
    console.error(
      "Erreur vente équipement :",
      error
    );

    return res.status(500).json({
      error: "Erreur vente équipement",
    });
  }
});
router.post("/moveToPlayer", (req, res) => {
  try {
    const {
      sourcePjId,
      targetPjId,
      equipmentId,
    } = req.body;

    const gameState = getGameState();

    if (!gameState) {
      return res.status(400).json({
        error: "Aucune partie en cours",
      });
    }

    const result =
      gameState.team.moveEquipmentToPlayer(
        sourcePjId,
        targetPjId,
        equipmentId
      );

    return res.json({
      result,
      gameState: gameState.toView(),
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error:
        "Erreur lors du transfert de l'équipement",
    });
  }
});
export default router;
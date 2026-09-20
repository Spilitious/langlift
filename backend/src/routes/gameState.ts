import { Router } from "express";

import { loadGame, saveGame, getSavePreview, findFirstEmptySaveSlot, deleteSave} from "../utils/saveGame.js";
import type { SavePreview } from "../../../shared/types/gameStateView.js";
import { GameState } from "../classes/GameState.js";
import {
  getGameState,
  setGameState,
} from "../game/gameStateInstance.js";

const router = Router();



router.post("/newGame", async (req, res) => {
  try {
    const saveId = await findFirstEmptySaveSlot();

    if (saveId === null) {
      return res.json({
        success: false,
        reason: "NO_EMPTY_SAVE_SLOT",
      });
    }

    const newGameState = new GameState(saveId);
    newGameState.newGame();

    setGameState(newGameState);

    return res.json({
      success: true,
      gameState: newGameState.toView(),
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erreur lors de la création de la partie",
    });
  }
});


router.post("/save", async (req, res) => {
  try {
    const gameState = getGameState();

    if (!gameState) {
      return res.status(400).json({
        error: "Aucune partie en cours",
      });
    }

    await saveGame(gameState);

    return res.json({
      success: true,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erreur lors de la sauvegarde",
    });
  }
});

router.get("/saves", async (req, res) => {
  try {
    const saves: SavePreview[] = [];

    for (let id = 1; id <= 4; id++) {
      const preview = await getSavePreview(id);
      saves.push(preview);
    }

    return res.json(saves);
  } catch (error) {
    console.error(
      "Erreur chargement sauvegardes :",
      error
    );

    return res.status(500).json({
      error:
        "Erreur lors du chargement des sauvegardes",
    });
  }
});

router.get("/loadGame/:saveId", async (req, res) => {
  try {
    const saveId = Number(req.params.saveId);

   const loadedGameState = await loadGame(saveId);
    setGameState(loadedGameState);
    return res.json(loadedGameState.toView());

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erreur lors du chargement",
    });
  }
});


router.get("/reload", (req, res) => {
  const gameState = getGameState();
 

  if (!gameState) {
    return res.json(null);
  }

  return res.json(gameState.toView());
});

router.post("/reset", (req, res) => {
  const gameState = getGameState();

  if (!gameState) {
    return res.status(404).json({
      error: "Aucune partie en cours",
    });
  }

  gameState.reset();

  return res.json(
    gameState.toView()
  );
});

router.delete("/save/:id", async (req, res) => {
  try {
    const saveId = Number(req.params.id);

    if (
      !Number.isInteger(saveId) ||
      saveId < 1 ||
      saveId > 4
    ) {
      return res.status(400).json({
        error: "INVALID_SAVE_ID",
      });
    }

    const deleted = await deleteSave(saveId);

    return res.json({
      success: true,
      deleted,
      saveId,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erreur lors de la suppression de la sauvegarde",
    });
  }
});

export default router;

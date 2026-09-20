import fs from "fs/promises";
import path from "path";

import { GameState } from "../classes/GameState.js";
import type { SavePreview, GameStateSave } from "../../../shared/types/gameStateView.js";

export async function saveGame(
  gameState: GameState
) {

  const save = gameState.toSave();

  const saveDirectory = path.join(
    process.cwd(),
    "saves"
  );

  await fs.mkdir(saveDirectory, {
    recursive: true,
  });

  const savePath = path.join(
    saveDirectory,
    `save${gameState.saveId}.json`
  );

   console.log("save", savePath);

  const json = JSON.stringify(
    save,
    null,
    2
  );

  await fs.writeFile(
    savePath,
    json,
    "utf-8"
  );
}


export async function getSavePreview(
  id: number
): Promise<SavePreview> {
  const savePath = path.join(
    process.cwd(),
    "saves",
    `save${id}.json`
  );

  try {
    const file = await fs.readFile(
      savePath,
      "utf-8"
    );

    const save: GameStateSave =
      JSON.parse(file);

    return {
      id,
      date: save.date ?? null,

      players: save.team.pjs.map(pj => ({
        name: pj.name,
        avatar: pj.avatar,
        level: pj.level,
        xp:pj.xp,
        base_att:pj.base_att,
        nextLevelXp: 10+pj.level*20
      })),
    };
  } catch (error) {
    return {
      id,
      date: null,
      players: [],
    };
  }
}


export async function loadGame(
  saveId: number
): Promise<GameState> {


  const savePath = path.join(
    process.cwd(),
    "saves",
    `save${saveId}.json`
  );

 
  const json = await fs.readFile(
    savePath,
    "utf-8"
  );

  const data: GameStateSave =
    JSON.parse(json);
  
  const gameState = new GameState(saveId);
  gameState.fromSave(data);

  return gameState;
}


const MAX_SAVES = 4;

export async function findFirstEmptySaveSlot():
  Promise<number | null> {

  const saveDirectory = path.join(
    process.cwd(),
    "saves"
  );

  for (let id = 1; id <= MAX_SAVES; id++) {
    const savePath = path.join(
      saveDirectory,
      `save${id}.json`
    );

    try {
      await fs.access(savePath);
    } catch {
      // Le fichier n'existe pas :
      // ce slot est libre
      return id;
    }
  }

  // Les 4 slots sont occupés
  return null;
}


export async function deleteSave(saveId: number): Promise<boolean> {
  if (!Number.isInteger(saveId) || saveId < 1 || saveId > 4) {
    throw new Error("ID de sauvegarde invalide");
  }

  const saveDirectory = path.join(
    process.cwd(),
    "saves"
  );

  const savePath = path.join(
    saveDirectory,
    `save${saveId}.json`
  );

  try {
    await fs.unlink(savePath);
    return true;
  } catch (error: any) {
    // Le fichier n'existe déjà plus
    if (error.code === "ENOENT") {
      return false;
    }

    throw error;
  }
}
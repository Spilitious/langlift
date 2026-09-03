import type { BmView } from "./bmView";
import type {AnimationName} from "./animation"
import type { FightPopupData } from "./fightPopUp";
import type { NpcIntentView } from "./npcIntentView";
import type { GameStateView } from "./gameStateView";
import type {EquipmentView} from "./equipmentView";
import Equipment = require("../../backend/src/classes/Equipment");


export type FightStatus =
  | "ongoing"
  | "victory"
  | "defeat";


export type TargetResult = {
  target_type: "pj" | "npc";
  id_target: number;
  
  animationName: AnimationName;

  hp_start: number;
  hp_end: number;

  shield_start: number;
  shield_end: number;

  bm_end: BmView[];

  new_intent?: NpcIntentView;

  popup: FightPopupData;
};


export type ActionResult = {
  author_type?: "pj" | "npc";
  id_author?: number;
  animationName: AnimationName;

  steps: TargetResult[][];
  fightStatus: FightStatus;
};

export type ActionResponse = {
  result: ActionResult;
  gameState: GameStateView;
};

export type VictoryResult= {
    xpResult:XpResult[];
    loots:EquipmentView[];
}

export type XpResult = {
  pjName: string;
  xpGained: number;
  level_up: boolean;
};

export type CreatePotionResult = {
  success: boolean;
  potion: EquipmentView | null;
  ingredientUsed:boolean;
  gameState: GameStateView;
};
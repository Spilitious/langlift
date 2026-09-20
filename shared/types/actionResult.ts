import type { BmView } from "./bmView";
import type {AnimationName} from "./animation"
import type { FightPopupData } from "./fightPopUp";
import type { NpcIntentView } from "./npcIntentView";
import type { GameStateView } from "./gameStateView";
import type {EquipmentView} from "./equipmentView";
import type label = require("./label");


export type buildRoomResult = {
  animation:ActionResult[][];
  gameState:GameStateView;
}



export type FightStatus =
  | "ongoing"
  | "victory"
  | "defeat";

export type ActionResult = {
  fighter_type: "pj" | "npc";
  fighter_id: number;
  animationName: AnimationName;
  fightStatus:FightStatus;

  hp_start: number;
  hp_end: number;

  shield_start: number;
  shield_end: number;

  armor_start: number;
  armor_end: number;

  bm_end: BmView[];

  popup?: FightPopupData;
  new_intent?: NpcIntentView;
};

export type ActionResponse = {
  result: ActionResult[][];
  gameState: GameStateView;
};

export type VictoryResult= {
    xpResult:XpResult[];
    loots:EquipmentView[];
   
}


export type VictoryResponse= {
   results:VictoryResult;
   gameState:GameStateView;
   
}

export type LevelUpResponse = {
  hpDelta:number;
  attribute?: keyof label.BaseAttributes;
  basicAbilityName?:string;
  gameState:GameStateView;
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
import { BmView } from "./bmView";
import {AnimationName} from "./animation"
import { FightPopupData } from "./fightPopUp";
import { NpcIntentView } from "./npcIntentView";


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

  new_intent: NpcIntentView;

  popup: FightPopupData;
};


export type ActionResult = {
  author_type?: "pj" | "npc";
  id_author?: number;
  animationName: AnimationName;

  steps: TargetResult[][];
  fightStatus: FightStatus;
};
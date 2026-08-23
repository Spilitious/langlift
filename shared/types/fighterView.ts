import type { AnimationEvent } from "./animation";
import { BmView } from "./bmView";
import { NpcIntentView } from "./npcIntentView";
import {Action} from "./action"
import { Equipment } from "./equipment";

export type FighterView = {
  id: number;
  image: number;
  name:string;
  level:number;
  position:number;
  shield:number;
  hp: number;
  maxHp: number;
  bms : BmView[];
};

export type PjView = FighterView & {
  ap : number;
  xp : number;
  actions: Action[];
  inventory: number[][];
  equipment: Equipment[];

}

export type NpcView = FighterView & {
  npc_intent: NpcIntentView;
  pending_intent?: NpcIntentView;
  old_intent?: NpcIntentView;
  
  
}
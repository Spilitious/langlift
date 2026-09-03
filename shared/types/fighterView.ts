import type { AnimationEvent } from "./animation";
import type { BmView } from "./bmView";
import type { NpcIntentView } from "./npcIntentView";
import type {Action} from "./action"
import type { EquipmentView } from "./equipmentView";
import type { StatName, BaseAttributes } from "./label";

export type FighterView = {
  id: number;
  image: number;
  name:string;
  level:number;
  position:number;
  bms : BmView[];
  stats: StatsView;
};

export type StatsView = Record<StatName, number>;


export type PjView = FighterView & {
  ap : number;
  xp : number;
  actions: Action[];
  inventory: number[][];
  equipment: EquipmentView[];
  base_att: BaseAttributes;
 

}



export type NpcView = FighterView & {
  hp:number;
  maxHp:number;
  //power:number[];
  npc_intent: NpcIntentView;
  pending_intent?: NpcIntentView;
  old_intent?: NpcIntentView;
  
  
}

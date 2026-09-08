import type { AnimationEvent } from "./animation";
import type { BmView } from "./bmView";
import type { NpcIntentView } from "./npcIntentView";
import type { EquipmentView } from "./equipmentView";
import type { StatName, BaseAttributes } from "./label";
import type {AbilityView} from "./abilityView";

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
  nextLevelXp:number;
  avatar : number;
  inventory: number[][];
  equipment: EquipmentView[];
  base_att: BaseAttributes;
  ability: AbilityView[];
  isUnconscious:boolean;
  canLevelUp:boolean;
 

}



export type NpcView = FighterView & {
  intent: NpcIntentView;
  pending_intent?: NpcIntentView;
  old_intent?: NpcIntentView;
  
  
}

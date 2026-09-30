import type { AnimationEvent } from "./animation";
import type { BmView, BmSave } from "./bmView";
import type { NpcIntentView } from "./npcIntentView";
import type { EquipmentView, EquipmentSave } from "./equipmentView";
import type { StatName, BaseAttributes } from "./label";
import type {AbilityView, AbilitySave} from "./abilityView";

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
  fight_absent:number;
  inventory: number[][];
  equipment: EquipmentView[];
  base_att: BaseAttributes;
  ability: AbilityView[];
  isUnconscious:boolean;
  canLevelUp:boolean;
 

}


export type PjPreview = {
  name:string;
  avatar:number;
  level:number;
  xp : number;
  base_att:BaseAttributes;
  nextLevelXp:number;
}

export type PjSave = {
  id: number;
  image: number;
  avatar : number;
  name:string;
  level:number;
  xp : number;
  fight_absent:number;
  base_att: BaseAttributes;
  equipment: EquipmentSave[];
  ability: AbilitySave[];
  bms : BmSave[];
}

export type SavePlayerView = {
  id: number;
  name: string;
  avatar: number;
  level: number;
};

export type NpcView = FighterView & {
  intent: NpcIntentView;
  pending_intent?: NpcIntentView;
  old_intent?: NpcIntentView;
  size:number;
  
  
}

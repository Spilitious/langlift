import type { PjView, PjSave} from "./fighterView";

export type TeamView = {
  pjs: PjView[];
  gold:number;
  profession:Profession;
  };

  
export type Profession = {
  alchemy: number,
  blacksmith:number,
  armorsmith:number,
}



export type TeamSave = {
  pjs: PjSave[];
  gold:number;
  profession:Profession;
  };
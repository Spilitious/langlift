import type { PjView } from "./fighterView";

export type TeamView = {
  pjs: PjView[];
  gold:number;
  profession:Profession;
  };

  
export type Profession = {
  alchimie: number,
  blacksmith:number,
  armorsmith:number,
}
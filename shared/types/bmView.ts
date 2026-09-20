
import type { StatName } from "./label";

export type BmDisplay = "none" | "life" | "empty" | "both" |"normal";


export type BmView = {
  id: number;
  basicBmId:number;
  name: string;
  image: number;
  life: number;
  display:BmDisplay;
  bonus: Partial<Record<StatName, number>>;
  mainStat:StatName;
};


export type BmSave = {
  id: number;
  basicBmId:number;
  name: string;
  image: number;
  life: number;
  display:BmDisplay;
  bonus: Partial<Record<StatName, number>>;
  mainStat:StatName;
};
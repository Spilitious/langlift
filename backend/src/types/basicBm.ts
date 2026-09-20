import type { BmDisplay } from "../../../shared/types/bmView.js";
import type { StatName } from "../../../shared/types/label.js";

export type BmType = "value_cumulative" | "life_cumulative" | "replaced" | "both_cumulative"

export type BasicBm = {
 
  id: number;
  name: string;
  image: number;
  life:number;
  removable:boolean;
  display:BmDisplay;
  mainStat:StatName;
  type:BmType;
  bonus: Partial<Record<StatName, number>>;

}
 
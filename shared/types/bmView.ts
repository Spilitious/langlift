
import type { StatName } from "./label";

export type BmDisplay = StatName | "none" | "life";


export type BmView = {
  id: number;
  name: string;
  image: number;
  life: number;
  display:BmDisplay;
  bonus: Partial<Record<StatName, number>>;
};
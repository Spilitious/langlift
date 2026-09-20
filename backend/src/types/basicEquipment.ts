import type { EquipmentType } from "../../../shared/types/equipmentView.js";

import type { StatName } from "../../../shared/types/label.js";



export type BasicEquipment = {
  id:number;
  name: string;
  type: EquipmentType;
  image: number;
  width: number;
  height: number;
  price:number;
  text:string;
  bonus: Partial<Record<StatName, number>>;
};

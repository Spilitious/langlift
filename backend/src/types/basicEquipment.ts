import type { EquipmentType } from "../../../shared/types/equipmentView.js";

export const Const_Equipment = {
  HP_POTION: 1,
  STR_POTION: 2,
  MM_POTION: 3,
  RAT_TAIL: 4,
  TOAD_TONGUE: 5,
  BAT_CLAW: 6,
  BASE_SWORD:7,
  BASE_STAFF:9,
  BASE_ARMOR:10,
  BASE_HELM:14,
  BASE_SHIELD:15,
  BASE_TOGE:16, 
  
  MEDIUM_SWORD:11,
  MEDIUM_STAFF:12,
  MEDIUM_ARMOR:13,
  MEDIUM_HELM:17,
  MEDIUM_SHIELD:18,
  MEDIUM_TOGE:19,
  
  
} as const;



export type BasicEquipment = {
  id:number;
  name: string;
  type: EquipmentType;
  image: number;
  width: number;
  height: number;
  price:number;
  text:string;
};

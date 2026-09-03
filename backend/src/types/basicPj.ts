import { Bm } from "../classes/Bm.js";
import type { Equipment } from "../classes/Equipment.js";


export type BasicPj = {
  id: number;
  image: number;
  name: string;
  level: number;
  position: number;
};


export type BasicNpc= {
  id: number;
  image: number;
  name: string;
  level_start: number;
  armor_start:number;
  hp_start: number;
  power_start:number[];
  upgradeRate:upgradeRates;
  bms:Bm[];
};


export type upgradeRates = {
  hp: number;
  armor: number;
  power: number[];
  bm_start:number;
};

export type makePotionResult = {
  potion:Equipment | null;
  ingredientUsed:boolean;
}
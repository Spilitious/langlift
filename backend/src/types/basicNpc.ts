import type { StatName } from "../../../shared/types/label.js";
import { Bm } from "../classes/Bm.js";

export type TargetSelectMode = {
    feature: StatName,
    mode : "min" | "max",
}

export type upgradeRates = {
  hp: number;
  armor: number;
  damage:number;
  magicSkill:number;
  power: number;
  bm:number;
};

export type BasicNpc= {
  id: number;
  image: number;
  name: string;
  size: number;
  favoriteTarget:TargetSelectMode;
  level_start: number;
  armor_start:number;
  hp_start: number;
  shield_start:number;
  damage_start:number;
  magicSkill_start:number
  power_start:number;
  bm_start:number[];
  upgradeRate:upgradeRates;
  bms:number[];
};

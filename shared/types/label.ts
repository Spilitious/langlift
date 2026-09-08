export type BaseAttributes = {
  constitution: number;
  strength: number;
  magicSkill: number;
  currhp:number;
  shield:number;
};

export type NpcBaseAttributes = {
  maxHp: number;
  damage: number;
  magicSkill: number;
  currhp:number;
  shield:number;
  armor:number;
  power:number;
};
  

export const STAT_NAMES = [
  "constitution",
  "strength",
  "magicSkill",
  "armor",
  "shield",
  "maxhp",
  "damage",
  "MM",
  "power",
  "currhp",
  "regen",
  "evasion",
  "spike",
  "ap",
  "reflex",
  "ward",
  "bleed",
  "burn",
] as const;

export type StatName =
  typeof STAT_NAMES[number];
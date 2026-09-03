export type BaseAttributes = {
  constitution: number;
  strength: number;
  magicSkill: number;
  currhp:number;
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
  "power1",
  "power2",
  "power3",
  "regen",
  "evasion",
  "spike",
] as const;

export type StatName =
  typeof STAT_NAMES[number];
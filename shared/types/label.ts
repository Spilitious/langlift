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
  "shield_bonus",
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
  "provocation",
  "shield_expert",
  "exposed",
  "ethereal",
  "guerison",
  "destruction",
  "protection",
  "alteration",
  "hp",
  "lifeSteal"
] as const;

export type StatName =
  typeof STAT_NAMES[number];


export const STAT_LABELS: Partial<Record<StatName, string>> = {
 
  armor:"Armure",
  damage:"Dégâts bonus",

  shield_bonus: "Bouclier bonus",
  regen: "Regen",
  evasion: "Evasion",
  spike: "Épine",
  ap: "Vitesse",
  reflex: "Bouclier réflexe",
  ward: "Protection",
  exposed: "Résistance",
  guerison: "Guérision",
  destruction: "Destruction"

  
};


export const STAT_EQUIPMENT_LABELS: Partial<Record<StatName, string>> = {
 
  armor:"Armure",
  damage:"Dégâts bonus",
  constitution: "Constitution",
  strength: "Force",
  magicSkill: "Magie",
  shield_bonus: "Bouclier bonus",
  regen: "Regen",
  evasion: "Evasion",
  spike: "Épine",
  ap: "Vitesse",
  reflex: "Bouclier réflexe",
  ward: "Talisman",
  exposed: "Résistance",
  guerison: "Guérision",
  destruction: "Destruction",
  protection: "Protection",
  alteration: "Alteration",
  hp:"Hp",
  shield:"Bouclier"

  
};
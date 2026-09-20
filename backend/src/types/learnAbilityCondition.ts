import type { SchoolType } from "../../../shared/types/abilityView.js";


export type SchoolRequirement =
  Partial<Record<SchoolType, number>>;


export const SCHOOL_INDEX= {
  Gardien: 0,
  Guerrier: 1,
  Assassin: 2,
  Guérison: 3,
  Protection: 4,
  Altération: 5,
  Destruction: 6,
} as const;



export type  learAbilityCondition = {
    id:number;
    strength_min: number;
    constitution_min: number;
    magicSkill_min:number;
    level_min:number;
    hasAtLeast:number[];
    hasOneOf:number[];
    schoolRequirements:SchoolRequirement; 
}



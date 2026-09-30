import type { learAbilityCondition } from "../types/learnAbilityCondition.js";
import {  ABILITY_NAME, SCHOOL_NAME} from "./constants.js";
import { ABILITY_ID } from "../../../shared/utils/abilityConstant.js";



export const learAbilityCondition_data: learAbilityCondition[] = [
    {
        id:ABILITY_ID.GUARD_REFLEX,
        strength_min:0,
        constitution_min:0,
        magicSkill_min:0,
        level_min:3,
        hasAtLeast:[],
        hasOneOf:[],
        schoolRequirements: {Gardien: 2}
    },
     {
        id:ABILITY_ID.VOID_RAY,
        strength_min:0,
        constitution_min:0,
        magicSkill_min:0,
        level_min:1,
        hasAtLeast:[],
        hasOneOf:[],
        schoolRequirements:{Destruction:1}    
    },
     {
        id:ABILITY_ID.CHARGE,
        strength_min:0,
        constitution_min:0,
        magicSkill_min:0,
        level_min:1,
        hasAtLeast:[],
        hasOneOf:[],
        schoolRequirements:{Gardien:1}        
    },
     {
        id:ABILITY_ID.TREACHEROUS_ATTACK,
        strength_min:0,
        constitution_min:0,
        magicSkill_min:0,
        level_min:1,
        hasAtLeast:[],
        hasOneOf:[],
        schoolRequirements:{Assassin:1}        
    },
     {
        id:ABILITY_ID.SHATTERING_ATTACK,
        strength_min:0,
        constitution_min:0,
        magicSkill_min:0,
        level_min:1,
        hasAtLeast:[],
        hasOneOf:[],
        schoolRequirements:{Guerrier:1}      
    },
    {
        id:ABILITY_ID.BLAZING_FIRE,
        strength_min:0,
        constitution_min:0,
        magicSkill_min:0,
        level_min:1,
        hasAtLeast:[],
        hasOneOf:[],
        schoolRequirements:{Destruction:2}      
    },
     {
        id:ABILITY_ID.WARD,
        strength_min:0,
        constitution_min:0,
        magicSkill_min:0,
        level_min:1,
        hasAtLeast:[],
        hasOneOf:[],
        schoolRequirements:{Protection:1}      
    },
     
];


export const getLearnAbilityCondition = (basicAbilityId:number):learAbilityCondition | undefined => {
    const condition = learAbilityCondition_data.find(condition => (condition.id === basicAbilityId))
   
    return condition
} 
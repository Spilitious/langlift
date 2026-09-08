import type {SchoolType, AbilityType, TargetType} from "../../../shared/types/abilityView.js";


export type  BasicAbility = {
    id:number;
    image: number;
    name: string;
    school: SchoolType;
    type: AbilityType;
    detail: string;
    formula: string;
    target: TargetType;
    ap : number;
    duration : number;
    
}

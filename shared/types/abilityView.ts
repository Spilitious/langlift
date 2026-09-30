export type SchoolType = "Gardien" | "Guerrier" |  "Assassin"  |  "Guérison" |  "Protection"  | "Altération" | "Destruction" ;
export type TargetType = "self" | "pj" | "npc" ;
export type AbilityType = "ability" | "spell" |"talent" | "skill";

export type  AbilityView = {
    id:number;
    basicAbilityId:number;
    image: number;
    name: string;
    type:AbilityType;
    school: SchoolType;
    detail: string;
    formula: string;
    target: TargetType;
    ap : number;
    duration : number;
    ignoreProvocation:boolean;
    
}


export type  AbilitySave = {
    id:number;
    basicAbilityId:number;
    image: number;
    name: string;
    type:AbilityType;
    school: SchoolType;
    detail: string;
    formula: string;
    target: TargetType;
    ap : number;
    duration : number;
    ignoreProvocation:boolean;
    
}

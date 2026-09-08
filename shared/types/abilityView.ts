export type SchoolType = "Guérison" | "Destruction" | "Altération" |  "Assassin" | "Guerrier" | "Gardien" | "Protection";
export type TargetType = "self" | "pj" | "npc" ;
export type AbilityType = "ability" | "spell";

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
    
}

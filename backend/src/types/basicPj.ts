
import type { Equipment } from "../classes/Equipment.js";


export type BasicPj = {
  id: number;
  image: number;
  avatar:number;
  name: string;
  level: number;
  
};



export type makePotionResult = {
  potion:Equipment | null;
  ingredientUsed:boolean;
}

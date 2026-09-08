
import { Bm } from "../classes/Bm.js";
import type { BasicBm} from "../types/basicBm.js";
import { BM_ID } from "./constants.js";


export const basicBms:BasicBm[] = [ 
  {
    id:BM_ID.EVASION,
    name: "Evasion",
    image: 5,
    life:-1,
    display:"evasion",
    type:"value_cumulative",
    bonus: {evasion:1}
  },
  {
    id:BM_ID.FATIGUE,
    name: "Fatigué",
    image:3,
    life:-1,
    display:"strength",
    type:"value_cumulative",
    bonus: {strength:-1},
  },
  {
    id:BM_ID.BLEED,
    name: "Saignement",
    image:14,
    life:-1,
    display:"regen",
    type:"value_cumulative",
    bonus: {regen:-1},
  },
  {
  id:BM_ID.BURN,
    name: "Brulûre",
    image:22,
    life:3,
    display:"regen",
    type:"value_cumulative",
    bonus: {regen:-1},
  },
  {
    id:BM_ID.WINGS,
    name: "Ailes de colère",
    image:3,
    life:2,
    display:"life",
    type:"replaced",
    bonus: {strength:1},
  },
  {
    id:BM_ID.GIANT_RAT,
    name: "Rage",
    image:3,
    life:1,
    display:"none",
    type:"replaced",
    bonus: {damage:1},
  },
  {
    id:BM_ID.FIRE_BARRIER,
    name: "Barrière de feu",
    image:11,
    life:3,
    display:"spike",
    type:"life_cumulative",
    bonus: {spike:1},
  },
   {
    id:BM_ID.REGENERATION,
    name: "Régénération",
    image:17,
    life:3,
    display:"regen",
    type:"life_cumulative",
    bonus: {regen:1},
  },
  {
    id:BM_ID.ROCK_SKIN,
    name: "Peau de roc",
    image:15,
    life:3,
    display:"life",
    type:"replaced",
    bonus: {armor:1},
  },
  {
    id:BM_ID.GUARD_REFLEX,
    name: "Bouclier reflexe",
    image:8,
    life:3,
    display:"life",
    type:"replaced",
    bonus: {reflex:1},
  },

];




export const getBasicBm = (id:number):BasicBm => {
    const bm = basicBms.find((bm) => bm.id === id);
   
    
    
  if (!bm) {
    throw new Error(
      `BasicBm introuvable : ${id}`
    );
  }

  return bm;
}

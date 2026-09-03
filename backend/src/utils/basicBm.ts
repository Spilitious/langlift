
import type { BasicBm} from "../types/basicBm.js";


export const basicBms:BasicBm[] = [ 
  {
    id:1,
    name: "Evasion",
    image: 5,
    value:1
  },
  {
    id:2,
    name: "Fatigué",
    image:3,
    value:1,
  }
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

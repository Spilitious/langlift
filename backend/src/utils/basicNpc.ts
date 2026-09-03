import type { NpcView }  from "../../../shared/types/fighterView.js";
import { Bm } from "../classes/Bm.js";
import { Npc } from "../classes/Npc.js";
import {  Const_Bm } from "../types/basicBm.js";
import type { BasicNpc } from "../types/basicPj.js";
import { getBasicBm} from "./basicBm.js";


export const basicNpcs:BasicNpc[] = [ 
  {
      id: 1,
      image : 1,
      name:"Rat Géant",
      level_start:1,
      hp_start:12,
      armor_start:0,
      power_start: [3],
      upgradeRate: {
          hp : 40,
          armor: 20,
          power:[40],
          bm_start: 0, 
        },
      bms: [],
   },
  


  {
      id: 2,
      image : 2,
      name:"Crapaud Géant",
      level_start:1,
      hp_start:42,
      armor_start:0,
      power_start: [3,5],
      upgradeRate: {
          hp : 70,
          armor: 20,
          power:[10],
          bm_start:0 
        },
      bms: [],
   },



  {
      id: 3,
      image : 3,
      name:"Chauve-souris Géante",
      level_start:1,
      hp_start:7,
      armor_start:0,
      power_start: [3,1],
      upgradeRate: {
          hp : 20,
          armor: 0,
          power:[20,10],
          bm_start:50 
        },
      bms: [new Bm(Const_Bm.EVASION)],
   },

   {
      id: 4,
      image :4,
      name:"Loup",
      level_start:2,
      hp_start:17,
      armor_start:0,
      power_start: [3,1],
      upgradeRate: {
          hp : 40,
          armor: 0,
          power:[50,10],
          bm_start:0 
        },
      bms: [],
   }
]
  
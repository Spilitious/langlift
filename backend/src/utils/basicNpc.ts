import type { NpcView }  from "../../../shared/types/fighterView.js";
import { Bm } from "../classes/Bm.js";
import { Npc } from "../classes/Npc.js";
import type { BasicNpc, TargetSelectMode } from "../types/basicNpc.js";
import { getBasicBm} from "./basicBm.js";
import { BM_ID } from "./constants.js";
import { pj1 } from "./mocks/pj.js";


export const basicNpcs:BasicNpc[] = [ 
  {
      id: 1,
      image : 1,
      name:"Rat Géant",
      favoriteTarget : {
        feature: "damage",
        mode : "max",
      },
      level_start:1,
      hp_start:33,
      armor_start:0,
      damage_start:3,
      magicSkill_start:1,
      power_start: 0,
      upgradeRate: {
          hp : 40,
          armor: 30,
          damage:30,
          magicSkill:0,
          power:0,
          bm_start: 0, 
        },
      bms: [],
   },
  


  {
      id: 2,
      image : 2,
      name:"Crapaud Géant",
      favoriteTarget : {
        feature: "maxhp",
        mode : "max",
      },
      level_start:1,
      hp_start:54,
      armor_start:0,
    
      damage_start:5,
      magicSkill_start:0,
      power_start: 8,
      upgradeRate: {
          hp : 20,
          armor: 0,
          damage:60,
          magicSkill:0,
          power:20,
          bm_start: 0, 
        },
      bms: [],
   },



  {
      id: 3,
      image : 3,
      name:"Chauve-souris Géante",
      favoriteTarget : {
        feature: "maxhp",
        mode : "min",
      },
      level_start:1,
      hp_start:24,
      armor_start:0,
      damage_start:3,
      magicSkill_start:0,
      power_start: 1,
      upgradeRate: {
          hp : 30,
          armor: 0,
          damage:20,
          magicSkill:0,
          power:10,
          bm_start: 40, 
        },
      bms: [BM_ID.EVASION],
   },

   {
      id: 4,
      image :4,
      name:"Loup",
      favoriteTarget : {
        feature: "constitution",
        mode : "min",
      },
      level_start:2,
      hp_start:45,
      armor_start:0,
      damage_start:5,
      magicSkill_start:0,
      power_start: 1,
      upgradeRate: {
          hp : 30,
          armor: 20,
          damage:60,
          magicSkill:0,
          power:10,
          bm_start: 0, 
        },
      bms: [],
   }
]

export function getTargetSelectMode(basicNpcId:number):TargetSelectMode {
   const npc = basicNpcs.find((npc) => npc.id === basicNpcId);
   if(!npc) {
    throw(new Error(
      `BasicNpc introuvable : ${basicNpcId}`
    ))
   }
   return npc.favoriteTarget;
}
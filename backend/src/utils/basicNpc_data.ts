import type { NpcView }  from "../../../shared/types/fighterView.js";
import { Bm } from "../classes/Bm.js";
import { Npc } from "../classes/Npc.js";
import type { BasicNpc, TargetSelectMode } from "../types/basicNpc.js";
import { getBasicBm} from "./basicBm_data.js";
import { BM_ID } from "./constants.js";


export const basicNpcs:BasicNpc[] = [ 
  {
      id: 1,
      image : 1,
      name:"Rat Géant",
      size:1,
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
          hp : 50,
          armor: 0,
          damage:50,
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
      size:1,
      favoriteTarget : {
        feature: "maxhp",
        mode : "max",
      },
      level_start:1,
      hp_start:54,
      armor_start:2,
      damage_start:5,
      magicSkill_start:0,
      power_start: 7,
      upgradeRate: {
          hp : 50,
          armor: 30,
          damage:0,
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
      size:1,
      favoriteTarget : {
        feature: "maxhp",
        mode : "min",
      },
      level_start:1,
      hp_start:17,
      armor_start:0,
      damage_start:2,
      magicSkill_start:2,
      power_start: 1,
      upgradeRate: {
          hp : 10,
          armor: 0,
          damage:20,
          magicSkill:0,
          power:20,
          bm_start: 50, 
        },
      bms: [BM_ID.EVASION],
   },

   {
      id: 4,
      image :4,
      name:"Loup",
      size:1,
      favoriteTarget : {
        feature: "currhp",
        mode : "max",
      },
      level_start:2,
      hp_start:45,
      armor_start:2,
      damage_start:6,
      magicSkill_start:0,
      power_start: 1,
      upgradeRate: {
          hp : 30,
          armor: 0,
          damage:60,
          magicSkill:0,
          power:10,
          bm_start: 0, 
        },
      bms: [],
   },
   {
      id: 5,
      image :5,
      name:"Kobold",
      size:1,
      favoriteTarget : {
        feature: "damage",
        mode : "max",
      },
      level_start:2,
      hp_start:23,
      armor_start:0,
      damage_start:6,
      magicSkill_start:0,
      power_start: 2,
      upgradeRate: {
          hp : 30,
          armor: 0,
          damage:50,
          magicSkill:0,
          power:20,
          bm_start: 0, 
        },
      bms: [],
   },
    {
      id: 6,
      image :6,
      name:"Troll",
      size:4,
      favoriteTarget : {
        feature: "magicSkill",
        mode : "max",
      },
      level_start:7,
      hp_start:170,
      armor_start:5,
      damage_start:9,
      magicSkill_start:2,
      power_start: 12,
      upgradeRate: {
          hp : 30,
          armor: 0,
          damage:60,
          magicSkill:0,
          power:10,
          bm_start: 0, 
        },
      bms: [],
   },
    {
      id: 7,
      image :7,
      name:"Ogre à 2 têtes",
      size:3,
      favoriteTarget : {
        feature: "strength",
        mode : "min",
      },
      level_start:10,
      hp_start:120,
      armor_start:7,
      damage_start:11,
      magicSkill_start:3,
      power_start: 24,
      upgradeRate: {
          hp : 30,
          armor: 30,
          damage:40,
          magicSkill:0,
          power:0,
          bm_start: 0, 
        },
      bms: [BM_ID.SHIELD_EXPERT, BM_ID.PROVOCATION],
   },
    {
      id: 8,
      image :9,
      name:"Brigand",
      size:1,
      favoriteTarget : {
        feature: "currhp",
        mode : "max",
      },
      level_start:3,
      hp_start:17,
      armor_start:0,
      damage_start:2,
      magicSkill_start:0,
      power_start: 0,
      upgradeRate: {
          hp : 100,
          armor: 0,
          damage:0,
          magicSkill:0,
          power:0,
          bm_start: 0, 
        },
      bms: []
   },
   

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
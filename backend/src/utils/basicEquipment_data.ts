import type { EquipmentType } from "../../../shared/types/equipmentView.js";
import  type {BasicEquipment } from "../types/basicEquipment.js";
import { BASIC_EQUIPMENT_ID } from "./constants.js";

export const BasicEquipments:BasicEquipment[] = [
{
    id:BASIC_EQUIPMENT_ID.HP_POTION,
  name: "Potion de vie",
  type: "potion",
  image: 1,
  width: 1,
  height: 1,
  price:12,
  text:"Restaure 5 à 8 pv",
  bonus: {},
},
{
    id:BASIC_EQUIPMENT_ID.STR_POTION,
  name: "Potion de force",
  type: "potion",
  image: 2,
  width: 1,
  height: 1,
  price:18,
  text:"+1 point de force",
   bonus: {},
},
{
    id:BASIC_EQUIPMENT_ID.MM_POTION,
  name: "Potion de mana",
  type: "potion",
  image: 3,
  width: 1,
  height: 1,
  price:18,
  text:"+1 point de MM",
   bonus: {},
},
{
    id:BASIC_EQUIPMENT_ID.RAT_TAIL,
  name: "Queue de rat",
  type: "ingredient",
  image: 1,
  width: 1,
  height: 1,
  price:5,
  text:"",
  bonus: {},
},
{
  id:BASIC_EQUIPMENT_ID.TOAD_TONGUE,
  name: "Langue de crapaud",
  type: "ingredient",
  image: 2,
  width: 1,
  height: 1,
  price:5,
  text:"",
  bonus: {},
},
{
    id:BASIC_EQUIPMENT_ID.BAT_FANG,
  name: "Croc de chauve-souris",
  type: "ingredient",
  image: 3,
  width: 1,
  height: 1,
  price:5,
  text:"",
  bonus: {},
},
    {
        id:BASIC_EQUIPMENT_ID.BASE_SWORD,
          name: "Sabre torsadé",
       
        type:  "sword",
        image:  2,
        width: 2,
        height: 3,
        price:150,
        text:"Dégât +1",
        bonus: {damage:1},
    },

  {
        id:BASIC_EQUIPMENT_ID.MEDIUM_SWORD,
        name: "Petite Hache",
        type:  "sword",
        image:  1,
        width: 2,
        height: 3,
        price:380,
        text:"Dégât +2",
        bonus: {damage:2},
  },

 {      id:BASIC_EQUIPMENT_ID.BASE_STAFF,
        name: "Bâton de mage",
        type:  "sword",
        image:  3,
        width: 2,
        height: 3,
        price:240,
        text:"MM +1",
        bonus: {magicSkill:1},
 },
 
 {      id:BASIC_EQUIPMENT_ID.MEDIUM_STAFF,
        name: "Bâton de mage",
        type:  "sword",
        image:  3,
        width: 2,
        height: 3,
        price:520,
        text:"MM +2",
        bonus: {magicSkill:2},
 },


  {     
         id:BASIC_EQUIPMENT_ID.BASE_ARMOR,
        name: "Armure de cuir",
        type:  "armor",
        image:  1,
        width: 2,
        height: 3,
        price:150,
        text:"Armure +1",
        bonus: {armor:1},
  },

 {
        id:BASIC_EQUIPMENT_ID.MEDIUM_ARMOR,
        name: "Armure de cuir renforcé",
        type:  "armor",
        image:  2,
        width: 2,
        height:3,
        price:380,
        text:"Armure +2",
        bonus: {armor:2},
 },
 
 {      id:BASIC_EQUIPMENT_ID.BASE_TOGE,
        name: "Robe de mage supérieur",
        type:  "armor",
        image:  6,
        width: 2,
        height:3,
        price:380,
        text:"MM +1",
        bonus: {magicSkill:1},
 },

 {      id:BASIC_EQUIPMENT_ID.MEDIUM_TOGE,
        name: "Robe de mage supérieur",
        type:  "armor",
        image:  6,
        width: 2,
        height:3,
        price:520,
        text:"MM +2",
        bonus: {magicSkill:2},
 },

   {    id:BASIC_EQUIPMENT_ID.BASE_SHIELD,
        name: "Bouclier rond",
        type:  "shield",
        image:  1,
        width: 2,
        height:3,
        price:80,
        text:"Bouclier +1",
        bonus: {shield_bonus:1},
    },
 
     {      
        id:BASIC_EQUIPMENT_ID.MEDIUM_SHIELD,
        name: "Bouclier rond",
        type:  "shield",
        image:  1,
        width: 2,
        height:3,
        price:150,
        text:"Bouclier +2",
        bonus: {shield_bonus:2},
    },
 
 {      id:BASIC_EQUIPMENT_ID.BASE_HELM,
        name: "Casque plein ",
        type:  "helm",
        image:  2,
        width: 2,
        height:2,
        price:150,
        text:"Armure +1",
        bonus: {armor:1},
    },

 {      id:BASIC_EQUIPMENT_ID.MEDIUM_HELM,
        name: "Casque plein ",
        type:  "helm",
        image:  2,
        width: 2,
        height:2,
        price:380,
        text:"Armure +2",
        bonus: {armor:2},
    },
];


export const getBasicEquipment = (
  id: number
): BasicEquipment => {
  const equip = BasicEquipments.find(
    (equip) => equip.id === id
  );

  if (!equip) {
    throw new Error(
      `BasicEquipment introuvable : ${id}`
    );
  }

  return equip;
};
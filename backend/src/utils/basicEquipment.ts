import type { EquipmentType } from "../../../shared/types/equipmentView.js";
import { Const_Equipment, type BasicEquipment } from "../types/basicEquipment.js";

export const BasicEquipments:BasicEquipment[] = [
{
    id:Const_Equipment.HP_POTION,
  name: "Potion de vie",
  type: "potion",
  image: 1,
  width: 1,
  height: 1,
  price:12,
  text:"Restaure 5 à 8 pv"
},
{
    id:Const_Equipment.STR_POTION,
  name: "Potion de force",
  type: "potion",
  image: 2,
  width: 1,
  height: 1,
  price:18,
  text:"+1 point de force"
},
{
    id:Const_Equipment.MM_POTION,
  name: "Potion de mana",
  type: "potion",
  image: 3,
  width: 1,
  height: 1,
  price:18,
  text:"+1 point de MM"
},
{
    id:Const_Equipment.RAT_TAIL,
  name: "Queue de rat",
  type: "ingredient",
  image: 1,
  width: 1,
  height: 1,
  price:5,
  text:""
},
{
  id:Const_Equipment.TOAD_TONGUE,
  name: "Langue de crapaud",
  type: "ingredient",
  image: 2,
  width: 1,
  height: 1,
  price:5,
  text:""
},
{
    id:Const_Equipment.BAT_CLAW,
  name: "Croc de chauve-souris",
  type: "ingredient",
  image: 1,
  width: 1,
  height: 1,
  price:5,
  text:""
},
    {
        id:Const_Equipment.BASE_SWORD,
        name: "Petite Hache",
        type:  "sword",
        image:  1,
        width: 2,
        height: 3,
        price:150,
        text:"Dégât +1"
    },

  {
        id:Const_Equipment.MEDIUM_SWORD,
        name: "Sabre torsadé",
        type:  "sword",
        image:  2,
        width: 2,
        height: 3,
        price:380,
        text:"Dégât +2"
  },

 {      id:Const_Equipment.BASE_STAFF,
        name: "Bâton de mage",
        type:  "sword",
        image:  3,
        width: 2,
        height: 3,
        price:240,
        text:"MM +1"
 },
 
 {      id:Const_Equipment.MEDIUM_STAFF,
        name: "Bâton de mage",
        type:  "sword",
        image:  3,
        width: 2,
        height: 3,
        price:520,
        text:"MM +2"
 },


  {     
         id:Const_Equipment.BASE_ARMOR,
        name: "Armure de cuir",
        type:  "armor",
        image:  1,
        width: 2,
        height: 3,
        price:150,
        text:"Armure +1"
  },

 {
        id:Const_Equipment.MEDIUM_ARMOR,
        name: "Armure de cuir renforcé",
        type:  "armor",
        image:  2,
        width: 2,
        height:3,
        price:380,
        text:"Armure +2"
 },
 
 {      id:Const_Equipment.BASE_TOGE,
        name: "Robe de mage supérieur",
        type:  "armor",
        image:  6,
        width: 2,
        height:3,
        price:380,
        text:"MM +1"
 },

 {      id:Const_Equipment.MEDIUM_TOGE,
        name: "Robe de mage supérieur",
        type:  "armor",
        image:  6,
        width: 2,
        height:3,
        price:520,
        text:"MM +2"
 },

   {      id:Const_Equipment.BASE_SHIELD,
        name: "Bouclier rond",
        type:  "shield",
        image:  1,
        width: 2,
        height:3,
        price:150,
        text:"Armure +1"
    },
 
     {      
        id:Const_Equipment.MEDIUM_SHIELD,
        name: "Bouclier rond",
        type:  "shield",
        image:  1,
        width: 2,
        height:3,
        price:150,
        text:"Armure +2"
    },
 
 {      id:Const_Equipment.BASE_HELM,
        name: "Casque plein ",
        type:  "helm",
        image:  2,
        width: 2,
        height:2,
        price:150,
        text:"Armure +1"
    },

 {      id:Const_Equipment.MEDIUM_HELM,
        name: "Casque plein ",
        type:  "helm",
        image:  2,
        width: 2,
        height:2,
        price:150,
        text:"Armure +2"
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
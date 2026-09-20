import { Equipment } from "../classes/Equipment.js";
import { BASIC_EQUIPMENT_ID } from "./constants.js";
import type { BasicShop } from "../types/basicShop.js";

export const BasicShops: BasicShop[] = [
    {
        id:1,
        destination:
        {
            type: "text",
            id : 28,
        },
        basicEquipmentId: [
            BASIC_EQUIPMENT_ID.BASE_SWORD, 
            BASIC_EQUIPMENT_ID.MEDIUM_SWORD,
            BASIC_EQUIPMENT_ID.BASE_STAFF,
            BASIC_EQUIPMENT_ID.BASE_ARMOR,
            BASIC_EQUIPMENT_ID.MEDIUM_ARMOR,
            BASIC_EQUIPMENT_ID.MEDIUM_TOGE,
            BASIC_EQUIPMENT_ID.BASE_SHIELD,
            BASIC_EQUIPMENT_ID.MEDIUM_HELM,
            BASIC_EQUIPMENT_ID.HP_POTION,
            BASIC_EQUIPMENT_ID.HP_POTION,
            BASIC_EQUIPMENT_ID.MM_POTION, 
        ]
    },

]


export const getBasicShop = (
  id: number
): BasicShop => {
  const shop = BasicShops.find(
    (room) => room.id === id
  );

  if (!shop) {
    throw new Error(
      `BasicShop introuvable : ${id}`
    );
  }

  return shop;
};
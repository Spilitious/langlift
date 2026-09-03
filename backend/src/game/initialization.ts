import { Shop } from "../classes/Shop.js";
import { Equipment } from "../classes/Equipment.js";
import type { EquipmentType } from "../../../shared/types/equipmentView.js";
import { Const_Equipment } from "../types/basicEquipment.js";




export function createShops(): Shop[] {
  const shop1 = new Shop(1);

  shop1.addEquipment(new Equipment(Const_Equipment.BASE_SWORD));
  shop1.addEquipment(new Equipment(Const_Equipment.MEDIUM_SWORD));
  shop1.addEquipment(new Equipment(Const_Equipment.BASE_STAFF));
  shop1.addEquipment(new Equipment(Const_Equipment.BASE_ARMOR));
  shop1.addEquipment(new Equipment(Const_Equipment.MEDIUM_ARMOR));
  shop1.addEquipment(new Equipment(Const_Equipment.MEDIUM_TOGE));
  shop1.addEquipment(new Equipment(Const_Equipment.BASE_SHIELD)); 
  shop1.addEquipment(new Equipment(Const_Equipment.MEDIUM_HELM));
  shop1.addEquipment(new Equipment(Const_Equipment.HP_POTION));
  shop1.addEquipment(new Equipment(Const_Equipment.HP_POTION));
  shop1.addEquipment(new Equipment(Const_Equipment.MM_POTION));
  return [shop1];
}


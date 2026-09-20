import { Equipment } from "./Equipment.js";
import type { ShopView } from "../../../shared/types/shopView.js";
import type { HistoryDestination } from "../../../shared/types/history.js";
import { getBasicShop } from "../utils/basicShop_data.js";



export class Shop {
  id: number;
  equipments: Equipment[];
  destination: HistoryDestination;

  constructor(basicShopId: number) {
    const basic = getBasicShop(basicShopId);
    this.id = basic.id;
    this.equipments = [];
    for(const id of basic.basicEquipmentId)
        this.equipments.push(Equipment.fromBasicEquipmentId(id))
   
    this.destination = basic.destination;
  }

toView(): ShopView {
      return {
        id: this.id,
        equipments: this.equipments.map((equipment) => equipment.toView()),
        destination: this.destination,
      };
    }

  addEquipment(equipment:Equipment) {
    this.equipments.push(equipment);
  }

  removeEquipment(
  equipmentId: number
): boolean {
  const index =
    this.equipments.findIndex(
      (equipment) =>
        equipment.id === equipmentId
    );

  if (index === -1) {
    return false;
  }

  this.equipments.splice(index, 1);

  return true;
}


  
}
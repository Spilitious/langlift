import { Equipment } from "./Equipment.js";
import type { ShopView } from "../../../shared/types/shopView.js";



export class Shop {
  id: number;
  equipments: Equipment[];

  constructor(id: number) {
    this.id = id;
    this.equipments = [];
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


    toView(): ShopView {
      return {
        id: this.id,
        equipments: this.equipments.map((equipment) => equipment.toView()),
      };
    }
}
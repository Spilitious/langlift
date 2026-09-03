import type { EquipmentType, EquipmentLocation, EquipmentSlot } from "../../../shared/types/equipmentView.js";
import type { BasicEquipment } from "../types/basicEquipment.js";
import type { EquipmentView } from "../../../shared/types/equipmentView.js";
import { getBasicEquipment } from "../utils/basicEquipment.js";

export class Equipment {
 private static nextId = 1;
  id: number;
  basicEquipmentId:number;

  name: string;
  type: EquipmentType;
  image: number;
  width: number;
  height: number;
  price:number;
  location: EquipmentLocation;
  x: number | null;
  y: number | null;

  slot?: EquipmentSlot;
  beltSlot?: number;
  text:string;

  constructor(basicEquipmentId: number)
   {

      const basic = getBasicEquipment(basicEquipmentId);
      this.id =Equipment.nextId++;
      this.basicEquipmentId = basicEquipmentId;
      this.name = basic.name;
      this.type = basic.type;
      this.image = basic.image;
      this.width = basic.width;
      this.height = basic.height;
      this.price = basic.price;
      this.text = basic.text;

      this.location = "dragged";
      this.x = null;
      this.y = null;
  }

  toView():EquipmentView {
    return {
        id:this.id,
        basicEquipmentId:this.basicEquipmentId,
        name:this.name,
        type: this.type,
        image:this.image,
        width:this.width,
        height:this.height,
        price:this.price,
        location:this.location,
        text:this.text,
        x:this.x,
        y:this.y,
         ...(this.slot !== undefined && {
      slot: this.slot,
    }),

    ...(this.beltSlot !== undefined && {
      beltSlot: this.beltSlot,
    }),
  };
  }
}



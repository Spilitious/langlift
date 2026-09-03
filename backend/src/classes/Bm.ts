import type { EquipmentType, EquipmentLocation, EquipmentSlot } from "../../../shared/types/equipmentView.js";
import type { BasicEquipment } from "../types/basicEquipment.js";
import type {BmView } from "../../../shared/types/bmView.js";
import type { BasicBm } from "../types/basicBm.js";
import { getBasicBm } from "../utils/basicBm.js";

export class Bm {
 private static nextId = 1;
  id: number;
  basicBmId:number;
  name: string;
  image: number;
  value:number;
  
  constructor(basicBmId: number)
   {
      const basic = getBasicBm(basicBmId);
    this.id =Bm.nextId++;
    this.basicBmId= basic.id;
    this.name = basic.name;
    this.image = basic.image;
    this.value = basic.value;
    
  }

  toView():BmView {
    return {
        id:this.id,
        image:this.image,
        name:this.name,
        value:this.value,
    }
  }
}

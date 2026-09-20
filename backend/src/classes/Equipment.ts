import type { EquipmentType, EquipmentLocation, EquipmentSlot } from "../../../shared/types/equipmentView.js";
import type { EquipmentView, EquipmentSave } from "../../../shared/types/equipmentView.js";
import { getBasicEquipment } from "../utils/basicEquipment_data.js";
import type { StatName } from "../../../shared/types/label.js";
export class Equipment {
  private static nextId = 1;

  id: number;
  basicEquipmentId: number;

  name: string;
  type: EquipmentType;
  image: number;
  width: number;
  height: number;
  price: number;

  location: EquipmentLocation;

  x: number | null;
  y: number | null;

  slot?: EquipmentSlot;
  beltSlot?: number;
  alchemySlot?: number;

  text: string;

  bonus: Partial<Record<StatName, number>>;


  private constructor() {
    this.id = Equipment.nextId++;

    this.basicEquipmentId = 0;

    this.name = "";
    this.type = "sword"; 

    this.image = 0;
    this.width = 0;
    this.height = 0;
    this.price = 0;

    this.location = "dragged";

    this.x = null;
    this.y = null;

    this.text = "";

    this.bonus = {};
  }


  static fromBasicEquipmentId(
    basicEquipmentId: number
  ): Equipment {

    const equipment = new Equipment();

    const basic =
      getBasicEquipment(basicEquipmentId);

    equipment.basicEquipmentId =
      basicEquipmentId;

    equipment.name = basic.name;
    equipment.type = basic.type;
    equipment.image = basic.image;

    equipment.width = basic.width;
    equipment.height = basic.height;

    equipment.price = basic.price;
    equipment.text = basic.text;

    equipment.location = "dragged";

    equipment.x = null;
    equipment.y = null;

    console.log(basic.name);
    console.log(basic.bonus);
    equipment.bonus = {... basic.bonus,};

    return equipment;
  }


  static fromSave(
    save: EquipmentSave
  ): Equipment {

    const equipment = new Equipment();

    equipment.id = save.id;
    

  Equipment.nextId = Math.max(
    Equipment.nextId,
    save.id + 1
  );

    equipment.basicEquipmentId =
      save.basicEquipmentId;

    equipment.name = save.name;
    equipment.type = save.type;
    equipment.image = save.image;

    equipment.width = save.width;
    equipment.height = save.height;

    equipment.price = save.price;
    equipment.text = save.text;

    equipment.location = save.location;

    equipment.x = save.x;
    equipment.y = save.y;

    equipment.bonus = {
      ...save.bonus,
    };

    if (save.slot !== undefined) {
    equipment.slot = save.slot;
  }

  if (save.beltSlot !== undefined) {
    equipment.beltSlot =
      save.beltSlot;
  }

  if (save.alchemySlot !== undefined) {
    equipment.alchemySlot =
      save.alchemySlot;
  }

    return equipment;
  }


  toView(): EquipmentView {
    return {
      id: this.id,
      basicEquipmentId:
        this.basicEquipmentId,

      name: this.name,
      type: this.type,
      image: this.image,

      width: this.width,
      height: this.height,

      price: this.price,

      location: this.location,

      text: this.text,

      x: this.x,
      y: this.y,

      bonus: { ...this.bonus },

      ...(this.slot !== undefined && {
        slot: this.slot,
      }),

      ...(this.beltSlot !== undefined && {
        beltSlot: this.beltSlot,
      }),

      ...(this.alchemySlot !== undefined && {
        alchemySlot: this.alchemySlot,
      }),
    };
  }


  toSave(): EquipmentSave {
    return {
      id: this.id,
      basicEquipmentId:
        this.basicEquipmentId,

      name: this.name,
      type: this.type,
      image: this.image,

      width: this.width,
      height: this.height,

      price: this.price,

      location: this.location,

      text: this.text,

      x: this.x,
      y: this.y,

      bonus: { ...this.bonus },

      ...(this.slot !== undefined && {
        slot: this.slot,
      }),

      ...(this.beltSlot !== undefined && {
        beltSlot: this.beltSlot,
      }),

      ...(this.alchemySlot !== undefined && {
        alchemySlot: this.alchemySlot,
      }),
    };
  }




  
  getBonus(stat: StatName): number {
    return this.bonus[stat] ?? 0;
  }

  setBonus(stat: StatName, value: number): void {
    this.bonus[stat] = value;
  }

  incBonus(stat: StatName, value: number): void {
    this.bonus[stat] = this.getBonus(stat) + value;
  }
}



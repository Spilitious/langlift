import type { PjView } from "../../../shared/types/fighterView.js";
import type { Action } from "../../../shared/types/action.js";
import type { BmView } from "../../../shared/types/bmView.js";
import type { BasicPj } from "../utils/basicPj.js";
import type { Equipment} from "../../../shared/types/equipment.js";


export class Pj {
  id: number;
  image: number;
  name:string;
  level:number;
  hp: number;
  ap: number;
  position: number;
  xp: number;
  bms: BmView[];
  actions:Action[];
  inventory: number[][];
  equipment: Equipment[];


   constructor(data: BasicPj) {
    this.id = data.id;
    this.image = data.image;
    this.name = data.name;
    this.level = data.level;
    this.position = data.position;

    this.hp = this.getMaxHp();
    this.ap = 3;
    this.xp = 0;

    this.actions = [];
    this.bms = [];
    this.equipment = [];
    this.inventory = [];
    
    this.createEmptyInventory();
  }

  toView(): PjView {
    return {
      id: this.id,
      image: this.image,
      name: this.name,
      level: this.level,
      hp: this.hp,
      maxHp: this.getMaxHp(),
      shield: this.getShield(),
      ap: this.ap,
      xp:this.xp,
      position: this.position,
      bms: this.bms,
      actions: this.actions,
      inventory: this.inventory,
      equipment: this.equipment,
    };
  }

  createEmptyInventory() {
    this.inventory = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]
  }
  
  getMaxHp():number {
    return 30;
  }

   getShield():number {
    return 1;
  }
  
}
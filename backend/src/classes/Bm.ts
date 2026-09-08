
import type {BmDisplay, BmView } from "../../../shared/types/bmView.js";
import { getBasicBm } from "../utils/basicBm.js";
import type { StatName } from "../../../shared/types/label.js";
import { STAT_NAMES } from "../../../shared/types/label.js";

export class Bm {
 private static nextId = 1;
  id: number;
  basicBmId:number;
  name: string;
  image: number;
  life:number;
  display:BmDisplay;
  
  
  bonus: Partial<Record<StatName, number>>;
  
  constructor(basicBmId: number, power:number)
   {
    const basic = getBasicBm(basicBmId);
    this.id =Bm.nextId++;
    this.basicBmId= basic.id;
    this.name = basic.name;
    this.image = basic.image;
    this.life = basic.life;
    this.bonus = basic.bonus;
    this.display = basic.display;
    this.bonus = Object.fromEntries(
    Object.entries(basic.bonus).map(
      ([stat, value]) => [stat, value * power]
    )
  ) as Partial<Record<StatName, number>>;

    console.log("bm", this.bonus);

  }
 
  toView():BmView {
    return {
        id:this.id,
        image:this.image,
        name:this.name,
        life:this.life,
        display:this.display,
        bonus: { ...this.bonus },
    }
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

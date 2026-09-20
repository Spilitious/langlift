
import type {BmDisplay, BmView, BmSave } from "../../../shared/types/bmView.js";
import { getBasicBm } from "../utils/basicBm_data.js";
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
  mainStat:StatName;
  
  
  bonus: Partial<Record<StatName, number>>;
  
  private constructor()
   {
      this.id =Bm.nextId++;
    this.basicBmId= 0;
    this.name = "";
    this.image = 0;
    this.life = 0;
    this.display = "none";
    this.mainStat= "armor";
    this.bonus = {}
   }

   static fromBasicBmId(basicBmId: number, power:number):Bm {
    const bm = new Bm();
    const  basic = getBasicBm(basicBmId);
   
    bm.basicBmId= basic.id;
    bm.name = basic.name;
    bm.image = basic.image;
    bm.life = basic.life;
    bm.bonus = basic.bonus;
    bm.display = basic.display;
    bm.mainStat = basic.mainStat;
    bm.bonus = Object.fromEntries(
    Object.entries(basic.bonus).map(
      ([stat, value]) => [stat, value * power]
    )) as Partial<Record<StatName, number>>; 

    return bm;
  }

  static fromSave(save:BmSave):Bm {
    const bm = new Bm();
    bm.id = save.id   
    

    Bm.nextId = Math.max(
    Bm.nextId,
    save.id + 1
  );
    bm.basicBmId= save.basicBmId;
    bm.name = save.name;
    bm.image = save.image;
    bm.life = save.life;
    bm.bonus = save.bonus;
    bm.display = save.display;
    bm.mainStat = save.mainStat;
    bm.bonus = {
    ...save.bonus,
  };

  return bm;
  }
 
  toView():BmView {
    return {
        id:this.id,
        basicBmId:this.basicBmId,
        image:this.image,
        name:this.name,
        life:this.life,
        display:this.display,
        mainStat: this.mainStat,
        bonus: { ...this.bonus },
    }
  }

   toSave():BmSave {
    return {
        id:this.id,
        basicBmId: this.basicBmId,
        image:this.image,
        name:this.name,
        life:this.life,
        display:this.display,
        mainStat:this.mainStat,
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

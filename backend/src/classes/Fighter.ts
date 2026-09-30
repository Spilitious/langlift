import { Bm } from "./Bm.js";

import type { BmView } from "../../../shared/types/bmView.js";
import type { StatName } from "../../../shared/types/label.js";

import { BM_ID } from "../../../shared/utils/bmConstant.js";
import { getBasicBm } from "../utils/basicBm_data.js";

export abstract class Fighter {

  bms: Bm[];

  constructor() {
    this.bms = [];
  }

  /* ************************************************
                    GESTION DES BMS
  ************************************************ */

  getBmViews(): BmView[] {
    return this.bms.map(bm => bm.toView());
  }

  haveBm(basicBmId: number): boolean {
    return this.bms.some(
      bm => bm.basicBmId === basicBmId
    );
  }

  getBm(basicBmId: number): Bm | undefined {
    return this.bms.find(
      bm => bm.basicBmId === basicBmId
    );
  }

  deleteBm(basicBmId: number): void {
    const index = this.bms.findIndex(
      bm => bm.basicBmId === basicBmId
    );

    if (index !== -1) {
      this.bms.splice(index, 1);
    }
  }

  updateBm(
    basicBmId: number,
    stat: StatName,
    value: number
  ): void {

    const basicBm = getBasicBm(basicBmId);
    let bm = this.getBm(basicBmId);
    

    if (bm) {
     
      switch(basicBm.type) 
      {
        case "life_cumulative" : bm.life += basicBm.life;
        break;

        case "value_cumulative" : 
         if(bm.getBonus(stat) > 0) 
              bm.incBonus(stat, value); 
          else 
              bm.incBonus(stat, -value); 
        break;
        
        case "both_cumulative" : bm.life = basicBm.life; 
            if(bm.getBonus(stat) < 0 )
                bm.incBonus(stat, -value);
            else  
              bm.incBonus(stat, value);    
        break;
        
        case "replaced": 
          this.deleteBm(bm.basicBmId);
          const newBm = Bm.fromBasicBmId(basicBmId, value);
          this.bms.push(newBm);
          break;
      }
      
    
      
      if (bm.getBonus(stat) === 0) {
        this.deleteBm(basicBmId);
      }

      return;
    }

    if (value > 0) {
      this.bms.push(
        Bm.fromBasicBmId(basicBmId, value)
      );
    }
  }

  
  updateBmLife(
    basicBmId: number,
    value: number
  ): void {

    const basicBm = getBasicBm(basicBmId);
    let bm = this.getBm(basicBmId);
    if(bm)
      bm.life = value;
  }

  replaceBm(
    basicBmId: number,
    value: number
  ): void {

    const bm = this.getBm(basicBmId);

    if (bm) 
      this.deleteBm(basicBmId)
    

    if (value > 0) {
      this.bms.push(
        Bm.fromBasicBmId(basicBmId, value)
      );
    }
  }


  protected getBmBonus(stat: StatName): number {
    return this.bms.reduce(
      (total, bm) =>
        total + bm.getBonus(stat),
      0
    );
  }

updateBmsNewTurn(): void {

  for (const bm of [...this.bms]) {

    // Gestion cas particulier
    switch (bm.basicBmId) {

      case BM_ID.BLEED:
        bm.incBonus("regen", 1);

        if (bm.getBonus("regen") === 0) {
          this.deleteBm(bm.basicBmId);
          continue;
        }

        break;

      case BM_ID.BLEAK:
        bm.incBonus("regen", -1);
        break;
    }

    if (bm.life !== -1)
      bm.life--;

    if (bm.life === 0)
      this.deleteBm(bm.basicBmId);
  }
}
  
hasBm(basicBmId:number):boolean {
  for(const bm of this.bms) {
    if(bm.basicBmId === basicBmId)
        return true;
  }
  return false;
}
}
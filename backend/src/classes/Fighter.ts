import { Bm } from "./Bm.js";

import type { BmView } from "../../../shared/types/bmView.js";
import type { StatName } from "../../../shared/types/label.js";

import { BM_ID } from "../utils/constants.js";
import { getBasicBm } from "../utils/basicBm.js";

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
        case "life_cumulative" : bm.life += basicBm.life; break;
        case "value_cumulative" : 
         console.log("stat", bm.getBonus(stat))
          if(bm.getBonus(stat) > 0) 
              bm.incBonus(stat, value); 
          else 
          {
            console.log("value", value)
              bm.incBonus(stat, -value); 
                    }          break;
        case "replaced" : bm = new Bm(basicBmId, 1); break;
        case "both_cumulative" : bm.life += basicBm.life; bm.incBonus(stat, value); break;
      }
      
      if (bm.getBonus(stat) === 0) {
        this.deleteBm(basicBmId);
      }

      return;
    }

    if (value > 0) {
      this.bms.push(
        new Bm(basicBmId, value)
      );
    }
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
        new Bm(basicBmId, value)
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

      //Gestion cas particulier
      switch (bm.basicBmId) {

          case BM_ID.BLEED:
            console.log("ici")
            bm.incBonus("regen", 1);
            break;
      }
      if (bm.life !== -1) {

        bm.life--;

       
      }

      if (bm.life === 0) {
        this.deleteBm(bm.basicBmId);
      }
    }
  }
}
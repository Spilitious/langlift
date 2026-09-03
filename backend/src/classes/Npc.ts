import type { NpcView } from "../../../shared/types/fighterView.js";
import type { NpcIntentView } from "../../../shared/types/npcIntentView.js";

import type {StatName,  } from "../../../shared/types/label.js";
import {STAT_NAMES} from "../../../shared/types/label.js";
import   {Bm } from "./Bm.js"
import type { BasicNpc } from "../types/basicPj.js";
import { basicNpcs } from "../utils/basicNpc.js";

export class Npc {
  private static nextId = 1;
  id: number;
  basicRaceId: number;
  image: number;
  level: number;
  name: string;
  hp: number;
  maxHp:number;
  armor:number;
  position: number;
  npcIntent: NpcIntentView;
  power:number[];
  bms:Bm[];



  constructor(basicRaceId: number, level:number) {
   
    this.id = Npc.nextId++;
    this.basicRaceId = basicRaceId;
    const basicNpc = basicNpcs.find(npc => npc.id === basicRaceId);

    if (!basicNpc) {
      throw new Error(`BasicNpc ${basicRaceId} introuvable`);
    }

    this.name = basicNpc.name;
    this.image = basicNpc.image;
    this.level = level;
    this.maxHp = basicNpc.hp_start;
    this.armor = basicNpc.armor_start;
    this.power = [...basicNpc.power_start];
    this.bms = [...basicNpc.bms];

    const levelsToGenerate = level - basicNpc.level_start;
    for (let i = 0; i < levelsToGenerate; i++) {
        this.upgrade(basicNpc);
    }

    this.hp = this.maxHp;
    this.position = 0;
    this.npcIntent = {
      action:1,
      target:1,
      target_image:1,
      value:this.getStat("power1"),
    }

  }
    
 


  toView(): NpcView {
    return {
      id: this.id,
      image: this.image,
      name:this.name,
      level:this.level,
      hp: this.hp,
      maxHp: this.maxHp,
      position: this.position,
      npc_intent: this.npcIntent,
      bms: this.bms.map( (bm) => bm.toView()),
       stats: Object.fromEntries(
      STAT_NAMES.map((stat) => [
        stat,
        this.getStat(stat),
      ])) as Record<StatName, number>,
    };
    
  }


    getStat(stat:StatName):number {
      let value = 0;
  
      switch (stat) {
        case "armor":
        value = 0;
        break;
  
      case "shield":
        value = 0;
        break;
      
      case "maxhp": 
        value = this.maxHp;
        break;

      case "power1": 
        if(this.power[0])
          value = this.power[0]; 
        break;

      case "power2": 
       if(this.power[1])
        value = this.power[1];
        break;
      
      case "power3":
        if(this.power[2])
          value = this.power[2]; 
        break;
      
      }
      
      return value;
    }

  private upgrade(basicNpc: BasicNpc) {
  const dice = Math.random() * 100;

  let limit = basicNpc.upgradeRate.hp;

  if (dice < limit) {
    this.maxHp += 6;
    return;
  }

  limit += basicNpc.upgradeRate.armor;

  if (dice < limit) {
    this.armor += 1;
    return;
  }

  limit += basicNpc.upgradeRate.bm_start;
  
  if(dice < limit) {
    //add one effect on the bm présent
    return;
  }
  for (let i = 0; i < basicNpc.power_start.length; i++) {
    const rate = basicNpc.upgradeRate.power[i];

    if (rate === undefined) {
      throw new Error(
        `Upgrade rate manquant pour power[${i}] de ${basicNpc.name}`
      );
    }

    limit += rate;

    if (dice < limit) {
      this.addPower(i, 1);
      return;
    }
  }


}

addPower(index: number, value: number) {
  const currentPower = this.power[index];

  if (currentPower === undefined) {
    throw new Error(
      `Power ${index} inexistante pour ${this.name}`
    );
  }

  this.power[index] = currentPower + value;
}
}
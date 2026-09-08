import type { NpcView } from "../../../shared/types/fighterView.js";
import type { NpcIntentView } from "../../../shared/types/npcIntentView.js";
import type {StatName} from "../../../shared/types/label.js";
import type { BasicNpc } from "../types/basicNpc.js";
import type { NpcBaseAttributes } from "../../../shared/types/label.js";
import type { BmView } from "../../../shared/types/bmView.js";
import {STAT_NAMES} from "../../../shared/types/label.js";

import { basicNpcs } from "../utils/basicNpc.js";

import   {Bm } from "./Bm.js"
import { Fighter } from "./Fighter.js";



export class Npc extends Fighter{
  private static nextId = 1;
  id: number;
  basicRaceId: number;
  image: number;
  level: number;
  name: string;
  base_att:NpcBaseAttributes;
  position: number;
  intent: NpcIntentView;
  

constructor(basicRaceId: number, level:number) {
    super();
    this.id = Npc.nextId++;
    this.basicRaceId = basicRaceId;
    const basicNpc = basicNpcs.find(npc => npc.id === basicRaceId);

    if (!basicNpc) {
      throw new Error(`BasicNpc ${basicRaceId} introuvable`);
    }

    this.name = basicNpc.name;
    this.image = basicNpc.image;
    this.level = level;
    this.base_att = {
      maxHp: basicNpc.hp_start+Math.floor(Math.random()*basicNpc.hp_start/7),
      damage: basicNpc.damage_start,
      magicSkill: basicNpc.magicSkill_start,
      currhp:0,
      shield:0,
      armor:basicNpc.armor_start,
      power:basicNpc.power_start,
    };
    this.bms = [];
    for(const basicBmId of basicNpc.bms) {
        this.bms.push(new Bm(basicBmId, 1))
    }

    const levelsToGenerate = level - basicNpc.level_start;
    for (let i = 0; i < levelsToGenerate; i++) {
        this.upgrade(basicNpc);
    }
    
    this.base_att.currhp = this.base_att.maxHp;
    this.position = 0;
    this.intent = {
      action:1,
      target:1,
      target_image:1,
      value:this.getStat("damage"),
    }

  }
    
 


  toView(): NpcView {
    return {
      id: this.id,
      image: this.image,
      name:this.name,
      level:this.level,
      position: this.position,
      intent: this.intent,
      bms: this.bms.map( (bm) => bm.toView()),
       stats: Object.fromEntries(
      STAT_NAMES.map((stat) => [
        stat,
        this.getStat(stat),
      ])) as Record<StatName, number>,
    };
    
  }


    getBmViews():BmView[] {
      return this.bms.map((bm) => bm.toView());
    }


getStat(stat:StatName):number {
      let value = 0;
  
      switch (stat) {
        case "armor":
        value = 0;
        break;
  
      case "maxhp": 
        value = this.base_att.maxHp;
        break;
      
      case "currhp": 
        value = this.base_att.currhp;
        break;

      case "damage": 
        value = this.base_att.damage;
        break;
      
      case "shield": 
        value = this.base_att.shield;
        break;

      case "armor": 
        value = this.base_att.armor;
        break;
      
      case "magicSkill": 
        value = this.base_att.magicSkill;
        break;
    
      case "power": 
        value = this.base_att.power;
        break;
      
      }
      
      return value+this.getBmBonus(stat);
    }

private upgrade(basicNpc: BasicNpc) {

  

  const dice = Math.random() * 100;

  let limit = basicNpc.upgradeRate.hp;

  if (dice < limit) {
    this.base_att.maxHp += 6;
    return;
  }

  limit += basicNpc.upgradeRate.armor;

  if (dice < limit) {
    this.base_att.armor += 1;
    return;
  }

  limit += basicNpc.upgradeRate.damage;
  
  if (dice < limit) {
    this.base_att.damage += 1;
    return;
  }

  limit += basicNpc.upgradeRate.magicSkill;
  
  if (dice < limit) {
    this.base_att.magicSkill += 1;
    return;
  }

  limit += basicNpc.upgradeRate.power;
  
  if (dice < limit) {
    this.base_att.damage += 1;
    return;
  }

  limit += basicNpc.upgradeRate.bm_start;
  if(dice < limit) {
    //add one effect on the bm présent
    return;
  }
  
  


}


setIntent(basicActionId: number, value:number, targetId?: number,  target_image?: number): void {
  this.intent = {
    action: basicActionId,
    target: targetId ?? 0,
    target_image: target_image ?? 0,
    value: value,
  };
}


setHp(value:number):number {
    if(value > 0)
      return this.getHealed(value);
    else 
      return this.getHit(-value);
  }

  
getHit(damage:number):number {
  const realHp = Math.min(damage, this.base_att.currhp);
  this.base_att.currhp -= realHp;
  return realHp;
 
}

getHealed(hp: number): number {

  const realHp = Math.min(hp,this.getStat("maxhp") - this.base_att.currhp);
  this.base_att.currhp += realHp;
  return realHp;
  }


}
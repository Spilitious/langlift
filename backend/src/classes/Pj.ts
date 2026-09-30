import type { PjSave, PjView } from "../../../shared/types/fighterView.js";
import type { BasicPj, makePotionResult } from "../types/basicPj.js";
import type {  EquipmentSlot, MoveObjectResult} from "../../../shared/types/equipmentView.js";
import { Equipment } from "./Equipment.js";
import type {BaseAttributes, StatName } from "../../../shared/types/label.js";
import {STAT_NAMES} from "../../../shared/types/label.js";
import type { ActionResult } from "../../../shared/types/actionResult.js";
import {Bm} from "./Bm.js";
import {BASIC_EQUIPMENT_ID } from "../utils/constants.js";
import {getPotionResult} from "../utils/receipe.js"
import { Ability } from "./Abitlity.js";
import { FIGHT_VALUE } from "../utils/constants.js";
import { BM_ID } from "../../../shared/utils/bmConstant.js";
import type { AbilityView, SchoolType } from "../../../shared/types/abilityView.js";
import { basicAbilities, getBasicAbility} from "../utils/basicAbility_data.js";

import { Fighter } from "./Fighter.js";
import { getLearnAbilityCondition } from "../utils/learnAbilityCondition_data.js";
import { getBasicBm } from "../utils/basicBm_data.js";
import { SCHOOL_INDEX } from "../types/learnAbilityCondition.js";


export class Pj extends Fighter {
  id: number;
  image: number;
  avatar: number;
  name: string;
  level: number;
  ap: number;
  position: number;
  xp: number;
  base_att: BaseAttributes;
  fight_absent:number;

  inventory: number[][];
  equipment: Equipment[];
  ability: Ability[];
  

  private constructor() {
    super();

    
    this.id = 0;
    this.image = 0;
    this.avatar = 0;
    this.name = "";
    this.level = 0;
    this.ap = 0;
    this.position = 0;
    this.xp = 0;
    this.fight_absent=0;

    this.base_att = {
      constitution: 0,
      strength: 0,
      magicSkill: 0,
      currhp: 0,
      shield: 0,
    };

    this.inventory = [];
    this.equipment = [];
    this.ability = [];
  }


  static fromBasicPj(data: BasicPj): Pj {
    const pj = new Pj();

    pj.id = data.id;
    pj.image = data.image;
    pj.name = data.name;
    pj.level = data.level;
    pj.avatar = data.avatar;

    pj.position = 0;
    pj.fight_absent=0;

    pj.base_att = {
      constitution: 0,
      strength: 0,
      magicSkill: 0,
      currhp: 0,
      shield: 0,
    };

    pj.equipment = [];

    pj.base_att.currhp =
      pj.getStat("maxhp");

    pj.ap = 3;
    pj.xp = 0;

    pj.inventory = [];
    pj.ability = [];

    pj.createEmptyInventory();

    return pj;
  }


  static fromSave(save: PjSave): Pj {
    const pj = new Pj();

    pj.id = save.id;
    pj.image = save.image;
    pj.avatar = save.avatar;
    pj.name = save.name;
    pj.level = save.level;
    pj.xp = save.xp;
    pj.fight_absent=save.fight_absent,

    pj.base_att = {
      ...save.base_att,
    };

    pj.equipment = save.equipment.map(
      equipmentSave =>
        Equipment.fromSave(equipmentSave)
    );

    pj.ability = save.ability.map(
      abilitySave =>
        Ability.fromSave(abilitySave)
    );

    pj.bms = save.bms.map(
      bmSave =>
        Bm.fromSave(bmSave)
    );

    pj.createEmptyInventory();
  

  pj.equipment
  .filter(equipment => equipment.location === "inventory")
  .forEach(equipment => {

    if (
      equipment.x == null ||
      equipment.y == null
    ) {
      return;
    }
     for (
    let currentY = equipment.y;
    currentY < equipment.y + equipment.height;
    currentY++
  ) {
    const row =
      pj.inventory[currentY];

    if (!row) continue;

    for (
      let currentX = equipment.x;
      currentX <  equipment.x + equipment.width;
      currentX++
    ) {
      row[currentX] = equipment.id;
    }
  }

    
  });
    return pj;
   
  }


  toView(): PjView {
    this.base_att.currhp = Math.min(this.getStat("currhp"), this.getStat("maxhp"));
    return {
      id: this.id,
      image: this.image,
      avatar:this.avatar,
      name: this.name,
      level: this.level,
      ap: this.ap,
      xp:this.xp,
      nextLevelXp:this.getNextLevelXP(),
      position: this.position,
      bms: this.bms.map(bm => bm.toView()),
      inventory: this.inventory,
      equipment: this.equipment,
      ability:this.ability,
      base_att:this.base_att,
      fight_absent:this.fight_absent,
      canLevelUp:this.canLevelUp(),
      isUnconscious:this.isUnconscious(),
      stats: Object.fromEntries(
      STAT_NAMES.map((stat) => [
        stat,
        this.getStat(stat),
      ])) as Record<StatName, number>,
    };
  }

  
  toSave(): PjSave {
     this.base_att.currhp = Math.min(this.getStat("currhp"), this.getStat("maxhp"));
    return {
      id: this.id,
      image: this.image,
      avatar:this.avatar,
      name: this.name,
      level: this.level,
      xp:this.xp,
      base_att:this.base_att,
      fight_absent:this.fight_absent,
      bms: this.bms.map(bm => bm.toSave()),
      equipment: this.equipment.map(equip => equip.toSave()),
      ability:this.ability.map(ab => ab.toSave()),
      
    }
  }

  
  



/*********************************************Les accesseurs **************************************************  */   
getStat(stat:StatName):number {
    let value = 0;

    switch (stat) {
    case "constitution":
      value = this.base_att.constitution;
      break;

    case "strength":
      value = this.base_att.strength;
      break;

    case "magicSkill":
      value = this.base_att.magicSkill;
      break;

    case "shield":
      value = this.base_att.shield;
      break;
    
    case "currhp":
      value = this.base_att.currhp;
      break;

    case "maxhp": 
  
      value =18 + 2*this.level 
                + 2*(this.base_att.constitution+this.getEquipmentBonus("constitution"))*this.level
                + (this.base_att.strength+this.getEquipmentBonus("strength"))*this.level;
      break;
    }
    value += this.getEquipmentBonus(stat);
    value += this.getBmBonus(stat);
    return value;
  }

isUnconscious(): boolean {
  return this.base_att.currhp <= 0;
}



createEmptyInventory() {
    this.inventory = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]
}

initNewFight() {
  this.ap = this.getNewTurnAp();
 
  this.base_att.shield = 0;
  
  for(const bm of this.bms) {
    if(getBasicBm(bm.basicBmId).removable)
      this.deleteBm(bm.basicBmId)
  }

   this.base_att.currhp = this.getStat("maxhp");
}

getFirstPotionId():number {
    const p = this.equipment.find((equip) => equip.location === "belt")
    if(!p)
       throw new Error("Pas de potion trouvé");
    
    return p.id;

}

initAfterFight() {
  this.base_att.currhp = this.getStat("maxhp");
   for(const bm of [...this.bms]) {
    if(getBasicBm(bm.basicBmId).removable)
      this.deleteBm(bm.id)
  }
}


/* **************************************** Methode autour des Ability ******************************* */

getNbAbilityOfScholl(school:SchoolType):number {
  let nb = 0;
  for(const ab of this.ability)
    if(ab.school === school)
        nb++;
  return nb;  
}

getNbAbilitiesOfSchool(school: SchoolType): number {
  return basicAbilities.filter(
    ability =>
      ability.school === school &&
      this.hasAbility(ability.id)
  ).length;
}

getLearnableAbilities(): AbilityView[] {

  const learnableAbilities: AbilityView[] = [];

  for (const ability of basicAbilities) {

    // Déjà apprise
    if (this.hasAbility(ability.id)) {
      continue;
    }

    const condition = getLearnAbilityCondition(ability.id);

    if (condition !== undefined) {

      // Conditions de statistiques
      if (
        condition.strength_min > this.base_att.strength ||
        condition.constitution_min > this.base_att.constitution ||
        condition.magicSkill_min > this.base_att.magicSkill ||
        condition.level_min > this.level
      ) {
        continue;
      }

      // Doit posséder au moins une des abilities
      if (
        condition.hasOneOf.length > 0 &&
        !condition.hasOneOf.some(ab => this.hasAbility(ab))
      ) {
        continue;
      }

      // Doit posséder toutes les abilities
      if (
        !condition.hasAtLeast.every(ab => this.hasAbility(ab))
      ) {
        continue;
      }

      const schoolRequirementsAreMet = Object.entries(
            condition.schoolRequirements).every(([school, required]) => {
              return (this.getNbAbilitiesOfSchool(school as SchoolType) >= required);
      });

      if (!schoolRequirementsAreMet) {
          continue;
      } 
    }

      

     learnableAbilities.push(
      Ability
        .fromBasicAbility(ability.id)
        .toView()
    );
      
    
  }

  return learnableAbilities;
}


getLearnableTalents(): AbilityView[] {

  const learnableAbilities: AbilityView[] = [];

  for (const ability of basicAbilities.filter(ba => (ba.type === "talent"))) {

    // Déjà apprise
    if (this.hasAbility(ability.id)) {
      continue;
    }

    const condition = getLearnAbilityCondition(ability.id);

    if (condition !== undefined) {

      // Conditions de statistiques
      if (
        condition.strength_min > this.base_att.strength ||
        condition.constitution_min > this.base_att.constitution ||
        condition.magicSkill_min > this.base_att.magicSkill ||
        condition.level_min > this.level
      ) {
        continue;
      }

      // Doit posséder au moins une des abilities
      if (
        condition.hasOneOf.length > 0 &&
        !condition.hasOneOf.some(ab => this.hasAbility(ab))
      ) {
        continue;
      }

      // Doit posséder toutes les abilities
      if (
        !condition.hasAtLeast.every(ab => this.hasAbility(ab))
      ) {
        continue;
      }

      const schoolRequirementsAreMet = Object.entries(
            condition.schoolRequirements).every(([school, required]) => {
              return (this.getNbAbilitiesOfSchool(school as SchoolType) >= required);
      });

      if (!schoolRequirementsAreMet) {
          continue;
      } 
    }

      

     learnableAbilities.push(
      Ability
        .fromBasicAbility(ability.id)
        .toView()
    );
      
    
  }

  return learnableAbilities;
}

getAbility(basicAbilityId:number):Ability {
  
    const ability = this.ability.find((ability) => ability.basicAbilityId === basicAbilityId);
    
    if(!ability) {
       throw new Error(`Ability introuvable : ${basicAbilityId}`);
    }
  
    return ability;
}

hasAbility(basicAbilityId:number):boolean {
  for(const ability of this.ability) {
    if(ability.basicAbilityId === basicAbilityId)
        return true;
  }
  return false;
}

learAbility(basicAbilityId: number):string {
  this.ability.push( Ability.fromBasicAbility(basicAbilityId));
  return  getBasicAbility(basicAbilityId).name;
}



/* **************************************** Methode autour des XP ******************************* */

canLevelUp():boolean {
  if(this.xp >= this.getNextLevelXP())
      return true;
   return false;

}

getNextLevelXP():number {
		return  10 + this.level * 20;      
}

addXp(xp:number) {
    this.xp +=  xp; 
  
}
  
levelUp():number {
		  this.xp -= this.getNextLevelXP();
      const maxHpStart = this.getStat("maxhp");
		  this.level+= 1;
      const maxHpEnd = this.getStat("maxhp"); 
		  this.base_att.currhp = this.getStat("maxhp");
      return maxHpEnd-maxHpStart;
}



getEquipmentBonus(stat:StatName):number {
      let value = 0;
       for (const equip of this.equipment) {
          if(equip.location === "equipped")
             value+= equip.getBonus(stat);
        }
      return value;
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


drinkPotion(
  idPj: number,
  potion: Equipment
): ActionResult[][] {

 

  if(potion.basicEquipmentId ===BASIC_EQUIPMENT_ID.HP_POTION) {
      const currHp = this.base_att.currhp;
      const hp = Math.floor(Math.random() * 4) + 5;
      const realHp = this.getHealed(hp);
      
      const result: ActionResult = {
          fighter_type: "pj",
          fighter_id: idPj,
          animationName: "potion_hp",
          fightStatus: "ongoing",
        

            hp_start: currHp,
            hp_end: this.base_att.currhp,

            shield_start: this.getStat("shield"),
            shield_end: this.getStat("shield"),

            armor_start:this.getStat("armor"),
            armor_end: this.getStat("armor"),

            bm_end: this.bms.map((bm) => bm.toView()), 
            popup: {
              text: `+${realHp} hp`,
              type: "heal",
           },
   
      };

  return [[result]];
} 
if(potion.basicEquipmentId === BASIC_EQUIPMENT_ID.MM_POTION)
{
  this.updateBm(BM_ID.MM_POTION, "magicSkill", 1);
   const result: ActionResult = {
      fighter_type: "pj",
      fighter_id: idPj,
      animationName: "potion_standard",
      fightStatus: "ongoing",
      hp_start: this.base_att.currhp,
      hp_end: this.base_att.currhp,
      shield_start: this.getStat("shield"),
      shield_end: this.getStat("shield"),
      armor_start:this.getStat("armor"),
      armor_end: this.getStat("armor"),
      bm_end: this.bms.map((bm) => bm.toView()), 
          popup: {
          text: `+1 MM`,
          type: "heal",
      },
   
  }
  
  return [[result]];
}

if(potion.basicEquipmentId === BASIC_EQUIPMENT_ID.STR_POTION)
{
  this.updateBm(BM_ID.STR_POTION, "strength", 1);
   const result: ActionResult = {
      fighter_type: "pj",
      fighter_id: idPj,
      animationName: "potion_standard",
      fightStatus: "ongoing",
      hp_start: this.base_att.currhp,
      hp_end: this.base_att.currhp,
      shield_start: this.getStat("shield"),
      shield_end: this.getStat("shield"),
      armor_start:this.getStat("armor"),
      armor_end: this.getStat("armor"),
      bm_end: this.bms.map((bm) => bm.toView()), 
          popup: {
          text: `+1 Force`,
          type: "heal",
      },
   
  }
 
  return [[result]];
}
else { 
     throw new Error(
      "Type de potion non encore géré"
    );
  }
}

getNewTurnAp():number {
  
  return FIGHT_VALUE.NEW_TURN_AP + this.getStat("ap");
}

addBaseAtt(
  name: keyof BaseAttributes,
  value: number
) {
  this.base_att[name] += value;
  this.base_att.currhp = this.getStat("maxhp");
}

canSpendAp(cost: number): boolean {
  return this.ap >= cost;
}

spendAp(cost: number): boolean {
  if (this.ap < cost) {
    return false;
  }

  this.ap -= cost;
  return true;
}


/* ******************************************** GESTION DES OBJETS DANS LES INVENTAIRES ************************ */
private getInventoryCollision(
  equipment: Equipment,
  x: number,
  y: number
): {
  canPlace: boolean;
  collidedEquipmentId: number;
} {
  if (
    x < 0 ||
    y < 0 ||
    x + equipment.width > 10 ||
    y + equipment.height > 4
  ) {
    return {
      canPlace: false,
      collidedEquipmentId: 0,
    };
  }

  const collisionIds = new Set<number>();

  for (
    let currentY = y;
    currentY < y + equipment.height;
    currentY++
  ) {
    for (
      let currentX = x;
      currentX < x + equipment.width;
      currentX++
    ) {

      const row = this.inventory[currentY]
      if(!row)
        continue
      const value = row[currentX]
      if(!value)
        continue
      if (
        value !== 0 &&
        value !== equipment.id
      ) {
        collisionIds.add(value);
      }
    }
  }

  // Aucun équipement ne gêne
  if (collisionIds.size === 0) {
    return {
      canPlace: true,
      collidedEquipmentId: 0,
    };
  }

  // Un seul équipement gêne :
  // échange possible
 if (collisionIds.size === 1) {
  const collidedEquipmentId =
    [...collisionIds][0];

  if (collidedEquipmentId === undefined) {
    return {
      canPlace: false,
      collidedEquipmentId: 0,
    };
  }

  return {
    canPlace: true,
    collidedEquipmentId,
  };
}

  // Plusieurs équipements différents gênent
  return {
    canPlace: false,
    collidedEquipmentId: 0,
  };
}

private clearEquipmentFromInventory(
  equipmentId: number
) {
  for (let y = 0; y < this.inventory.length; y++) {
    const row = this.inventory[y];
    if(!row)
      continue
    for (let x = 0; x < row.length; x++) {
      if (row[x] === equipmentId) {
        row[x] = 0;
      }
    }
  }
}

canBuy(
  equipment: Equipment,
  x: number,
  y: number
): boolean {

  // Vérifie que l'objet rentre dans l'inventaire
  if (
    x < 0 ||
    y < 0 ||
    x + equipment.width > 10 ||
    y + equipment.height > 4
  ) {
    return false;
  }

  // Toutes les cases doivent être libres
  for (
    let currentY = y;
    currentY < y + equipment.height;
    currentY++
  ) {
    const row = this.inventory[currentY];

    if (!row) {
      return false;
    }

    for (
      let currentX = x;
      currentX < x + equipment.width;
      currentX++
    ) {
      const value = row[currentX];

      if (value === undefined || value !== 0) {
        return false;
      }
    }
  }

  return true;
}

removeEquipment(
  equipmentId: number
): boolean {

  const equipment = this.equipment.find(
    (equipment) =>
      equipment.id === equipmentId
  );

  if (!equipment) {
    return false;
  }

  if (equipment.location === "inventory") {
    this.clearEquipmentFromInventory(
      equipmentId
    );
  }

  this.equipment =
    this.equipment.filter(
      (equipment) =>
        equipment.id !== equipmentId
    );

  return true;
}
/* ******************************************* les fonctions add ************************************************ */
addEquipment(
  equipment: Equipment,
  slot: EquipmentSlot
): MoveObjectResult {

  // Vérifie que l'objet peut aller dans ce slot
  if (equipment.type !== slot) {
    return {
      result: false,
      newEquipmentDragged: equipment.id,
    };
  }

  // Objet actuellement équipé sur ce slot
  const previousEquipment =
    this.equipment.find(
      (item) =>
        item.location === "equipped" &&
        item.slot === slot
    );

  // L'objet entre dans la possession du PJ
  this.equipment.push(equipment);

  equipment.location = "equipped";
  equipment.slot = slot;
  equipment.x = null;
  equipment.y = null;

  delete equipment.beltSlot;

  // L'ancien équipement devient l'objet drag
  if (previousEquipment) {
    previousEquipment.location = "dragged";
    previousEquipment.x = null;
    previousEquipment.y = null;

    delete previousEquipment.slot;
    delete previousEquipment.beltSlot;
  }

  return {
    result: true,
    newEquipmentDragged:
      previousEquipment?.id ?? 0,
  };
}

addPotionFirstAvailableSlot(equipment: Equipment): boolean {

  const maxBeltSlots = 4;

  for (let slot = 0; slot < maxBeltSlots; slot++) {

    const occupied = this.equipment.some(
      item =>
        item.location === "belt" &&
        item.beltSlot === slot
    );

    if (!occupied) {
      this.addPotion(equipment, slot);
      return true;
    }
  }

  return false;
}

addObjectFirstAvailableSlot(equipment: Equipment): boolean {

  for (let y = 0; y < this.inventory.length; y++) {

    const row = this.inventory[y];
    if (!row) continue;

    for (let x = 0; x < row.length; x++) {

      const collision = this.getInventoryCollision(
        equipment,
        x,
        y
      );

      if (
        collision.canPlace &&
        collision.collidedEquipmentId === 0
      ) {
        const result = this.addObject(
          equipment,
          x,
          y
        );

        return result.result;
      }
    }
  }

  return false;
}

addEquipFirstAvailableSlot(equipment: Equipment): boolean {

 
 if (
    equipment.type !== "sword" &&
    equipment.type !== "helm" &&
    equipment.type !== "armor" &&
    equipment.type !== "shield"
  ) {
    return false;
  }

   const slot = equipment.type;
  const occupied = this.equipment.some(
    item =>
      item.location === "equipped" &&
      item.slot === slot
  );

  if (occupied) {
    return false;
  }

  this.addEquipment(equipment, slot);

  return true;
}
addObjectAuto(equipment: Equipment): boolean {

  if (equipment.type === "potion") {
    if (this.addPotionFirstAvailableSlot(equipment)) {
      return true;
    }
  }

  if (this.addEquipFirstAvailableSlot(equipment)) {
    return true;
  }

  return this.addObjectFirstAvailableSlot(equipment);
}
addObject(
  equipment: Equipment,
  x: number,
  y: number
): MoveObjectResult {

  const collision =
    this.getInventoryCollision(
      equipment,
      x,
      y
    );

  if (!collision.canPlace) {
    return {
      result: false,
      newEquipmentDragged: equipment.id,
    };
  }

  // S'il y a un objet à cet endroit,
  // il sort de la grille et devient dragged.
  if (
    collision.collidedEquipmentId !== 0
  ) {
    this.clearEquipmentFromInventory(
      collision.collidedEquipmentId
    );

    const collidedEquipment =
      this.equipment.find(
        (item) =>
          item.id ===
          collision.collidedEquipmentId
      );

    if (collidedEquipment) {
      collidedEquipment.location = "dragged";
      collidedEquipment.x = null;
      collidedEquipment.y = null;

      delete collidedEquipment.slot;
      delete collidedEquipment.beltSlot;
    }
  }

  // Maintenant seulement l'objet appartient au PJ
  this.equipment.push(equipment);

  equipment.location = "inventory";
  equipment.x = x;
  equipment.y = y;

  delete equipment.slot;
  delete equipment.beltSlot;

  // Inscription dans la matrice
  for (
    let currentY = y;
    currentY < y + equipment.height;
    currentY++
  ) {
    const row =
      this.inventory[currentY];

    if (!row) continue;

    for (
      let currentX = x;
      currentX < x + equipment.width;
      currentX++
    ) {
      row[currentX] = equipment.id;
    }
  }

  return {
    result: true,
    newEquipmentDragged:
      collision.collidedEquipmentId,
  };
}

addPotion(
  equipment: Equipment,
  slot: number
): MoveObjectResult {

  // Seules les potions peuvent aller dans la ceinture
  if (equipment.type !== "potion") {
    return {
      result: false,
      newEquipmentDragged: equipment.id,
    };
  }

  if (
  equipment.type !== "potion" ||
  slot < 0 ||
  slot >= 3
) {
  return {
    result: false,
    newEquipmentDragged: equipment.id,
  };
}

  const previousEquipment =
    this.equipment.find(
      (item) =>
        item.location === "belt" &&
        item.beltSlot === slot
    );

  this.equipment.push(equipment);

  equipment.location = "belt";
  equipment.beltSlot = slot;
  equipment.x = null;
  equipment.y = null;

  delete equipment.slot;

  if (previousEquipment) {
    previousEquipment.location = "dragged";
    previousEquipment.x = null;
    previousEquipment.y = null;

    delete previousEquipment.slot;
    delete previousEquipment.beltSlot;
  }

  return {
    result: true,
    newEquipmentDragged:
      previousEquipment?.id ?? 0,
  };
}



/* ********************************************** les fonctions de transfert internes ***************************** */
moveEquipmentToInventory(
  equipmentId: number,
  x: number,
  y: number
): MoveObjectResult {

  const equipment =
    this.equipment.find(
      (item) => item.id === equipmentId
    );

  if (!equipment) {
    return {
      result: false,
      newEquipmentDragged: 0,
    };
  }

  const collision =
    this.getInventoryCollision(
      equipment,
      x,
      y
    );

  if (!collision.canPlace) {
    return {
      result: false,
      newEquipmentDragged: equipmentId,
    };
  }

  // Retire l'objet actuellement drag de
  // son ancienne position dans la grille
  this.clearEquipmentFromInventory(
    equipmentId
  );

  // S'il y avait exactement un objet gênant,
  // on le retire lui aussi de la grille
  if (
    collision.collidedEquipmentId !== 0
  ) {
    this.clearEquipmentFromInventory(
      collision.collidedEquipmentId
    );

    const collidedEquipment =
      this.equipment.find(
        (item) =>
          item.id ===
          collision.collidedEquipmentId
      );

    if (collidedEquipment) {
      collidedEquipment.location = "dragged";
      collidedEquipment.x = null;
      collidedEquipment.y = null;
      delete collidedEquipment.slot;
delete collidedEquipment.beltSlot;
    }
  }

  // Place le nouvel objet
  for (
    let currentY = y;
    currentY < y + equipment.height;
    currentY++
  ) {
    const row = this.inventory[currentY];

  if (!row) {
    continue;
  }

  for (
    let currentX = x;
    currentX < x + equipment.width;
    currentX++
  ) {
    row[currentX] = equipmentId;
  }
}
      

  equipment.location = "inventory";
  equipment.x = x;
  equipment.y = y;
  delete equipment.slot;
  delete  equipment.beltSlot;
  return {
    result: true,
    newEquipmentDragged:
      collision.collidedEquipmentId,
  };
}

moveEquipmentToBelt(
  equipmentId: number,
  slot: number
): MoveObjectResult {


  
  const equipment =
    this.equipment.find(
      (item) => item.id === equipmentId
    );

  if (!equipment) {
    return {
      result: false,
      newEquipmentDragged: 0,
    };
  }

   // test si c'est une potion
  if (equipment.type !== "potion") {
    return {
      result: false,
      newEquipmentDragged: equipmentId,
    };
  }

  const previousEquipment =
    this.equipment.find(
      (item) =>
        item.location === "belt" &&
        item.beltSlot === slot &&
        item.id !== equipmentId
    );

    if (previousEquipment) {
  previousEquipment.location = "dragged";
  previousEquipment.x = null;
  previousEquipment.y = null;

  delete previousEquipment.slot;
  delete previousEquipment.beltSlot;
}

  this.clearEquipmentFromInventory(
    equipmentId
  );

  equipment.location = "belt";
  equipment.beltSlot = slot;

  equipment.x = null;
  equipment.y = null;
  delete equipment.slot;
 
  return {
    result: true,

    newEquipmentDragged:
      previousEquipment?.id ?? 0,
  };
}

equip(
  equipmentId: number,
  slot: EquipmentSlot
): MoveObjectResult {

  const equipment =
    this.equipment.find(
      (item) => item.id === equipmentId
    );

  if (!equipment) {
    return {
      result: false,
      newEquipmentDragged: 0,
    };
  }

  // Vérification du bon type
  if (equipment.type !== slot) {
    return {
      result: false,
      newEquipmentDragged: equipmentId,
    };
  }

  const previousEquipment =
    this.equipment.find(
      (item) =>
        item.location === "equipped" &&
        item.slot === slot &&
        item.id !== equipmentId
    );

  this.clearEquipmentFromInventory(
    equipmentId
  );

  equipment.location = "equipped";
  equipment.slot = slot;

  equipment.x = null;
  equipment.y = null;
  delete equipment.beltSlot;
  console.log("bonusAll", equipment.bonus);
  equipment.getBonus("magicSkill");
  console.log(this.getEquipmentBonus("magicSkill"));
  return {
    result: true,

    newEquipmentDragged:
      previousEquipment?.id ?? 0,
  };
}

moveEquipmentToAlchemy(equipmentId: number,
  slot: number
): MoveObjectResult {
  
  
  const equipment =
    this.equipment.find(
      (item) => item.id === equipmentId
    );

  if (!equipment) {
    return {
      result: false,
      newEquipmentDragged: 0,
    };
  }

   // test si c'est un ingredient
  if (equipment.type !== "ingredient") {
    return {
      result: false,
      newEquipmentDragged: equipmentId,
    };
  }

  const previousEquipment =
    this.equipment.find(
      (item) =>
        item.location === "alchemy" &&
        item.alchemySlot === slot &&
        item.id !== equipmentId
    );

    if (previousEquipment) {
      previousEquipment.location = "dragged";
      previousEquipment.x = null;
      previousEquipment.y = null;

    delete previousEquipment.slot;
    delete previousEquipment.beltSlot;
    delete previousEquipment.alchemySlot;
}

  this.clearEquipmentFromInventory(
    equipmentId
  );

  equipment.location = "alchemy";
  equipment.alchemySlot = slot;

  equipment.x = null;
  equipment.y = null;
  delete equipment.slot;
  delete equipment.beltSlot;
 
  return {
    result: true,

    newEquipmentDragged:
      previousEquipment?.id ?? 0,
  };
}
/* ************************************************ Gestion des BMs ************************************************ */


makePotion(): makePotionResult {

  

  let result:makePotionResult = {
    potion: null,
    ingredientUsed: false,
  }
  
   // Le slot de résultat doit être vide
  if (
    this.equipment.some(
      equip =>
        equip.location === "alchemy" &&
        equip.alchemySlot === 4
    )
  ) {
    throw new Error(
      "Emplacement pour création non vide"
    );
  }


   const basicIngredients = this.equipment
  .filter(equip => equip.location === "alchemy");

  

 const potionResult = getPotionResult(basicIngredients);
 
 

if (potionResult.potionBasicId === 0) {
  if (Math.random() < 0.5) {
    this.consumeIngredients();
    result.ingredientUsed = true;
  }
  return result;
}


else {
  this.consumeIngredients();
  result.ingredientUsed = true;
  const potion = Equipment.fromBasicEquipmentId(potionResult.potionBasicId);
  potion.location = "alchemy";
  potion.alchemySlot=4;
  delete potion.slot;
  delete potion.beltSlot;
  potion.x = null;
  potion.y = null;
  result.potion = potion;
  this.equipment.push(potion);
  
  return result;
}

}
private consumeIngredients() {
  for (const equip of this.equipment.filter(equip => (equip.location == "alchemy")))
    {
      this.removeEquipment(equip.id);
    }
  }

}
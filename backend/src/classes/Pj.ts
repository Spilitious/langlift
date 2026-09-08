import type { PjView } from "../../../shared/types/fighterView.js";
import type { BasicPj, makePotionResult } from "../types/basicPj.js";
import type {  EquipmentSlot, MoveObjectResult} from "../../../shared/types/equipmentView.js";
import { Equipment } from "./Equipment.js";
import type {BaseAttributes, StatName } from "../../../shared/types/label.js";
import {STAT_NAMES} from "../../../shared/types/label.js";
import type { ActionResult } from "../../../shared/types/actionResult.js";
import {Bm} from "./Bm.js";
import { Const_Equipment } from "../types/basicEquipment.js";
import {getAlchemyResult} from "../utils/receipe.js"
import { Ability } from "./Abitlity.js";
import { BM_ID, FIGHT_VALUE } from "../utils/constants.js";
import type { AbilityView } from "../../../shared/types/abilityView.js";
import { basicAbilities} from "../utils/basicAbility.js";

import { Fighter } from "./Fighter.js";

export class Pj extends Fighter {
  id: number;
  image: number;
  avatar:number;
  name:string;
  level:number;
  ap: number;
  position: number;
  xp: number;
  base_att:BaseAttributes;
  
  
  inventory: number[][];
  equipment: Equipment[];
  ability:Ability[];


   constructor(data: BasicPj) {
    super();
    this.id = data.id;
    this.image = data.image;
    this.name = data.name;
    this.level = data.level;
    this.position = data.position;
    this.avatar = data.avatar;
   
    this.base_att = {
      constitution: 0,
      strength: 0,
      magicSkill: 0,
      currhp:0,
      shield:0,
    };

    this.equipment = [];
    this.base_att.currhp=this.getStat("maxhp"),

    this.ap = 3;
    this.xp = 0;

   
    
    
    this.inventory = [];
    this.ability = [];

    

    
    this.createEmptyInventory();
  }

  toView(): PjView {
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
      canLevelUp:this.canLevelUp(),
      isUnconscious:this.isUnconscious(),
      stats: Object.fromEntries(
      STAT_NAMES.map((stat) => [
        stat,
        this.getStat(stat),
      ])) as Record<StatName, number>,
    };
  }

  isUnconscious(): boolean {
  return this.base_att.currhp <= 0;
}

canLevelUp():boolean {
  if(this.xp >= this.getNextLevelXP())
      return true;
   return false;

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
  this.base_att.currhp = this.getStat("maxhp");
  this.base_att.shield = 0;
  this.bms = [];
}

getFirstPotionId():number {
    const p = this.equipment.find((equip) => equip.location === "belt")
    if(!p)
       throw new Error("Pas de potion trouvé");
    
    return p.id;

}


getLearnableAbilities():AbilityView[] {
  
  let learnableAbilities:AbilityView[] = [];
  for( const ability of basicAbilities)
    if(!this.hasAbility(ability.id))
      learnableAbilities.push(new Ability(ability.id).toView());

  return learnableAbilities;
}

getAbility(basicAbilityId:number):Ability {
  
    const ability = this.ability.find((ability) => ability.basicAbilityId === basicAbilityId);
    
    if(!ability) {
       throw new Error(`Ability introuvable : ${basicAbilityId}`);
    }
    console.log(ability.name);
    return ability;
}

hasAbility(basicAbilityId:number):boolean {
  for(const ability of this.ability) {
    if(ability.basicAbilityId === basicAbilityId)
        return true;
  }
  return false;
}
learAbility(basicAbilityId: number) {
  this.ability.push(new Ability(basicAbilityId));
}

  /* **************************************** Methode autour des XP ******************************* */
getNextLevelXP():number {
		return  this.level * 20;      
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

 /***********************************************************************************************  */   
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
      value =28 + 2*this.level + 6*this.getStat("constitution")*this.level + 2*this.getStat("strength")*this.level;
      break;
    }
    value += this.getEquipmentBonus(stat);
    value += this.getBmBonus(stat);
    return value;
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
  potionId: number
): ActionResult {

  const potion = this.equipment.find(equip => (equip.id === potionId));

  if (!potion) {
    throw new Error(
      "La potion n'a pas été trouvé"
    );
  }

  if(potion.basicEquipmentId === Const_Equipment.HP_POTION) {
      const currHp = this.base_att.currhp;
      const hp = Math.floor(Math.random() * 5) + 3;
      const realHp = this.getHealed(hp);
      const shield = this.getStat("shield");
      const result: ActionResult = {
          author_type: "pj",
          id_author: idPj,
          animationName: "idle",
          fightStatus: "ongoing",
          steps: [
        [
          {
            target_type: "pj",
            id_target: this.id,
            animationName: "potion_hp",

            hp_start: currHp,
            hp_end: this.base_att.currhp,

            shield_start: shield,
            shield_end: shield,

            armor_start:this.getStat("armor"),
            armor_end: this.getStat("armor"),

            bm_end: this.bms.map((bm) => bm.toView()), 
            popup: {
              text: `+${realHp} hp`,
              type: "heal",
           },
        },
      ],
    ],
  };

  this.removeEquipment(potionId);
  return result;
} else { 
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

  return {
    result: true,

    newEquipmentDragged:
      previousEquipment?.id ?? 0,
  };
}

/* ************************************************ Gestion des BMs ************************************************ */

makePotion(
  ingredientIds: (number | null)[],
  power: number
): makePotionResult {

  let result:makePotionResult = {
    potion: null,
    ingredientUsed: false,
  }
  const basicIngredientIds = ingredientIds.map((id) => {
    if (id === null) return null;

    const equipment = this.equipment.find(
      equip => equip.id === id
    );

    if (!equipment) {
      throw new Error(
        `Ingrédient introuvable : ${id}`
      );
    }

    return equipment.basicEquipmentId;
  });

 const resultId = getAlchemyResult(basicIngredientIds);

if (resultId === null) {
  if (Math.random() < 0.5) {
    this.consumeIngredients(ingredientIds);
    result.ingredientUsed = true;
  }

  return result;
}

this.consumeIngredients(ingredientIds);
result.ingredientUsed = true;

return result;
}

private consumeIngredients(
  ingredientIds: (number | null)[]
) {
  for (const id of ingredientIds) {
    if (id !== null) {
      this.removeEquipment(id);
    }
  }
}
}
import { Pj } from "./Pj.js";
import type { TeamView,TeamSave} from "../../../shared/types/teamView.js";
import type { Equipment } from "./Equipment.js";
import type { BuyResult } from "../../../shared/types/shop.js"
import type { ActionResult } from "../../../shared/types/actionResult.js";
import type { XpResult } from "../../../shared/types/actionResult.js";
import type { Profession } from "../../../shared/types/teamView.js";
import type { AbilityView } from "../../../shared/types/abilityView.js";
import type { BaseAttributes } from "../../../shared/types/label.js";

export class Team {
  pjs: Pj[];
  gold: number;
  profession:Profession;


constructor() {
    this.pjs = [];
    this.gold =40;
    this.profession = {
      alchemy: 0,
      blacksmith: 0,
      armorsmith: 0
    }
}

 
toView():TeamView {
    return {
    pjs: this.pjs.map((pj) => pj.toView()),
    gold: this.gold,
    profession: this.profession,
    }
}


toSave():TeamSave {
    return {
    pjs: this.pjs.map((pj) => pj.toSave()),
    gold: this.gold,
    profession: this.profession,
    }
}


fromSave(save:TeamSave) {
  this.gold = save.gold;
  this.profession= save.profession;
   this.pjs = save.pjs.map(pjSave => {
    return Pj.fromSave(pjSave);
  });
}
/* ****************************************** GESTION DES PJ ************************************************** */

removePj(id:number)
{
   const index = this.pjs.findIndex(
      pj => pj.id === id
    );

    if (index !== -1) {
      this.pjs.splice(index, 1);
    }
}

addPj(pj:Pj) {
    this.pjs.push(pj);
 }

getPj(pjId:number):Pj {
    const pj = this.pjs.find((pj) => pj.id === pjId);
    if(!pj) {
       throw new Error(`Pj introuvable : ${pjId}`);
    }
    return pj;
 }

 endFight() {
   for(const pj of this.pjs)
      pj.initAfterFight();
 }
 
/* ****************************************** GESTION DES ABILITY ************************************************** */
learnAbility(pjId:number, basicAbilityId:number):string {
  return this.getPj(pjId).learAbility(basicAbilityId);
}

learnAttribut(pjId:number, attribute: keyof BaseAttributes) {
  console.log(attribute);
  this.getPj(pjId).addBaseAtt(attribute, 1);
}

levelUp(pjId:number):number {
  return this.getPj(pjId).levelUp();
}

getLearnableAbilities(pjId:number):AbilityView[] {
  
  return this.getPj(pjId).getLearnableAbilities();
}


getLearnableTalents(pjId:number):AbilityView[] {
  
  return this.getPj(pjId).getLearnableTalents();
}



initNewFight() {
   for(const pj of this.pjs)
      pj.initNewFight();
}
 

dealXp(xp: number): XpResult[] {
  if (this.pjs.length === 0) {
    return [];
  }

  const results: XpResult[] = [];

  const xpEach = Math.floor(xp / this.pjs.length);
  let rest = xp % this.pjs.length;

  for (const pj of this.pjs) {
    const xpGained = xpEach + (rest > 0 ? 1 : 0);

    if (rest > 0) {
      rest--;
    }

    let levelUp = false;
    pj.addXp(xpGained);
    if(pj.xp >= pj.getNextLevelXP())
        levelUp = true;

    results.push({
      pjName: pj.name,
      xpGained,
      level_up: levelUp,
    });
  }

  return results;
}

buy(
  equipment: Equipment,
  pjId: number,
  x: number,
  y: number,
  price: number
): BuyResult {

  const pj = this.pjs.find(
    (pj) => pj.id === pjId
  );

  if (!pj) {
    return {
      result: false,
      reason: "pj_not_found",
    };
  }

  if (!this.canAfford(price)) {
    return {
      result: false,
      reason: "not_enough_gold",
    };
  }

  if (!pj.canBuy(equipment, x, y)) {
    return {
      result: false,
      reason: "no_space",
    };
  }

  pj.addObject(equipment, x, y);
  this.spendGold(price);

  return {
    result: true,
  };
}

sell(
  pjId: number,
  equipmentId: number,
  price: number
): boolean {

  const pj = this.pjs.find(
    (pj) => pj.id === pjId
  );

  if (!pj) {
    return false;
  }

  const equipment = pj.equipment.find(
    (equipment) =>
      equipment.id === equipmentId
  );

  if (!equipment) {
    return false;
  }

  pj.removeEquipment(equipmentId);

  this.addGold(price);

  return true;
}




canAfford(price: number): boolean {
    return this.gold >= price;
}

private spendGold(amount: number) {
    this.gold -= amount;
}

private addGold(amount: number) {
    this.gold += amount;
}

moveEquipmentToPlayer(sourcePjId:number, targetPjId:number, equipmentId:number):boolean {
    const sourcePj = this.getPj(sourcePjId);
    const equipment = sourcePj.equipment.find(equip => (equip.id === equipmentId));
    if(!equipment)
        throw(new Error(`Equipement invalide`));

    const targetPj = this.getPj(targetPjId);
    if(equipment.type === "potion")
    {
      if(targetPj.addObjectFirstAvailableSlot(equipment))
      {
            sourcePj.removeEquipment(equipmentId);
          return true;
      }
    }
    if(equipment.type === "sword" || equipment.type === "helm" || equipment.type === "armor" || equipment.type === "shield")
    {
      if(targetPj.addEquipFirstAvailableSlot(equipment))
      {
            sourcePj.removeEquipment(equipmentId);
             return true;
      }
    }
    if(targetPj.addObjectFirstAvailableSlot(equipment))
    {
            sourcePj.removeEquipment(equipmentId);
             return true;
    }

    return false;    
}

usePotion(
  authorId: number,
  targetId: number,
  potionId: number
): ActionResult[][] {

  const author = this.pjs.find(
    (pj) => pj.id === authorId
  );

  if (!author) {
    throw new Error(
      "PJ auteur introuvable"
    );
  }

  if (!author.canSpendAp(1)) {
    throw new Error(
      "Pas assez de points d'action"
    );
  }

  const target = this.pjs.find(
    (pj) => pj.id === targetId
  );

  if (!target) {
    throw new Error(
      "PJ cible introuvable"
    );
  }
    console.log("potionId", potionId);
   const potion = author.equipment.find(equip => (equip.id === potionId));
   if (!potion) {
      throw new Error(
        "La potion n'a pas été trouvé"
      );
    }

  const result =
    target.drinkPotion(
      targetId,
      potion
    );

  author.removeEquipment(potionId);
  
  author.spendAp(1);

  return result;
}


}
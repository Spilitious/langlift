import type { ActionResult } from "../../../shared/types/actionResult.js";
import type { AnimationName } from "../../../shared/types/animation.js";
import type { FightPopupData } from "../../../shared/types/fightPopUp.js";
import type { StatName } from "../../../shared/types/label.js";
import { Team } from "./Team.js";
import { Room } from "./Room.js";
import { Pj } from "./Pj.js";
import { Npc } from "./Npc.js";
import { BM_ID, ABILITY_ID, NPC_ID, NPC_ACTION_ID } from "../utils/constants.js";
import { getTargetSelectMode } from "../utils/basicNpc_data.js";
import type { FightStatus } from "../../../shared/types/actionResult.js";
import { convertProcessSignalToExitCode } from "node:util";

export class FightIA {
   
   round:number;

   constructor(
   
    private team: Team,
    private room: Room,
    private getFightStatus: () => FightStatus
  ) {
     this.round = 0;
  }
 


execute(): ActionResult[][] {

  this.round++;
  const results: ActionResult[][] = [];

    // PHASE 1 : nouveau tour des NPC
   results.push(...this.newTurnNpcAction());

  // PHASE 2 : chaque NPC joue son action
  for (const npc of this.room.npcs) {

    if (npc.getStat("currhp") <= 0)
      continue;

    results.push(... this.performNpcAction(npc));
 
    if (this.getFightStatus() !== "ongoing")
      return results;
  }

  // PHASE 3 : nouveau tour des PJ
  results.push(...this.newTurnPjAction());
  
  // PHASE 4 : changement d'intention
  for (const npc of this.room.npcs) {

    if (npc.getStat("currhp") <= 0)
      continue;

    results.push(...this.changeNpcIntentAction(npc));
  }

  this.room.removeDeadNpcs();
  return this.setFightStatus(results);
}


private getActionResult(npc:Npc, name:AnimationName):ActionResult
{
  return {
    fighter_type: "npc",
    fighter_id: npc.id,
    animationName: name,
    fightStatus: this.getFightStatus(),
   
    shield_start:npc.getStat("shield"),
    shield_end:npc.getStat("shield"),

    hp_start:npc.getStat("currhp"),
    hp_end:npc.getStat("currhp"),
    
    armor_start:npc.getStat("armor"),
    armor_end:npc.getStat("armor"),

    bm_end:npc.getBmViews(),
  };


}


private setFightStatus(
  results: ActionResult[][]
): ActionResult[][] {

  const fightStatus = this.getFightStatus();

  return results.map(group =>
    group.map(result => ({
      ...result,
      fightStatus,
    }))
  );
}

private performNpcAction(npc:Npc):ActionResult[][] {

  
  let result:ActionResult[][]= [];
  let target;
  switch(npc.intent.action) 
  {
    
      case NPC_ACTION_ID.ATTACK:
        target = this.team.getPj(npc.intent.target);
        if(target.base_att.currhp <= 0)
            break;
        result.push([this.getActionResult(npc, "attack")]);
        result.push(
        ...this.npcAttack(npc, target));
        break;

      case NPC_ACTION_ID.SHIELD : 
        result = this.npcShield(npc);
        break;

      case NPC_ACTION_ID.EVASION : 
        result = this.npcEvasion(npc);
        break;
      
      case NPC_ACTION_ID.WOLF_CRY :
        result.push([this.getActionResult(npc, "power")]);
        result.push(
        ...this.npcWolfCry(npc));
        break;
      
      case NPC_ACTION_ID.MULTIPLE_ATTACK :
        target = this.team.getPj(npc.intent.target); 
        result = this.npcMultipleAttack(npc,target);
        break;


      case NPC_ACTION_ID.TWIRL :
        result.push([this.getActionResult(npc, "attack")]);
        result.push(
        ...this.npcTwirl(npc));
        break;


      case NPC_ACTION_ID.TROLL_FURY :
        result = this.npcTrollFury(npc);
        break;


      case NPC_ACTION_ID.BURN_ATTACK :
        target = this.team.getPj(npc.intent.target); 
        if(target.base_att.currhp <= 0)
            break;
        result.push([this.getActionResult(npc, "attack")]);
        result.push(...this.npcAttack(npc,target, NPC_ACTION_ID.BURN_ATTACK));
        break;


      case NPC_ACTION_ID.PIERCING_ATTACK :
        target = this.team.getPj(npc.intent.target); 
        if(target.base_att.currhp <= 0)
            break;
        result.push([this.getActionResult(npc, "attack")]);
        result.push(...this.npcPiercingAttack(npc,target));
        break;

      case NPC_ACTION_ID.AUTOREGENERATION :
        result.push(...this.npcAutoRegeneration(npc));
      break;
  }
  
    // L'action est complètement résolue.
   // this.room.removeDeadNpcs();
  
    return result;

  
  
}

private newTurnNpcAction():ActionResult[][] {

  const result: ActionResult[][] = [];

  for (const npc of this.room.npcs) {
    if (npc.getStat("currhp") <= 0)
      continue;
    result.push(...this.newTurnNpc(npc));
  }
  return result;
}


private newTurnPjAction(): ActionResult[][] {

  const result: ActionResult[][] = [];

  for (const player of this.team.pjs) {
    if (player.getStat("currhp") <= 0)
      continue;
    result.push(...this.newTurnPj(player));
  }
  return result;
  
}


private newTurnPj(player: Pj): ActionResult[][] {

  
  if (player.getStat("shield_expert") == 0)
    player.base_att.shield = 0;

  const hpStart = player.base_att.currhp;
  const shieldStart = player.getStat("shield");
  
  const regen = player.getStat("regen");
  const shield = player.getStat("armor");

  player.setHp(regen);
  player.base_att.shield += shield;
  player.updateBmsNewTurn();
  player.ap = player.getNewTurnAp();

  // Aucun effet
  if (regen === 0 && shield === 0) {
    return [];
  }

  const hpEnd = player.base_att.currhp;
  const shieldEnd = player.getStat("shield");

  let animationName: AnimationName;
  let popupData: FightPopupData;

  if (hpEnd === 0) {
    animationName = "death";

    popupData = {
      text: `-${hpStart} HP`,
      type: "damage",
    };
  }
  else if (regen < 0) {
    animationName = "hurt";

    popupData = {
      text: `${hpEnd - hpStart} HP`,
      type: "damage",
    };
  }
  else if (regen > 0) {
    animationName = "heal";

    popupData = {
      text: `+${hpEnd - hpStart} HP`,
      type: "heal",
    };
  }
  else {
    animationName = "blocked";

    popupData = {
      text: `+${shieldEnd - shieldStart} bouclier`,
      type: "block",
    };
  }

 

  const result: ActionResult = {
    fighter_type: "pj",
    fighter_id: player.id,
    animationName,
    fightStatus:"ongoing",

    hp_start: hpStart,
    hp_end: hpEnd,

    shield_start: shieldStart,
    shield_end: shieldEnd,

    armor_start : player.getStat("armor"),
    armor_end : player.getStat("armor"),

    bm_end: player.getBmViews(),

    popup: popupData,
  };

  return [[result]];
}


private newTurnNpc(npc: Npc): ActionResult[][] {

  if (!npc.haveBm(BM_ID.SHIELD_EXPERT))
    npc.base_att.shield = 0;

  const hpStart = npc.getStat("currhp");
  const shieldStart = npc.getStat("shield");

  const regen = npc.getStat("regen");
  const shield = npc.getStat("armor");

  // Aucun effet
  if (regen === 0 && shield === 0) {
    return [];
  }

  npc.setHp(regen);
  npc.base_att.shield += shield;

  const hpEnd = npc.getStat("currhp");
  const shieldEnd = npc.getStat("shield");

  let animationName: AnimationName;
  let popupData: FightPopupData;

  if (hpEnd === 0) {
    animationName = "death";

    popupData = {
      text: `-${hpStart} HP`,
      type: "damage",
    };
  }
  else if (regen < 0) {
    animationName = "hurt";

    popupData = {
      text: `${hpEnd - hpStart} HP`,
      type: "damage",
    };
  }
  else if (regen > 0) {
    animationName = "heal";

    popupData = {
      text: `+${hpEnd - hpStart} HP`,
      type: "heal",
    };
  }
  else {
    animationName = "blocked";

    popupData = {
      text: `+${shield} bouclier`,
      type: "block",
    };
  }

  npc.updateBmsNewTurn();

  const result: ActionResult = {
    fighter_type: "npc",
    fighter_id: npc.id,
    animationName,
    fightStatus:"ongoing",
    new_intent: npc.intent,

    hp_start: hpStart,
    hp_end: hpEnd,

    shield_start: shieldStart,
    shield_end: shieldEnd,

    armor_start: npc.getStat("armor"),
    armor_end: npc.getStat("armor"),

    bm_end: npc.getBmViews(),

    popup: popupData,
  };

  return [[result]];
}

playIntentNpc():ActionResult[][] {
  
   const results: ActionResult[][] = [];
  for (const npc of this.room.npcs) {

    if (npc.getStat("currhp") <= 0)
      continue;

    results.push(...
      this.changeNpcIntentAction(npc)
    );
  }
  return results;
}

private changeNpcIntentAction(
  npc: Npc
): ActionResult[][] {

  let result: ActionResult[][];

  switch (npc.basicRaceId) {

    case NPC_ID.GIANT_RAT:
      result = this.giantRatIntent(npc);
      break;
    
    case NPC_ID.GIANT_TOAD:
      result = this.giantToadIntent(npc);
      break;

    case NPC_ID.GIANT_BAT:
      result = this.giantBatIntent(npc);
      break;
    
    case NPC_ID.WOLF:
      result = this.wolfIntent(npc);
      break;
    
    case NPC_ID.TROLL:
      result = this.trollIntent(npc);
      break;
    
    case NPC_ID.KOBOLD:
      result = this.koboldIntent(npc);
      break;
    
    case NPC_ID.OGRE:
      result = this.ogreIntent(npc);
      break;
    
     case NPC_ID.BRIGAND:
      result = this.brigandIntent(npc);
      break;
     

    default:
      throw new Error(
        `IA non définie pour NPC ${npc.basicRaceId}`
      );
  }

  return result;
}

/* ********************************************** FONCTION DE CHOIX DE CIBLE ****************************************** */

private newIntentNpc(npc:Npc, actionId:number, value:number,  targetId?:number, target_image?:number,value2?:number):ActionResult[][]
{
 
  npc.setIntent(actionId, value, value2, targetId, target_image);

  const result: ActionResult = {
    fighter_type: "npc",
    fighter_id: npc.id,
    animationName : "change_intent",
    fightStatus:"ongoing",

    new_intent: npc.intent,

    hp_start: npc.getStat("currhp"),
    hp_end: npc.getStat("currhp"),

    shield_start:npc.getStat("shield"),
    shield_end: npc.getStat("shield"),

    armor_start:npc.getStat("armor"),
    armor_end: npc.getStat("armor"),

    bm_end: npc.getBmViews(),

    popup:  {
      text: "",
      type: "block"
    },
  };

  return [[result]];
}

private selectNewTarget(
  feature: StatName,
  mode: "min" | "max"
): number {

  const players = this.team.pjs.filter(
    pj => !pj.isUnconscious()
  );

  if (players.length === 0) {
    throw new Error("Aucun PJ disponible");
  }

  const BASE_CHANCE = 10;
  const FAVORITE_BONUS = 40;
  const TARGET_MALUS = 20;

  const favorite = players.reduce((best, pj) => {

    const value = pj.getStat(feature);
    const bestValue = best.getStat(feature);

    if (mode === "min") {
      return value < bestValue ? pj : best;
    }

    return value > bestValue ? pj : best;

  });

  const chances = players.map(pj => {

    let chance = BASE_CHANCE;

    // Cible favorite
    if (pj.id === favorite.id) {
      chance += FAVORITE_BONUS;
    }

    // Malus pour chaque NPC qui cible déjà ce PJ
    const nbNpcTargeting =
      this.room.npcs.filter(
        npc => npc.intent.target === pj.id
      ).length;

    chance -= nbNpcTargeting * TARGET_MALUS;

    return Math.max(0, chance);
  });

  const total = chances.reduce(
    (sum, chance) => sum + chance,
    0
  );

  let dice = Math.random() * total;

  for (let i = 0; i < players.length; i++) {

    const chance = chances[i];
    const player = players[i];

    if (chance === undefined || player === undefined) {
      continue;
    }

    dice -= chance;

    if (dice <= 0) {
      return player.id;
    }
  }

  return players[0]!.id;
}

/* ******************************************** INTENT NPC PAR NPC ****************************** *************** */

private giantRatIntent(npc: Npc): ActionResult[][] {

  
  const targetMode = getTargetSelectMode(
    npc.basicRaceId
  );

  const pjId = this.selectNewTarget(
    targetMode.feature,
    targetMode.mode
  );

  const targetImage = this.team.pjs.find(
    pj => pj.id === pjId
  )?.avatar;

  const damageBonus = Math.floor(Math.random() * 3);

  npc.replaceBm(
    BM_ID.GIANT_RAT,
    damageBonus
  );
 
  return this.newIntentNpc(
    npc,
    NPC_ACTION_ID.ATTACK,
    Math.max(0, npc.getStat("damage")),
    pjId,
    targetImage
  );
}

private giantBatIntent(npc: Npc): ActionResult[][] {

  const evasion = npc.getStat("evasion");
  const dice = Math.round(Math.random() * 10);

  // Attaque avec une cible PJ
  if (dice < 5 + evasion) {

    const targetMode = getTargetSelectMode(
      npc.basicRaceId
    );

    const pjId = this.selectNewTarget(
      targetMode.feature,
      targetMode.mode
    );

    const targetImage = this.team.pjs.find(
      pj => pj.id === pjId
    )?.avatar;

    const dice2 = Math.round(Math.random() * 10);
    if(dice2 < 0) {
       return this.newIntentNpc(
          npc,
          NPC_ACTION_ID.ATTACK,
          npc.getStat("damage"),
          pjId,
          targetImage);
    }
    else
    {
       return this.newIntentNpc(
          npc,
          NPC_ACTION_ID.MULTIPLE_ATTACK,
          Math.max(0, npc.getStat("damage")),
          pjId,
          targetImage,
          npc.getStat("magicSkill"));
    }
  
  }
  // Deuxième attaque sans cible
  return this.newIntentNpc(
    npc,
    NPC_ACTION_ID.EVASION,
    npc.getStat("power")
  );
}

private giantToadIntent(npc: Npc): ActionResult[][] {

  let dice = Math.round(Math.random() * 10);

  if(this.round == 0)
    dice=10;
  
  if (npc.intent.action === NPC_ACTION_ID.SHIELD) {
    dice += 2;
  }

  
  if (dice < 5) {
    return this.newIntentNpc(
      npc,
      NPC_ACTION_ID.SHIELD,
      npc.getStat("power")
    );
  }

  // Attaque 1 : sélection d'un PJ
  const targetMode = getTargetSelectMode(
    npc.basicRaceId
  );

  const pjId = this.selectNewTarget(
    targetMode.feature,
    targetMode.mode
  );

  const targetImage = this.team.pjs.find(
    pj => pj.id === pjId
  )?.avatar;

  return this.newIntentNpc(
    npc,
    NPC_ACTION_ID.ATTACK,
    Math.max(0, npc.getStat("damage")),
    pjId,
    targetImage
  );
}

private wolfIntent(npc: Npc): ActionResult[][] {

  const dice = Math.floor(Math.random() * 10);

  // Attaque 4 : sans cible précise
  if (dice < 2 + this.team.pjs.filter(
    pj => !pj.isUnconscious()
  ).length) {

    return this.newIntentNpc(
      npc,
      NPC_ACTION_ID.WOLF_CRY,
      npc.getStat("power")
    );
  }


  
  // Attaque normale : choisit un PJ
  const targetMode = getTargetSelectMode(
    npc.basicRaceId
  );

  const pjId = this.selectNewTarget(
    targetMode.feature,
    targetMode.mode
  );

  const targetImage = this.team.pjs.find(
    pj => pj.id === pjId
  )?.avatar;

  return this.newIntentNpc(
    npc,
    NPC_ACTION_ID.ATTACK,
    Math.max(0, npc.getStat("damage")),
    pjId,
    targetImage
  );
}


private trollIntent(npc: Npc): ActionResult[][] {

  if (npc.intent.action === NPC_ACTION_ID.ATTACK && this.round !=0)
  {
    return this.newIntentNpc(
      npc,
      NPC_ACTION_ID.TROLL_FURY,
      npc.getStat("magicSkill")
    );
  }

  if(npc.intent.action === NPC_ACTION_ID.TROLL_FURY)
  {
    return this.newIntentNpc(
      npc,
      NPC_ACTION_ID.TWIRL,
      Math.floor(npc.getStat("damage")*2/3)
    )
  }

  const targetMode = getTargetSelectMode(npc.basicRaceId);
  const pjId = this.selectNewTarget(targetMode.feature,targetMode.mode);
  const targetImage = this.team.pjs.find(pj => pj.id === pjId)?.avatar;
  return this.newIntentNpc(
      npc,
      NPC_ACTION_ID.ATTACK,
      Math.max(0, npc.getStat("damage")),
      pjId,
      targetImage
    );
}


private koboldIntent(npc: Npc): ActionResult[][] {

  const targetMode = getTargetSelectMode(npc.basicRaceId);
  const pjId = this.selectNewTarget(targetMode.feature,targetMode.mode);
  const targetImage = this.team.pjs.find(pj => pj.id === pjId)?.avatar;
  return this.newIntentNpc(
      npc,
      NPC_ACTION_ID.BURN_ATTACK,
      Math.max(0, npc.getStat("damage")),
      pjId,
      targetImage
    );
}


private ogreIntent(npc: Npc): ActionResult[][] {

   
    if ((npc.getStat("currhp")/npc.getStat("maxhp")*10) < 3.5  && npc.getStat("magicSkill") > 0) {
        return this.newIntentNpc(
          npc,
          NPC_ACTION_ID.AUTOREGENERATION,
          -1,
         
        );
    }
   
    const dice:number = Math.floor(Math.random() * 10);
    const shield:number = npc.getStat("shield");
    if (dice < 4 + Math.floor(shield / 8))
    {
        const targetMode = getTargetSelectMode(npc.basicRaceId);
        const pjId = this.selectNewTarget(targetMode.feature,targetMode.mode);
        const targetImage = this.team.pjs.find(pj => pj.id === pjId)?.avatar;
        return this.newIntentNpc(
          npc,
          NPC_ACTION_ID.ATTACK,
          Math.max(0, npc.getStat("damage")),
          pjId,
          targetImage
        );
    }


    return this.newIntentNpc(
      npc,
      NPC_ACTION_ID.SHIELD,
      npc.getStat("power")
    );
  }

  
private brigandIntent(npc: Npc): ActionResult[][] {

    const targetMode = getTargetSelectMode(npc.basicRaceId);
    const pjId = this.selectNewTarget(targetMode.feature,targetMode.mode);
    const targetImage = this.team.pjs.find(pj => pj.id === pjId)?.avatar;
    return this.newIntentNpc(
        npc,
        NPC_ACTION_ID.PIERCING_ATTACK,
        Math.max(0, npc.getStat("damage"))+Math.floor(Math.random()*2),
        pjId,
        targetImage
        );
}


private queenAntIntent(npc: Npc): ActionResult[][] {

  const dice:number = Math.floor(Math.random() * 10);
	if (dice > 3+2*this.room.npcs.length && npc.intent.action != NPC_ACTION_ID.INVOKE_ANT)
  {
      return this.newIntentNpc(
        npc,
        NPC_ACTION_ID.INVOKE_ANT,
        npc.getStat("power"),
      );
  }
  else
  {
    const targetMode = getTargetSelectMode(npc.basicRaceId);
    const pjId = this.selectNewTarget(targetMode.feature,targetMode.mode);
    const targetImage = this.team.pjs.find(pj => pj.id === pjId)?.avatar;
    return this.newIntentNpc(
        npc,
        NPC_ACTION_ID.PIERCING_ATTACK,
        Math.max(0, npc.getStat("damage")),
        pjId,
        targetImage
    );
  }
}
              
/* **************************************************** DEBUT DES ACTIONS ***************************** */
private npcAttack(
  npc: Npc,
  player: Pj,
  npcAction: number = 0,
): ActionResult[][] {

  const steps: ActionResult[][] = [];

  // =========================
  // SPIKE DU PJ
  // =========================

  if (player.getStat("spike") > 0) {

    const spikeResult = this.applyDamage(
      npc,
      "npc",
      player.getStat("spike")
    );

    steps.push([spikeResult]);

    // NPC tué par Spike : son attaque n'a pas lieu
    if (npc.getStat("currhp") === 0) {
      return steps;
    }
  }

  // =========================
  // EVASION DU PJ
  // =========================

  if (player.getStat("evasion") > 0) {

    const hpStart = player.getStat("currhp");
    const shieldStart = player.getStat("shield");
    const armorStart = player.getStat("armor");

    player.updateBm(
      BM_ID.EVASION,
      "evasion",
      -1
    );

    steps.push([{
      fighter_type: "pj",
      fighter_id: player.id,
      fightStatus: "ongoing",
      animationName: "dodged",

      hp_start: hpStart,
      hp_end: player.getStat("currhp"),

      shield_start: shieldStart,
      shield_end: player.getStat("shield"),

      armor_start: armorStart,
      armor_end: player.getStat("armor"),

      bm_end: player.getBmViews(),

      popup: {
        text: "-1 évasion",
        type: "dodge",
      },
    }]);

    return steps;
  }

  // =========================
  // ATTAQUE
  // =========================

  const attackResult = this.applyDamage(
    player,
    "pj",
    npc.intent.value
  );
 steps.push([attackResult]);

  // =========================
  // EFFETS PARTICULIERS
  // =========================
  console.log(npcAction);
   if (
      npc.getStat("currhp") > 0 && (attackResult.hp_start > attackResult.hp_end) &&
      npcAction === NPC_ACTION_ID.BURN_ATTACK)
    {
      
      player.updateBm(
        BM_ID.BURN,
        "regen",
        npc.base_att.power,
      );
      attackResult.bm_end = player.getBmViews();
    }
  if (player.getStat("currhp") > 0 && player.getStat("reflex") > 0) {
    const shieldStart = player.getStat("shield");
    const reflex = player.getStat("reflex");
    player.base_att.shield += reflex;

    const reflexResult: ActionResult = {
      fighter_type: "pj",
      fighter_id: player.id,
      animationName: "shield",
      fightStatus: "ongoing",

    hp_start: player.getStat("currhp"),
    hp_end: player.getStat("currhp"),

    shield_start: shieldStart,
    shield_end: player.getStat("shield"),

    armor_start: player.getStat("armor"),
    armor_end: player.getStat("armor"),

    bm_end: player.getBmViews(),

    popup: {
      text: `+${reflex}`,
      type: "block",
    },
  };

  steps.push([reflexResult]);
}

 

  return steps;
}


private applyDamage(
  target: Pj | Npc,
  targetType: "pj" | "npc",
  damage: number
): ActionResult {

  const hpStart = target.getStat("currhp");
  const shieldStart = target.getStat("shield");

  let animationName: AnimationName;
  let popupData: FightPopupData;

  if (shieldStart >= damage) {
    target.base_att.shield -= damage;

    animationName = "blocked";

    popupData = {
      text: "Bloqué",
      type: "block",
    };
  }

  else {
    target.base_att.shield = 0;

    const hpDamage = damage - shieldStart;
    
    target.getHit(hpDamage);
   

    animationName =
      target.getStat("currhp") === 0 ? "death" : "hurt";

    popupData = {
      text: `-${hpDamage} HP`,
      type: "damage",
    };
  }

  return {
    fighter_type: targetType,
    fighter_id: target.id,
    animationName,
    fightStatus: "ongoing",
    hp_start: hpStart,
    hp_end: target.getStat("currhp"),

    shield_start: shieldStart,
    shield_end: target.getStat("shield"),

    armor_start:target.getStat("armor"),
    armor_end: target.getStat("armor"),

    bm_end: target.bms.map(bm => bm.toView()),

    popup: popupData,

    ...(targetType === "npc" && {
      new_intent: (target as Npc).intent,
    }),
  };
}

private npcShield(npc: Npc): ActionResult[][] {

  const shieldStart = npc.getStat("shield");

  npc.base_att.shield +=  npc.intent.value;

  const shieldEnd =npc.getStat("shield");

  return [[{
    fighter_type: "npc",
    fighter_id: npc.id,
    animationName: "shield",
    fightStatus:"ongoing",

    new_intent: npc.intent,

    hp_start: npc.getStat("currhp"),
    hp_end: npc.getStat("currhp"),

    shield_start: shieldStart,
    shield_end: shieldEnd,

    armor_start:npc.getStat("armor"),
    armor_end: npc.getStat("armor"),

    bm_end: npc.getBmViews(),

    popup: {
      text: `+${shieldEnd - shieldStart}`,
      type: "block",
    },
  }]];
}


private npcEvasion(npc: Npc): ActionResult[][] {

  npc.updateBm(BM_ID.EVASION, "evasion", npc.intent.value);

  
  return [[{
    fighter_type: "npc",
    fighter_id: npc.id,

    animationName: "shake",
    fightStatus:"ongoing",
    new_intent: npc.intent,

    hp_start: npc.getStat("currhp"),
    hp_end: npc.getStat("currhp"),

    shield_start: npc.getStat("shield"),
    shield_end: npc.getStat("shield"),

    armor_start:npc.getStat("armor"),
    armor_end: npc.getStat("armor"),

    bm_end: npc.getBmViews(),

    popup: {
      text: `+${npc.intent.value} evasion`,
      type: "block",
    },
  }]];
}


private npcWolfCry(npc: Npc): ActionResult[][] {

  const value = npc.intent.value;
  const step: ActionResult[] = [];

  for (const wolf of this.room.npcs) {

    wolf.updateBm(
      BM_ID.WOLF_CRY,
      "damage",
      value
    );

    step.push({
      fighter_type: "npc",
      fighter_id: wolf.id,

      animationName: "power",
      fightStatus: "ongoing",

      hp_start: wolf.getStat("currhp"),
      hp_end: wolf.getStat("currhp"),

      shield_start: wolf.getStat("shield"),
      shield_end: wolf.getStat("shield"),

      armor_start: wolf.getStat("armor"),
      armor_end: wolf.getStat("armor"),

      bm_end: wolf.getBmViews(),

      popup: {
        text: `+${value} dégât(s)`,
        type: "block",
      },
    });
  }

  return [step];
}

private npcTwirl(npc: Npc): ActionResult[][] {

  const damage = npc.intent.value;
  const steps: ActionResult[][] = [];

  for (const player of this.team.pjs) {

    if (player.getStat("currhp") <= 0) continue;

    const attackSteps =
      this.npcAttack(npc, player);

    steps.push(...attackSteps);

    // Une réaction du PJ a pu tuer le NPC
    if (npc.getStat("currhp") <= 0) {
      break;
    }
  }

  return steps;
}


private npcFireball(
  npc: Npc,
  targetId: number
): ActionResult[][] {

   const steps: ActionResult[][] = [];

  const target = this.team.getPj(targetId);


  // EVASION
  if (target.getStat("evasion")) {

    target.updateBm(BM_ID.EVASION, "evasion", -1);
    steps.push([{
      fighter_type: "pj",
      fighter_id: target.id,
      animationName: "dodged",
      fightStatus: "ongoing",

     
      
      hp_start: target.getStat("currhp"),
      hp_end: target.getStat("currhp"),

      shield_start: target.getStat("shield"),
      shield_end: target.getStat("shield"),

      armor_start: target.getStat("armor"),
      armor_end: target.getStat("armor"),

      bm_end: target.bms.map(bm => bm.toView()),

      popup: {
        text: "-1 évasion",
        type: "dodge",
      },
    }]);

    return steps;
  }

  // =========================
  // DEGATS
  // =========================

  const damage = npc.intent.value;
  const result = this.applyDamage(target, "pj", damage);

  // =========================
  // BURN
  // =========================

  const hasTakenHpDamage =
    result.hp_end < result.hp_start;

  if (target.getStat("currhp") > 0 && hasTakenHpDamage) {
    target.updateBm(BM_ID.BURN, "regen",2);

    result.bm_end = target.getBmViews();
  }

  return [[result]];
}

private npcTears(
  npc: Npc,
  targetId: number
): ActionResult[][] {

  const target = this.room.getNpc(targetId);
  const hpStart = target.base_att.currhp;
  target.getHealed(npc.intent.value);
  const hpEnd = target.base_att.currhp;

  return [[{
     fighter_type: "npc",
    fighter_id: target.id,
    animationName: "heal",
    fightStatus: "ongoing",

    hp_start: hpStart,
    hp_end: hpEnd,

    shield_start: target.getStat("shield"),
    shield_end: target.getStat("shield"),

    armor_start: target.getStat("armor"),
    armor_end: target.getStat("armor"),

    bm_end: target.getBmViews(),

    popup: {
      text: `+${hpEnd - hpStart} HP`,
      type: "heal",
    },
  }]];
}


private npcArmor(npc: Npc): ActionResult[][] {

  const armor_start = npc.getStat("armor");
  const value = npc.intent.value;
  npc.base_att.armor += value;


  
  const playerStep: ActionResult = {
    fighter_type: "npc",
    fighter_id: npc.id,
    animationName: "blocked",
    fightStatus:"ongoing",

    hp_start: npc.base_att.currhp,
    hp_end: npc.base_att.currhp,

    shield_start: npc.getStat("shield"),
    shield_end: npc.getStat("shield"),

    armor_start: armor_start,
    armor_end: npc.getStat("armor"),

    bm_end: npc.getBmViews(),

    popup: {
      text: `+${value} armure`,
      type: "block",
    },
  };

  return [[playerStep]];
}


private npcGuardReflex(npc: Npc): ActionResult[][] {

     npc.updateBm(BM_ID.GUARD_REFLEX, "shield",npc.intent.value);

    const playerStep: ActionResult = {
    fighter_type: "npc",
    fighter_id: npc.id,
    animationName: "blocked",
    fightStatus: "ongoing",

    hp_start: npc.base_att.currhp,
    hp_end: npc.base_att.currhp,

    shield_start: npc.getStat("shield"),
    shield_end: npc.getStat("shield"),

    armor_start : npc.getStat("armor"),
    armor_end: npc.getStat("armor"),

    bm_end: npc.getBmViews(),

    popup: {
      text: "Réflexe de garde",
      type: "block",
    },
  };

  return [[playerStep]];
}

private npcMultipleAttack(
  npc: Npc,
  pj: Pj
): ActionResult[][] {

  const result: ActionResult[][] = [];

  const damage = npc.intent.value;

  let iteration = npc.intent.value2;
  if(!iteration)
    iteration=1;

  for (let i = 0; i < iteration; i++) {

    // Animation d'attaque
    result.push([
      this.getActionResult(npc, "attack")
    ]);

    // Résolution de l'attaque
    result.push(
      ...this.npcAttack(npc, pj, damage)
    );

    if (pj.getStat("currhp") <= 0 || npc.getStat("currhp") <=0) {
      break;
    }
  }

  return result;
}

private npcTrollFury(npc: Npc): ActionResult[][] {

   npc.updateBm(BM_ID.TROLL_STR, "damage", npc.intent.value);
   npc.updateBm(BM_ID.TROLL_REGEN, "regen", npc.intent.value);


  
  const playerStep: ActionResult = {
    fighter_type: "npc",
    fighter_id: npc.id,
    animationName: "blocked",
    fightStatus:"ongoing",

    hp_start: npc.base_att.currhp,
    hp_end: npc.base_att.currhp,

    shield_start: npc.getStat("shield"),
    shield_end: npc.getStat("shield"),

    armor_start: npc.getStat("armor"),
    armor_end: npc.getStat("armor"),

    bm_end: npc.getBmViews(),

    popup: {
      text: `+${npc.intent.value} furie`,
      type: "block",
    },
  };

  return [[playerStep]];
}


private npcAutoRegeneration(npc: Npc): ActionResult[][] {

  const hpStart = npc.getStat("currhp");
  const regen = Math.floor(npc.getStat("maxhp")*0.9) - npc.getStat("currhp");
  npc.getHealed(regen);
  npc.base_att.magicSkill -=1;
  const hpEnd = npc.getStat("currhp");

  const playerStep: ActionResult = {
    fighter_type: "npc",
    fighter_id: npc.id,
    animationName: "heal",
    fightStatus: "ongoing",

    hp_start: hpStart,
    hp_end: hpEnd,

    shield_start: npc.getStat("shield"),
    shield_end: npc.getStat("shield"),

    armor_start: npc.getStat("armor"),
    armor_end: npc.getStat("armor"),

    bm_end: npc.getBmViews(),

    popup: {
      text: `+${hpEnd - hpStart} HP`,
      type: "heal",
    },
  };

  return [[playerStep]];
}

private npcPiercingAttack(
  npc: Npc,
  player: Pj,
): ActionResult[][] {

  const steps: ActionResult[][] = [];

  
  // =========================
  // EVASION DU PJ
  // =========================

  if (player.getStat("evasion") > 0) {

    const hpStart = player.getStat("currhp");
    const shieldStart = player.getStat("shield");
    const armorStart = player.getStat("armor");

    player.updateBm(
      BM_ID.EVASION,
      "evasion",
      -1
    );

    steps.push([{
      fighter_type: "pj",
      fighter_id: player.id,
      fightStatus: "ongoing",
      animationName: "dodged",

      hp_start: hpStart,
      hp_end: player.getStat("currhp"),

      shield_start: shieldStart,
      shield_end: player.getStat("shield"),

      armor_start: armorStart,
      armor_end: player.getStat("armor"),

      bm_end: player.getBmViews(),

      popup: {
        text: "-1 évasion",
        type: "dodge",
      },
    }]);

    return steps;
  }

  // =========================
  // ATTAQUE
  // =========================

  const hpStart = player.getStat("currhp");
  let animationName: AnimationName;
  let popupData: FightPopupData;
  player.getHit(npc.intent.value);
  animationName = player.getStat("currhp") === 0 ? "death" : "hurt";
  popupData = {
      text: `-${npc.intent.value} HP`,
      type: "damage",
    };
  

  steps.push([{
    fighter_type: "pj",
    fighter_id: player.id,
    animationName,
    fightStatus: "ongoing",
    hp_start: hpStart,
    hp_end: player.getStat("currhp"),

    shield_start: player.getStat("shield"),
    shield_end: player.getStat("shield"),

    armor_start:player.getStat("armor"),
    armor_end: player.getStat("armor"),

    bm_end: player.bms.map(bm => bm.toView()),

    popup: popupData,
  }]);

  

  if (player.getStat("currhp") > 0 && player.getStat("reflex") > 0) {
    const shieldStart = player.getStat("shield");
    const reflex = player.getStat("reflex");
    player.base_att.shield += reflex;

    const reflexResult: ActionResult = {
      fighter_type: "pj",
      fighter_id: player.id,
      animationName: "shield",
      fightStatus: "ongoing",

    hp_start: player.getStat("currhp"),
    hp_end: player.getStat("currhp"),

    shield_start: shieldStart,
    shield_end: player.getStat("shield"),

    armor_start: player.getStat("armor"),
    armor_end: player.getStat("armor"),

    bm_end: player.getBmViews(),

    popup: {
      text: `+${reflex}`,
      type: "block",
    },
  };

  steps.push([reflexResult]);
}

  return steps;
}

private npcParry(
  npc: Npc,
  player: Pj,
  
): ActionResult[][] {

  const steps: ActionResult[][] = [];

  // =========================
  // ATTAQUE
  // =========================

  const damage = npc.intent.value
   
  const attackSteps =
    this.npcAttack(
      npc,
      player,
      damage,
    );

  steps.push(...attackSteps);

  // =========================
  // BOUCLIER
  // =========================

  const shieldStart = npc.getStat("shield");

  npc.base_att.shield += npc.getStat("power");
 

  const shieldEnd = npc.getStat("shield");

  const npcStep: ActionResult = {
    fighter_type: "npc",
    fighter_id: npc.id,

    animationName: "shield",
    fightStatus: "ongoing",

    hp_start: npc.getStat("currhp"),
    hp_end: npc.getStat("currhp"),

    shield_start: shieldStart,
    shield_end: shieldEnd,

    armor_start: npc.getStat("armor"),
    armor_end: npc.getStat("armor"),

    bm_end: npc.getBmViews(),

    popup: {
      text: `+${shieldEnd - shieldStart}`,
      type: "block",
    },
  };

  steps.push([npcStep]);

  return steps;
}
}
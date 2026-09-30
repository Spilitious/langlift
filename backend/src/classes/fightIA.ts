import type { ActionResult } from "../../../shared/types/actionResult.js";
import type { AnimationName } from "../../../shared/types/animation.js";
import type { FightPopupData } from "../../../shared/types/fightPopUp.js";
import type { StatName } from "../../../shared/types/label.js";
import { Team } from "./Team.js";
import { Room } from "./Room.js";
import { Pj } from "./Pj.js";
import { Npc } from "./Npc.js";
import { NPC_ID } from "../utils/constants.js";
import { NPC_ACTION_ID } from "../../../shared/utils/npcActionConstant.js";
import { BM_ID } from "../../../shared/utils/bmConstant.js";
import { getTargetSelectMode } from "../utils/basicNpc_data.js";
import type { FightStatus } from "../../../shared/types/actionResult.js";
import { Bm } from "./Bm.js";

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
  for (const npc of [...this.room.npcs]) {

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
    
      case NPC_ACTION_ID.RAT_ATTACK:
      case NPC_ACTION_ID.TOAD_ATTACK:
      case NPC_ACTION_ID.TROLL_ATTACK:
      case NPC_ACTION_ID.SOUL_ATTACK:
      case NPC_ACTION_ID.WOLF_ATTACK:
        target = this.team.getPj(npc.intent.target);
        if(target.base_att.currhp <= 0)
            break;
        result.push([this.getActionResult(npc, "attack")]);
        result.push(
        ...this.npcAttack(npc, target));
        break;

        case NPC_ACTION_ID.DEEP_WOUND:
        target = this.team.getPj(npc.intent.target);
        if(target.base_att.currhp <= 0)
            break;
        result.push([this.getActionResult(npc, "attack")]);
        result.push(
        ...this.npcAttack(npc, target, NPC_ACTION_ID.DEEP_WOUND));
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
         if(target.base_att.currhp <= 0)
            break;
        result = this.npcMultipleAttack(npc,target);
        break;

        case NPC_ACTION_ID.MULTIPLE_DEEP_WOUND :
        target = this.team.getPj(npc.intent.target);
         if(target.base_att.currhp <= 0)
            break;
        result = this.npcMultipleDeepWound(npc,target);
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
      
      case NPC_ACTION_ID.FREEZING_RAY :
       //  result.push([this.getActionResult(npc, "attack")]);
        target = this.team.getPj(npc.intent.target); 
        if(target.base_att.currhp <= 0)
            break;
        result.push([this.getActionResult(npc, "attack")]);
        result.push(...this.npcAttack(npc,target, NPC_ACTION_ID.FREEZING_RAY));
        break;

       case NPC_ACTION_ID.BLEAK_ATTACK :
        target = this.team.getPj(npc.intent.target); 
        if(target.base_att.currhp <= 0)
            break;
        result.push([this.getActionResult(npc, "attack")]);
        result.push(...this.npcAttack(npc,target, NPC_ACTION_ID.BLEAK_ATTACK));
        break;

      case NPC_ACTION_ID.PIERCING_ATTACK :
        target = this.team.getPj(npc.intent.target); 
        if(target.base_att.currhp <= 0)
            break;
        result.push([this.getActionResult(npc, "attack")]);
        result.push(...this.npcPiercingAttack(npc,target));
        break;

       case NPC_ACTION_ID.VAMPIRE_ATTACK :
        target = this.team.getPj(npc.intent.target); 
        if(target.base_att.currhp <= 0)
            break;
        result.push([this.getActionResult(npc, "attack")]);
        result.push(...this.npcAttack(npc,target, NPC_ACTION_ID.VAMPIRE_ATTACK));
        break;

       case NPC_ACTION_ID.AUTOREGENERATION :
        result.push(...this.npcAutoRegeneration(npc));
        break;

       case NPC_ACTION_ID.SOUL_CURSE :
        result.push(...this.npcSoulCurse(npc));
        break;

       case NPC_ACTION_ID.SOUL_ATTACK :
        target = this.team.getPj(npc.intent.target); 
        if(target.base_att.currhp <= 0)
            break;
        result.push([this.getActionResult(npc, "attack")]);
        break;
      
       case NPC_ACTION_ID.BLEAK_ABSORB :
        result.push([this.getActionResult(npc, "attack")]);
        result.push(
        ...this.npcBleakAbsorb(npc));
        break;

        case NPC_ACTION_ID.INVOKE_ZOMBIE :
        result.push([this.getActionResult(npc, "power")]);
        result.push(
        ...this.npcInvokeZombie(npc));
        break;

        case NPC_ACTION_ID.ZONE_VAMPIRISME:
        result.push([this.getActionResult(npc, "attack")]);
        result.push(
        ...this.npcZoneVampirisme(npc));
        break;

        case NPC_ACTION_ID.SLAY_ZOMBIE :
        target = this.room.getNpc(npc.intent.target); 
        if(target.base_att.currhp <= 0)
            break;
        result.push([this.getActionResult(npc, "power")]);
        result.push(
        ...this.npcSlayZombie(npc));
        break;

        case NPC_ACTION_ID.NECRO_BUFF :
        result.push([this.getActionResult(npc, "power")]);
        result.push(
        ...this.npcNecroBuff(npc));
        break;

        case NPC_ACTION_ID.WHITE_ANGEL_RESURRECT :
        result.push([this.getActionResult(npc, "power")]);
        result.push(
        ...this.npcResurectABlackAngel(npc));
        break;

        case NPC_ACTION_ID.BLACK_ANGEL_RESURRECT :
        result.push([this.getActionResult(npc, "power")]);
        result.push(
        ...this.npcResurectAWhiteAngel(npc));
        break;

        case NPC_ACTION_ID.ANGEL_SPELL :
        result.push([this.getActionResult(npc, "power")]);
        result.push(
        ...this.npcAngelSpell(npc));
        break;

        case NPC_ACTION_ID.MULTIPLE_MAGIC_ATTACK :
          target = this.team.getPj(npc.intent.target);
         if(target.base_att.currhp <= 0)
            break;
        result = this.npcMultipleMagicAttack(npc,target);
        break;

        case NPC_ACTION_ID.USE_HP_POTION : 
          target = this.room.getNpc(npc.intent.target);
         if(target.base_att.currhp <= 0)
            break;
        result = this.npcUseHpPotion(npc, target);
        break;

        
        case NPC_ACTION_ID.USE_STR_POTION : 
          target = this.room.getNpc(npc.intent.target);
         if(target.base_att.currhp <= 0)
            break;
        result = this.npcUseStrPotion(npc, target);
        break;


  }
  
    // L'action est complètement résolue.
   // this.room.removeDeadNpcs();
  
    console.log("action", npc.intent.action)
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

    if (player.getStat("currhp") <= 0 && player.fight_absent == 0)
      continue;
    result.push(...this.newTurnPj(player));
  }
  return result;
  
}


private newTurnPj(player: Pj): ActionResult[][] {

  player.fight_absent = Math.max(0, player.fight_absent -1);

  if (player.getStat("shield_expert") == 0)
    player.base_att.shield = 0;

  const hpStart = player.base_att.currhp;
  const shieldStart = player.getStat("shield");
  
  const regen = player.getStat("regen");
  const shield = player.getStat("armor");

  player.setHp(regen);
  player.base_att.shield += shield;
  player.ap = player.getNewTurnAp();
  
  player.updateBmsNewTurn();
 

  
  // Aucun effet
  if ((regen === 0 || player.getStat("currhp")===player.getStat("maxhp")) && shield === 0) {
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

  
  if (npc.getStat("shield_expert") == 0)
    npc.base_att.shield = 0;

  const hpStart = npc.getStat("currhp");
  const shieldStart = npc.getStat("shield");

  const regen = npc.getStat("regen");
  const shield = npc.getStat("armor");

   npc.updateBmsNewTurn();
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
    
    case NPC_ID.GOULE:
      result = this.gouleIntent(npc);
      break;

    case NPC_ID.SOUL:
      result = this.soulIntent(npc);
      break;

    case NPC_ID.ZOMBIE:
      result = this.zombieIntent(npc);
      break;

    case NPC_ID.NECROMANCIEN:
      result = this.necromancienIntent(npc);
      break;
    
    case NPC_ID.BLACK_ANGEL:
      result = this.blackAngelIntent(npc);
      break;

    case NPC_ID.WHITE_ANGEL:
      result = this.whiteAngelIntent(npc);
      break;
    
    case NPC_ID.MANTIS:
      result = this.mantisIntent(npc);
      break;
    
    case NPC_ID.GNOLL:
      result = this.gnollIntent(npc);
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
    pj => (!pj.isUnconscious() && pj.fight_absent ===0)
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
    NPC_ACTION_ID.RAT_ATTACK,
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
          NPC_ACTION_ID.RAT_ATTACK,
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
    NPC_ACTION_ID.TOAD_ATTACK,
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
    NPC_ACTION_ID.WOLF_ATTACK,
    Math.max(0, npc.getStat("damage")),
    pjId,
    targetImage
  );
}


private trollIntent(npc: Npc): ActionResult[][] {

  if (npc.intent.action === NPC_ACTION_ID.TROLL_ATTACK && this.round !=0)
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
      NPC_ACTION_ID.TROLL_ATTACK,
      Math.max(0, npc.getStat("damage")),
      pjId,
      targetImage
    );
}

private gouleIntent(npc: Npc): ActionResult[][] {

  const dice = Math.floor( Math.random()*10);
  
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

  const dice_bonus = 5- Math.floor((npc.getStat("currhp") / npc.getStat("maxhp"))*5)
 
  if ((dice+dice_bonus) > 7)
  {
    return this.newIntentNpc(
      npc,
      NPC_ACTION_ID.VAMPIRE_ATTACK,
      Math.floor(Math.floor(npc.getStat("damage"))),
      pjId,
      targetImage,
    );
  }
  if ((dice +dice_bonus) === 6)
  {
    return this.newIntentNpc(
      npc,
      NPC_ACTION_ID.MULTIPLE_ATTACK,
      Math.floor(Math.floor(npc.getStat("damage")/2)),
      pjId,
      targetImage,
      npc.getStat("power")
    );
  }
  
     return this.newIntentNpc(
      npc,
      NPC_ACTION_ID.BLEAK_ATTACK,
      Math.max(0, npc.getStat("damage")),
      pjId,
      targetImage,
      
    )
  

  

}


private soulIntent(npc: Npc): ActionResult[][] {

 if (npc.intent.action === NPC_ACTION_ID.SOUL_ATTACK || this.round ==0)
  {
    return this.newIntentNpc(
      npc,
      NPC_ACTION_ID.SOUL_CURSE,
      npc.getStat("power")
    );
  }

 let value:number = 0;
 
 for(const pj of this.team.pjs) {
    const bm = pj.getBm(BM_ID.BLEAK)
    if(bm != undefined) 
    {
      if(bm.getBonus("regen")) {
        value += bm.getBonus("regen");
     
      }
      
    }
  }

  if(npc.getStat("currhp") < 20 && value < -12 && npc.intent.action != NPC_ACTION_ID.BLEAK_ABSORB)
  {
     return this.newIntentNpc(
      npc,
      NPC_ACTION_ID.BLEAK_ABSORB,
      0
      )
  }
  
 
  const targetMode = getTargetSelectMode(npc.basicRaceId);
  const pjId = this.selectNewTarget(targetMode.feature,targetMode.mode);
  const targetImage = this.team.pjs.find(pj => pj.id === pjId)?.avatar;
  return this.newIntentNpc(
      npc,
      NPC_ACTION_ID.SOUL_ATTACK,
      npc.getStat("magicSkill"),
      pjId,
      targetImage,
    )
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
          NPC_ACTION_ID.TROLL_ATTACK,
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
      

  
private zombieIntent(npc: Npc): ActionResult[][] {

    const targetMode = getTargetSelectMode(npc.basicRaceId);
    const pjId = this.selectNewTarget(targetMode.feature,targetMode.mode);
    const targetImage = this.team.pjs.find(pj => pj.id === pjId)?.avatar;
    return this.newIntentNpc(
        npc,
        NPC_ACTION_ID.BLEAK_ATTACK,
        npc.getStat("damage"),
        pjId,
        targetImage
        );
}


  
private necromancienIntent(npc: Npc): ActionResult[][] {

    const dice = Math.floor(Math.random()*10);
    const hpRate = npc.getStat("currhp")/npc.getStat("maxhp")*10;
    if(hpRate < 7 && dice < 10-hpRate && npc.intent.action != NPC_ACTION_ID.ZONE_VAMPIRISME) {
        return this.newIntentNpc(
              npc,
              NPC_ACTION_ID.ZONE_VAMPIRISME,
              Math.floor(npc.getStat("magicSkill"))
          );
    }



    if (this.room.npcs.length < 5 && dice + this.room.npcs.length < 7 && npc.intent.action !== NPC_ACTION_ID.INVOKE_ZOMBIE) {
      
        const positions = [1, 3, 4, 6].filter( position =>!this.room.npcs.some(monster => monster.position === position));
        const dice = Math.floor(Math.random() * positions.length);
       
        if(positions[dice]) {
        
          return this.newIntentNpc(
              npc,
              NPC_ACTION_ID.INVOKE_ZOMBIE,
              -1,
              positions[dice],
             

          );
        }
    }

    if (this.room.npcs.length > 3 && dice + this.room.npcs.length > 8 && npc.intent.action !== NPC_ACTION_ID.SLAY_ZOMBIE) {
      
        return this.newIntentNpc(
              npc,
              NPC_ACTION_ID.SLAY_ZOMBIE,
              -1,
              
        );
        
    }

   
    
   if(npc.intent.action != NPC_ACTION_ID.NECRO_BUFF) {
 
     return this.newIntentNpc(
        npc,
        NPC_ACTION_ID.NECRO_BUFF,
        npc.getStat("power"),
       
        );
    }
    
    const targetMode = getTargetSelectMode(npc.basicRaceId);
    const pjId = this.selectNewTarget(targetMode.feature,targetMode.mode);
    const targetImage = this.team.pjs.find(pj => pj.id === pjId)?.avatar;
    return this.newIntentNpc(
        npc,
        NPC_ACTION_ID.SOUL_ATTACK,
        npc.getStat("magicSkill")*2,
        pjId,
        targetImage
       
        );
}


  
private blackAngelIntent(npc: Npc): ActionResult[][] {

    if(this.room.npcs.length< 2) {
        return this.newIntentNpc(
              npc,
              NPC_ACTION_ID.WHITE_ANGEL_RESURRECT,
              -1
          );
    }

    if (this.round % 2 === 0) {
        return this.newIntentNpc(
              npc,
              NPC_ACTION_ID.ANGEL_SPELL,
              npc.getStat("magicSkill")*3
          );
    }
    
    const targetMode = getTargetSelectMode(npc.basicRaceId);
    const pjId = this.selectNewTarget(targetMode.feature,targetMode.mode);
    const targetImage = this.team.pjs.find(pj => pj.id === pjId)?.avatar;
    return this.newIntentNpc(
        npc,
        NPC_ACTION_ID.MULTIPLE_ATTACK,
        npc.getStat("damage"),
        pjId,
        targetImage,
        npc.getStat("power")
       
        );
}

  
private whiteAngelIntent(npc: Npc): ActionResult[][] {

    if(this.room.npcs.length< 2) {
        return this.newIntentNpc(
              npc,
              NPC_ACTION_ID.WHITE_ANGEL_RESURRECT,
              -1
          );
    }

    if (this.round % 2 === 1) {
        return this.newIntentNpc(
              npc,
              NPC_ACTION_ID.ANGEL_SPELL,
              npc.getStat("magicSkill")*3
          );
    }
    
    const targetMode = getTargetSelectMode(npc.basicRaceId);
    const pjId = this.selectNewTarget(targetMode.feature,targetMode.mode);
    const targetImage = this.team.pjs.find(pj => pj.id === pjId)?.avatar;
    return this.newIntentNpc(
        npc,
        NPC_ACTION_ID.FREEZING_RAY,
        npc.getStat("magicSkill") + Math.floor(npc.getStat("magicSkill")*Math.random()),
        pjId,
        targetImage
       
        );
}



private mantisIntent(npc: Npc): ActionResult[][] {

  const dice = Math.floor( Math.random()*10);
  
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

 
  if (dice < 5)
  {
    return this.newIntentNpc(
      npc,
      NPC_ACTION_ID.DEEP_WOUND,
      Math.floor(Math.floor(npc.getStat("damage"))),
      pjId,
      targetImage,
    );
  }
 
    return this.newIntentNpc(
      npc,
      NPC_ACTION_ID.MULTIPLE_ATTACK,
      Math.floor(Math.floor(npc.getStat("damage")/2)),
      pjId,
      targetImage,
      npc.getStat("power")
    );
  }
  
   


private gnollIntent(npc: Npc): ActionResult[][] {

  const dice = Math.floor( Math.random()*10);
  
  const targetMode = getTargetSelectMode(
    npc.basicRaceId
  );

  const pjId = this.selectNewTarget(
    targetMode.feature,
    targetMode.mode
  );


  if(this.round !== 0 && this.round %3 === 0)
  {
    if(npc.getStat("magicSkill")> 0 && npc.getStat("currhp")/npc.getStat("maxhp")*10 < 6 )
    {  npc.base_att.magicSkill -=1;
     return this.newIntentNpc(
      npc,
      NPC_ACTION_ID.USE_HP_POTION,
      -1,
      npc.id,
    
    );
    }
    else {
      return this.newIntentNpc(
      npc,
      NPC_ACTION_ID.USE_STR_POTION,
      -1,
      npc.id,
    );


    }  
  }
  const targetImage = this.team.pjs.find(
    pj => pj.id === pjId
  )?.avatar;

  const damage = 1+Math.floor(Math.random()*(npc.getStat("damage")-2))
  const iteration = 1+npc.getStat("damage")-damage;

   return this.newIntentNpc(
      npc,
      NPC_ACTION_ID.MULTIPLE_DEEP_WOUND,
      damage+1,
      pjId,
      targetImage,
      iteration
    );
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
  
   // BURN
if (
  npc.getStat("currhp") > 0 &&
  attackResult.hp_start > attackResult.hp_end &&
  npcAction === NPC_ACTION_ID.BURN_ATTACK
) {

  if (player.getStat("ward") > 0) {

    player.updateBm(BM_ID.WARD, "ward", -1);
   // attackResult.animationName ="ward";
    if (attackResult.popup) {
      attackResult.popup.text =
        `-1 protection\n${attackResult.popup.text}`;
    }

  } else {

    player.updateBm(
      BM_ID.BURN,
      "regen",
      npc.base_att.power
    );

    if (attackResult.popup) {
      attackResult.popup.text =
        `+${npc.base_att.power} brûlure\n${attackResult.popup.text}`;
    }
  }

  attackResult.bm_end = player.getBmViews();
}

// BLEED
if (
  npc.getStat("currhp") > 0 &&
  attackResult.hp_start > attackResult.hp_end &&
  npcAction === NPC_ACTION_ID.DEEP_WOUND
) {

  if (player.getStat("ward") > 0) {

    player.updateBm(BM_ID.WARD, "ward", -1);
   // attackResult.animationName ="ward";
    if (attackResult.popup) {
      attackResult.popup.text =
        `-1 protection\n${attackResult.popup.text}`;
    }

  } else {

    player.updateBm(
      BM_ID.BLEED,
      "regen",
      npc.base_att.power
    );

    if (attackResult.popup) {
      attackResult.popup.text =
        `+${npc.base_att.power} saignement\n${attackResult.popup.text}`;
    }
  }

  attackResult.bm_end = player.getBmViews();
}
// LIEFE_STEAL
if (
  npc.getStat("currhp") > 0 &&
  attackResult.hp_start > attackResult.hp_end &&
  npc.getStat("lifeSteal") > 0)
   {
     const hp_start = npc.getStat("currhp");
     const regen = npc.getHealed(npc.getStat("lifeSteal"));
     if(regen > 0) {
     
        const reflexResult: ActionResult = {
          fighter_type: "npc",
          fighter_id: npc.id,
          animationName: "heal",
          fightStatus: "ongoing",
          hp_start: hp_start,
          hp_end: npc.getStat("currhp"),
          shield_start: npc.getStat("shield"),
          shield_end: npc.getStat("shield"),
          armor_start: npc.getStat("armor"),
          armor_end: npc.getStat("armor"),
          bm_end: npc.getBmViews(),
          popup: {
          text: `+${regen} PV`,
          type: "heal",
        },
  };

  steps.push([reflexResult]);
}
   }
  


// BLEAK
if (
  npc.getStat("currhp") > 0 &&
  attackResult.hp_start > attackResult.hp_end &&
  npcAction === NPC_ACTION_ID.BLEAK_ATTACK
) {

  if (player.getStat("ward") > 0) {

    player.updateBm(BM_ID.WARD, "ward", -1);

    if (attackResult.popup) {
      attackResult.popup.text =
        `-1 protection\n${attackResult.popup.text}`;
    }

  } else {

    player.updateBm(
      BM_ID.BLEAK,
      "regen",
      1
    );

    if (attackResult.popup) {
      attackResult.popup.text =
        `+1 putréfaction\n${attackResult.popup.text}`;
    }
  }

  attackResult.bm_end = player.getBmViews();
}

     //VAMPIRE_ATTACK
    if (
      npc.getStat("currhp") > 0 && (attackResult.hp_start > attackResult.hp_end) &&
      npcAction === NPC_ACTION_ID.VAMPIRE_ATTACK)
    {
      const hp_start = npc.getStat("currhp");
      npc.getHealed(attackResult.hp_start- attackResult.hp_end);
      const hp_end = npc.getStat("currhp");

      const vampireResult: ActionResult = {
      fighter_type: "npc",
      fighter_id: npc.id,
      animationName: "heal",
      fightStatus: "ongoing",

      hp_start: hp_start,
      hp_end: hp_end,

      shield_start: npc.getStat("shield"),
      shield_end: npc.getStat("shield"),

      armor_start: player.getStat("armor"),
      armor_end: player.getStat("armor"),

      bm_end: player.getBmViews(),

      popup: {
        text: `+${hp_end-hp_start}`,
        type: "heal",
      },
    };
        steps.push([vampireResult]);
      
    }

     //LENTEUR
    if (
      npc.getStat("currhp") > 0 && (attackResult.hp_start > attackResult.hp_end) &&
      npcAction === NPC_ACTION_ID.FREEZING_RAY)
    {
      if (player.getStat("ward") > 0) {
          player.updateBm(BM_ID.WARD, "ward", -1);
          if (attackResult.popup) {
            attackResult.popup.text =
            `-1 protection\n${attackResult.popup.text}`;
          }

      } else {

          player.updateBm(
            BM_ID.SLOWNESS,
            "ap",
            1
    );


    if (attackResult.popup) {
      attackResult.popup.text =
        `Lenteur\n${attackResult.popup.text}`;
    }
  }

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

    let hpDamage = damage - shieldStart;

    if(target.hasBm(BM_ID.DAMAGE_CURSE)) {
        hpDamage *=2;
        target.deleteBm(BM_ID.DAMAGE_CURSE);
    }

    if(target.getStat("ethereal")> 0)
      hpDamage =1;

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
      text: `+${shieldEnd - shieldStart} bouclier`,
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
      ...this.npcAttack(npc, pj)
    );

    if (pj.getStat("currhp") <= 0 || npc.getStat("currhp") <=0) {
      break;
    }
  }

  return result;
}


private npcMultipleMagicAttack(
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
      ...this.npcAttack(npc, pj)
    );

    if (pj.getStat("currhp") <= 0 || npc.getStat("currhp") <=0) {
      break;
    }
  }

  return result;
}


private npcMultipleDeepWound(
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
      ...this.npcAttack(npc, pj, NPC_ACTION_ID.DEEP_WOUND)
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

private npcSoulCurse(npc: Npc): ActionResult[][] {
  const value = npc.getStat("power");
  const steps: ActionResult[] = [];
  steps.push(this.getActionResult(npc, "power"));
  let animationName ="hurt";
  for (const player of this.team.pjs) {
   
    if (player.getStat("currhp") <= 0) continue;

  if(player.getStat("ward")>2)
    animationName = "athlan";

  const effects = [
  {
    apply: () => {
      player.updateBm(BM_ID.SLOWNESS, "ap", 1);
      player.updateBmLife(BM_ID.SLOWNESS, value);
      return "+Lenteur\n";
    },
  },
  {
    apply: () => {
      player.updateBm(BM_ID.BLEAK, "regen", value);
      return `+${value} putréfaction\n`;
    },
  },
  {
    apply: () => {
      player.updateBm(
        BM_ID.SHATTERED,
        "shield_bonus",
        value
      );
      return `+${value} désorienté\n`;
    },
  },
];

effects.sort(() => Math.random() - 0.5);
  let text = "";

for (const effect of effects) {

  if (player.getStat("ward") > 0) {

    player.updateBm(
      BM_ID.WARD,
      "ward",
      -1
    );

    text += "-1 protection\n";

  } else {

    text += effect.apply();

  }
}  
    steps.push({
      fighter_type: "pj",
      fighter_id: player.id,
      animationName: animationName as AnimationName,
      fightStatus: "ongoing",
      hp_start: player.getStat("currhp"),
      hp_end: player.getStat("currhp"),
      shield_start: player.getStat("shield"),
      shield_end: player.getStat("shield"),
      armor_start: player.getStat("armor"),
      armor_end: player.getStat("armor"),
      bm_end: player.bms.map(bm => bm.toView()),

      popup: {
        text: text,
        type: "damage",
      },
    });
  }

  return [steps];
}

private npcBleakAbsorb(npc: Npc): ActionResult[][] {

  const actions: ActionResult[] = [];
  let value = 0;

  for (const pj of this.team.pjs) {

    const bleak = pj.getBm(BM_ID.BLEAK);

    if (!bleak) continue;

    const bleakValue = bleak.getBonus("regen");

    value += bleakValue;

    pj.deleteBm(BM_ID.BLEAK);

    const step: ActionResult = {
      fighter_type: "pj",
      fighter_id: pj.id,
      animationName: "heal",
      fightStatus: "ongoing",

      hp_start: pj.getStat("currhp"),
      hp_end: pj.getStat("currhp"),

      shield_start: pj.getStat("shield"),
      shield_end: pj.getStat("shield"),

      armor_start: pj.getStat("armor"),
      armor_end: pj.getStat("armor"),

      bm_end: pj.getBmViews(),

      popup: {
        text: `${bleakValue} putréfaction`,
        type: "heal",
      },
    };

    actions.push(step);
  }

  // Aucun BLEAK trouvé
  if (value === 0) {
    return [];
  }

  const hpStart = npc.getStat("currhp");

  npc.getHealed(-value);
  npc.base_att.power+=2;

  const stepNpc: ActionResult = {
    fighter_type: "npc",
    fighter_id: npc.id,
    animationName: "heal",
    fightStatus: "ongoing",

    hp_start: hpStart,
    hp_end: npc.getStat("currhp"),

    shield_start: npc.getStat("shield"),
    shield_end: npc.getStat("shield"),

    armor_start: npc.getStat("armor"),
    armor_end: npc.getStat("armor"),

    bm_end: npc.getBmViews(),

    popup: {
      text: `+${npc.getStat("currhp") - hpStart} HP\n +2 puissance`,
      type: "heal",
    },
  };

  actions.push(stepNpc);

  return [actions];
}


private npcInvokeZombie(npc: Npc): ActionResult[][] {

  const zombie = new Npc(NPC_ID.ZOMBIE, 7+ Math.floor( Math.random()*3));
  zombie.position = npc.intent.target;
  this.room.npcs.push(zombie);
  
  const new_intent = this.newTurnNpc(zombie);

  
  const action2: ActionResult = {
    fighter_type: "npc",
    fighter_id: zombie.id,
    animationName: "spawn",
    fightStatus: "ongoing",

    hp_start: zombie.getStat("currhp"),
    hp_end: zombie.getStat("currhp"),

    shield_start: zombie.getStat("shield"),
    shield_end: zombie.getStat("shield"),

    armor_start: zombie.getStat("armor"),
    armor_end: zombie.getStat("armor"),

    bm_end: zombie.getBmViews(),

    fighter_spawn: zombie.toView(),

    popup: {
      text: `I'm alive`,
      type: "heal",
    },
  };

 

 return [
  [action2],
  ...new_intent
];
}

private npcZoneVampirisme(npc: Npc): ActionResult[][] {

  const damage = npc.intent.value;
  let totalHealPoint = 0;

  const playerResults: ActionResult[] = [];

  for (const player of this.team.pjs) {

    if (player.getStat("currhp") <= 0) continue;

    const hpStart = player.getStat("currhp");
    const shieldStart = player.getStat("shield");
    const armorStart = player.getStat("armor");

    // PROTECTION
    if (player.getStat("ward") > 0) {

      player.updateBm(BM_ID.WARD, "ward", -1);

      playerResults.push({
        fighter_type: "pj",
        fighter_id: player.id,
        animationName: "ward",
        fightStatus: "ongoing",

        hp_start: hpStart,
        hp_end: player.getStat("currhp"),

        shield_start: shieldStart,
        shield_end: player.getStat("shield"),

        armor_start: armorStart,
        armor_end: player.getStat("armor"),

        bm_end: player.getBmViews(),

        popup: {
          text: "-1 protection",
          type: "heal",
        },
      });

      continue;
    }

    // DÉGÂTS
    player.getHit(damage);

    const damageTaken =
      hpStart - player.getStat("currhp");

    totalHealPoint += damageTaken;

    playerResults.push({
      fighter_type: "pj",
      fighter_id: player.id,
      animationName: "hurt",
      fightStatus: "ongoing",

      hp_start: hpStart,
      hp_end: player.getStat("currhp"),

      shield_start: shieldStart,
      shield_end: player.getStat("shield"),

      armor_start: armorStart,
      armor_end: player.getStat("armor"),

      bm_end: player.getBmViews(),

      popup: {
        text: `-${damageTaken} HP`,
        type: "damage",
      },
    });
  }

  const steps: ActionResult[][] = [];

  // Tous les PJ simultanément
  if (playerResults.length > 0) {
    steps.push(playerResults);
  }

  // Puis soin du NPC
  if (totalHealPoint > 0) {

    const hpStart = npc.getStat("currhp");

    npc.getHealed(totalHealPoint);

    steps.push([{
      fighter_type: "npc",
      fighter_id: npc.id,
      animationName: "heal",
      fightStatus: "ongoing",

      hp_start: hpStart,
      hp_end: npc.getStat("currhp"),

      shield_start: npc.getStat("shield"),
      shield_end: npc.getStat("shield"),

      armor_start: npc.getStat("armor"),
      armor_end: npc.getStat("armor"),

      bm_end: npc.getBmViews(),

      popup: {
        text: `+${npc.getStat("currhp") - hpStart} HP`,
        type: "heal",
      },
    }]);
  }

  return steps;
}

private npcSlayZombie(
  npc: Npc,
): ActionResult[][] {

 
  const steps: ActionResult[][] = [];

  // =========================
  // 1. Mort du zombie
  // =========================
  const possibleTarget = this.room.npcs.filter( monster => (monster.basicRaceId = NPC_ID.ZOMBIE))
  const dice = Math.floor(Math.random() * possibleTarget.length);
  const target =possibleTarget[dice]
  if(!target)
      return steps;

  const hpStart = target.getStat("currhp");
  const shieldStart = target.getStat("shield");
  const armorStart = target.getStat("armor");

  target.getHit(hpStart);

  steps.push([{
    fighter_type: "npc",
    fighter_id: target.id,
    animationName: "death",
    fightStatus: "ongoing",

    hp_start: hpStart,
    hp_end: target.getStat("currhp"),

    shield_start: shieldStart,
    shield_end: target.getStat("shield"),

    armor_start: armorStart,
    armor_end: target.getStat("armor"),

    bm_end: target.getBmViews(),

    popup: {
      text: `-${hpStart - target.getStat("currhp")} HP`,
      type: "damage",
    },
  }]);


  // =========================
  // 2. Gain de puissance
  // =========================

  
  npc.base_att.magicSkill += 3;

  steps.push([{
    fighter_type: "npc",
    fighter_id: npc.id,
    animationName: "buff",
    fightStatus: "ongoing",

    hp_start: npc.getStat("currhp"),
    hp_end: npc.getStat("currhp"),

    shield_start: npc.getStat("shield"),
    shield_end: npc.getStat("shield"),

    armor_start: npc.getStat("armor"),
    armor_end: npc.getStat("armor"),

    bm_end: npc.getBmViews(),

    popup: {
      text: `+3 puissance`,
      type: "block",
    },
  }]);

  return steps;
}


private npcNecroBuff(
  npc: Npc,
): ActionResult[][] {

 
  const steps: ActionResult[][] = [];

  const armor_start = npc.getStat("armor");
  const shield_start = npc.getStat("shield");
  npc.base_att.armor += npc.intent.value;
  npc.base_att.shield = 18+npc.intent.value;
  

  // =========================_
  // 2. Gain de puissance
  // =========================

  
  steps.push([{
    fighter_type: "npc",
    fighter_id: npc.id,
    animationName: "buff",
    fightStatus: "ongoing",

    hp_start: npc.getStat("currhp"),
    hp_end: npc.getStat("currhp"),

    shield_start: shield_start,
    shield_end: npc.getStat("shield"),

    armor_start: armor_start,
    armor_end: npc.getStat("armor"),

    bm_end: npc.getBmViews(),

    popup: {
      text: `+${npc.getStat("armor")- armor_start} armor\n
            +${npc.getStat("shield")-shield_start} bouclier`,
      type: "block",
    },
  }]);

  return steps;
}

private npcResurectABlackAngel(npc: Npc): ActionResult[][] {

  const angel = new Npc(NPC_ID.BLACK_ANGEL, 10);
  angel.position = 2;
  this.room.npcs.push(angel);
  
  const new_intent = this.newTurnNpc(angel);
  
  const action2: ActionResult = {
    fighter_type: "npc",
    fighter_id: angel.id,
    animationName: "spawn",
    fightStatus: "ongoing",

    hp_start: angel.getStat("currhp"),
    hp_end: angel.getStat("currhp"),

    shield_start: angel.getStat("shield"),
    shield_end: angel.getStat("shield"),

    armor_start: angel.getStat("armor"),
    armor_end: angel.getStat("armor"),

    bm_end: angel.getBmViews(),

    fighter_spawn: angel.toView(),

    popup: {
      text: `I'm alive`,
      type: "heal",
    },
  };
  
 return [
  [action2],
  ...new_intent
];
}


private npcResurectAWhiteAngel(npc: Npc): ActionResult[][] {

  const angel = new Npc(NPC_ID.WHITE_ANGEL, 10);
  angel.position = 2;
  this.room.npcs.push(angel);
  
  const new_intent = this.newTurnNpc(angel);
  
  const action2: ActionResult = {
    fighter_type: "npc",
    fighter_id: angel.id,
    animationName: "spawn",
    fightStatus: "ongoing",

    hp_start: angel.getStat("currhp"),
    hp_end: angel.getStat("currhp"),

    shield_start: angel.getStat("shield"),
    shield_end: angel.getStat("shield"),

    armor_start: angel.getStat("armor"),
    armor_end: angel.getStat("armor"),

    bm_end: angel.getBmViews(),

    fighter_spawn: angel.toView(),

    popup: {
      text: `I'm alive`,
      type: "heal",
    },
  };
  
 return [
  [action2],
  ...new_intent
];
}


private npcAngelSpell(
  npc: Npc,
): ActionResult[][] {

 
  const steps: ActionResult[][] = [];
  const armor_start = npc.getStat("armor");
  const shield_start = npc.getStat("shield");
 
  // 1. Gain Ethereal
  npc.updateBm(BM_ID.SHORT_LIVED_ETHEREAL, "ethereal", 1);
  
  const step1:ActionResult = {
    fighter_type: "npc",
    fighter_id: npc.id,
    animationName: "curse",
    fightStatus: "ongoing",
    hp_start: npc.getStat("currhp"),
    hp_end: npc.getStat("currhp"),
    shield_start: shield_start,
    shield_end: npc.getStat("shield"),
    armor_start: armor_start,
    armor_end: npc.getStat("armor"),
    bm_end: npc.getBmViews(),
    popup: {
      text: `+1 éthérée`,
      type: "block",
    },
  };

  // 2. Gain Shield
 const otherAngel = this.room.npcs.find(
  m => m.id !== npc.id
);

if (otherAngel) {
  const shieldStart =
    otherAngel.getStat("shield");

  otherAngel.base_att.shield += npc.intent.value;

  const shieldEnd =
    otherAngel.getStat("shield");

  const step2:ActionResult = {
    fighter_type: "npc",
    fighter_id: otherAngel.id,
    animationName: "shield",
    fightStatus: "ongoing",

    hp_start: otherAngel.getStat("currhp"),
    hp_end: otherAngel.getStat("currhp"),

    shield_start: shieldStart,
    shield_end: shieldEnd,

    armor_start: otherAngel.getStat("armor"),
    armor_end: otherAngel.getStat("armor"),

    bm_end: otherAngel.getBmViews(),

    popup: {
      text: `+${shieldEnd - shieldStart} bouclier`,
      type: "block",
    }
  }
  return [[step1, step2]];
}
 return [[step1]]; 
}


private npcUseHpPotion(npc: Npc, target:Npc): ActionResult[][] {

  const hpStart = target.getStat("currhp");
  const regen = Math.floor(npc.getStat("maxhp")*0.4+Math.random()*10)
  npc.getHealed(regen);
  const hpEnd = npc.getStat("currhp");

  const playerStep: ActionResult = {
    fighter_type: "npc",
    fighter_id: target.id,
    animationName: "potion_hp",
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
  };

  return [[playerStep]];
}


private npcUseStrPotion(npc: Npc, target:Npc): ActionResult[][] {

 
  const damage = 1+Math.floor(Math.random()*2);
  npc.updateBm(BM_ID.GNOLL_POTION, "damage", damage);

  const playerStep: ActionResult = {
    fighter_type: "npc",
    fighter_id: target.id,
    animationName: "potion_standard",
    fightStatus: "ongoing",

    hp_start: npc.getStat("currhp"),
    hp_end: npc.getStat("currhp"),

    shield_start: target.getStat("shield"),
    shield_end: target.getStat("shield"),

    armor_start: target.getStat("armor"),
    armor_end: target.getStat("armor"),

    bm_end: target.getBmViews(),

    popup: {
      text: `+${damage} force`,
      type: "block",
    },
  };

  return [[playerStep]];
}
}
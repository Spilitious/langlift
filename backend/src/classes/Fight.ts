import {Pj} from "./Pj.js";
import {Npc} from "./Npc.js"
import { Team } from "./Team.js";
import { Room } from "./Room.js";
import type { ActionResult, FightStatus, } from "../../../shared/types/actionResult.js";
import { BM_ID, ABILITY_ID, FIGHT_VALUE, NPC_ACTION_ID, NPC_ACTION_ID_NEED_INTENT_CHANGE } from "../utils/constants.js";
import type { AnimationName } from "../../../shared/types/animation.js";
import type { FightPopupData } from "../../../shared/types/fightPopUp.js";

import { FightIA } from "./fightIA.js";

export class Fight {
   
    team:Team;
    room:Room;
    round:number;
    private ia: FightIA;
   

   
    constructor(t:Team, r:Room) {
        this.team = t;
        this.room =r; 
        this.ia = new FightIA(t,r,  () => this.getFightStatus());
        this.round = 0;
    }

    executeIA():ActionResult[][] {
      return this.ia.execute();
    }

    playIntentNpcIa():ActionResult[][] {
      return this.ia.playIntentNpc();
    }
/*
    getProvocation():number {
      for(let i:number=0; i< this.getNbOpponent(); i++)
      {
        if(this.getOpponent(i).haveBm(BM_NAME.PROVOCATION))
            return i
      }
      return -1;
    }

*/

private getActionResult(player:Pj, name:AnimationName):ActionResult
{
  return {
    fighter_type: "pj",
    fighter_id: player.id,
    animationName: name,
    fightStatus: this.getFightStatus(),
   
    shield_start:player.getStat("shield"),
    shield_end:player.getStat("shield"),

    hp_start:player.getStat("currhp"),
    hp_end:player.getStat("currhp"),
    
    armor_start:player.getStat("armor"),
    armor_end:player.getStat("armor"),

    bm_end:player.getBmViews(),
  };


}
              
private getFightStatus(): FightStatus {

  if (this.room.npcs.length === 0) {
    return "victory";
  }

  const allPlayersUnconscious =
    this.team.pjs.every(
      player => player.isUnconscious()
    );

  if (allPlayersUnconscious) {
    return "defeat";
  }

  return "ongoing";
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

executeAction(basicAbilityId: number, pjId: number, targetId?: number): ActionResult[][] {

  const player = this.team.getPj(pjId);
  

  let result: ActionResult[][] = [];


  switch (basicAbilityId) {

    case ABILITY_ID.ATTACK: 
      result.push([this.getActionResult(player, "attack")]);
      result.push(
        ...this.base_attack(player, targetId!));
      break;
      

    case ABILITY_ID.SHIELD:
      
        result = this.base_shield(player);
      break;
      
    case ABILITY_ID.BRUTAL_BLOW:
      result.push([this.getActionResult(player, "attack")]);
      result.push(
        ...this.brutalBlow(player, targetId!));
    
      break;

    case ABILITY_ID.GUARD:
      result= this.guard(player);
      break;

    case ABILITY_ID.ROCK_SKIN:
      result= this.skinOfRock(player);
      break;

    case ABILITY_ID.PARRY:
      result.push([this.getActionResult(player, "attack")]);
       result.push(
        ...this.parry(player, targetId!));
     
      break;

    case ABILITY_ID.AUTOREGENERATION:
      result = this.autoRegeneration(player);
      break;

    case ABILITY_ID.GUARD_REFLEX:
      result = this.guardReflex(player);
      break;

    case ABILITY_ID.DEEP_THRUST:
      result.push([this.getActionResult(player, "attack")]);
      result.push(
        ...this.deepThrust(player, targetId!));
      break;

    case ABILITY_ID.TWIRL:
      result.push([this.getActionResult(player, "attack")]);
      result= this.twirl(player);
      break;

    case ABILITY_ID.FIREBALL:
      result.push([this.getActionResult(player, "attack")]);
       result.push(
        ...this.fireball(player, targetId!));
      break;

    case ABILITY_ID.LIFE_TEARS:
      result= this.tears(player, targetId!);
      break;

      case ABILITY_ID.WINGS:
      result= this.wings(player, targetId!);
      break;  

      case ABILITY_ID.FIRE_BARRIER:
     
      result= this.fireBarrier(player, targetId!);
      break;  
      case ABILITY_ID.ATHLAN_SHIELD:
       
      result= this.shieldOfAthlan(player, targetId!);
      break;  
      case ABILITY_ID.ATHLAN_ARMOR:
      
      result= this.armorOfAthlan(player, targetId!);
      break;  
      case ABILITY_ID.REGENERATION:
      
      result= this.regeneration(player, targetId!);
      break; 

      case ABILITY_ID.ARCXOS:
      result= this.ArcxosCursed(player, targetId!);
      break;  

      case ABILITY_ID.MULTIPLE_ATTACK:
      result= this.MultipleAttack(player, targetId!);
      break;  

      case ABILITY_ID.CHARGE:
      result.push([this.getActionResult(player, "attack")]);
      result.push(... this.charge(player, targetId!));
      break;  

      case ABILITY_ID.TREACHEROUS_ATTACK:
        result.push([this.getActionResult(player, "attack")]);
      result.push(...this.treacherousAttack(player, targetId!));
      break;  

      default:
      throw new Error(`Ability ${basicAbilityId} non gérée`);
  }

    // L'action est complètement résolue.
    this.room.removeDeadNpcs();
  
   return this.setFightStatus(result);
  
}

private applyDamage(
  target: Pj | Npc,
  targetType: "pj" | "npc",
  damage: number
): ActionResult {

  const hpStart = target.getStat("currhp");
  const shieldStart = target.getStat("shield");
  const armorStart = target.getStat("armor");

  let animationName: AnimationName;
  let popupData: FightPopupData;

  if (shieldStart >= damage) {

    target.base_att.shield -= damage;

    animationName = "blocked";

    popupData = {
      text: "Bloqué",
      type: "block",
    };

  } else {

    target.base_att.shield = 0;

    const hpDamage = damage - shieldStart;

    target.getHit(hpDamage);

    animationName =
      target.getStat("currhp") === 0
        ? "death"
        : "hurt";

    popupData = {
      text: `-${hpDamage} HP`,
      type: "damage",
    };
  }

  return {
    fighter_type: targetType,
    fighter_id: target.id,
    fightStatus:"ongoing",
    animationName,

    hp_start: hpStart,
    hp_end: target.getStat("currhp"),

    shield_start: shieldStart,
    shield_end: target.getStat("shield"),

    armor_start: armorStart,
    armor_end: target.getStat("armor"),

    bm_end: target.getBmViews(),

    popup: popupData,

    ...(targetType === "npc" && {
      new_intent: (target as Npc).intent,
    }),
  };
}

private attack(
  player: Pj,
  npc: Npc,
  damage: number,
  ability?: number
): ActionResult[][] {

  const results: ActionResult[][] = [];

  // =========================
  // SPIKE
  // =========================

  if (npc.getStat("spike") > 0) {

    const spikeDamage = npc.getStat("spike");
    if (spikeDamage > 0) {

      const spikeResult = this.applyDamage(
        player,
        "pj",
        spikeDamage
      );

      results.push([spikeResult]);
      // Le Spike tue le PJ :
      // l'attaque s'arrête ici.
      if (player.getStat("currhp") === 0) {
        return results;
      }
    }
  }

  // =========================
  // EVASION
  // =========================

  if (npc.getStat("evasion")> 0) {

    const hpStart = npc.getStat("currhp");
    const shieldStart = npc.getStat("shield");
    const armorStart = npc.getStat("armor");

    npc.updateBm(BM_ID.EVASION, "evasion", -1);
    

    results.push([{
      fighter_type: "npc",
      fighter_id: npc.id,
      animationName: "dodged",
      fightStatus: "ongoing",

      hp_start: hpStart,
      hp_end: npc.getStat("currhp"),

      shield_start: shieldStart,
      shield_end: npc.getStat("shield"),

      armor_start: armorStart,
      armor_end: npc.getStat("armor"),

      bm_end: npc.getBmViews(),

      new_intent: npc.intent,

      popup: {
        text: "-1 évasion",
        type: "dodge",
      },
    }]);

    return results;
  }

  // =========================
  // DEGATS
  // =========================

  const attackResult = this.applyDamage(
    npc,
    "npc",
    damage
  );

 
  // TRAITEMENT PARTICULIER AJOUT DU BM POUR  DEEP THRUST 
  if (
    npc.getStat("currhp") > 0 && (attackResult.hp_start > attackResult.hp_end) &&
    ability === ABILITY_ID.DEEP_THRUST
  ) {
    npc.updateBm(
      BM_ID.BLEED,
      "regen",
      FIGHT_VALUE.DEEP_THRUST_BLEED_BASE
        + FIGHT_VALUE.DEEP_THRUST_BLEED_MULT
        * player.getStat("strength")
    );
    attackResult.bm_end = npc.getBmViews();
    attackResult.armor_end = npc.getStat("armor");
  }


  // TRAITEMENT PARTICULIER AJOUT DU BM POUR TREACHEROUS ATTACK
   if (
    npc.getStat("currhp") > 0 && (attackResult.hp_start > attackResult.hp_end) &&
    ability === ABILITY_ID.TREACHEROUS_ATTACK
  ) {
    npc.updateBm(
      BM_ID.DEEP_WOUND,
      "damage",
      (FIGHT_VALUE.TREACHEROUS_ATTACK_WOUND_BASE+player.getStat("constitution"))+
            (FIGHT_VALUE.TREACHEROUS_ATTACK_WOUND_BASE+player.getStat("strength"))
    );
    attackResult.bm_end = npc.getBmViews();
    attackResult.armor_end = npc.getStat("armor");
  }
  results.push([attackResult]);
  return results;
}

private base_attack(player: Pj, targetId:number):ActionResult[][] {
  const npc = this.room.getNpc(targetId);
  player.spendAp(FIGHT_VALUE.BASIC_ACTION_AP);
  const damage = FIGHT_VALUE.BASIC_DAMAGE+player.getStat("strength")+ player.getStat("damage");
  return this.attack(player, npc, damage);
  
}

private base_shield(player:Pj):ActionResult[][] {
  
  player.spendAp(FIGHT_VALUE.BASIC_ACTION_AP);
  const shieldStart = player.base_att.shield;
  player.base_att.shield +=  FIGHT_VALUE.BASIC_SHIELD+player.getStat("constitution")+player.getStat("shield_bonus");
  const shieldEnd = player.base_att.shield;

  return [[{
    fighter_type: "pj",
    fighter_id: player.id,
    animationName: "shield",
    fightStatus:"ongoing",


    hp_start: player.base_att.currhp,
    hp_end: player.base_att.currhp,

    shield_start: shieldStart,
    shield_end: shieldEnd,

    armor_start: player.getStat("armor"),
    armor_end: player.getStat("armor"),

    bm_end: player.getBmViews(),

    popup: {
      text: `+${shieldEnd - shieldStart}`,
      type: "block",
    },
  }]];
}

private brutalBlow(player: Pj, targetId: number): ActionResult[][] {

  const npc = this.room.getNpc(targetId);
  const ability = player.getAbility(ABILITY_ID.BRUTAL_BLOW);
  player.spendAp(ability.ap);
  const damage = FIGHT_VALUE.BRUTAL_BLOW_BASE + FIGHT_VALUE.BRUTAL_BLOW_MULT * player.getStat("strength")+ player.getStat("damage");
  return this.attack(player, npc, damage);
  
}

private guard(player: Pj): ActionResult[][] {

  const ability = player.getAbility(ABILITY_ID.GUARD);
  player.spendAp(ability.ap);
  const shieldStart = player.getStat("shield");
  player.base_att.shield +=  FIGHT_VALUE.GUARD_BASE + FIGHT_VALUE.GUARD_MULT * player.getStat("constitution")+player.getStat("shield_bonus");
  const shieldEnd = player.base_att.shield;

  return [[{
    fighter_type: "pj",
    fighter_id: player.id,
    animationName: "shield",
    fightStatus: "ongoing",
    hp_start: player.base_att.currhp,
    hp_end: player.base_att.currhp,

    armor_start: player.getStat("armor"),
    armor_end: player.getStat("armor"),

    shield_start: shieldStart,
    shield_end: shieldEnd,

    bm_end: player.getBmViews(),

    popup: {
      text: `+${shieldEnd - shieldStart}`,
      type: "block",
    },
  }]];
}

private parry(
  player: Pj,
  targetId: number
): ActionResult[][] {

  const npc = this.room.getNpc(targetId);

  const ability = player.getAbility(ABILITY_ID.PARRY);
  player.spendAp(ability.ap);

  
  const damage =
    FIGHT_VALUE.PARRY_DAMAGE
    + player.getStat("strength")
    + player.getStat("damage");

  const attackSteps =
    this.attack(player, npc, damage);

const shieldStart = player.getStat("shield");
  player.base_att.shield += FIGHT_VALUE.PARRY_SHIELD + player.getStat("constitution");
  const shieldEnd = player.getStat("shield");

  const playerStep: ActionResult = {
    fighter_type: "pj",
    fighter_id: player.id,
    animationName: "shield",
    fightStatus: "ongoing",
    hp_start: player.base_att.currhp,
    hp_end: player.base_att.currhp,

    shield_start: shieldStart,
    shield_end: shieldEnd,

    armor_start: player.getStat("armor"),
    armor_end: player.getStat("armor"),

    bm_end: player.getBmViews(),

    popup: {
      text: `+${shieldEnd - shieldStart}`,
      type: "block",
    },
  };

return [
  ...attackSteps,
  [playerStep],
];
}

private skinOfRock(player: Pj): ActionResult[][] {

  const ability = player.getAbility(ABILITY_ID.ROCK_SKIN);
  const armor_start = player.getStat("armor");
  player.spendAp(ability.ap);
  const value = FIGHT_VALUE.ROCK_BASE + FIGHT_VALUE.ROCK_MULT*player.getStat("constitution");
  player.updateBm(BM_ID.ROCK_SKIN, "armor",value);

  
  const playerStep: ActionResult = {
    fighter_type: "pj",
    fighter_id: player.id,
    animationName: "blocked",
    fightStatus:"ongoing",

    hp_start: player.base_att.currhp,
    hp_end: player.base_att.currhp,

    shield_start: player.getStat("shield"),
    shield_end: player.getStat("shield"),

    armor_start: armor_start,
    armor_end: player.getStat("armor"),

    bm_end: player.getBmViews(),

    popup: {
      text: `+${value} armure`,
      type: "block",
    },
  };

  return [[playerStep]];
}


 private wings(player: Pj, targetId:number): ActionResult[][] {

  const target = this.team.getPj(targetId);
  const ability = player.getAbility(ABILITY_ID.WINGS);
  player.spendAp(ability.ap);
  const value = FIGHT_VALUE.WINGS_BASE + FIGHT_VALUE.WINGS_MULT*player.getStat("magicSkill");
  target.updateBm(BM_ID.WINGS, "strength",value);

  const playerStep: ActionResult = {
    fighter_type: "pj",
    fighter_id: target.id,
    animationName: "wings",
    fightStatus: "ongoing",

    hp_start: target.base_att.currhp,
    hp_end: target.base_att.currhp,

    shield_start: target.getStat("shield"),
    shield_end:target.getStat("shield"),

    armor_start: target.getStat("armor"),
    armor_end: target.getStat("armor"),

    bm_end:target.getBmViews(),

    popup: {
      text: `+${value} force`,
      type: "block",
    },
  };

  return [[playerStep]];
}

private autoRegeneration(player: Pj): ActionResult[][] {

  const ability = player.getAbility(ABILITY_ID.AUTOREGENERATION);
  player.spendAp(ability.ap);
  const hpStart = player.base_att.currhp;
  const regen = FIGHT_VALUE.AUTOREGENERATION_BASE + player.getStat("constitution") * FIGHT_VALUE.AUTOREGENERATION_MULT;
  player.getHealed(regen);
  const hpEnd = player.base_att.currhp;

  const playerStep: ActionResult = {
     fighter_type: "pj",
    fighter_id: player.id,
    animationName: "heal",
    fightStatus: "ongoing",

    hp_start: hpStart,
    hp_end: hpEnd,

    shield_start: player.getStat("shield"),
    shield_end: player.getStat("shield"),

    armor_start: player.getStat("armor"),
    armor_end: player.getStat("armor"),

    bm_end: player.getBmViews(),

    popup: {
      text: `+${hpEnd - hpStart} HP`,
      type: "heal",
    },
  };

  return [[playerStep]];
}

private guardReflex(player: Pj): ActionResult[][] {

  const ability = player.getAbility(ABILITY_ID.GUARD_REFLEX);
  player.spendAp(ability.ap);

  player.updateBm(BM_ID.GUARD_REFLEX, "shield", FIGHT_VALUE.GUARD_REFLEX_BASE +
     FIGHT_VALUE.GUARD_REFLEX_MULT*player.getStat("constitution")+player.getStat("shield_bonus"));

    const playerStep: ActionResult = {
    fighter_type: "pj",
    fighter_id: player.id,
    animationName: "blocked",
    fightStatus: "ongoing",

    hp_start: player.base_att.currhp,
    hp_end: player.base_att.currhp,

    shield_start: player.getStat("shield"),
    shield_end: player.getStat("shield"),

    armor_start : player.getStat("armor"),
    armor_end: player.getStat("armor"),

    bm_end: player.getBmViews(),

    popup: {
      text: "Réflexe de garde",
      type: "block",
    },
  };

  return [[playerStep]];
}

private deepThrust(player: Pj, targetId: number): ActionResult[][] {
  const npc = this.room.getNpc(targetId);
  const ability = player.getAbility(ABILITY_ID.DEEP_THRUST);
  player.spendAp(ability.ap);
  const damage = FIGHT_VALUE.DEEP_THRUST_BASE +player.getStat("strength");
  return this.attack(player, npc, damage, ABILITY_ID.DEEP_THRUST);
  
}

private twirl(player: Pj): ActionResult[][] {

 
  const ability = player.getAbility(ABILITY_ID.TWIRL);
  player.spendAp(ability.ap);
  const damage =  FIGHT_VALUE.TWIRL_BASE + FIGHT_VALUE.TWIRL_MULT * player.getStat("strength");
  const steps: ActionResult[][] = [];

  for (const npc of this.room.npcs) {

    if (npc.getStat("currhp") <= 0) continue;

    const attackSteps =
      this.attack(player, npc, damage);

    steps.push(...attackSteps);

    // Un Spike a pu tuer le PJ
    if (player.getStat("currhp") <= 0) {
      break;
    }
  }

  return steps;
}

private fireball(
  player: Pj,
  targetId: number
): ActionResult[][] {

   const steps: ActionResult[][] = [];

  const npc = this.room.getNpc(targetId);

  const ability = player.getAbility(ABILITY_ID.FIREBALL);
  player.spendAp(ability.ap);


  // EVASION
  if (npc.getStat("evasion")> 0) {

    const hpStart = npc.getStat("currhp");
    const shieldStart = npc.getStat("shield");

    npc.updateBm(
      BM_ID.EVASION,
      "evasion",
      -1
    );

    steps.push([{
      fighter_type: "npc",
    fighter_id: npc.id,
    animationName: "dodged",
    fightStatus: "ongoing",

     
      new_intent: npc.intent,

      hp_start: hpStart,
      hp_end: npc.getStat("currhp"),

      shield_start: shieldStart,
      shield_end: npc.getStat("shield"),

      armor_start: npc.getStat("armor"),
      armor_end: npc.getStat("armor"),

      bm_end: npc.bms.map(bm => bm.toView()),

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

  const damage = FIGHT_VALUE.FIREBALL_BASE + player.getStat("magicSkill") +
    player.getStat("damage");

  const result = this.applyDamage(
    npc,
    "npc",
    damage
  );

  // =========================
  // BURN
  // =========================

  const hasTakenHpDamage =
    result.hp_end < result.hp_start;

  if (
    npc.getStat("currhp") > 0 &&
    hasTakenHpDamage
  ) {
    npc.updateBm(BM_ID.BURN, "regen",
      FIGHT_VALUE.FIREBALL_BURN_BASE + FIGHT_VALUE.FIREBALL_BURN_MULT * player.getStat("magicSkill"));

    result.bm_end = npc.getBmViews();
  }

  return [[result]];
}

private tears(
  player: Pj,
  targetId: number
): ActionResult[][] {

  const target = this.team.getPj(targetId);
  const ability = player.getAbility(ABILITY_ID.LIFE_TEARS);
  player.spendAp(ability.ap);
  const hpStart = target.base_att.currhp;
  target.getHealed(FIGHT_VALUE.TEARS_BASE +FIGHT_VALUE.TEARS_MULT * player.getStat("magicSkill"));
  const hpEnd = target.base_att.currhp;

  return [[{
     fighter_type: "pj",
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

private fireBarrier(player: Pj, targetId:number): ActionResult[][] {

  const ability = player.getAbility(ABILITY_ID.FIRE_BARRIER);
  const target = this.team.getPj(targetId);
  player.spendAp(ability.ap);
  const value = FIGHT_VALUE.FIRE_BARRIER_BASE + FIGHT_VALUE.FIRE_BARRIER_MULT*player.getStat("magicSkill");
  target.updateBm(BM_ID.FIRE_BARRIER, "spike",value);

  const playerStep: ActionResult = {
     fighter_type: "pj",
    fighter_id: target.id,
    animationName: "fire_barrier",
    fightStatus: "ongoing",

    hp_start: target.base_att.currhp,
    hp_end: target.base_att.currhp,

    shield_start: target.getStat("shield"),
    shield_end: target.getStat("shield"),

    armor_start: target.getStat("armor"),
    armor_end: target.getStat("armor"),

    bm_end: target.getBmViews(),

    popup: {
      text: `+${value} épines`,
      type: "block",
    },
  };

  return [[playerStep]];
}


private regeneration(player: Pj, targetId:number): ActionResult[][] {

  const ability = player.getAbility(ABILITY_ID.REGENERATION);
   const target = this.team.getPj(targetId);
  player.spendAp(ability.ap);
  const value = FIGHT_VALUE.REGENERATION_BASE+ FIGHT_VALUE.REGENERATION_MULT*player.getStat("magicSkill");
  player.updateBm(BM_ID.REGENERATION, "regen",value);

   const playerStep: ActionResult = {
     fighter_type: "pj",
    fighter_id: target.id,
    animationName: "heal",
    fightStatus: "ongoing",

    hp_start: target.base_att.currhp,
    hp_end: target.base_att.currhp,

    shield_start: target.getStat("shield"),
    shield_end: target.getStat("shield"),

    armor_start: target.getStat("armor"),
    armor_end: target.getStat("armor"),

    bm_end: target.getBmViews(),

    popup: {
      text: `+${value} regen`,
      type: "block",
    },
  };
  return [[playerStep]];
}


private shieldOfAthlan(player: Pj, targetId:number): ActionResult[][] {

   const ability = player.getAbility(ABILITY_ID.ATHLAN_SHIELD);
   const target = this.team.getPj(targetId);
   player.spendAp(ability.ap);
   const shieldStart = target.getStat("shield");
   const value =  FIGHT_VALUE.ATHLAN_SHIELD_BASE + FIGHT_VALUE.ATHLAN_SHIELD_MULT * player.getStat("magicSkill");
   target.base_att.shield += value;
   const shieldEnd = target.base_att.shield;

   const playerStep: ActionResult = {
    fighter_type: "pj",
    fighter_id: target.id,
    animationName: "blocked",
    fightStatus: "ongoing",

    hp_start: target.base_att.currhp,
    hp_end: target.base_att.currhp,

    shield_start: shieldStart,
    shield_end: shieldEnd,

    armor_start: target.getStat("armor"),
    armor_end: target.getStat("armor"),

    bm_end: target.getBmViews(),

    popup: {
      text: `+${value} bouclier`,
      type: "block",
    },
  };
  
  return [[playerStep]];
}


 private armorOfAthlan(player: Pj, targetId:number): ActionResult[][] {

  const ability = player.getAbility(ABILITY_ID.ATHLAN_ARMOR);
  
   const target = this.team.getPj(targetId);
   const armor_start = target.getStat("armor");
   player.spendAp(ability.ap);
   const value = FIGHT_VALUE.ATHLAN_ARMOR_BASE + FIGHT_VALUE.ATHLAN_ARMOR_MULT*player.getStat("magicSkill");
   target.updateBm(BM_ID.ROCK_SKIN, "armor",value);

   const playerStep: ActionResult = {
     fighter_type: "pj",
     fighter_id: target.id,
     animationName: "athlan",
    fightStatus: "ongoing",

    hp_start: target.base_att.currhp,
    hp_end: target.base_att.currhp,

    shield_start: target.getStat("shield"),
    shield_end: target.getStat("shield"),

    armor_start: armor_start,
    armor_end: target.getStat("armor"),

    bm_end: target.getBmViews(),

    popup: {
      text: "+${value} armure",
      type: "block",
    },
  };

  return [[playerStep]];
}


 private ArcxosCursed(player: Pj, targetId:number): ActionResult[][] {

  const ability = player.getAbility(ABILITY_ID.ARCXOS);
  const target = this.room.getNpc(targetId);
  player.spendAp(ability.ap);
  const value = FIGHT_VALUE.ARCXOS_BASE + FIGHT_VALUE.ARCXOS_MULT*player.getStat("magicSkill");
  
  target.updateBm(BM_ID.ARCXOS, "damage",value);

 if (NPC_ACTION_ID_NEED_INTENT_CHANGE.includes(target.intent.action)) {
      target.intent.value = Math.max(0, target.intent.value -value);
   
    const playerStep: ActionResult = {
     fighter_type: "npc",
    fighter_id: target.id,
    animationName : "change_intent",
    fightStatus: "ongoing",

    new_intent: target.intent,
    hp_start: target.base_att.currhp,
    hp_end: target.base_att.currhp,

    shield_start: target.getStat("shield"),
    shield_end: target.getStat("shield"),

    armor_start: target.getStat("armor"),
    armor_end: target.getStat("armor"),

    bm_end: target.getBmViews(),

    popup: {
      text: `-${value} damage`,
      type: "block",
    },
  };
    return [[playerStep]];
  }
  
   const playerStep: ActionResult = {
     fighter_type: "npc",
    fighter_id: target.id,
    animationName: "hurt",
    fightStatus: "ongoing",

    hp_start: target.base_att.currhp,
    hp_end: target.base_att.currhp,

    shield_start: target.getStat("shield"),
    shield_end: target.getStat("shield"),

    armor_start: target.getStat("armor"),
    armor_end: target.getStat("armor"),

    bm_end: target.getBmViews(),

    popup: {
      text: `-${value} damage`,
      type: "block",
    },
  };

  return [[playerStep]];
}

private MultipleAttack(
  player: Pj,
  targetId: number
): ActionResult[][] {

  const result: ActionResult[][] = [];

  const ability =
    player.getAbility(ABILITY_ID.MULTIPLE_ATTACK);

  const target =
    this.room.getNpc(targetId);

  player.spendAp(ability.ap);

  const damage =
    FIGHT_VALUE.MULTIPLE_ATTACK_DAMAGE +
    player.getStat("strength") +
    player.getStat("damage");

  const iteration =
    FIGHT_VALUE.MULTIPLE_ATTACK_ITERATION +
    player.getStat("constitution");

  for (let i = 0; i < iteration; i++) {

    // Animation d'attaque
    result.push([
      this.getActionResult(player, "attack")
    ]);

    // Résolution de l'attaque
    result.push(
      ...this.attack(player, target, damage)
    );

    if (target.getStat("currhp") <= 0 || player.getStat("currhp") <=0) {
      break;
    }
  }

  return result;
}


private treacherousAttack(player: Pj, targetId: number): ActionResult[][] {
  const npc = this.room.getNpc(targetId);
  const ability = player.getAbility(ABILITY_ID.TREACHEROUS_ATTACK);
  player.spendAp(ability.ap);
  const damage = FIGHT_VALUE.TREACHEROUS_ATTACK_BASE +player.getStat("strength");
  return this.attack(player, npc, damage, ABILITY_ID.TREACHEROUS_ATTACK);
  
}


private charge(
  player: Pj,
  targetId: number,
): ActionResult[][] {

  const results: ActionResult[][] = [];
  const npc = this.room.getNpc(targetId);
  player.spendAp(player.getAbility(ABILITY_ID.CHARGE).ap);
  // =========================
  // SPIKE
  // =========================

  if (npc.getStat("spike") > 0) {

    const spikeDamage = npc.getStat("spike");
    if (spikeDamage > 0) {

      const spikeResult = this.applyDamage(
        player,
        "pj",
        spikeDamage
      );

      results.push([spikeResult]);
      // Le Spike tue le PJ :
      // l'attaque s'arrête ici.
      if (player.getStat("currhp") === 0) {
        return results;
      }
    }
  }

  // =========================
  // EVASION
  // =========================

  if (npc.getStat("evasion")> 0) {

    const hpStart = npc.getStat("currhp");
    const shieldStart = npc.getStat("shield");
    const armorStart = npc.getStat("armor");

    npc.updateBm(BM_ID.EVASION, "evasion", -1);
    

    results.push([{
      fighter_type: "npc",
      fighter_id: npc.id,
      animationName: "dodged",
      fightStatus: "ongoing",

      hp_start: hpStart,
      hp_end: npc.getStat("currhp"),

      shield_start: shieldStart,
      shield_end: npc.getStat("shield"),

      armor_start: armorStart,
      armor_end: npc.getStat("armor"),

      bm_end: npc.getBmViews(),

      new_intent: npc.intent,

      popup: {
        text: "-1 évasion",
        type: "dodge",
      },
    }]);

    return results;
  }

  // =========================
  // DEGATS
  // =========================
  const shieldStart = npc.getStat("shield");
  const damage = Math.min(FIGHT_VALUE.CHARGE_BASE + FIGHT_VALUE.CHARGE_MULT*5, npc.getStat("shield"))
  npc.base_att.shield -= damage;

  const popupData:FightPopupData = {
      text: `-${damage} bouclier`,
      type: "block",
    };

  const attackResult: ActionResult = {
    fighter_type: "npc",
    fighter_id: npc.id,
    fightStatus:"ongoing",
    animationName: "blocked",

    hp_start: npc.getStat("currhp"),
    hp_end: npc.getStat("currhp"),

    shield_start: shieldStart,
    shield_end: npc.getStat("shield"),

    armor_start: npc.getStat("armor"),
    armor_end: npc.getStat("armor"),

    bm_end: npc.getBmViews(),

    popup: popupData,

    
  };

  results.push([attackResult]);
  return results;
}


private blazingFire(player: Pj): ActionResult[][] {

 
  const ability = player.getAbility(ABILITY_ID.BLAZING_FIRE);
  player.spendAp(ability.ap);
  const damage =  FIGHT_VALUE.BLAZING_FIRE_BASE + FIGHT_VALUE.BLAZING_FIRE_MULT * player.getStat("magicSkill");
  const steps: ActionResult[][] = [];

  for (const npc of this.room.npcs) {

    if (npc.getStat("currhp") <= 0) continue;

    const attackSteps = this.applyDamage(npc, "npc", damage);
    steps.push([attackSteps]);
  }

  return steps;
}

}
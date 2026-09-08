import {Pj} from "./Pj.js";
import {Npc} from "./Npc.js"
import { Bm } from './Bm.js';
import { Team } from "./Team.js";
import { Room } from "./Room.js";
import type { ActionResult, FightStatus, TargetResult } from "../../../shared/types/actionResult.js";
import { ABILITY_NAME, BM_ID, BM_NAME, ABILITY_ID, FIGHT_VALUE } from "../utils/constants.js";
import type { AnimationName } from "../../../shared/types/animation.js";
import type { FightPopup, FightPopupData } from "../../../shared/types/fightPopUp.js";
import type { StatName } from "../../../shared/types/label.js";

import {getTargetSelectMode} from "../utils/basicNpc.js"
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

    executeIA():ActionResult[] {
      return this.ia.execute();
    }

    playIntentNpcIa():ActionResult[] {
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

executeAction(basicAbilityId: number, pjId: number, targetId?: number): ActionResult {

  const player = this.team.getPj(pjId);
  

  let steps: TargetResult[][];

  switch (basicAbilityId) {

    case ABILITY_ID.ATTACK: 
      steps = this.base_attack(player, targetId!);
      break;

    case ABILITY_ID.SHIELD: 
      steps = this.base_shield(player);
      break;
      
    case ABILITY_ID.BRUTAL_BLOW:
      steps = this.brutalBlow(player, targetId!);
      break;

    case ABILITY_ID.GUARD:
      steps = this.guard(player);
      break;

    case ABILITY_ID.ROCK_SKIN:
      steps = this.skinOfRock(player);
      break;

    case ABILITY_ID.PARRY:
      steps = this.parry(player, targetId!);
      break;

    case ABILITY_ID.AUTOREGENERATION:
      steps = this.autoRegeneration(player);
      break;

    case ABILITY_ID.GUARD_REFLEX:
      steps = this.guardReflex(player);
      break;

    case ABILITY_ID.DEEP_THRUST:
      steps = this.deepThrust(player, targetId!);
      break;

    case ABILITY_ID.TWIRL:
      console.log()
      steps = this.twirl(player);
      break;

    case ABILITY_ID.FIREBALL:
      steps = this.fireball(player, targetId!);
      break;

    case ABILITY_ID.LIFE_TEARS:
      steps = this.tears(player, targetId!);
      break;

    case ABILITY_ID.WINGS:
      steps = this.wings(player, targetId!);
      break;  
    case ABILITY_ID.FIRE_BARRIER:
      steps = this.fireBarrier(player, targetId!);
      break;  
    case ABILITY_ID.ATHLAN_SHIELD:
      steps = this.shieldOfAthlan(player, targetId!);
      break;  
    case ABILITY_ID.ATHLAN_ARMOR:
      steps = this.armorOfAthlan(player, targetId!);
      break;  
    case ABILITY_ID.REGENERATION:
      steps = this.regeneration(player, targetId!);
      break;  
    case ABILITY_ID.ARCXOS:
      steps = this.tears(player, targetId!);
      break;  
    default:
      throw new Error(`Ability ${basicAbilityId} non gérée`);
  }

  // L'action est complètement résolue.
  this.room.removeDeadNpcs();

 

  return {
    author_type: "pj",
    id_author: player.id,
    animationName: "attack",
    fightStatus: this.getFightStatus(),
    steps,
  };
}

private applyDamage(
  target: Pj | Npc,
  targetType: "pj" | "npc",
  damage: number
): TargetResult {

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
    target_type: targetType,
    id_target: target.id,
    animationName,

    hp_start: hpStart,
    hp_end: target.getStat("currhp"),

    shield_start: shieldStart,
    shield_end: target.getStat("shield"),

    armor_start: target.getStat("armor"),
    armor_end: target.getStat("armor"),

    bm_end: target.bms.map(bm => bm.toView()),

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
): TargetResult[][] {

  const steps: TargetResult[][] = [];

  // SPIKE
  if (npc.getStat("spike") >0 ) {

    const spikeDamage =
      npc.getBm(BM_ID.SPIKE)?.getBonus("damage") ?? 0;

    if (spikeDamage > 0) {

      const spikeResult = this.applyDamage(
        player,
        "pj",
        spikeDamage
      );

      steps.push([spikeResult]);

      // Le PJ est mort à cause du Spike :
      // son attaque n'a donc jamais lieu.
      if (player.getStat("currhp") === 0) {
        return steps;
      }
    }
  }

  // EVASION
  if (npc.haveBm(BM_ID.EVASION)) {

    const hpStart = npc.getStat("currhp");
    const shieldStart = npc.getStat("shield");

    npc.updateBm(
      BM_ID.EVASION,
      "evasion",
      -1
    );

    steps.push([{
      target_type: "npc",
      id_target: npc.id,

      animationName: "dodged",
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

  // ATTAQUE
  const attackResult = this.applyDamage(
    npc,
    "npc",
    damage
  );

  // Effets appliqués par l'ability
  if (npc.getStat("currhp") > 0) {

    if (ability === ABILITY_ID.DEEP_THRUST) {
      npc.updateBm(BM_ID.BLEED, "regen",
        FIGHT_VALUE.DEEP_THRUST_BLEED_BASE+ FIGHT_VALUE.DEEP_THRUST_BLEED_MULT * player.getStat("strength"));

      // Important : le résultat doit contenir
      // l'état des BM APRÈS l'application du bleed.
      attackResult.bm_end =
        npc.bms.map(bm => bm.toView());
        
    }
  }

  steps.push([attackResult]);

  
  return steps;
}

private base_attack(player: Pj, targetId:number):TargetResult[][] {
  const npc = this.room.getNpc(targetId);
  player.spendAp(FIGHT_VALUE.BASIC_ACTION_AP);
  const damage = FIGHT_VALUE.BASIC_DAMAGE+player.getStat("strength")+ player.getStat("damage");
  const step = this.attack(player, npc, damage);
  return step;
}

private base_shield(player:Pj):TargetResult[][] {
  
  player.spendAp(FIGHT_VALUE.BASIC_ACTION_AP);
  const shieldStart = player.base_att.shield;
  player.base_att.shield +=  FIGHT_VALUE.BASIC_SHIELD+player.getStat("constitution");
  const shieldEnd = player.base_att.shield;

  return [[{
    target_type: "pj",
    id_target: player.id,

    animationName: "shield",

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

private brutalBlow(player: Pj, targetId: number): TargetResult[][] {

  const npc = this.room.getNpc(targetId);
  const ability = player.getAbility(ABILITY_ID.BRUTAL_BLOW);
  player.spendAp(ability.ap);
  const damage = FIGHT_VALUE.BRUTAL_BLOW_BASE + FIGHT_VALUE.BRUTAL_BLOW_MULT * player.getStat("strength")+ player.getStat("damage");
  const step = this.attack(player, npc, damage);
  return step;
}

private guard(player: Pj): TargetResult[][] {

  const ability = player.getAbility(ABILITY_ID.GUARD);
  player.spendAp(ability.ap);
  const shieldStart = player.getStat("shield");
  player.base_att.shield +=  FIGHT_VALUE.GUARD_BASE + FIGHT_VALUE.GUARD_MULT * player.getStat("constitution");
  const shieldEnd = player.base_att.shield;

  return [[{
    target_type: "pj",
    id_target: player.id,

    animationName: "shield",

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
): TargetResult[][] {

  const npc = this.room.getNpc(targetId);

  const ability = player.getAbility(ABILITY_ID.PARRY);
  player.spendAp(ability.ap);

  const shieldStart = player.getStat("shield");

  player.base_att.shield += FIGHT_VALUE.PARRY_SHIELD + player.getStat("constitution");

  const shieldEnd = player.getStat("shield");

  const playerStep: TargetResult = {
    target_type: "pj",
    id_target: player.id,
    animationName: "shield",

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

  const damage =
    FIGHT_VALUE.PARRY_DAMAGE
    + player.getStat("strength")
    + player.getStat("damage");

  const attackSteps =
    this.attack(player, npc, damage);

  return [
    [playerStep],
    ...attackSteps,
  ];
}

private skinOfRock(player: Pj): TargetResult[][] {

  const ability = player.getAbility(ABILITY_ID.ROCK_SKIN);
  const armor_start = player.getStat("armor");
  player.spendAp(ability.ap);
  const value = FIGHT_VALUE.ROCK_BASE + FIGHT_VALUE.ROCK_MULT*player.getStat("constitution");
  player.updateBm(BM_ID.ROCK_SKIN, "armor",value);

  
  const playerStep: TargetResult = {
    target_type: "pj",
    id_target: player.id,
    animationName: "blocked",

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


 private wings(player: Pj, targetId:number): TargetResult[][] {

  const npc = this.room.getNpc(targetId);
  const ability = player.getAbility(ABILITY_ID.WINGS);
  player.spendAp(ability.ap);
  const value = FIGHT_VALUE.WINGS_BASE + FIGHT_VALUE.WINGS_MULT*player.getStat("magicSkill");
  player.updateBm(BM_ID.WINGS, "armor",value);

  const playerStep: TargetResult = {
    target_type: "pj",
    id_target: player.id,
    animationName: "blocked",

    hp_start: player.base_att.currhp,
    hp_end: player.base_att.currhp,

    shield_start: player.getStat("shield"),
    shield_end: player.getStat("shield"),

    armor_start: player.getStat("armor"),
    armor_end: player.getStat("armor"),

    bm_end: player.getBmViews(),

    popup: {
      text: "+${value} armure",
      type: "block",
    },
  };

  return [[playerStep]];
}

private autoRegeneration(player: Pj): TargetResult[][] {

  const ability = player.getAbility(ABILITY_ID.AUTOREGENERATION);
  player.spendAp(ability.ap);
  const hpStart = player.base_att.currhp;
  const regen = FIGHT_VALUE.AUTOREGENERATION_BASE + player.getStat("constitution") * FIGHT_VALUE.AUTOREGENERATION_MULT;
  player.getHealed(regen);
  const hpEnd = player.base_att.currhp;

  const playerStep: TargetResult = {
    target_type: "pj",
    id_target: player.id,
    animationName: "heal",

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

private guardReflex(player: Pj): TargetResult[][] {

  const ability = player.getAbility(ABILITY_ID.GUARD_REFLEX);
  player.spendAp(ability.ap);

  player.updateBm(BM_ID.GUARD_REFLEX, "shield", FIGHT_VALUE.GUARD_REFLEX_BASE +
     FIGHT_VALUE.GUARD_REFLEX_MULT*player.getStat("constitution"));

    const playerStep: TargetResult = {
    target_type: "pj",
    id_target: player.id,
    animationName: "blocked",

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

private deepThrust(player: Pj, targetId: number): TargetResult[][] {
  const npc = this.room.getNpc(targetId);
  const ability = player.getAbility(ABILITY_ID.DEEP_THRUST);
  player.spendAp(ability.ap);
  const damage = FIGHT_VALUE.DEEP_THRUST_BASE +player.getStat("strength");
  return this.attack(player, npc, damage, ABILITY_ID.DEEP_THRUST);
  
}

private twirl(player: Pj): TargetResult[][] {

 
  const ability = player.getAbility(ABILITY_ID.TWIRL);
  player.spendAp(ability.ap);
  const damage =  FIGHT_VALUE.TWIRL_BASE + FIGHT_VALUE.TWIRL_MULT * player.getStat("strength");
  const steps: TargetResult[][] = [];

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
): TargetResult[][] {

   const steps: TargetResult[][] = [];

  const npc = this.room.getNpc(targetId);

  const ability = player.getAbility(ABILITY_ID.FIREBALL);
  player.spendAp(ability.ap);


  // EVASION
  if (npc.haveBm(BM_ID.EVASION)) {

    const hpStart = npc.getStat("currhp");
    const shieldStart = npc.getStat("shield");

    npc.updateBm(
      BM_ID.EVASION,
      "evasion",
      -1
    );

    steps.push([{
      target_type: "npc",
      id_target: npc.id,

      animationName: "dodged",
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
): TargetResult[][] {

  const target = this.team.getPj(targetId);
  const ability = player.getAbility(ABILITY_ID.LIFE_TEARS);
  player.spendAp(ability.ap);
  const hpStart = target.base_att.currhp;
  target.getHealed(FIGHT_VALUE.TEARS_BASE +FIGHT_VALUE.TEARS_MULT * player.getStat("magicSkill"));
  const hpEnd = target.base_att.currhp;

  return [[{
    target_type: "pj",
    id_target: target.id,

    animationName: "heal",

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

private fireBarrier(player: Pj, targetId:number): TargetResult[][] {

  const ability = player.getAbility(ABILITY_ID.FIRE_BARRIER);
  const target = this.team.getPj(targetId);
  player.spendAp(ability.ap);
  const value = FIGHT_VALUE.FIRE_BARRIER_BASE + FIGHT_VALUE.FIRE_BARRIER_MULT*player.getStat("magicSkill");
  target.updateBm(BM_ID.FIRE_BARRIER, "armor",value);

  const playerStep: TargetResult = {
    target_type: "pj",
    id_target: target.id,
    animationName: "fire_barrier",

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


private regeneration(player: Pj, targetId:number): TargetResult[][] {

  const ability = player.getAbility(ABILITY_ID.REGENERATION);
   const target = this.team.getPj(targetId);
  player.spendAp(ability.ap);
  const value = FIGHT_VALUE.REGENERATION_BASE+ FIGHT_VALUE.REGENERATION_MULT*player.getStat("magicSkill");
  player.updateBm(BM_ID.REGENERATION, "regen",value);

   const playerStep: TargetResult = {
    target_type: "pj",
    id_target: target.id,
    animationName: "blocked",

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


private shieldOfAthlan(player: Pj, targetId:number): TargetResult[][] {

  const ability = player.getAbility(ABILITY_ID.ATHLAN_SHIELD);
   const target = this.team.getPj(targetId);
  player.spendAp(ability.ap);
  const shieldStart = player.getStat("shield");
  const value =  FIGHT_VALUE.ATHLAN_SHIELD_BASE + FIGHT_VALUE.ATHLAN_SHIELD_MULT * player.getStat("magicSkill");
   player.base_att.shield += value;
   const shieldEnd = player.base_att.shield;

   const playerStep: TargetResult = {
    target_type: "pj",
    id_target: target.id,
    animationName: "athlan",

    hp_start: target.base_att.currhp,
    hp_end: target.base_att.currhp,

    shield_start: target.getStat("shield"),
    shield_end: target.getStat("shield"),

    armor_start: target.getStat("armor"),
    armor_end: target.getStat("armor"),

    bm_end: target.getBmViews(),

    popup: {
      text: `+${value} armure`,
      type: "block",
    },
  };
  
  return [[playerStep]];
}


 private armorOfAthlan(player: Pj, targetId:number): TargetResult[][] {

  const ability = player.getAbility(ABILITY_ID.ATHLAN_ARMOR);
  
   const target = this.team.getPj(targetId);
   const armor_start = target.getStat("armor");
   player.spendAp(ability.ap);
   const value = FIGHT_VALUE.ATHLAN_ARMOR_BASE + FIGHT_VALUE.ATHLAN_ARMOR_MULT*player.getStat("magicSkill");
   player.updateBm(BM_ID.ROCK_SKIN, "armor",value);

   const playerStep: TargetResult = {
    target_type: "pj",
    id_target: target.id,
    animationName: "athlan",

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


 private ArcxosCursed(player: Pj, targetId:number): TargetResult[][] {

  const ability = player.getAbility(ABILITY_ID.ATHLAN_ARMOR);
  const target = this.room.getNpc(targetId);
  player.spendAp(ability.ap);
  const value = FIGHT_VALUE.ARCXOS__BASE + FIGHT_VALUE.ARCXOS_MULT*player.getStat("magicSkill");
  player.updateBm(BM_ID.ARCXOS, "damage",value);

   const playerStep: TargetResult = {
    target_type: "npc",
    id_target: target.id,
    animationName: "hurt",

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

}
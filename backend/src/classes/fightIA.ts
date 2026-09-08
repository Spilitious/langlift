import type { ActionResult } from "../../../shared/types/actionResult.js";
import type { TargetResult } from "../../../shared/types/actionResult.js";
import type { AnimationName } from "../../../shared/types/animation.js";
import type { FightPopupData } from "../../../shared/types/fightPopUp.js";



import type { StatName } from "../../../shared/types/label.js";

import { Team } from "./Team.js";
import { Room } from "./Room.js";
import { Pj } from "./Pj.js";
import { Npc } from "./Npc.js";

import { BM_ID, ABILITY_ID, NPC_ID, NPC_ACTION_ID } from "../utils/constants.js";
import { getTargetSelectMode } from "../utils/basicNpc.js";
import type { FightStatus } from "../../../shared/types/actionResult.js";

export class FightIA {
   

   constructor(
    private team: Team,
    private room: Room,
    private getFightStatus: () => FightStatus
  ) {}
 


execute(): ActionResult[] {


  
  const results: ActionResult[] = [];

  
  // PHASE 1 : nouveau tour des NPC
  results.push(this.newTurnNpcAction());

  // PHASE 2 : chaque NPC joue son action
  for (const npc of this.room.npcs) {

    if (npc.getStat("currhp") <= 0)
      continue;

    results.push( this.performNpcAction(npc));
 
    if (this.getFightStatus() !== "ongoing")
      return results;
  }

  // PHASE 3 : nouveau tour des PJ
  results.push(this.newTurnPjAction());
  
  // PHASE 4 : changement d'intention
  for (const npc of this.room.npcs) {

    if (npc.getStat("currhp") <= 0)
      continue;

    results.push(this.changeNpcIntentAction(npc));
  }


  return results;
}

private performNpcAction(npc:Npc):ActionResult {

  let animationName:AnimationName="attack";
  let steps:TargetResult[][]= [];
  switch(npc.intent.action) 
  {
    case NPC_ACTION_ID.ATTACK : 
      const target = this.team.getPj(npc.intent.target);
      steps = this.npcAttack(npc, target);
      break;

      case NPC_ACTION_ID.SHIELD : 
      steps = this.npcShield(npc);
      break;

      case NPC_ACTION_ID.EVASION : 
      steps = this.npcEvasion(npc);
      
      break;
      
  }
  
  return {
    author_type: "npc",
    id_author: npc.id,
    animationName: animationName,
    fightStatus: "ongoing",
    steps,
  };
  
  
}

private newTurnNpcAction():ActionResult {

  const steps: TargetResult[][] = [];

  for (const npc of this.room.npcs) {
    if (npc.getStat("currhp") <= 0)
      continue;
    steps.push(...this.newTurnNpc(npc));
  }

  return {
    author_type: "npc",
    id_author: 0,
    animationName: "idle",
    fightStatus: this.getFightStatus(),
    steps,
  };
}


private newTurnPjAction(): ActionResult {

  const steps: TargetResult[][] = [];

  for (const player of this.team.pjs) {
    if (player.getStat("currhp") <= 0)
      continue;
    steps.push(...this.newTurnPj(player));
  }

  return {
    author_type: "pj",
    id_author: 0,
    animationName: "idle",

    fightStatus: this.getFightStatus(),

    steps,
  };
}


private newTurnPj(player: Pj): TargetResult[][] {

  
  if (!player.haveBm(BM_ID.SHIELD_EXPERT))
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
      text: `+${shieldEnd - player.getStat("armor")} bouclier`,
      type: "block",
    };
  }

 

  const result: TargetResult = {
    target_type: "pj",
    id_target: player.id,
    animationName,

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


private newTurnNpc(npc: Npc): TargetResult[][] {

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

  const result: TargetResult = {
    target_type: "npc",
    id_target: npc.id,
    animationName,

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

playIntentNpc():ActionResult[] {
  
   const results: ActionResult[] = [];
  for (const npc of this.room.npcs) {

    if (npc.getStat("currhp") <= 0)
      continue;

    results.push(
      this.changeNpcIntentAction(npc)
    );
  }
  return results;
}

private changeNpcIntentAction(
  npc: Npc
): ActionResult {

  let steps: TargetResult[][];

  switch (npc.basicRaceId) {

    case NPC_ID.GIANT_RAT:
      steps = this.giantRatIntent(npc);
      break;
    
    case NPC_ID.GIANT_TOAD:
      steps = this.giantToadIntent(npc);
      break;

    case NPC_ID.GIANT_BAT:
      steps = this.giantBatIntent(npc);
      break;
     

    default:
      throw new Error(
        `IA non définie pour NPC ${npc.basicRaceId}`
      );
  }

  return {
    author_type: "npc",
    id_author: npc.id,
    animationName: "idle",
    fightStatus: "ongoing",
    steps,
  };
}

/* ********************************************** FONCTION DE CHOIX DE CIBLE ****************************************** */

private newIntentNpc(npc:Npc, actionId:number, value:number, targetId?:number, target_image?:number ):TargetResult[][]
{
  npc.setIntent(actionId, value, targetId, target_image);

  const result: TargetResult = {
    target_type: "npc",
    id_target: npc.id,
    animationName : "change_intent",

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


private giantRatIntent(npc: Npc): TargetResult[][] {

  
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
    npc.getStat("damage"),
    pjId,
    targetImage
  );
}



private giantBatIntent(npc: Npc): TargetResult[][] {

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

    return this.newIntentNpc(
      npc,
      NPC_ACTION_ID.ATTACK,
      npc.getStat("damage"),
      pjId,
      targetImage
    );
  }

  // Deuxième attaque sans cible
  return this.newIntentNpc(
    npc,
    NPC_ACTION_ID.EVASION,
    npc.getStat("power")
  );
}

private giantToadIntent(npc: Npc): TargetResult[][] {

  let dice = Math.round(Math.random() * 10);
  console.log(dice)
  
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
    ABILITY_ID.ATTACK,
    npc.getStat("damage"),
    pjId,
    targetImage
  );
}

private giantWolfIntent(npc: Npc): TargetResult[][] {

  const dice = Math.floor(Math.random() * 10);

  // Attaque 4 : sans cible précise
  if (dice < 2 + this.team.pjs.filter(
    pj => !pj.isUnconscious()
  ).length) {

    return this.newIntentNpc(
      npc,
      NPC_ACTION_ID.WOLF_CRY,
      npc.getStat("damage")
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
  )?.image;

  return this.newIntentNpc(
    npc,
    NPC_ACTION_ID.ATTACK,
    npc.getStat("damage"),
    pjId,
    targetImage
  );
}

/* **************************************************** DEBUT DES ACTIONS ***************************** */

private npcAttack(
  npc: Npc,
  player: Pj,
  ability?: number
): TargetResult[][] {

  const steps: TargetResult[][] = [];


  // SPIKE DU PJ
  if (player.getStat("spike")>0) {

  

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
}


  // EVASION DU PJ
  if (player.haveBm(BM_ID.EVASION)) {

    const hpStart = player.getStat("currhp");
    const shieldStart = player.getStat("shield");
    player.updateBm(BM_ID.EVASION,"evasion",-1);

    steps.push([{
      target_type: "pj",
      id_target: player.id,

      animationName: "dodged",

      hp_start: hpStart,
      hp_end: player.getStat("currhp"),

      shield_start: shieldStart,
      shield_end: player.getStat("shield"),

      armor_start:npc.getStat("armor"),
      armor_end: npc.getStat("armor"),

      bm_end: player.bms.map(
        bm => bm.toView()
      ),

      popup: {
        text: "-1 évasion",
        type: "dodge",
      },
    }]);

    return steps;
  }

  // ATTAQUE
  const attackResult = this.applyDamage(
    player,
    "pj",
    npc.intent.value
  );
  
  // Ici on ajoutera plus tard les effets
  // particuliers des attaques NPC.
  if (player.getStat("currhp") > 0) {

    switch (ability) {

      // exemple :
      // case ABILITY_ID.POISON_ATTACK:
      //   player.updateBm(...);
      //   attackResult.bm_end =
      //     player.bms.map(bm => bm.toView());
      //   break;

    }
  }

  steps.push([attackResult]);

  return steps;
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
    if(target.getStat("reflex") > 0)
      target.base_att.shield += target.getStat("reflex");

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

    armor_start:target.getStat("armor"),
    armor_end: target.getStat("armor"),

    bm_end: target.bms.map(bm => bm.toView()),

    popup: popupData,

    ...(targetType === "npc" && {
      new_intent: (target as Npc).intent,
    }),
  };
}

private npcShield(npc: Npc): TargetResult[][] {

  const shieldStart = npc.getStat("shield");

  npc.base_att.shield += npc.getStat("power");

  const shieldEnd = npc.intent.value;

  return [[{
    target_type: "npc",
    id_target: npc.id,

    animationName: "shield",
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


private npcEvasion(npc: Npc): TargetResult[][] {

  npc.updateBm(BM_ID.EVASION, "evasion", npc.intent.value);

  
  return [[{
    target_type: "npc",
    id_target: npc.id,

    animationName: "shake",
    new_intent: npc.intent,

    hp_start: npc.getStat("currhp"),
    hp_end: npc.getStat("currhp"),

    shield_start: npc.getStat("shield"),
    shield_end: npc.getStat("shield"),

    armor_start:npc.getStat("armor"),
    armor_end: npc.getStat("armor"),

    bm_end: npc.getBmViews(),

    popup: {
      text: `+${npc.intent.value} evasion}`,
      type: "block",
    },
  }]];
}

}
  

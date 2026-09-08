
import type { ActionRequest } from "../../../shared/types/action.js";
import type { ActionResult, VictoryResult } from "../../../shared/types/actionResult.js";
import type { GameStateView } from "../../../shared/types/gameStateView.js";
import type { HistoryDestination } from "../../../shared/types/history.js";
import { mockNpcIntent1 } from "../utils/mocks/npcIntentChange.js";
import { pj1, pj2} from "../utils/mocks/pj.js";
import { Shop } from "./Shop.js";
import { createShops } from "../game/initialization.js";
import { Equipment } from "./Equipment.js";
import { Team } from "./Team.js";
import { Room } from "./Room.js";
import { Const_Equipment } from "../types/basicEquipment.js";
import {BM_ID, ABILITY_ID} from "../utils/constants.js"

import  {Pj} from "./Pj.js"
import type { Relation } from "../types/relation.js"
import { Fight } from "./Fight.js";
import { convertProcessSignalToExitCode } from "node:util";

export class GameState {
 
  team:Team;
  fight:Fight;
  currentRoomId: number | null;
  currentPageId: number | null;
  currentShopId: number | null;
  currentProfessionId: number | null;
  consequenceIds: Set<number>;
  roomPrologueTable: Map<number, number>;
  shops:Shop[];
  room:Room;
  gladysRelation:Relation;

  constructor() {
    
    this.currentRoomId = null;
    this.currentShopId = null;
    this.currentProfessionId = null;
    this.currentPageId = 1;
    this.consequenceIds = new Set();
    this.shops = createShops();
    this.team = new Team();
    this.roomPrologueTable = new Map([]);
    this.room = new Room(1);
    this.fight = new Fight(this.team, this.room);
    this.gladysRelation = {
      love:0,
      trust:0,
      gratitude:0,
      admiration:0,
      ressentment:0,
      jealousy:0,
    }
    
  }

  toView(): GameStateView {
    return {
      
      currentRoomId: this.currentRoomId,
      currentPageId: this.currentPageId,
      currentShopId:this.currentShopId,
      currentProfessionId:this.currentProfessionId,
      consequenceIds: new Set(this.consequenceIds),
      shops:this.shops.map((shop) => shop.toView()),
      team:this.team.toView(),
      room:this.room.toView(),
      
      
    };
  }

  addPj(pj:Pj) {
    this.team.addPj(pj);
  }

  buildRoom(basicRoomId:number):ActionResult[] {
    let result:ActionResult[] = [];

    if(this.room.loaded && this.room.basicRoomId === basicRoomId)
      return result;

    
    this.room = new Room(basicRoomId);
    this.room.loaded = true;
    this.setPositionPj();
    this.team.initNewFight();
    this.fight = new Fight(this.team, this.room);
    result = this.fight.playIntentNpcIa();

    //Crapaud + retard
    if(basicRoomId === 3 && this.consequenceIds.has(4))
    {
        this.room.prologueId = 1;
        if(this.team.pjs[0])
          this.team.pjs[0].ap = 1;
    }

    // Chauve-souris + poursuite après Gladys
    if(basicRoomId === 5 && this.consequenceIds.has(7))
    {
        this.room.prologueId = 2;
        if(this.team.pjs[0])
          this.team.pjs[0].getHit(3);
    }

    // Loup + pas reposé 
    if(basicRoomId === 6 && (this.consequenceIds.has(11) || this.consequenceIds.has(12)))
    {
        this.room.prologueId = 3;
        if(this.team.pjs[0])
          this.team.pjs[0].updateBm(BM_ID.FATIGUE,"strength", 1)
    }

    return result;

  }


  executeVictory():VictoryResult {
    
    if(this.room.victoryResult)
        return this.room.victoryResult;
    

    
    const victoryResult: VictoryResult = {
    xpResult: this.team.dealXp(this.room.xp),
    loots: [],
    };
    
    //Room 2 
    if(this.room.id == 2){
        
        let p1 = new Equipment(Const_Equipment.HP_POTION);   
        this.team.pjs[0]?.addObjectAuto(p1);

        p1 = new Equipment(Const_Equipment.HP_POTION);   
        this.team.pjs[0]?.addObjectAuto(p1);
      }

    // Room 4 : bonus d'alchimie
    if (this.room.id === 4 && this.team.profession.alchimie > 0 ) {
      console.log("pas deux fois")
        let tongue = new Equipment(Const_Equipment.TOAD_TONGUE);
       this.team.pjs[0]?.addObjectFirstAvailableSlot(tongue);
       victoryResult.loots.push(tongue);
       tongue = new Equipment(Const_Equipment.TOAD_TONGUE);
       this.team.pjs[0]?.addObjectFirstAvailableSlot(tongue);
       victoryResult.loots.push(tongue);
       tongue = new Equipment(Const_Equipment.TOAD_TONGUE);
       this.team.pjs[0]?.addObjectFirstAvailableSlot(tongue);
        victoryResult.loots.push(tongue);
    }

    // Room 5 : bonus d'alchimie
    if (this.room.id === 5 && this.team.profession.alchimie > 0 ) {

        let claw = new Equipment(Const_Equipment.BAT_CLAW);
       this.team.pjs[0]?.addObjectFirstAvailableSlot(claw);
       victoryResult.loots.push(claw);
       claw = new Equipment(Const_Equipment.BAT_CLAW);
       this.team.pjs[0]?.addObjectFirstAvailableSlot(claw);
       victoryResult.loots.push(claw);
       claw = new Equipment(Const_Equipment.BAT_CLAW);
       this.team.pjs[0]?.addObjectFirstAvailableSlot(claw);
        victoryResult.loots.push(claw);
    }
    this.room.victoryResult = victoryResult;

  return this.room.victoryResult;
}


  setDestination(
  destination: HistoryDestination
) {
   this.currentPageId = null;
  this.currentRoomId = null;
  this.currentShopId = null;
  if (destination.type === "text") {
    this.currentPageId = destination.id;
     return;
  }

   if (destination.type === "shop") {
    this.currentShopId = destination.id;
    return;
  }

  this.currentRoomId = destination.id;
 
}

 addConsequence(id:number) {
 
    this.consequenceIds.add(id);
    if(!this.team.pjs[0])
    {
      throw new Error(`Pas de pj trouvé`);
    }


    
    let equipment:Equipment;

    switch(id)
    {
      //Choix avant de combattre le rat
      case 1 : this.team.pjs[0].addBaseAtt("constitution", 1);this.team.pjs[0].addBaseAtt("strength", 50); break;
      case 2 : this.team.pjs[0].addBaseAtt("strength", 1); break;
      case 3 : this.team.pjs[0].addBaseAtt("magicSkill", 1); break;

      //Perte de la potion avant le crapaud
      case 5 : this.team.pjs[0].removeEquipment(this.team.pjs[0].getFirstPotionId()); 
      
      //Courir après Gladys
      case 7: this.gladysRelation.gratitude += 2; break;

      //Choix de campement à la forêt d'irostat
      case 11:
      
      
      //Dire la vérité à Gladys sur les égoûts
      case 12 : 
      case 13 : this.gladysRelation.trust += 1; 
      case 14 : this.gladysRelation.trust += 1;
                const pj2 = new Pj({
                    id: 2,
                    image: 13,
                    avatar:2,
                    name: "Gladys",
                    level: 1,
                    position: 3});
                this.team.addPj(pj2)
                 break;
     
      
      // Choix de l'équipement à Irostat
      case 16 : 
        equipment = new Equipment(Const_Equipment.BASE_SWORD)
        this.team.pjs[0].addObjectAuto(equipment);
        break;

      case 17 : 
        equipment = new Equipment(Const_Equipment.BASE_STAFF)
        this.team.pjs[0].addObjectFirstAvailableSlot(equipment);
        break;

      case 18 : 
        equipment = new Equipment(Const_Equipment.BASE_ARMOR)
        this.team.pjs[0].addObjectFirstAvailableSlot(equipment);
        break;

          // Choix du métier après le rat
      case 19 :
        this.team.profession.alchimie += 1;
        equipment = new Equipment(Const_Equipment.RAT_TAIL);
        this.team.pjs[0].addObjectFirstAvailableSlot(equipment);
        equipment = new Equipment(Const_Equipment.RAT_TAIL);
        this.team.pjs[0].addObjectFirstAvailableSlot(equipment);
        equipment = new Equipment(Const_Equipment.RAT_TAIL);
        this.team.pjs[0].addObjectFirstAvailableSlot(equipment);
        break;

      case 20 :
        this.team.profession.blacksmith += 1;

      case 21 :
        this.team.profession.armorsmith += 1;
      
      

    } 
}



reset() {

    
    this.currentRoomId = null;
    this.currentShopId = null;
    this.currentProfessionId = null;
    this.currentPageId = 2;
    this.consequenceIds = new Set();
    this.shops = createShops();
    this.team = new Team();
    this.roomPrologueTable = new Map([]);
    this.room = new Room(1);
    
    this.fight = new Fight(this.team, this.room);
    this.gladysRelation = {
      love:0,
      trust:0,
      gratitude:0,
      admiration:0,
      ressentment:0,
      jealousy:0,
    }
  
  const newPj = new Pj({
  id: 1,
  image: 14,
  avatar:1,
  name: "Troylan",
  level: 1,
  position: 1,
});

this.addPj(newPj);
  newPj.learAbility(ABILITY_ID.LIFE_TEARS);
   newPj.learAbility(ABILITY_ID.TWIRL);
  newPj.addXp(20);
/*
  const Pj2 = new Pj({
  id: 2,
  image: 13,
  avatar:2,
  name: "Gladys",
  level: 1,
  position: 3,
});


this.addPj(Pj2);*/
 
  /*
  let p1 = new Equipment(Const_Equipment.HP_POTION);   
  this.team.pjs[0]?.addObjectAuto(p1);
  p1 = new Equipment(Const_Equipment.HP_POTION);   
  this.team.pjs[0]?.addObjectAuto(p1);
  let tongue = new Equipment(Const_Equipment.TOAD_TONGUE);
  this.team.pjs[0]?.addObjectFirstAvailableSlot(tongue);
  tongue = new Equipment(Const_Equipment.TOAD_TONGUE);
  this.team.pjs[0]?.addObjectFirstAvailableSlot(tongue); */

}
setPositionPj() {
  const positions = {
    1: [2],
    2: [1, 3],
    3: [1, 3, 8],
  } as const;

  const config = positions[this.team.pjs.length as keyof typeof positions];

  if (!config) return;

  this.team.pjs.forEach((pj, index) => {
    pj.position = config[index]!;
  });
}

playAction(action:ActionRequest):ActionResult
{
  return this.fight.executeAction(action.id_action, action.id_pj, action.id_target)
}

}
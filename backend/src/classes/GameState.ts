
import type { ActionRequest } from "../../../shared/types/action.js";
import type { ActionResult, VictoryResult } from "../../../shared/types/actionResult.js";
import type { GameStateView } from "../../../shared/types/gameStateView.js";
import type { HistoryDestination } from "../../../shared/types/history.js";
import { mockNpcIntent1 } from "../utils/mocks/npcIntentChange.js";
import { pj1 } from "../utils/mocks/pj.js";
import { Shop } from "./Shop.js";
import { createShops } from "../game/initialization.js";
import { Equipment } from "./Equipment.js";
import { Team } from "./Team.js";
import { Room } from "./Room.js";
import { Const_Equipment } from "../types/basicEquipment.js";


import  {Pj} from "./Pj.js"
import type { Relation } from "../types/relation.js"
import { Const_Bm } from "../types/basicBm.js";
export class GameState {
 
  team:Team;
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

  buildRoom(basicRoomId:number) {
    this.room = new Room(basicRoomId);

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
          this.team.pjs[0].heal(-3);
    }

    // Loup + pas reposé 
    if(basicRoomId === 6 && (this.consequenceIds.has(11) || this.consequenceIds.has(12)))
    {
        this.room.prologueId = 3;
        if(this.team.pjs[0])
          this.team.pjs[0].addBm(Const_Bm.FATIGUE)
    }
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
      case 1 : this.team.pjs[0].addBaseAtt("constitution", 1); break;
      case 2 : this.team.pjs[0].addBaseAtt("strength", 1); break;
      case 3 : this.team.pjs[0].addBaseAtt("magicSkill", 1); break;

      //Perte de la potion avant le crapaud
      case 5 : this.team.pjs[0].removeEquipment(this.team.pjs[0].getFirstPotionId()); 
      
      //Courir après Gladys
      case 7: this.gladysRelation.gratitude += 2; break;

      //Choix de campement à la forêt d'irostat
      case 11:
      
      
      //Dire la vérité à Gladys sur les égoûts
      case 13 : this.gladysRelation.trust += 2; break;
      case 14 : this.gladysRelation.trust += 1; break;
     
      
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
  const newPj = new Pj(pj1);
 
   newPj.base_att.currhp = 30;
  this.team = new Team();
  this.team.addPj(pj1);
  createShops();
  this.team.pjs = [newPj];
   let p1 = new Equipment(Const_Equipment.HP_POTION);   
        this.team.pjs[0]?.addObjectAuto(p1);

        p1 = new Equipment(Const_Equipment.HP_POTION);   
        this.team.pjs[0]?.addObjectAuto(p1);
 let tongue = new Equipment(Const_Equipment.TOAD_TONGUE);
       this.team.pjs[0]?.addObjectFirstAvailableSlot(tongue);
      
       tongue = new Equipment(Const_Equipment.TOAD_TONGUE);
       this.team.pjs[0]?.addObjectFirstAvailableSlot(tongue);
  this.currentPageId = null;
  this.currentRoomId = null;
  this.currentShopId = null;
  this.currentProfessionId = 1;

  this.consequenceIds.clear();
}

playAction(action:ActionRequest):ActionResult
{
  let result:ActionResult = {
        author_type: "pj", 
        id_author: action.id_pj,
        animationName: "attack",
        fightStatus: "ongoing",
  
        steps: [
          [
            {
              target_type: "npc",
              id_target: action.id_target,
  
              animationName: "hurt",
              new_intent: mockNpcIntent1,
              hp_start: 10,
              hp_end: 5,
              shield_start: 3,
              shield_end: 0,
              bm_end: [],
              popup: {
                text: "-5 HP",
                type: "damage",
              },
            },
          ],
        ],
      }

      return result; 
}

}
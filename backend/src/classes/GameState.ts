
import type { ActionRequest } from "../../../shared/types/action.js";
import type { ActionResult, VictoryResult } from "../../../shared/types/actionResult.js";
import type { GameStateView, GameStateSave, Relation} from "../../../shared/types/gameStateView.js";
import type { HistoryDestination } from "../../../shared/types/history.js";
import { Troylan, Gladys} from "../utils/basicPj_data.js";
import { Shop } from "./Shop.js";
import { Equipment } from "./Equipment.js";
import { Team } from "./Team.js";
import { Room } from "./Room.js";
import {BASIC_EQUIPMENT_ID } from "../utils/constants.js";
import {BM_ID, ABILITY_ID} from "../utils/constants.js"

import  {Pj} from "./Pj.js"
import { Fight } from "./Fight.js";
import { saveGame } from "../utils/saveGame.js";

export class GameState {
 
  saveId:number;
  team:Team;
  currentRoomId: number | null;
  currentPageId: number | null;
  currentShopId: number | null;
  consequenceIds: Set<number>;
  roomPrologueTable: Map<number, number>;
  shop:Shop | null;
  room:Room | null;
  fight:Fight | null;
  gladysRelation:Relation;
  alchemyAccess:boolean;

  constructor(emptySlotId:number) {
    
    this.saveId = emptySlotId;
    this.currentRoomId = null;
    this.currentShopId = null;
    this.currentPageId = 1;
    this.consequenceIds = new Set();
    this.team = new Team();
    this.shop = null;
    this.roomPrologueTable = new Map([]);
    this.room = null;
    this.fight = null;
    this.alchemyAccess = false;
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
      consequenceIds: new Set(this.consequenceIds),
      alchemyAccess: this.alchemyAccess,
      
      team:this.team.toView(),

      room: this.room? this.room.toView() : null,
      shop: this.shop? this.shop.toView() : null,
 
      
    };
  }


  toSave(): GameStateSave {
    return {
      date: new Date().toISOString(), 
      currentRoomId: this.currentRoomId,
      currentPageId: this.currentPageId,
      currentShopId:this.currentShopId,
      consequenceIds: [...this.consequenceIds],
      alchemyAccess: this.alchemyAccess,
      gladysRelation: this.gladysRelation,
      roomPrologueTable: Array.from(this.roomPrologueTable.entries()),
      team:this.team.toSave(),
     
      
    };
  }

  addPj(pj:Pj) {
    this.team.addPj(pj);
  }

buildShop(basicShopId:number) {
    this.shop = new Shop(basicShopId);

}


buildRoom(basicRoomId:number):ActionResult[][] {
    let result:ActionResult[][] = [];


    if(this.room && this.room.loaded && this.room.basicRoomId === basicRoomId)
      return result;

    this.room = new Room(basicRoomId);
    this.room.loaded = true;
    this.setPositionPj();

    // Conséquence à traiter avant le initFight

     // Loup + pas reposé 
    if(basicRoomId === 6 && (this.consequenceIds.has(11) || this.consequenceIds.has(12)))
    {
        this.room.prologueId = 3;
        if(this.team.pjs[0]) {
          this.team.pjs[0].updateBm(BM_ID.FATIGUE_STR,"strength", 1);
          this.team.pjs[0].updateBm(BM_ID.FATIGUE_MM,"magicSkill", 1);
         }
    }

   
    
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

   
    return result;

  }


executeVictory():VictoryResult {

    const victoryResult: VictoryResult = {
    xpResult: [],
    loots: [],
    };

    if(!this.room)
      return victoryResult

    if(this.room.victoryResult)
        return this.room.victoryResult;
    
 
    victoryResult.xpResult = this.team.dealXp(this.room.xp);
  
    
    this.team.endFight();
    //Room 2 
    if(this.room.id == 2){
        
        let p1 = Equipment.fromBasicEquipmentId(BASIC_EQUIPMENT_ID.HP_POTION);   
        this.team.pjs[0]?.addObjectAuto(p1);

        p1 = Equipment.fromBasicEquipmentId(BASIC_EQUIPMENT_ID.HP_POTION);   
        this.team.pjs[0]?.addObjectAuto(p1);
      }

    // Room 4 : bonus d'alchimie
    if (this.room.id === 4 && this.team.profession.alchemy > 0 ) {
      console.log("pas deux fois")
        let tongue = Equipment.fromBasicEquipmentId(BASIC_EQUIPMENT_ID.TOAD_TONGUE);
       this.team.pjs[0]?.addObjectFirstAvailableSlot(tongue);
       victoryResult.loots.push(tongue);
       tongue = Equipment.fromBasicEquipmentId(BASIC_EQUIPMENT_ID.TOAD_TONGUE);
       this.team.pjs[0]?.addObjectFirstAvailableSlot(tongue);
       victoryResult.loots.push(tongue);
       tongue = Equipment.fromBasicEquipmentId(BASIC_EQUIPMENT_ID.TOAD_TONGUE);
       this.team.pjs[0]?.addObjectFirstAvailableSlot(tongue);
        victoryResult.loots.push(tongue);
    }

    // Room 5 : bonus d'alchimie
    if (this.room.id === 5 && this.team.profession.alchemy > 0 ) {

        let claw = Equipment.fromBasicEquipmentId(BASIC_EQUIPMENT_ID.BAT_FANG);
       this.team.pjs[0]?.addObjectFirstAvailableSlot(claw);
       victoryResult.loots.push(claw);
       claw = Equipment.fromBasicEquipmentId(BASIC_EQUIPMENT_ID.BAT_FANG);
       this.team.pjs[0]?.addObjectFirstAvailableSlot(claw);
       victoryResult.loots.push(claw);
       claw = Equipment.fromBasicEquipmentId(BASIC_EQUIPMENT_ID.BAT_FANG);
       this.team.pjs[0]?.addObjectFirstAvailableSlot(claw);
        victoryResult.loots.push(claw);
    }

    // Room 6 : Loup
    if (this.room.id === 6) {
       this.alchemyAccess= true;
       this.team.pjs[0]?.deleteBm(BM_ID.FATIGUE_MM);
       this.team.pjs[0]?.deleteBm(BM_ID.FATIGUE_STR);
       
       
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
      saveGame(this);
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
      case 11:  this.team.profession.alchemy +=1;
      case 12:  this.team.profession.armorsmith +=1;
                this.alchemyAccess = true; break;
      
      
      //Dire la vérité à Gladys sur les égoûts
      case 12 : 
      case 13 : this.gladysRelation.trust += 1; 
      case 14 : this.gladysRelation.trust += 1;break;
     
      
      // Choix de l'équipement à Irostat
      case 16 : 
        equipment = Equipment.fromBasicEquipmentId(BASIC_EQUIPMENT_ID.BASE_SWORD)
        this.team.pjs[0].addObjectAuto(equipment);
        break;

      case 17 : 
        equipment = Equipment.fromBasicEquipmentId(BASIC_EQUIPMENT_ID.BASE_STAFF)
        this.team.pjs[0].addObjectFirstAvailableSlot(equipment);
        break;

      case 18 : 
        equipment = Equipment.fromBasicEquipmentId(BASIC_EQUIPMENT_ID.BASE_ARMOR)
        this.team.pjs[0].addObjectFirstAvailableSlot(equipment);
        break;

          // Choix du métier après le rat
      case 19 :
        this.team.profession.alchemy += 1;
        equipment = Equipment.fromBasicEquipmentId(BASIC_EQUIPMENT_ID.RAT_TAIL);
        this.team.pjs[0].addObjectFirstAvailableSlot(equipment);
        equipment = Equipment.fromBasicEquipmentId(BASIC_EQUIPMENT_ID.RAT_TAIL);
        this.team.pjs[0].addObjectFirstAvailableSlot(equipment);
        equipment = Equipment.fromBasicEquipmentId(BASIC_EQUIPMENT_ID.RAT_TAIL);
        this.team.pjs[0].addObjectFirstAvailableSlot(equipment);
        break;

      case 20 :
        this.team.profession.blacksmith += 1;break;

      case 21 :
        this.team.profession.armorsmith += 1; break;
      
      case 22 :
          this.addPj(Pj.fromBasicPj(Gladys)); break;
      
    }
    
}

reset() {

    this.currentPageId = 1;
    this.currentRoomId = null;
    this.currentShopId = null;
    this.consequenceIds = new Set();
    this.shop = null;
    this.team = new Team();
    this.roomPrologueTable = new Map([]);
    this.room = null;
    this.fight = null;
    this.gladysRelation = {
      love:0,
      trust:0,
      gratitude:0,
      admiration:0,
      ressentment:0,
      jealousy:0,
    }

    const newPj = Pj.fromBasicPj(Troylan);
    this.team.addPj(newPj);
  
}

fromSave(save:GameStateSave) {
    this.currentRoomId = save.currentRoomId;
    this.currentShopId = save.currentShopId
    this.currentPageId = save.currentPageId;
    this.consequenceIds = new Set(save.consequenceIds);
    this.alchemyAccess = save.alchemyAccess;
    this.roomPrologueTable = new Map(save.roomPrologueTable);
    this.gladysRelation = {
    ...save.gladysRelation,
  };
    this.team = new Team();
    this.team.fromSave(save.team);
    

}

newGame() {
   const newPj = Pj.fromBasicPj(Troylan);
    this.team.addPj(newPj);
}

loadGame() {

    
    this.currentRoomId = 8;
    this.currentShopId = null;
   
    this.currentPageId = null;
    this.consequenceIds = new Set();
    this.shop = new Shop(1);
    this.team = new Team();
    this.roomPrologueTable = new Map([]);
    this.room = new Room(8);
    
    this.fight = new Fight(this.team, this.room);
    this.gladysRelation = {
      love:0,
      trust:0,
      gratitude:0,
      admiration:0,
      ressentment:0,
      jealousy:0,
    }
  
    const newPj = Pj.fromBasicPj(Troylan);
    /* Profil Warrior */ 
    newPj.addBaseAtt("strength", 1);
    newPj.xp = 10;
    this.addPj(newPj);
    newPj.learAbility(ABILITY_ID.BRUTAL_BLOW);
    newPj.learAbility(ABILITY_ID.AUTOREGENERATION);
    // newPj.learAbility(ABILITY_ID.AUTOREGENERATION);
    // newPj.learAbility(ABILITY_ID.ROCK_SKIN);
    this.team.profession.alchemy += 1;
    let equipment = Equipment.fromBasicEquipmentId(BASIC_EQUIPMENT_ID.RAT_TAIL);
        newPj.addObjectFirstAvailableSlot(equipment);
        equipment = Equipment.fromBasicEquipmentId(BASIC_EQUIPMENT_ID.BAT_FANG);
        newPj.addObjectFirstAvailableSlot(equipment);
        equipment = Equipment.fromBasicEquipmentId(BASIC_EQUIPMENT_ID.TOAD_TONGUE);
        newPj.addObjectFirstAvailableSlot(equipment);
          equipment = Equipment.fromBasicEquipmentId(BASIC_EQUIPMENT_ID.TOAD_TONGUE);
        newPj.addObjectFirstAvailableSlot(equipment);
          equipment = Equipment.fromBasicEquipmentId(BASIC_EQUIPMENT_ID.HP_POTION);
        newPj.addPotionFirstAvailableSlot(equipment);

  const Pj2 = Pj.fromBasicPj(Gladys);
  Pj2.xp = 15;
  this.addPj(Pj2); 
  Pj2.addBaseAtt("magicSkill", 1);
/*
 const Pj3 = new Pj({
  id: 3,
  image: 2,
  avatar:2,
  name: "Xaran",
  level: 0,
  position: 3,
});
  
 
this.addPj(Pj3); */
 
  /*
  let p1 = new Equipment(BASIC_EQUIPMENT_ID.HP_POTION);   
  this.team.pjs[0]?.addObjectAuto(p1);
  p1 = new Equipment(BASIC_EQUIPMENT_ID.HP_POTION);   
  this.team.pjs[0]?.addObjectAuto(p1);
  let tongue = new Equipment(BASIC_EQUIPMENT_ID.TOAD_TONGUE);
  this.team.pjs[0]?.addObjectFirstAvailableSlot(tongue);
  tongue = new Equipment(BASIC_EQUIPMENT_ID.TOAD_TONGUE);
  this.team.pjs[0]?.addObjectFirstAvailableSlot(tongue); */

}

setPositionPj() {
  const positions = {
    1: [5],
    2: [4, 6],
    3: [1, 3, 8],
  } as const;

  const config = positions[this.team.pjs.length as keyof typeof positions];

  if (!config) return;

  this.team.pjs.forEach((pj, index) => {
    pj.position = config[index]!;
  });
}

playAction(action:ActionRequest):ActionResult[][]
{
  const result:ActionResult[][] = [];
  if(!this.fight)
    return result;

  return this.fight.executeAction(action.id_action, action.id_pj, action.id_target)
}

}
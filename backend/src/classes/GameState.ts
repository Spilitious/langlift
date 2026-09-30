
import type { ActionRequest } from "../../../shared/types/action.js";
import type { ActionResult, VictoryResult } from "../../../shared/types/actionResult.js";
import type { GameStateView, GameStateSave, Relation} from "../../../shared/types/gameStateView.js";
import type { HistoryDestination } from "../../../shared/types/history.js";
import { basicTroylan, basicGladys, basicSiguis, basicGunthar} from "../utils/basicPj_data.js";
import { Shop } from "./Shop.js";
import { Equipment } from "./Equipment.js";
import { Team } from "./Team.js";
import { Room } from "./Room.js";
import {BASIC_EQUIPMENT_ID, COMPANION_ID, } from "../utils/constants.js";
import {ABILITY_ID} from "../../../shared/utils/abilityConstant.js";
import { BM_ID } from "../../../shared/utils/bmConstant.js";

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
  companion: Pj[];
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
    this.companion = [];
   
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
   

    // Conséquence à traiter avant le initFight

     // Loup + pas reposé 
    if(basicRoomId === 6) {
      const pj = this.companion.find(pj => (pj.id ==COMPANION_ID.GLADYS));
       if(pj)
        this.addPj(pj);
      if(this.consequenceIds.has(11) || this.consequenceIds.has(12))
      {
          this.room.prologueId = 3;
          if(this.team.pjs[0]) {
            this.team.pjs[0].updateBm(BM_ID.FATIGUE_STR,"strength", 1);
            this.team.pjs[0].updateBm(BM_ID.FATIGUE_MM,"magicSkill", 1);
          }
      }
    }
    
    if(basicRoomId === 8) {
       const pj = this.companion.find(pj => (pj.id ===COMPANION_ID.SIGUIS));
      
       if(pj)
        this.addPj(pj);
       
       
    }

    //Combat contre les goules
    if(basicRoomId === 11) {
       const pj = this.companion.find(pj => (pj.id ==COMPANION_ID.SIGUIS));
       if(pj)
       this.addPj(pj);
      
       
    }

     //Combat contre les mantes
    if(basicRoomId === 16) {
       const pj = this.companion.find(pj => (pj.id ==COMPANION_ID.GUNTHAR));
       if(pj)
       this.addPj(pj);
      
       
    }
   
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

     // Troll
    if(basicRoomId === 7 && this.consequenceIds.has(23))
      this.room.prologueId = 5;
    
    if(basicRoomId === 7 && this.consequenceIds.has(24))
      this.room.prologueId = 4;
    
     //Combat contre les mantes
    if(basicRoomId === 16) 
        this.team.getPj(1).getHit(Math.floor(this.team.getPj(1).getStat("currhp")/2));
   
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
     
        if(this.team.profession.alchemy > 0) {
         for (let i = 0; i < 3; i++) {
            const dust = Equipment.fromBasicEquipmentId(BASIC_EQUIPMENT_ID.TOAD_TONGUE);
            if (this.team.pjs[0]?.addObjectFirstAvailableSlot(dust)) {
                victoryResult.loots.push(dust);
            }
          }
        }
      
        this.team.getPj(1).deleteBm(BM_ID.FATIGUE_MM);
        this.team.getPj(1).deleteBm(BM_ID.FATIGUE_STR);
        
    }

    // Room 5 : bonus d'alchimie
    if (this.room.id === 5 && this.team.profession.alchemy > 0 ) {
 
         for (let i = 0; i < 3; i++) {
            const dust = Equipment.fromBasicEquipmentId(BASIC_EQUIPMENT_ID.BAT_FANG);
            if (this.team.pjs[0]?.addObjectFirstAvailableSlot(dust)) {
                victoryResult.loots.push(dust);
            }
          }
        
    }

    // Room 6 : Loup
    if (this.room.id === 6) {
       this.alchemyAccess= true;
       this.team.pjs[0]?.deleteBm(BM_ID.FATIGUE_MM);
       this.team.pjs[0]?.deleteBm(BM_ID.FATIGUE_STR);
       
       
    }
 

   // Room 7 : Troll et alchimie
    if (this.room.id === 7 && this.team.profession.alchemy > 0 ) {
         for (let i = 0; i < 2; i++) {
            const dust = Equipment.fromBasicEquipmentId(BASIC_EQUIPMENT_ID.TROLL_BLOOD);
            if (this.team.pjs[0]?.addObjectFirstAvailableSlot(dust)) {
                victoryResult.loots.push(dust);
            }
          }
        
    }


   // Room 8 : Kobold avec Siguis
    if (this.room.id === 8) {
      this.team.removePj(3);
     
    }

    // Room 12 : Ame en peine
    if (this.room.id === 12) {
        if(this.team.profession.alchemy > 0) {
         for (let i = 0; i < 3; i++) {
            const dust = Equipment.fromBasicEquipmentId(BASIC_EQUIPMENT_ID.ETHEREAL_DUST);
            if (this.team.pjs[0]?.addObjectFirstAvailableSlot(dust)) {
                victoryResult.loots.push(dust);
            }
          }
        }
      
      const dice = Math.floor(Math.random()*4 + 23);
      const toga = Equipment.fromBasicEquipmentId(dice);
      this.team.pjs[0]?.addObjectFirstAvailableSlot(toga);

    }

    // Room 13 : Necromancien
    if (this.room.id === 13) {
      
        const siguisSword = this.team.getPj(basicSiguis.id).equipment.find(equip => (equip.basicEquipmentId === BASIC_EQUIPMENT_ID.SIGIS_SWORD))
        if(siguisSword)
        {
            console.log("ici")
          this.team.moveEquipmentToPlayer(basicSiguis.id, basicTroylan.id, siguisSword.id );
        
        }
         if(this.team.profession.alchemy > 0) {
         for (let i = 0; i < 2; i++) {
            const dust = Equipment.fromBasicEquipmentId(BASIC_EQUIPMENT_ID.EYE);
            if (this.team.pjs[0]?.addObjectFirstAvailableSlot(dust)) {
                victoryResult.loots.push(dust);
            }
          }
        
         for (let i = 0; i < 3; i++) {
            const dust = Equipment.fromBasicEquipmentId(BASIC_EQUIPMENT_ID.ROOT);
            if (this.team.pjs[0]?.addObjectFirstAvailableSlot(dust)) {
                victoryResult.loots.push(dust);
            }
          }
          for (let i = 0; i < 2; i++) {
            const dust = Equipment.fromBasicEquipmentId(BASIC_EQUIPMENT_ID.BONE_MARROW);
            if (this.team.pjs[0]?.addObjectFirstAvailableSlot(dust)) {
                victoryResult.loots.push(dust);
            }
          }
           for (let i = 0; i < 2; i++) {
            const dust = Equipment.fromBasicEquipmentId(BASIC_EQUIPMENT_ID.RAT_TAIL);
            if (this.team.pjs[0]?.addObjectFirstAvailableSlot(dust)) {
                victoryResult.loots.push(dust);
            }
          }
         
          
        }
     
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
      case 13 : this.gladysRelation.trust += 1; 
      case 14 : this.gladysRelation.trust += 1;break;
     
      
      // Choix de l'équipement à Irostat
      case 16 : 
        equipment = Equipment.fromBasicEquipmentId(BASIC_EQUIPMENT_ID.BASE_SWORD)
        this.team.pjs[0].addObjectAuto(equipment);
        break;

      case 17 : 
        equipment = Equipment.fromBasicEquipmentId(BASIC_EQUIPMENT_ID.BASE_STAFF)
        this.team.pjs[0].addObjectAuto(equipment);
        break;

      case 18 : 
        equipment = Equipment.fromBasicEquipmentId(BASIC_EQUIPMENT_ID.BASE_ARMOR)
        this.team.pjs[0].addObjectAuto(equipment);
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
      
      //Descente par le chemin escarpé 
      case 22:  this.team.getPj(2).fight_absent = 4;
                break;
            
      //Troylan descend prendre le bouclier    
      case 23:
          equipment = Equipment.fromBasicEquipmentId(BASIC_EQUIPMENT_ID.BASE_SHIELD);
          this.team.getPj(1).addObjectAuto(equipment);
          this.team.getPj(1).fight_absent = 2; 
          this.gladysRelation.trust +=1; 
          this.gladysRelation.admiration+= 1; break;
      
      //Gladys descend prendre le bouclier  
      case 24: 
          equipment = Equipment.fromBasicEquipmentId(BASIC_EQUIPMENT_ID.BASE_SHIELD);
          this.team.getPj(2).addObjectAuto(equipment);
          this.team.getPj(2).fight_absent = 2; break;
      
      case 25: 
         this.team.gold += 150; break;

      

      
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

    const newPj = Pj.fromBasicPj(basicTroylan);
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

    this.companion = [];
    this.createCompagnion();
    

}

newGame() {
   const newPj = Pj.fromBasicPj(basicTroylan);
    this.team.addPj(newPj);

    this.createCompagnion();
}


createCompagnion() {
  
      const Siguis = Pj.fromBasicPj(basicSiguis);
      Siguis.addBaseAtt("strength", 2);
      Siguis.addBaseAtt("magicSkill", 1);
      Siguis.learAbility(ABILITY_ID.PARRY);
      Siguis.learAbility(ABILITY_ID.WARD);
      Siguis.learAbility(ABILITY_ID.TREACHEROUS_ATTACK);
      Siguis.learAbility(ABILITY_ID.FIRST_AID);
      Siguis.addEquipment(Equipment.fromBasicEquipmentId(BASIC_EQUIPMENT_ID.SIGIS_SWORD), "sword");
      this.companion.push(Siguis);

      const Gladys = Pj.fromBasicPj(basicGladys);
      this.companion.push(Gladys);

      const Gunthar = Pj.fromBasicPj(basicGunthar);
      Gunthar.addBaseAtt("constitution", 2);
      Gunthar.addBaseAtt("magicSkill", 1);
      Gunthar.addEquipment(Equipment.fromBasicEquipmentId(BASIC_EQUIPMENT_ID.GUNTHAR_AXE), "sword");
      Gunthar.addEquipment(Equipment.fromBasicEquipmentId(BASIC_EQUIPMENT_ID.MEDIUM_ARMOR), "armor");
      Gunthar.addEquipment(Equipment.fromBasicEquipmentId(BASIC_EQUIPMENT_ID.MEDIUM_HELM), "helm");
      Gunthar.addEquipment(Equipment.fromBasicEquipmentId(BASIC_EQUIPMENT_ID.MEDIUM_SHIELD), "shield");
      Gunthar.learAbility(ABILITY_ID.GUARD);
      Gunthar.learAbility(ABILITY_ID.PROVOCATION);
      Gunthar.learAbility(ABILITY_ID.CALL_OF_LIGHT);
      this.companion.push(Gunthar);
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
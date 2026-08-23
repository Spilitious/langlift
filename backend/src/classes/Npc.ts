import type { NpcView } from "../../../shared/types/fighterView.js";
import type { NpcIntentView } from "../../../shared/types/npcIntentView.js";

export class Npc {
  private static nextId = 1;
  id: number;
  basicRaceId: number;
  image: number;
  level: number;
  name: string;
  hp: number;
  maxHp:number;
  position: number;
  npcIntent: NpcIntentView;


  constructor(basicRaceId: number,
    
  ) {
    this.id = Npc.nextId++;
    this.basicRaceId = basicRaceId;
    this.name ="not init";
    this.image = 1;
    this.level =1;
    this.maxHp = 20;
    this.hp = 20;
    this.position = 1;

    this.npcIntent = 
    {
      action:0,
      target:0,
      target_image:0,
      value:0,
    }
    
  }

  toView(): NpcView {
    return {
      id: this.id,
      image: this.image,
      name:this.name,
      level:this.level,
      hp: this.hp,
      maxHp: this.maxHp,
      shield: this.getShield(),
      position: this.position,
      npc_intent: this.npcIntent,
      bms: [],
    };
  }

   getShield():number {
    return 1;
  }
  
}
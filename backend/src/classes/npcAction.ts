import { getBasicAbility } from "../utils/basicAbility_data.js";
import type { SchoolType, TargetType, AbilityView, AbilityType, AbilitySave} from "../../../shared/types/abilityView.js";

export class NpcAction {
 
  id: number;
  image: number;
  name: string;
  need_intent_change:boolean;
  change_under_provocation:boolean;


  private constructor(npcBasicAction:number) {

    this.id=0;
    this.image=0;
    this.name= "";
    this.change_under_provocation = false;
    this.need_intent_change = false;
   
    
  }


}
import { getBasicAbility } from "../utils/basicAbility_data.js";
import type { SchoolType, TargetType, AbilityView, AbilityType, AbilitySave} from "../../../shared/types/abilityView.js";

export class Ability {
  private static nextId = 1;

  id: number;
  basicAbilityId: number;
  image: number;
  name: string;
  school: SchoolType;
  detail: string;
  formula: string;
  target: TargetType;
  ap: number;
  type: AbilityType;
  duration: number;
  ignoreProvocation:boolean;

  private constructor() {
    this.id=0;
    this.basicAbilityId=0 ;
    this.image=0;
    this.name="";
    this.school="Guerrier";
    this.detail="";
    this.formula="";
    this.target="npc";
    this.ap=0;
    this.type="spell";
    this.duration=0;
    this.ignoreProvocation=false;
    
  }


  static fromBasicAbility(
    basicAbilityId: number
  ): Ability {

    const ability = new Ability();

    const basic =
      getBasicAbility(basicAbilityId);

    ability.id = Ability.nextId++;
    ability.basicAbilityId = basicAbilityId;

    ability.image = basic.image;
    ability.name = basic.name;
    ability.school = basic.school;
    ability.detail = basic.detail;
    ability.formula = basic.formula;
    ability.target = basic.target;
    ability.ap = basic.ap;
    ability.type = basic.type;
    ability.duration = basic.duration;
    ability.ignoreProvocation = basic.ignoreProvocation;

    return ability;
  }


  static fromSave(
    save: AbilitySave
  ): Ability {

    const ability = new Ability();

    ability.id = save.id;
    

    Ability.nextId = Math.max(
    Ability.nextId,
    save.id + 1
  );
    ability.basicAbilityId =
      save.basicAbilityId;

    ability.image = save.image;
    ability.name = save.name;
    ability.school = save.school;
    ability.detail = save.detail;
    ability.formula = save.formula;
    ability.target = save.target;
    ability.ap = save.ap;
    ability.type = save.type;
    ability.duration = save.duration;
    ability.ignoreProvocation = save.ignoreProvocation;

    return ability;
  }


  toView():AbilityView {
    return {
      id:this.id,
      basicAbilityId:this.basicAbilityId,
      image:this.image,
      name:this.name,
      school:this.school,
      type:this.type,
      detail:this.detail,
      target:this.target,
      formula:this.formula,
      ap:this.ap,
      duration:this.duration,
      ignoreProvocation:this.ignoreProvocation,
    }
  }

  toSave():AbilitySave {
    return {
      id:this.id,
      
      basicAbilityId:this.basicAbilityId,
      image:this.image,
      name:this.name,
      school:this.school,
      type:this.type,
      detail:this.detail,
      target:this.target,
      formula:this.formula,
      ap:this.ap,
      duration:this.duration,
      ignoreProvocation: this.ignoreProvocation,
    }
  }
}



    


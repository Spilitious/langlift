import { getBasicAbility } from "../utils/basicAbility.js";
import type { SchoolType, TargetType, AbilityView, AbilityType} from "../../../shared/types/abilityView.js";

export class Ability {
  private static nextId = 1;
  id:number;
  basicAbilityId: number;
  image: number;
  name: string;
  school: SchoolType;
  type: AbilityType;
  detail: string;
  formula: string;
  target: TargetType;
  ap: number;
  duration:number;

  constructor(basicAbilityId: number) {
    const basic = getBasicAbility(basicAbilityId);

    this.id =Ability.nextId++;
    this.basicAbilityId = basicAbilityId;
    this.image = basic.image;
    this.name = basic.name;
    this.school = basic.school;
    this.detail = basic.detail;
    this.formula = basic.formula;
    this.target = basic.target;
    this.ap = basic.ap;
    this.type = basic.type;
    this.duration=basic.duration;
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
    }
  }

}



    


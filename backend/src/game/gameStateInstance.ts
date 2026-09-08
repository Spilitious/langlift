import { GameState } from "../classes/GameState.js";
import {pj1, pj2} from "../utils/mocks/pj.js"
import { Equipment } from "../classes/Equipment.js";
import { Const_Equipment } from "../types/basicEquipment.js";
import { Ability } from "../classes/Abitlity.js";
import { ABILITY_ID } from "../utils/constants.js";
export const gameState = new GameState();


gameState.addPj(pj1);
//pj1.learAbility(ABILITY_ID.BRUTAL_BLOW);
//pj1.addXp(20);
//Pour test
//let p1 = new Equipment(Const_Equipment.HP_POTION);   
//gameState.team.getPj(pj1.id).addObjectAuto(p1);

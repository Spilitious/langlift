
import type { ActionRequest } from "../../../shared/types/action.js";
import type { ActionResult } from "../../../shared/types/actionResult.js";
import type { GameStateView } from "../../../shared/types/gameStateView.js";
import type { HistoryDestination } from "../../../shared/types/history.js";
import { mockNpcIntent1 } from "../utils/mocks/npcIntentChange.js";
import { pj1 } from "../utils/mocks/pj.js";

import  {Pj} from "./Pj.js"


export class GameState {
  pjs: Pj[];
  currentRoomId: number | null;
  currentPageId: number | null;
  consequenceIds: Set<number>;

  constructor() {
    this.pjs = [];
    this.currentRoomId = null;
    this.currentPageId = 1;
    this.consequenceIds = new Set();
  }

  toView(): GameStateView {
    return {
      pjs: this.pjs.map((pj) => pj.toView()),
      currentRoomId: this.currentRoomId,
      currentPageId: this.currentPageId,
      consequenceIds: new Set(this.consequenceIds),
    };
  }

  addPj(pj:Pj) {
    this.pjs.push(pj);
  }

  setDestination(
  destination: HistoryDestination
) {
  if (destination.type === "text") {
    this.currentPageId = destination.id;
    this.currentRoomId = null;
    return;
  }

  this.currentRoomId = destination.id;
  this.currentPageId = null;
}

 addConsequence(id:number) {
    this.consequenceIds.add(id);
}
 

reset(pageId: number = 1) {
  this.pjs = [
    new Pj(pj1),
  ];

  this.currentPageId = pageId;
  this.currentRoomId = null;

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
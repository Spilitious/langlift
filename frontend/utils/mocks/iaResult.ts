import type { EndTurnResult } from "../../../shared/types/ia";
import { getResultAction } from "../../../backend/src/utils/mocks/actionResult";

export const EndTurnResultMock1: EndTurnResult = {
  events: [
    getResultAction("NPC1 newTurnRegen"),
    getResultAction("NPC1 hurt PJ2"),
    getResultAction("NPC1 intent attack on PJ1"),
    getResultAction("NPC2 hurt PJ1"),
    getResultAction("NPC2 intent to shield himself")
  ],
 
};



export const EndTurnResultMock2: EndTurnResult = {
  events: [
   
     getResultAction("NPC1 kill PJ2"),
   
  ],
 
};


export const EndTurnResultMock3: EndTurnResult = {
  events: [
   
     getResultAction("PJ1 kill NPC1"),
    
   
  ],
  
};


export const EndTurnResultMock4: EndTurnResult = {
  events: [
   
     getResultAction("NPC1 newTurnHurt"),
    
   
  ],
  
};



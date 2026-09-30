import type { PjPreview} from "./fighterView"; 
import type { TeamView,TeamSave } from "./teamView";

import type {ShopView} from "./shopView"
import type { RoomView } from "./roomView";

export type NewGameResponse =
  | {
      success: true;
      gameState: GameStateView;
    }
  | {
      success: false;
      reason: "NO_EMPTY_SAVE_SLOT";
    };

export type Relation = {
 
  trust: number;
  gratitude:number;
  love: number;
  admiration: number;
  jealousy:number;
  ressentment:number;
}

export type GameStateView = {
  
  
  currentRoomId: number | null;
  currentPageId: number | null;
  currentShopId: number | null;
  
  consequenceIds: Set<number>;
  alchemyAccess:boolean;
  
  shop:ShopView | null;
  room:RoomView | null;
  team:TeamView;
 
 
  
};


export type GameStateSave = {
  date: string;
  currentRoomId: number | null;
  currentPageId: number | null;
  currentShopId: number | null;
  consequenceIds: number[];
  alchemyAccess:boolean;
  
  team:TeamSave;
  roomPrologueTable: [number, number][];
  gladysRelation:Relation;


 
 
  
};

export type SavePreview = {
  id: number;
  date: string | null;
  players: PjPreview[];
};
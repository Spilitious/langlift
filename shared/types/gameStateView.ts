import type { PjView } from "./fighterView"; 
import type { TeamView } from "./teamView";

import type {ShopView} from "./shopView"
import type { RoomView } from "./roomView";

export type GameStateView = {
  team:TeamView;
  currentRoomId: number | null;
  currentPageId: number | null;
  currentShopId: number | null;
  currentProfessionId: number | null;
  consequenceIds: Set<number>;
  shops:ShopView[];
  room:RoomView;
 
 
  
};
import type {NpcView} from "./fighterView";
import type { HistoryDestination} from "./history.js";

export type RoomView = {
    id:number,
    imageId:number,
    destination:HistoryDestination,
    npcs:NpcView[],
    transitionId:number,
    xp:number,
}
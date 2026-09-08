import type { HistoryDestination } from "../../../shared/types/history.js";


export type BasicRoomNpc = {
  basicRaceId: number;
  level_min:number;
  level_max:number;
  position: number;
};

export type BasicRoom = 
    {
        id:number,
        npcs:BasicRoomNpc[];
        imageId:number,
        destination : HistoryDestination,
        transitionId:number,
        prologueId:number,
        xp:number,
    };


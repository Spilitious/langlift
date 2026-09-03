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


export const BasicRooms:BasicRoom[] = [
    {
        id:1, //Rat Géant première salle 
        npcs: [
        {
            basicRaceId: 1,
            level_min:1,
            level_max:2,
            position:5,
        }
        ],
        
        imageId:2,
        destination:
        {
                type: "fight",
                id : 2,
        },
        transitionId:1,
        prologueId:0,
        xp:0,
    },
]    


export const getBasicRoom = (
  id: number
): BasicRoom => {
  const room = BasicRooms.find(
    (room) => room.id === id
  );

  if (!room) {
    throw new Error(
      `BasicRoom introuvable : ${id}`
    );
  }

  return room;
};
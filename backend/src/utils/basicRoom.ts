import type { RoomView } from "../../../shared/types/roomView.js";
import type { BasicRoom } from "../types/basicRoom.js";

export const BasicRooms:BasicRoom[] = [
    {
        id:1, //Rat Géant première salle 
        npcs: [
        {
            basicRaceId: 1,
            level_min:1,
            level_max:1,
            position:5,
        }
        ],
        
        imageId:1,
        destination:
        {
                type: "fight",
                id : 2,
        },
        transitionId:1,
        prologueId:0,
        xp:0,
    },
     {
        id:2, //Rat Géant deuxième salle 
        npcs: [
        {
            basicRaceId: 1,
            level_min:1,
            level_max:2,
            position:4,
        },
         {
            basicRaceId: 1,
            level_min:1,
            level_max:2,
            position:6,
        }
        ],
        
        imageId:1,
        destination:
        {
                type: "text",
                id : 26,
        },
        transitionId:-1,
        prologueId:0,
        xp:15,
    },
     {
        id:3, //Crapaud Géant première salle 
        npcs: [
        {
            basicRaceId: 2,
            level_min:1,
            level_max:1,
            position:5,
        },
        ],
        
        imageId:4,
        destination:
        {
                type: "fight",
                id : 4,
        },
        transitionId:2,
        prologueId:0,
        xp:0,
    },
     {
        id:4, //Crapaud Géant deuxième salle 
        npcs: [
        {
            basicRaceId: 2,
            level_min:1,
            level_max:1,
            position:4,
        },
         {
            basicRaceId: 2,
            level_min:1,
            level_max:1,
            position:6,
        }
        ],
        
        imageId:4,
        destination:
        {
                type: "text",
                id : 10,
        },
        transitionId:-1,
        prologueId:0,
        xp:25,
    },
    {
        id:5, //Chauve souris Géante 
        npcs: [
        {
            basicRaceId: 3,
            level_min:1,
            level_max:3,
            position:2,
        },
         {
            basicRaceId: 3,
            level_min:1,
            level_max:3,
            position:7,
        },
        {
            basicRaceId: 3,
            level_min:1,
            level_max:3,
            position:9,
        }
        ],
        
        imageId:7,
        destination:
        {
                type: "text",
                id : 14,
        },
        transitionId:-1,
        prologueId:0,
        xp:30,
    },
    {
        id:6, // Loups  
        npcs: [
        {
            basicRaceId: 4,
            level_min:2,
            level_max:3,
            position:1,
        },
         {
            basicRaceId: 4,
            level_min:2,
            level_max:3,
            position:3,
        },
        {
            basicRaceId: 4,
            level_min:2,
            level_max:3,
            position:8,
        }
        ],
        
        imageId:10,
        destination:
        {
                type: "text",
                id : 22,
        },
        transitionId:-1,
        prologueId:0,
        xp:30,
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
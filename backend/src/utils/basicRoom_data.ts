import type { RoomView } from "../../../shared/types/roomView.js";
import type { BasicRoom } from "../types/basicRoom.js";
import { NPC_ID } from "./constants.js";

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
            level_max:1,
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
        xp:20,
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
            level_max:2,
            position:4,
        },
         {
            basicRaceId: 2,
            level_min:1,
            level_max:2,
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
        xp:50,
    },
    {
        id:5, //Chauve souris Géante 
        npcs: [
        {
            basicRaceId: 3,
            level_min:1,
            level_max:2,
            position:2,
        },
         {
            basicRaceId: 3,
            level_min:1,
            level_max:2,
            position:4,
        },
        {
            basicRaceId: 3,
            level_min:1,
            level_max:2,
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
        xp:50,
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
        xp:50,
    },
      {
        id:7, // Troll 
        npcs: [
        {
            basicRaceId: 6,
            level_min:7,
            level_max:8,
            position:5,
        },
        
        ],
        
        imageId:10,
        destination:
        {
                type: "text",
                id : 32,
        },
        transitionId:-1,
        prologueId:0,
        xp:50,
    },
      {
        id:8, // Kobold
        npcs: [
        {
            basicRaceId: 5,
            level_min:3,
            level_max:4,
            position:1,
        },
          {
            basicRaceId: 5,
            level_min:3,
            level_max:4,
            position:3,
        },
          {
            basicRaceId: 5,
            level_min:3,
            level_max:4,
            position:5,
        },
          {
            basicRaceId: 5,
            level_min:3,
            level_max:4,
            position:7,
        },
          {
            basicRaceId: 5,
            level_min:3,
            level_max:4,
            position:9,
        },
      
        
        ],
        
        imageId:26,
        destination:
        {
                type: "text",
                id : 42,
        },
        transitionId:-1,
        prologueId:0,
        xp:45,
    },
      {
        id:9, // Ogre
        npcs: [
        {
            basicRaceId: 7,
            level_min:10,
            level_max:12,
            position:2,
        },
          {
            basicRaceId: 8,
            level_min:3,
            level_max:4,
            position:10,
        },
        
        
        ],
        
        imageId:10,
        destination:
        {
                type: "text",
                id : 22,
        },
        transitionId:-1,
        prologueId:0,
        xp:50,
    },
      {
        id:10, // 3 Kobolds
        npcs: [
        {
            basicRaceId: 5,
            level_min:3,
            level_max:4,
            position:1,
        },
          {
            basicRaceId: 5,
            level_min:3,
            level_max:4,
            position:3,
        },
          {
            basicRaceId: 5,
            level_min:3,
            level_max:4,
            position:5,
        },
         
      
        
        ],
        
        imageId:26,
        destination:
        {
            type: "text",
            id : 50,
        },
        transitionId:-1,
        prologueId:0,
        xp:30,
    },
      {
        id:11, // Les goules
        npcs: [
        {
            basicRaceId: 9,
            level_min:5,
            level_max:7,
            position:1,
        },
           {
            basicRaceId: 9,
            level_min:5,
            level_max:7,
            position:3,
        },
        {
            basicRaceId: 9,
            level_min:5,
            level_max:7,
            position:7,
        },
           {
            basicRaceId: 9,
            level_min:5,
            level_max:7,
            position:9,
        },    
        ],
        
        imageId:31,
        destination:
        {
            type: "text",
            id : 52,
        },
        transitionId:-1,
        prologueId:0,
        xp:45,
    },
      {
        id:12, // L'âme en peine
        npcs: [
        {
            basicRaceId: NPC_ID.SOUL,
            level_min:10,
            level_max:13,
            position:5,
        },
          
        ],
        
        imageId:34,
        destination:
        {
            type: "text",
            id : 56,
        },
        transitionId:-1,
        prologueId:0,
        xp:75,
    },
     {
        id:13, // Le nécromancien
        npcs: [
       
        {
            basicRaceId: NPC_ID.NECROMANCIEN,
            level_min:12,
            level_max:15,
            position:8,
        },
         {
            basicRaceId: NPC_ID.ZOMBIE,
            level_min:7,
            level_max:10,
            position:1,
        },
         {
            basicRaceId: NPC_ID.ZOMBIE,
            level_min:7,
            level_max:10,
            position:3,
        },
          
        ],
        
        imageId:34,
        destination:
        {
            type: "text",
            id : 63,
        },
        transitionId:-1,
        prologueId:0,
        xp:75,
    },
     {
        id:14, // Les anges
        npcs: [
        {
            basicRaceId: NPC_ID.BLACK_ANGEL,
            level_min:10,
            level_max:10,
            position:1,
        },
        {
            basicRaceId: NPC_ID.WHITE_ANGEL,
            level_min:10,
            level_max:10,
            position:9,
        },
        
        
          
        ],
        
        imageId:34,
        destination:
        {
            type: "text",
            id : 63,
        },
        transitionId:-1,
        prologueId:0,
        xp:50,
    },
    {
        id:15, // Le Gnoll
        npcs: [
        {
            basicRaceId: NPC_ID.GNOLL,
            level_min:10,
            level_max:10,
            position:5,
        },
       
        
        
          
        ],
        
        imageId:34,
        destination:
        {
            type: "text",
            id : 63,
        },
        transitionId:-1,
        prologueId:0,
        xp:50,
    },
     {
        id:16, // Les mantes
        npcs: [
        {
            basicRaceId: NPC_ID.MANTIS,
            level_min:3,
            level_max:5,
            position:1,
        },
        {
            basicRaceId: NPC_ID.MANTIS,
            level_min:3,
            level_max:5,
            position:3,
        },
         {
            basicRaceId: NPC_ID.MANTIS,
            level_min:3,
            level_max:5,
            position:5,
        },
          {
            basicRaceId: NPC_ID.MANTIS,
            level_min:3,
            level_max:5,
            position:7,
        },
         {
            basicRaceId: NPC_ID.MANTIS,
            level_min:3,
            level_max:5,
            position:9,
        },
        
        
          
        ],
        
        imageId:34,
        destination:
        {
            type: "text",
            id : 78,
        },
        transitionId:-1,
        prologueId:6,
        xp:60,
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
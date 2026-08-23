import type { RoomView } from "../../../../shared/types/roomView.js";
import {npc1, npc2, npc3, npc4, npc5} from "./npc.js"

export const rooms:RoomView[] = [
    {
        //Rat salle 1 
        id : 1,
        imageId:1,
        destination : 
        {
            type: "fight",
            id : 2,
        },

        npcs: [npc1],
        transitionId:1,
        xp:0,
    },
    {
        //Rat salle 2
        id:2,
        imageId:1,
        destination : 
        {
            type: "text",
            id : 4,
        },
        npcs: [npc1, npc2],
        transitionId: -1,
        xp:17,
    },
    {
        // Crapaud salle 1
      id:3,
        imageId:4,
        destination : 
        {
            type: "fight",
            id : 4,
        },
        npcs: [npc1],
        transitionId: 2,
        xp:0,
    },
    {
        // Crapaud salle 2
      id:4,
        imageId:4,
        destination : 
        {
            type: "text",
            id : 10,
        },
        npcs: [npc1, npc4],
        transitionId: -1,
        xp:17
    },
    {
        //Chauve souris
      id:5,
        imageId:8,
        destination : 
        {
            type: "text",
            id : 14,
        },
        npcs: [npc1],
        transitionId: -1,
        xp:19,
    },
    {
        // Loups
      id:6,
        imageId:10,
        destination : 
        {
            type: "text",
            id : 22,
        },
        npcs: [npc1],
        transitionId: -1,
        xp:21,
    }
];



export const getRoom = (id:number):RoomView =>
{
    const room = rooms.find(
       (room) => room.id === id
     );
   
     if (!room) {
       throw new Error(
         `Room introuvable : ${id}`
       );
     }
   
     return room;
   };

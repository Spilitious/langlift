import type { RoomView } from "../../../shared/types/roomView.js";

import {
  getBasicRoom,
} from "../utils/basicRoom.js";


export class Room {
  data: RoomView;
  

  constructor(basicRoomId: number) {
    const basicRoom =
      getBasicRoom(basicRoomId);

      
/*
    const npcs = basicRoom.npcs_idBasicRace.map(
      (basicRaceId, index) => {
        const npc =
          Npc.generate(basicRaceId);

        npc.data.position =
          basicRoom.npcs_position[index];

        return npc.data;
      }
    );*/

    this.data = {
      id: basicRoom.id,

      imageId:
        basicRoom.imageId,

      destination:
        basicRoom.destination,

      transitionId:
        basicRoom.transitionId,

      npcs,

      xp:basicRoom.xp,
    };

   
  }
}
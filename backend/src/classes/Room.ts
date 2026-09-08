import type { RoomView } from "../../../shared/types/roomView.js";
import type { HistoryDestination } from "../../../shared/types/history.js";
import type { VictoryResult } from "../../../shared/types/actionResult.js";
import { getBasicRoom } from "../utils/basicRoom.js";
import { Npc } from "./Npc.js";

export class Room {
  id: number;
  basicRoomId:number;
  imageId: number;
  destination: HistoryDestination;
  transitionId: number;
  prologueId:number;
  xp: number;
  npcs: Npc[];
  cleared:boolean;
  loaded:boolean;
  victoryResult: VictoryResult | null = null;

  constructor(basicRoomId: number) {
  const basicRoom = getBasicRoom(basicRoomId);

  if (!basicRoom) {
    throw new Error(`BasicRoom ${basicRoomId} introuvable`);
  }

  this.id = basicRoom.id;
  this.basicRoomId = basicRoomId;
  this.imageId = basicRoom.imageId;
  this.destination = basicRoom.destination;
  this.transitionId = basicRoom.transitionId;
  this.prologueId = basicRoom.prologueId;
  this.xp = basicRoom.xp;
  this.npcs = [];
  this.cleared= false;
  this.loaded = false;

  for (const npcData of basicRoom.npcs) {
    const level =
      Math.floor(
        Math.random() * (npcData.level_max - npcData.level_min + 1)
      ) + npcData.level_min;

    const npc = new Npc(npcData.basicRaceId, level);

    npc.position = npcData.position;

    this.npcs.push(npc);
  }
}

  toView(): RoomView {
    return {
      id: this.id,
      basicRoomId: this.basicRoomId,
      imageId: this.imageId,
      destination: this.destination,
      transitionId: this.transitionId,
      prologueId: this.prologueId,
      xp: this.xp,

      npcs: this.npcs.map(
        (npc) => npc.toView()
      ),
    };
  }

 
  getNpc(npcId:number):Npc {
     const npc = this.npcs.find((npc) => npc.id === npcId);
     if(!npc) {
        throw new Error(`Pj introuvable : ${npcId}`);
     }
     return npc;
  }

 
removeDeadNpcs(): void {
  this.npcs = this.npcs.filter(
    npc => npc.getStat("currhp") > 0
  );
}

}

 
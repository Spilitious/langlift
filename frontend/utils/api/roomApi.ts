// utils/api/room.ts

import type { RoomView } from "../../../shared/types/roomView";

export const loadRoom = async (
  roomId: number
): Promise<RoomView> => {
  const response = await fetch(
    `http://localhost:3001/api/room/${roomId}`
  );
 if (!response.ok) {
    const text = await response.text();

    console.error(
      "Erreur room",
      response.status,
      text
    );

    throw new Error(
      `Impossible de charger la room ${roomId}`
    );
  }

  return response.json();
};


import type { buildRoomResult, VictoryResponse, XpResult } from "@shared/types/actionResult";

export const loadRoom = async (
  roomId: number
): Promise<buildRoomResult> => {
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



export async function victoryRoom(): Promise<VictoryResponse> {
  const response = await fetch(
    "http://localhost:3001/api/room/victory",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la victoire");
  }

  return response.json();
}
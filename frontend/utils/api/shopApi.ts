

import { GameStateView } from "@shared/types/gameStateView";

export const loadShop = async (
  shopId: number
): Promise<GameStateView> => {
  const response = await fetch(
    `http://localhost:3001/api/shop/${shopId}`
  );
 if (!response.ok) {
    const text = await response.text();

    console.error(
      "Erreur room",
      response.status,
      text
    );

    throw new Error(
      `Impossible de charger la room ${shopId}`
    );
  }

  return response.json();
};
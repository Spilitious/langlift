import type { HistoryDestination } from "@shared/types/history";
import type { GameStateView } from "@shared/types/gameStateView";

export const applyDestination = async (
  destination: HistoryDestination
): Promise<GameStateView> => {
    console.log("hoh",destination);
  const response = await fetch(
    "http://localhost:3001/api/destination",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(destination),
      
    }
  );

  if (!response.ok) {
    const text = await response.text();
     console.error(
      "GameState error:",
      response.status,
      text
    );
    throw new Error(
      "Impossible de changer de destination"
    );
  }


  return response.json();
};
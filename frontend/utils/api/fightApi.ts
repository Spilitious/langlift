import type { ActionResult } from "@shared/types/actionResult";
import type { ActionRequest } from "@shared/types/action";
import type { PotionRequest } from "@shared/types/action";


export async function sendAction(
  action: ActionRequest
): Promise<ActionResult> {

  const response = await fetch(
    "http://localhost:3001/api/action",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(action),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Erreur lors de l'envoi de l'action"
    );
  }

  return response.json();
}


export async function usePotion(
  request: PotionRequest
): Promise<ActionResult> {
  const response = await fetch(
    "http://localhost:3001/api/fight/potion",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Erreur lors de l'utilisation de la potion"
    );
  }

  return response.json();
}
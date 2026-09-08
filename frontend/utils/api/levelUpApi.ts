import type { AbilityView } from "@shared/types/abilityView";
import { LevelUpResponse } from "@shared/types/actionResult";


export async function getLearnableAbilities(
  pjId: number
): Promise<AbilityView[]> {
  const response = await fetch(
    `http://localhost:3001/api/levelUp/learnable/${pjId}`
  );

  if (!response.ok) {
    throw new Error(
      "Erreur lors du chargement des abilities"
    );
  }

  return response.json();
}

export async function learnAbility(
  pjId: number,
  abilityId: number
): Promise<LevelUpResponse> {
  const response = await fetch(
    "http://localhost:3001/api/levelUp/learn",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pjId: pjId,
        basicAbilityId: abilityId,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Erreur lors de l'apprentissage de l'ability"
    );
  }

   return response.json();
}
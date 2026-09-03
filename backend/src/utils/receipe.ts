import { Const_Equipment } from "../types/basicEquipment.js";

const alchemyRecipes: Record<string, number> = {
  "1-2": Const_Equipment.HP_POTION,  
  "2-3": Const_Equipment.STR_POTION,
  "1-3": Const_Equipment.MM_POTION,
};

function getRecipeKey(
  ingredientTypes: (number | null)[]
): string {
  return ingredientTypes
    .filter(
      (id): id is number => id !== null
    )
    .sort((a, b) => a - b)
    .join("-");
}

export function getAlchemyResult(
  ingredientTypes: (number | null)[]
): number | null {

  const key = getRecipeKey(ingredientTypes);

  return alchemyRecipes[key] ?? null;
}
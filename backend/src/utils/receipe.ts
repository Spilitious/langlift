import { BASIC_EQUIPMENT_ID } from "../utils/constants.js";

function recipeKey(...ingredients: number[]): string {
  return [...ingredients]
    .sort((a, b) => a - b)
    .join("-");
}
const alchemyRecipes: Record<string, number> = {
  [recipeKey(
    BASIC_EQUIPMENT_ID.TOAD_TONGUE,
    BASIC_EQUIPMENT_ID.RAT_TAIL
  )]: BASIC_EQUIPMENT_ID.HP_POTION,

  [recipeKey(
    BASIC_EQUIPMENT_ID.RAT_TAIL,
    BASIC_EQUIPMENT_ID.BAT_FANG,
  )]: BASIC_EQUIPMENT_ID.STR_POTION,

  [recipeKey(
    BASIC_EQUIPMENT_ID.TOAD_TONGUE,
    BASIC_EQUIPMENT_ID.BAT_FANG
  )]: BASIC_EQUIPMENT_ID.MM_POTION,
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
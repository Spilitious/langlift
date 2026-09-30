import { BASIC_EQUIPMENT_ID } from "../utils/constants.js";
import type { EquipmentView } from "../../../shared/types/equipmentView.js";
import type { StatName } from "../../../shared/types/label.js";
import { STAT_NAMES } from "../../../shared/types/label.js";

/*
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
*/
type AlchemyResult = {
  stat: StatName;
  level: number;
};

function getAlchemyResult(
  ingredients: EquipmentView[]
): AlchemyResult | null {

  // Il faut 2 ou 3 ingrédients
  if (
    ingredients.length < 2 ||
    ingredients.length > 3
  ) {
    return null;
  }

  // Il faut au moins 2 ingrédients différents
  const differentIngredients = new Set(
    ingredients.map(
      ingredient => ingredient.basicEquipmentId
    )
  );

  if (differentIngredients.size < 2) {
    return null;
  }

  // Cherche un bonus commun aux ingrédients
  const commonStat = STAT_NAMES.find(stat =>
    ingredients.every(
      ingredient =>
        (ingredient.bonus[stat] ?? 0) > 0
    )
  );

  if (!commonStat) {
    return null;
  }

  const values = ingredients.map(
    ingredient =>
      ingredient.bonus[commonStat] ?? 0
  );

  // =========================
  // 2 ingrédients différents
  // =========================

  if (ingredients.length === 2) {
    return {
      stat: commonStat,
      level: Math.min(...values),
    };
  }

  // =========================
  // 3 ingrédients différents
  // =========================

  if (differentIngredients.size === 3) {
    return {
      stat: commonStat,
      level: values.reduce(
        (sum, value) => sum + value,
        0
      ),
    };
  }

  // =========================
  // 3 ingrédients
  // dont 2 identiques
  // =========================

  const groups = new Map<number, EquipmentView[]>();

  for (const ingredient of ingredients) {
    const id = ingredient.basicEquipmentId;
    const group = groups.get(id) ?? [];
    group.push(ingredient);
    groups.set(id, group);
  }

  const duplicatedGroup =
    [...groups.values()].find(
      group => group.length === 2
    );

  const uniqueGroup =
    [...groups.values()].find(
      group => group.length === 1
    );

  if (
    !duplicatedGroup ||
    !uniqueGroup
  ) {
    return null;
  }

  const duplicateValue =
    duplicatedGroup.reduce(
      (sum, ingredient) =>
        sum +
        (ingredient.bonus[commonStat] ?? 0),
      0
    );

  const uniqueValue =
    uniqueGroup[0]!.bonus[commonStat] ?? 0;

  return {
    stat: commonStat,
    level: Math.min(
      duplicateValue,
      uniqueValue
    ),
  };
}


type PotionResult = {
  potionBasicId: number;
  level: number;
};

export const getPotionResult = (ingredients:EquipmentView[]):PotionResult => {

  const result:PotionResult = {
    potionBasicId: 0,
    level: 0,
  }


  const alchemyResult = getAlchemyResult(ingredients);
  if(!alchemyResult)
    return result;
  
  result.level = alchemyResult.level;
  switch(alchemyResult.stat) 
  {
    case "magicSkill" : result.potionBasicId = BASIC_EQUIPMENT_ID.MM_POTION; break;
    case "strength" : result.potionBasicId = BASIC_EQUIPMENT_ID.STR_POTION; break;
    case "hp" : result.potionBasicId = BASIC_EQUIPMENT_ID.STR_POTION; break;
    default : break;

  }
  return result;


}
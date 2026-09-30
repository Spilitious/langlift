import { Bm } from "../classes/Bm.js";
import type { BasicNpcAction} from "../types/basicNpcAction.js";
import { NPC_ACTION_ID} from "../../../shared/utils/npcActionConstant.js";
export const basicNpcActions: BasicNpcAction[] = [
  {
    id: NPC_ACTION_ID.RAT_ATTACK,
    name: "Coup de griffes acérées",
    image: 1,
    change_under_Arcxos: true,
    change_under_provocation: true,
  },
  {
    id: NPC_ACTION_ID.SHIELD,
    name: "Posture de défense",
    image: 2,
    change_under_Arcxos: false,
    change_under_provocation: false,
  },
  {
    id: NPC_ACTION_ID.EVASION,
    name: "Évasion",
    image: 3,
    change_under_Arcxos: false,
    change_under_provocation: false,
  },
  {
    id: NPC_ACTION_ID.WOLF_CRY,
    name: "Appel de la meute",
    image: 4,
    change_under_Arcxos: false,
    change_under_provocation: false,
  },
  {
    id: NPC_ACTION_ID.MULTIPLE_ATTACK,
    name: "Rafale de coups",
    image: 5,
    change_under_Arcxos: true,
    change_under_provocation: true,
  },
  {
    id: NPC_ACTION_ID.TWIRL,
    name: "Tourbillon",
    image: 6,
    change_under_Arcxos: true,
    change_under_provocation: true,
  },
  {
    id: NPC_ACTION_ID.TROLL_FURY,
    name: "Furie",
    image: 7,
    change_under_Arcxos: false,
    change_under_provocation: false,
  },
  {
    id: NPC_ACTION_ID.BURN_ATTACK,
    name: "Attaque de feu",
    image: 8,
    change_under_Arcxos: true,
    change_under_provocation: true,
  },
  {
    id: NPC_ACTION_ID.AUTOREGENERATION,
    name: "Auto-régénération",
    image: 9,
    change_under_Arcxos: false,
    change_under_provocation: false,
  },
  {
    id: NPC_ACTION_ID.PIERCING_ATTACK,
    name: "Attaque transperçante",
    image: 10,
    change_under_Arcxos: true,
    change_under_provocation: true,
  },
  {
    id: NPC_ACTION_ID.INVOKE_ANT,
    name: "Invocation",
    image: 11,
    change_under_Arcxos: false,
    change_under_provocation: false,
  },
  {
    id: NPC_ACTION_ID.TROLL_ATTACK,
    name: "Grand coup de gourdin",
    image: 12,
    change_under_Arcxos: true,
    change_under_provocation: true,
  },
  {
    id: NPC_ACTION_ID.BLEAK_ATTACK,
    name: "Attaque putride",
    image: 13,
    change_under_Arcxos: true,
    change_under_provocation: true,
  },
  {
    id: NPC_ACTION_ID.VAMPIRE_ATTACK,
    name: "Morsure vampirique",
    image: 14,
    change_under_Arcxos: false,
    change_under_provocation: false,
  },
  {
    id: NPC_ACTION_ID.TOAD_ATTACK,
    name: "Attrape-proie",
    image: 15,
    change_under_Arcxos: true,
    change_under_provocation: true,
  },
  {
    id: NPC_ACTION_ID.SOUL_CURSE,
    name: "Malédiction",
    image: 16,
    change_under_Arcxos: false,
    change_under_provocation: false,
  },
  {
    id: NPC_ACTION_ID.SOUL_ATTACK,
    name: "Rayon noir",
    image: 17,
    change_under_Arcxos: false,
    change_under_provocation: true,
  },
  {
    id: NPC_ACTION_ID.BLEAK_ABSORB,
    name: "Buveur de peine",
    image: 18,
    change_under_Arcxos: false,
    change_under_provocation: false,
  },
  {
    id: NPC_ACTION_ID.WOLF_ATTACK,
    name: "Morsure",
    image: 19,
    change_under_Arcxos: true,
    change_under_provocation: true,
  },
  {
    id: NPC_ACTION_ID.INVOKE_ZOMBIE,
    name: "Invocation",
    image: 20,
    change_under_Arcxos: false,
    change_under_provocation: false,
  },
  {
    id: NPC_ACTION_ID.SLAY_ZOMBIE,
    name: "Sacrifice",
    image: 21,
    change_under_Arcxos: false,
    change_under_provocation: false,
  },
  {
    id: NPC_ACTION_ID.ZONE_VAMPIRISME,
    name: "Drain de vie",
    image: 22,
    change_under_Arcxos: false,
    change_under_provocation: false,
  },
  {
    id: NPC_ACTION_ID.NECRO_BUFF,
    name: "Protection du vide",
    image: 23,
    change_under_Arcxos: false,
    change_under_provocation: false,
  },
  {
    id: NPC_ACTION_ID.MULTIPLE_DEEP_WOUND,
    name: "Blessures multiples",
    image: 1,
    change_under_Arcxos: true,
    change_under_provocation: true,
  },
  {
    id: NPC_ACTION_ID.DEEP_WOUND,
    name: "Blessure profonde",
    image: 25,
    change_under_Arcxos: true,
    change_under_provocation: true,
  },
  {
    id: NPC_ACTION_ID.BLACK_ANGEL_RESURRECT,
    name: "Résurrection",
    image: 26,
    change_under_Arcxos: false,
    change_under_provocation: false,
  },
  {
    id: NPC_ACTION_ID.ANGEL_SPELL,
    name: "Protection",
    image: 27,
    change_under_Arcxos: false,
    change_under_provocation: false,
  },
  {
    id: NPC_ACTION_ID.WHITE_ANGEL_RESURRECT,
    name: "Résurrection",
    image: 28,
    change_under_Arcxos: false,
    change_under_provocation: false,
  },
  {
    id: NPC_ACTION_ID.MULTIPLE_MAGIC_ATTACK,
    name: "Rafale magique",
    image: 29,
    change_under_Arcxos: false,
    change_under_provocation: true,
  },
  {
    id: NPC_ACTION_ID.FREEZING_RAY,
    name: "Rayon glacial",
    image: 30,
    change_under_Arcxos: false,
    change_under_provocation: true,
  },
   {
    id: NPC_ACTION_ID.USE_HP_POTION,
    name: "Bois une potion de vie",
    image: 31,
    change_under_Arcxos: false,
    change_under_provocation: false,
  },
  {
    id: NPC_ACTION_ID.USE_STR_POTION,
    name: "Bois une potion de force",
    image: 32,
    change_under_Arcxos: false,
    change_under_provocation: false,
  },

];




export const getBasicNpcAction = (id:number):BasicNpcAction => {
    const action = basicNpcActions.find((action) => action.id === id);
   
    if (!action) {
    throw new Error(
      `BasicAction introuvable : ${id}`
    );
  }

  return action;
}

export type ActionTargetType =
  | "self"
  | "pj"
  | "npc";

export type ActionType =
  | "base"
  | "ability"
  | "spell";

export type Action = {
  id: number;
  name: string;
  type: ActionType;
  image: number;
  target_type: ActionTargetType;
};

export type ActionRequest = {
  id_action: number;
  id_pj: number;
  id_target: number;
};

export type PotionRequest = {
  id_pj: number;
  id_potion: number;
  id_target: number;
};
export type AnimationName =
  | "attack"
  | "dodged"
  | "heal"
  | "shield"
  | "blocked"
  | "death"
  | "hurt"
  | "idle"
  | "potion_hp"
  | "potion_standard"
  | "change_intent"
  | "shake"

export type AnimationType =
  | "frame"
  | "overlay"
  | "death"
  | "idle"
  | "blocked"
  | "change_intent"
  | "shake"


const animationTypes: Record<
  AnimationName,
  AnimationType
> = {
  attack: "frame",
  hurt: "frame",
  dodged: "frame",
  blocked: "blocked",
  heal: "overlay",
  death: "death",
  idle: "idle",
  shield: "blocked",
  potion_hp: "overlay",
  potion_standard: "overlay",
  change_intent: "change_intent",
  shake: "shake"
};

export function getAnimationType(
  name: AnimationName
): AnimationType {
  return animationTypes[name];
}


export type AnimationEvent = {
  id: number;
  name : AnimationName;
};
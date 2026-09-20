export type AnimationName =
  | "attack"
  | "dodged"
  | "heal"
  | "athlan"
  | "fire_barrier"
  | "wings"
  | "shield"
  | "blocked"
  | "death"
  | "hurt"
  | "idle"
  | "potion_hp"
  | "potion_standard"
  | "change_intent"
  | "shake"
  | "power"

export type AnimationType =
  | "frame"
  | "overlay"
  | "death"
  | "idle"
  | "blocked"
  | "change_intent"
  | "shake"
  | "power"


const animationTypes: Record<
  AnimationName,
  AnimationType
> = {
  attack: "frame",
  hurt: "frame",
  dodged: "frame",
  blocked: "blocked",
  heal: "overlay",
  athlan: "overlay",
  fire_barrier:"overlay",
  wings:"overlay",
  death: "death",
  idle: "idle",
  shield: "blocked",
  potion_hp: "overlay",
  potion_standard: "overlay",
  change_intent: "change_intent",
  shake: "shake",
  power: "frame"
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
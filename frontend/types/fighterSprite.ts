import type { AnimationEvent } from "@shared/types/animation";
import type { NpcView, PjView } from "@shared/types/fighterView";

export type PjSprite = PjView & {
  
  animation: AnimationEvent;
};

export type NpcSprite = NpcView & {
 animation: AnimationEvent;

}

  
  

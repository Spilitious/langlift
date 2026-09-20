import { AnimationName } from "@shared/types/animation";

export const getNpcAnimationSound = (name:AnimationName, npcId: number): string => {
 
        return `/sounds/npc${npcId}/npc${npcId}-${name}.mp3`;
}
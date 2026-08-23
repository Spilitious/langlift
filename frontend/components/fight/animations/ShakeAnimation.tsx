"use client";

import { useEffect } from "react";

type ShakeAnimationProps = {
  trigger: number;
  onImpact?: () => void;
  
};

export default function ShakeAnimation({
  trigger,
  onImpact,
  
}: ShakeAnimationProps) {

  useEffect(() => {
    if (trigger === 0) return;

    

    const play = async () => {

      // Déclenche la réaction intent_change
      // après 100 ms
      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );

      
      onImpact?.();

    };

    play();

  }, [trigger, onImpact]);

  return null;
}
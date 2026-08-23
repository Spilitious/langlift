"use client";

import { useState, useEffect } from "react";
import { pjFrameAnimations} from "@/utils/animationFrame";
import type { FrameAnimationName } from "@/utils/animationFrame";

type PjFrameAnimationProps = {
   image:number;
   trigger: number;
   animationName:FrameAnimationName;
   onImpact?: () => void;
   onEnd?: () => void;
};





export default function PjFrameAnimation({
  image,
   trigger,
   onImpact,
   animationName,
   onEnd,
}: PjFrameAnimationProps) {

  const [step, setStep] = useState(0);
  const frames = pjFrameAnimations[animationName](image);
  const current = frames[step];

 
  useEffect(() => {
  if (trigger === 0) return;

  let cancelled = false;

  const hurt = async () => {
    
    await new Promise((resolve) =>
      setTimeout(resolve, 300)
    );

    if (cancelled) return;

    
    for (let i = 1; i < frames.length; i++) {

       if (i === 1) {
    onImpact?.();
  }
      setStep(i);

      await new Promise((resolve) =>
        setTimeout(resolve, frames[i].duration)
      );

      if (cancelled) return;
    }

    setStep(0);
    onEnd?.();
  };

  hurt();

  return () => {
    cancelled = true;
  };
}, [trigger]);

  return (
    <img
      src={current.image}
      alt="Personnage"
      className="fighter-sprite"
      style={{
        transform: `translate(${current.x}px, ${current.y}px)`,
        transition:
          `transform ${current.duration}ms ease-out`,
        pointerEvents: "none",
      }}
    />
  );
}
"use client";

import { useState, useEffect } from "react";

import { getPjDeathFrames} from "@/utils/animationFrame";



type PjDeathProps = {
  image:number;
   trigger: number;
   onImpact?: () => void;
   onHideUi?: () => void;
   onEnd?: () => void;
};



export default function PjDeathAnimation({
  image,
  trigger,
  onImpact,
  onHideUi,
  onEnd,
}: PjDeathProps) {
  const [step, setStep] = useState(0);
  const frames = getPjDeathFrames(image)
  const [opacity, setOpacity] = useState(1);
  const current = frames[step];
  useEffect(() => {
  if (trigger === 0) return;

   let cancelled = false;

    const death = async () => {
      setStep(0);
      setOpacity(1);

      for (let i = 0; i < frames.length; i++) {
        if (cancelled) return;

        setStep(i);

        // Première frame de réaction à l'impact
        if (i === 1) {
          onImpact?.();
        }

        setTimeout(() => {
    onHideUi?.();
  }, 1000);
  
        await new Promise((resolve) =>
          setTimeout(resolve, frames[i].duration)
        );
      }

      if (cancelled) return;

      // On garde la dernière frame et on lance le fade
      setOpacity(0);
       await new Promise((resolve) =>
  setTimeout(resolve, 800)
);

if (cancelled) return;

onEnd?.();
    };

    death();

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
        width: "240px",
        height: "160px",
        objectFit: "contain",

        opacity,

        transform: `translate(
          ${current.x}px,
          ${current.y}px
        )`,

        transition: `
          transform ${current.duration}ms ease-out,
          opacity 1500ms ease-out
        `,

        pointerEvents: "none",
      }}
    />
  );
}
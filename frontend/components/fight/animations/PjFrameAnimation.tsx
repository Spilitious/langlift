"use client";

import { useState, useEffect } from "react";
import { pjFrameAnimations } from "@/utils/animationFrame";
import type { FrameAnimationName } from "@/utils/animationFrame";

type PjFrameAnimationProps = {
  image: number;
  trigger: number;
  animationName: FrameAnimationName;
  onEnd?: () => void;
};

export default function PjFrameAnimation({
  image,
  trigger,
  animationName,
  onEnd,
}: PjFrameAnimationProps) {

  const [step, setStep] = useState(0);

  const frames =
    pjFrameAnimations[animationName](image);

  const current = frames[step];


  useEffect(() => {
    if (trigger === 0) return;

    let cancelled = false;

    const play = async () => {
      setStep(0);

      for (let i = 0; i < frames.length; i++) {
        if (cancelled) return;

        setStep(i);

        await new Promise((resolve) =>
          setTimeout(
            resolve,
            frames[i].duration
          )
        );
      }

      if (cancelled) return;

      setStep(0);
      onEnd?.();
    };

    play();

    return () => {
      cancelled = true;
    };
  }, [trigger]);

  if (!current) return null;

  return (
    <img
      src={current.image}
      alt="Personnage"
      className="fighter-sprite"
      style={{
        transform: `translate(
          ${current.x}px,
          ${current.y}px
        )`,

        transition:
          `transform ${current.duration}ms ease-out`,

        pointerEvents: "none",
      }}
    />
  );
}
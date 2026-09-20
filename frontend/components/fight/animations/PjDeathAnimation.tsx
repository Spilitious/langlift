"use client";

import { useState, useEffect } from "react";
import { getPjDeathFrames } from "@/utils/animationFrame";

type PjDeathProps = {
  image: number;
  trigger: number;
  onHideUi?: () => void;
  onEnd?: () => void;
};

export default function PjDeathAnimation({
  image,
  trigger,
  onHideUi,
  onEnd,
}: PjDeathProps) {
  const [step, setStep] = useState(0);

  const frames = getPjDeathFrames(image);
  const current = frames[step];

  useEffect(() => {
    if (trigger === 0) return;

    let cancelled = false;

    const death = async () => {
      setStep(0);

      for (let i = 0; i < frames.length; i++) {
        if (cancelled) return;

        setStep(i);

        await new Promise((resolve) =>
          setTimeout(resolve, frames[i].duration)
        );
      }

      if (cancelled) return;

      // Le PJ reste sur la dernière frame
      onHideUi?.();
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

        transform: `translate(
          ${current.x}px,
          ${current.y}px
        )`,

        transition: `
          transform ${current.duration}ms ease-out
        `,

        pointerEvents: "none",
      }}
    />
  );
}
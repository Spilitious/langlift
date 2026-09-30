"use client";

import { useState, useEffect } from "react";
import { getNpcDeathFrames } from "@/utils/animationFrame";

type NpcDeathProps = {
  image: number;
  trigger: number;
  onHideUi?: () => void;
  onEnd?: () => void;
};

export default function NpcDeathAnimation({
  image,
  trigger,
  onHideUi,
  onEnd,
}: NpcDeathProps) {
  const [step, setStep] = useState(0);
  const [opacity, setOpacity] = useState(1);

  const frames = getNpcDeathFrames(image);
  const current = frames[step];

  useEffect(() => {
    if (trigger === 0) return;

    let cancelled = false;

    const death = async () => {
      setStep(0);
      setOpacity(1);

      // Joue toutes les frames avec leurs durées propres
      for (let i = 0; i < frames.length; i++) {
        if (cancelled) return;

        setStep(i);
        if (frames[i].sound) {
            const audio = new Audio(frames[i].sound);
            audio.volume = 0.5;
            audio.play();
        }
        await new Promise((resolve) =>
          setTimeout(resolve, frames[i].duration)
        );
      }

      if (cancelled) return;

      // Fin des frames : disparition de l'UI
      onHideUi?.();

      // Fade pendant 1 seconde
      setOpacity(0);

      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
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
          opacity 1000ms ease-out
        `,

        pointerEvents: "none",
      }}
    />
  );
}
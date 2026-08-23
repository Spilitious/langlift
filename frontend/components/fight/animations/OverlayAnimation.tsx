"use client";

import { useEffect, useState } from "react";
import type { OverlayAnimationName } from "@/utils/animationFrame";
import { overlayAnimation } from "@/utils/animationFrame";


type OverlayAnimationProps = {
  trigger: number;
  animationName:OverlayAnimationName;
  onImpact?: () => void;
  onEnd?: () => void;
};

export default function OverlayAnimation({
 
  trigger,
  onImpact,
  onEnd,
  animationName,

}: OverlayAnimationProps) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  const frames = overlayAnimation[animationName];
  console.log("animationSprite", frames);
  const current = frames[step];

  useEffect(() => {
    if (trigger === 0) return;

    let cancelled = false;

    const play = async () => {
      setVisible(true);
      setStep(0);

      for (let i = 0; i < frames.length; i++) {
        if (cancelled) return;

        setStep(i);

        if (i === 1) {
          onImpact?.();
        }

        await new Promise((resolve) =>
          setTimeout(resolve, frames[i].duration)
        );
      }

      if (cancelled) return;

      setVisible(false);
      onEnd?.();
    };

    play();

    return () => {
      cancelled = true;
    };
  }, [trigger]);

  if (!visible) return null;

  return (
    <img
      src={current.image}
      alt=""
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: "180px",
        height: "180px",
        objectFit: "contain",
        transform: `translate(
          calc(-50% + ${current.x}px),
          calc(-50% + ${current.y}px)
        )`,
        pointerEvents: "none",
        zIndex: 50,
      }}
    />
  );
}
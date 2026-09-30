"use client";

import { AnimationName } from "@shared/types/animation";
import { useEffect, useState } from "react";
import { getBlockedImage } from "@/utils/spritePaths";

type NpcBlockAnimationProps = {
  trigger: number;
  animation: AnimationName;
  onEnd?: () => void;
  size?: number;
};

export default function NpcBlockAnimation({
  trigger,
  onEnd,
  animation,
  size = 150,
}: NpcBlockAnimationProps) {
  const [visible, setVisible] = useState(false);
  const [animate, setAnimate] = useState(false);

  const image = getBlockedImage(animation);
  useEffect(() => {
    if (trigger === 0) return;

    setVisible(true);
    setAnimate(false);

    // laisse une frame au navigateur avant de lancer la transition
    const start = setTimeout(() => {
      setAnimate(true);
    }, 20);

    const hide = setTimeout(() => {
      setVisible(false);
      onEnd?.();
    }, 1000);

    return () => {
      clearTimeout(start);
      clearTimeout(hide);
    };
  }, [trigger]);

  if (!visible) return null;

  return (
    <img
      src={image}
      alt="Block"
      style={{
        position: "absolute",

        left: "50%",
        top: "50%",

        width: `${size}px`,
        height: `${size}px`,
        objectFit: "contain",

        transform: animate
          ? "translate(-50%, -50%) scale(1.25)"
          : "translate(-50%, -50%) scale(1)",

        opacity: animate ? 0 : 0.75,

        transition:
          "transform 600ms ease-out, opacity 1000ms ease-out",

        pointerEvents: "none",
        zIndex: 50,
      }}
    />
  );
}
"use client";

import { useEffect, useState, useRef } from "react";

type pjBlockAnimationProps = {
  trigger: number;
  onImpact?: () => void;
  onEnd?: () => void;
  size?: number;
};

export default function PjBlockAnimation({
  trigger,
  onImpact,
  onEnd, 
  size = 150,
}: pjBlockAnimationProps) {
  const [visible, setVisible] = useState(false);
  const [animate, setAnimate] = useState(false);
  const lastImpactTrigger = useRef<number>(0);

  useEffect(() => {
    if (trigger === 0) return;

    setVisible(true);
    setAnimate(false);

    if (lastImpactTrigger.current !== trigger) {
      lastImpactTrigger.current = trigger;
      onImpact?.();
    }

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
      src="/ui/shield.png"
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
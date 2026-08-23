"use client";

import { useEffect, useState } from "react";

import type { NpcIntentView } from "../../../../shared/types/npcIntentView";
import NpcIntent from "@/components/fight/fighters/NpcIntent";

type NpcIntentChangeAnimationProps = {
  oldIntent?: NpcIntentView;
  newIntent: NpcIntentView;
  trigger: number;
  onEnd?: () => void;
};

export default function NpcIntentChangeAnimation({
  oldIntent,
  newIntent,
  trigger,
  onEnd,
}: NpcIntentChangeAnimationProps) {
  const [showNew, setShowNew] = useState(false);
  const [newVisible, setNewVisible] = useState(false);

  useEffect(() => {
    if (trigger === 0) return;

    let cancelled = false;

    const play = async () => {
      setShowNew(false);
      setNewVisible(false);

      // Fade out ancienne intent
      await new Promise((resolve) =>
        setTimeout(resolve, 600)
      );

      if (cancelled) return;

      // Monte la nouvelle intent invisible
      setShowNew(true);

      // On laisse le navigateur la rendre à opacity 0
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() =>
          requestAnimationFrame(() => resolve())
        )
      );

      if (cancelled) return;

      // Fade in
      setNewVisible(true);

      await new Promise((resolve) =>
        setTimeout(resolve, 600)
      );

      if (cancelled) return;

      onEnd?.();
    };

    play();

    return () => {
      cancelled = true;
    };
  }, [trigger]);

  return (
    <div
      style={{
        position: "absolute",
        top: "-55px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "70px",
        height: "70px",
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      {!showNew && oldIntent && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            animation:
              "intentFadeOut 600ms ease-in-out forwards",
          }}
        >
          <NpcIntent
            intent={oldIntent}
            size={70}
          />
        </div>
      )}

      {showNew && (
        <div
          style={{
            position: "absolute",
            inset: 0,

            opacity: newVisible ? 1 : 0,

            transition:
              "opacity 600ms ease-in-out",
          }}
        >
          <NpcIntent
            intent={newIntent}
            size={70}
          />
        </div>
      )}
    </div>
  );
}
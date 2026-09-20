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

      // Ancienne intention : fade out 500 ms
      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );

      if (cancelled) return;

      // Monte la nouvelle intention invisible
      setShowNew(true);

      // Laisse React / navigateur afficher opacity 0
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() =>
          requestAnimationFrame(() => resolve())
        )
      );

      if (cancelled) return;

      // Nouvelle intention : fade in 500 ms
      setNewVisible(true);

      await new Promise((resolve) =>
        setTimeout(resolve, 500)
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
      //  position: "absolute",
       
       // transform: "translateX(-50%)",
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
              "intentFadeOut 500ms ease-in-out forwards",
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
              "opacity 500ms ease-in-out",
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
"use client";

import { useState, useEffect } from "react";

import {
  npcFrameAnimations,
} from "@/utils/animationFrame";

import type {
  FrameAnimationName,
} from "@/utils/animationFrame";


type NpcFrameAnimationProps = {
  image: number;
  animationName: FrameAnimationName;
  trigger: number;

  onImpact?: () => void;
  onEnd?: () => void;
};


export default function NpcFrameAnimation({
  image,
  animationName,
  trigger,
  onImpact,
  onEnd,
}: NpcFrameAnimationProps) {

  const [step, setStep] = useState(0);

  const frames =
    npcFrameAnimations[animationName](image);

  const current = frames[step];


  useEffect(() => {
    if (trigger === 0) return;

    let cancelled = false;

    const play = async () => {

      setStep(0);

      // Petite attente initiale
      await new Promise((resolve) =>
        setTimeout(resolve, 300)
      );

      if (cancelled) return;


      for (
        let i = 1;
        i < frames.length;
        i++
      ) {
        setStep(i);

        if (i === 1) {
          onImpact?.();
        }

        await new Promise((resolve) =>
          setTimeout(
            resolve,
            frames[i].duration
          )
        );

        if (cancelled) return;
      }


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
      draggable={false}
      className="fighter-sprite"

      style={{
        width: "240px",
        height: "160px",

        objectFit: "contain",

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
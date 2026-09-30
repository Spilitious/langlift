"use client";

import { useState, useEffect } from "react";

import {
  npcFrameAnimations,
} from "@/utils/animationFrame";

import type {
  FrameAnimationName,
} from "@/utils/animationFrame";

import {getNpcAnimationSound} from "../../../utils/animationSound"

type NpcFrameAnimationProps = {
  image: number;
  animationName: FrameAnimationName;
  trigger: number;
  onEnd?: () => void;
};


export default function NpcFrameAnimation({
  image,
  animationName,
  trigger,
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

      for (
        let i = 0;
        i < frames.length;
        i++
      ) {
        if (cancelled) return;

        setStep(i);
         if (frames[i].sound) {
            const audio = new Audio(frames[i].sound);
            audio.volume = 0.5;

            audio.play();
        }

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
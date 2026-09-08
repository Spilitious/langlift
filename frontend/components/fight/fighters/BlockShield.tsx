"use client";

import { useEffect, useRef, useState } from "react";

type BlockShieldProps = {
  block: number;
  size?: number;
};

export default function BlockShield({
  block,
  size = 60,
}: BlockShieldProps) {
  const previousBlock = useRef(block);

  const [displayBlock, setDisplayBlock] = useState(block);
  const [impact, setImpact] = useState(false);

 useEffect(() => {
  const oldValue = previousBlock.current;

  if (block !== oldValue) {
    setImpact(true);

    let currentValue = oldValue;

    const direction = block > oldValue ? 1 : -1;

    const interval = setInterval(() => {
      currentValue += direction;

      const finished =
        direction > 0
          ? currentValue >= block
          : currentValue <= block;

      if (finished) {
        currentValue = block;
        clearInterval(interval);

        setTimeout(() => {
          setImpact(false);
        }, 150);
      }

      setDisplayBlock(currentValue);
    }, 60);

    previousBlock.current = block;

    return () => clearInterval(interval);
  }

}, [block]);

  return (
    <div
      style={{
        position: "relative",

        width: `${size}px`,
        height: `${size}px`,

        flexShrink: 0,

        transform: impact
          ? "scale(1.25)"
          : "scale(1)",

        transition:
          "transform 250ms ease-out",

        zIndex: 2,
      }}
    >
      <img
        src="/ui/shield.png"
        alt="Block"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",

          userSelect: "none",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          color: "black",
          fontSize: `${size * 0.35}px`,
          fontWeight: "bold",

          pointerEvents: "none",

          // léger décalage vers le haut car le bouclier finit en pointe
          paddingBottom: `${size * 0.08}px`,
        }}
      >
        {displayBlock}
      </div>
    </div>
  );
}
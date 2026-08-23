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

    // Si le block baisse
    if (block < oldValue) {
      setImpact(true);

      let currentValue = oldValue;

      const interval = setInterval(() => {
        currentValue -= 1;

        if (currentValue <= block) {
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

    // Si le block augmente, pas forcément besoin d'animation pour l'instant
    setDisplayBlock(block);
    previousBlock.current = block;
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
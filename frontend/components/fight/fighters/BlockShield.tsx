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

  const [showDetail, setShowDetail] = useState(false);

const hoverTimeoutRef =
  useRef<ReturnType<typeof setTimeout> | null>(null);

const handleMouseEnter = () => {
  hoverTimeoutRef.current = setTimeout(() => {
    setShowDetail(true);
  }, 1000);
};

const handleMouseLeave = () => {
  if (hoverTimeoutRef.current) {
    clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = null;
  }

  setShowDetail(false);
};

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
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
  style={{
    position: "relative",
    width: `${size}px`,
    height: `${size}px`,
    flexShrink: 0,

    transform: impact
      ? "scale(1.25)"
      : "scale(1)",

    transition: "transform 250ms ease-out",
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
          fontSize: `${size * 0.25}px`,
          fontWeight: "bold",

          pointerEvents: "none",

          // léger décalage vers le haut car le bouclier finit en pointe
          paddingBottom: `${size * 0.08}px`,
        }}
      >
        {displayBlock}
      </div>


      {showDetail && (
      <div
        style={{
          position: "absolute",
          bottom: `${size + 5}px`,
          left: "50%",
          transform: "translateX(-50%)",

          width: "300px",
          padding: "8px",

          background: "rgba(10, 10, 15, 0.95)",
          border: "1px solid #c9a35d",
          borderRadius: "5px",

          color: "#d6aa5d",
          fontWeight: "bold",
          fontSize: "16px",
          textAlign: "center",

          pointerEvents: "none",
          zIndex: 1000,
        }}
      >
      Points de bouclier
      
      <div
          style={{
            textAlign: "center",
            fontWeight: "normal",
            color: "white",
            fontSize: "12px",
            marginBottom: "6px",
          }}
      >
        Les points de bouclier absorbe les dégâts.
        Ils peuvent être générés par une action ou automatiquement par l'armure en début de tour.
        A la fin de tour, les points de bouclier sont perdus
        </div>
        
            
       
  </div>
)}
    </div>
  );
}
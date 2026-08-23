import { useState, useEffect } from "react";

type HealthBarProps = {
  hp: number;
  maxHp: number;
  width?: number;
};

export default function HealthBar({
  hp,
  maxHp,
  width = 180,
}: HealthBarProps) {
  const [displayHp, setDisplayHp] = useState(hp);

  useEffect(() => {
    const startHp = displayHp;
    const difference = hp - startHp;

    if (difference === 0) return;

    const duration = 550;
    const startTime = performance.now();

    let animationFrame: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;

      const progress = Math.min(
        elapsed / duration,
        1
      );

      const newHp =
        startHp + difference * progress;

      setDisplayHp(newHp);

      if (progress < 1) {
        animationFrame =
          requestAnimationFrame(animate);
      } else {
        setDisplayHp(hp);
      }
    };

    animationFrame =
      requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [hp]);

  
  const hpPercent = Math.max(
  0,
  Math.min(
    100,
    (displayHp / maxHp) * 100
  )
);



  return (
    <div
      style={{
        position: "relative", // important pour positionner le texte
        width: `${width}px`,
        height: "18px",

        background: "white",
        border: "3px solid black",
        borderRadius: "3px",

        boxShadow: `
          inset 0 2px 0 rgba(255,255,255,0.8),
          inset 0 -2px 0 rgba(0,0,0,0.25),
          0 3px 0 rgba(0,0,0,0.7)
        `,

        overflow: "hidden",
      }}
    >
      {/* Barre rouge */}
      <div
        style={{
          width: `${hpPercent}%`,
          height: "100%",
          background: "#db0000",

          boxShadow: `
            inset 0 3px 2px rgba(255,255,255,0.25),
            inset 0 -3px 3px rgba(0,0,0,0.45)
          `,

          transition: "width 550ms ease-out",
        }}
      />

      {/* Texte HP */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,

          width: "100%",
          height: "100%",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          color: "black",
          fontSize: "12px",
          fontWeight: "bold",

          pointerEvents: "none",
        }}
      >
        {Math.round(displayHp)}/{maxHp} HP
      </div>
    </div>
  );
}
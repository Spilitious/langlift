import { useState, useEffect, useRef } from "react";

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
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    style={{
      position: "relative",
      width: `${width}px`,
      height: "18px",
      overflow: "visible",
    }}
  >
    {/* BARRE */}
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",

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
      <div
        style={{
          width: `${hpPercent}%`,
          height: "100%",
          background: "#db0000",

          boxShadow: `
            inset 0 3px 2px rgba(255,255,255,0.25),
            inset 0 -3px 3px rgba(0,0,0,0.45)
          `,
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
          fontSize: "12px",
          fontWeight: "bold",

          pointerEvents: "none",
        }}
      >
        {Math.round(displayHp)}/{maxHp} HP
      </div>
    </div>

    {/* TOOLTIP */}
    {showDetail && (
      <div
        style={{
          position: "absolute",
          bottom: "30px",
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
        Barre de vie
      </div>
    )}
  </div>
);
}

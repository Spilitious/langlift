"use client";

import { useEffect, useRef, useState } from "react";
import type { BmView } from "../../../../shared/types/bmView";
import { getBmImagePath } from "@/utils/spritePaths";
import BmDetail from "./BmDetail";

type BmItemProps = {
  bm: BmView;
  
   
   onDisappear?: () => void;
};
function BmItem({
  bm,
 
  onDisappear,
}: BmItemProps) {

  const mainValue = getBmMainValue(bm);
  const lifeValue = bm.life;

  const previousMainValue = useRef(mainValue);
  const previousLifeValue = useRef(lifeValue);

  const [displayMainValue, setDisplayMainValue] =
    useState(mainValue);

  const [displayLifeValue, setDisplayLifeValue] =
    useState(lifeValue);

  const [impact, setImpact] = useState(false);
  const [fading, setFading] = useState(false);
  const [visible, setVisible] = useState(true);

  const size = 36;

  const [showTooltip, setShowTooltip] = useState(false);

  const tooltipTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    
    tooltipTimeoutRef.current = setTimeout(() => {
    setShowTooltip(true);
  }, 1000);
  };

  const handleMouseLeave = () => {
    if (tooltipTimeoutRef.current) {
    clearTimeout(tooltipTimeoutRef.current);
    tooltipTimeoutRef.current = null;
  }

  setShowTooltip(false);
};


  const impactTimeoutRef =
  useRef<ReturnType<typeof setTimeout> | null>(null);

const triggerImpact = () => {
  if (impactTimeoutRef.current) {
    clearTimeout(impactTimeoutRef.current);
  }

  setImpact(false);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setImpact(true);

      impactTimeoutRef.current = setTimeout(() => {
        setImpact(false);
        impactTimeoutRef.current = null;
      }, 200);
    });
  });
};

useEffect(() => {
  return () => {
    if (impactTimeoutRef.current) {
      clearTimeout(impactTimeoutRef.current);
    }
  };
}, []);

  // =========================
  // CHANGEMENT DU BM
  // =========================
useEffect(() => {
  const oldMainValue =
    previousMainValue.current;

  const oldLifeValue =
    previousLifeValue.current;

  const mainChanged =
    mainValue !== oldMainValue;

  const lifeChanged =
    lifeValue !== oldLifeValue;

  if (!mainChanged && !lifeChanged) {
    return;
  }
 
  setVisible(true);

setFading(false);
triggerImpact();


  // =========================
  // ANIMATION MAIN STAT
  // =========================

  if (mainChanged) {
    let currentValue = oldMainValue;

    const direction =
      mainValue > oldMainValue ? 1 : -1;

    const interval = setInterval(() => {
      currentValue += direction;

      setDisplayMainValue(currentValue);

      if (currentValue === mainValue) {
        clearInterval(interval);
      }
    }, 100);
  }

  // =========================
  // ANIMATION LIFE
  // =========================

  if (lifeChanged) {
    let currentLife = oldLifeValue;

    const direction =
      lifeValue > oldLifeValue ? 1 : -1;

    const interval = setInterval(() => {
      currentLife += direction;

      setDisplayLifeValue(currentLife);

      if (currentLife === lifeValue) {
        clearInterval(interval);
      }
    }, 100);
  }

  previousMainValue.current = mainValue;
  previousLifeValue.current = lifeValue;

  // =========================
  // DISPARITION
  // =========================


 const shouldDisappear =
  (bm.display === "normal" && mainValue === 0) || 
  (bm.life ===0) || 
  (bm.display === "life" && lifeValue === 0) ||
  (bm.display === "both" &&
    (mainValue === 0 || lifeValue === 0));
    

  if (shouldDisappear) {
    const maxDistance = Math.max(
      Math.abs(mainValue - oldMainValue),
      Math.abs(lifeValue - oldLifeValue)
    );

    // Attend la fin du décompte
    const animationDuration =
      maxDistance * 100;

    const fadeTimeout = setTimeout(() => {
      setFading(true);
    }, animationDuration + 150);

    const removeTimeout = setTimeout(() => {
      setVisible(false);
      onDisappear?.();
    }, animationDuration + 500);

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(removeTimeout);
    };
  }

  


}, [
  mainValue,
  lifeValue,
  bm.display,

]);

  // =========================
  // APPARITION
  // =========================

  useEffect(() => {
  triggerImpact();
}, []);

  if (!visible) {
    return null;
  }

  return (
   <div
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
  style={{
    position: "relative",

    width: `${size}px`,
    height: `${size}px`,

    transform: impact
      ? "scale(1.3)"
      : "scale(1)",

    opacity: fading ? 0 : 1,

    transition: `
      transform 200ms ease-out,
      opacity 350ms ease-out
    `,
  }}
>

      <img
        src={getBmImagePath(bm.image)}
        alt={bm.name}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />

    
   {showTooltip && (
  <BmDetail bm={bm} />
)}
 

      {/* =========================
          MAIN STAT - GAUCHE
         ========================= */}

      {(bm.display === "normal" ||
        bm.display === "both") && (

        <span
          style={{
            position: "absolute",
            left: "-4px",
            bottom: "-2px",

            width: "17px",
            height: "17px",
            borderRadius: "50%",

            background: "black",
            border: "1px solid white",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            color: "red",
            fontSize: "11px",
            fontWeight: "bold",
          }}
        >
          {displayMainValue}
        </span>
      )}

      {/* =========================
          LIFE - DROITE
         ========================= */}

      {(bm.display === "life" ||
        bm.display === "both") && (

        <span
          style={{
            position: "absolute",
            right: "-4px",
            bottom: "-2px",

            width: "17px",
            height: "17px",
            borderRadius: "50%",

            background: "black",
            border: "1px solid white",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            color: "white",
            fontSize: "11px",
            fontWeight: "bold",
          }}
        >
          {displayLifeValue}
        </span>
      )}

    </div>
  );
}

type BmProps = {
  bms: BmView[];
  armor?: number;
  
 
};
export default function Bm({
  bms,
 
  armor,
 
}: BmProps) {

  
  const armorBm: BmView = {
  id: -1,
  basicBmId:-1,
  image: 1,
  name: "Armure",
  life: -1,
  display: "normal",
  mainStat:"armor",
  bonus: {armor}, };

  const visualBms: BmView[] = [
 
  ...(armor !== 0 ? [armorBm] : []),
   ...bms,
  ];

  const size=36;
  const [displayedBms, setDisplayedBms] =   useState<BmView[]>(visualBms);

    

  useEffect(() => {
    setDisplayedBms((current) => {
      const result: BmView[] = [];

      // BM présents dans le nouvel état
      for (const newBm of visualBms) {
        result.push(newBm);
      }

      // BM qui viennent de disparaître :
      // on les conserve temporairement avec value = 0
     for (const oldBm of current) {
  const stillExists = visualBms.some(
    (bm) => bm.id === oldBm.id
  );

  if (!stillExists) {
    result.push(zeroBmDisplayValue(oldBm));
  }
}

      return result;
    });
  }, [bms, armor]);

 
  const removeBm = (id: number) => {
    setDisplayedBms((current) =>
      current.filter((bm) => bm.id !== id)
    );
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(5, ${size}px)`,
        gap: "6px",
      }}
    >
      {displayedBms.filter((bm) => bm.display !== "none")
                    .map((bm) => (
        <BmItem
          key={bm.id}
          bm={bm}
         
          onDisappear={() => removeBm(bm.id)}
        />
      ))}
    </div>
  );
}

function getBmMainValue(bm: BmView): number {
  return bm.bonus[bm.mainStat] ?? 0;
}
function zeroBmDisplayValue(
  bm: BmView
): BmView {

  switch (bm.display) {

    case "normal":
      return {
        ...bm,
        bonus: {
          ...bm.bonus,
          [bm.mainStat]: 0,
        },
      };

    case "empty":
    case "life":
      return {
        ...bm,
        life: 0,
      };

    case "both":
      return {
        ...bm,
        life: 0,
        bonus: {
          ...bm.bonus,
          [bm.mainStat]: 0,
        },
      };

  
   

    case "none":
      return bm;
  }
}
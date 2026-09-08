"use client";

import { useEffect, useRef, useState } from "react";
import type { BmView } from "../../../../shared/types/bmView";
import { getBmImagePath } from "@/utils/spritePaths";

type BmItemProps = {
  bm: BmView;
  size: number;
   
   onDisappear?: () => void;
};

function BmItem({ bm, size, onDisappear }: BmItemProps) {

  const value = getBmDisplayValue(bm);
  const previousValue = useRef(value);

  const [displayValue, setDisplayValue] = useState(value);
  const [impact, setImpact] = useState(false);
  const [fading, setFading] = useState(false);
  
  const [visible, setVisible] = useState(value !== 0);

  useEffect(() => {
  const oldValue = previousValue.current;
  const newValue = value;

  if (newValue === oldValue) return;

  setVisible(true);
  setImpact(true);
  setFading(false);

  let currentValue = oldValue;
  
  const direction = newValue > oldValue ? 1 : -1;

  const interval = setInterval(() => {
    currentValue += direction;

    setDisplayValue(currentValue);

    if (currentValue === newValue) {
      clearInterval(interval);

      if (newValue === 0) {
        setTimeout(() => {
          setFading(true);
        }, 150);

        setTimeout(() => {
          setVisible(false);
           onDisappear?.();
        }, 500);
      } else {
        setTimeout(() => {
          setImpact(false);
        }, 150);
      }
    }
  }, 100);

  previousValue.current = newValue;

  return () => {
    clearInterval(interval);
  };
}, [value]);
useEffect(() => {
  if (value === 0) return;

  const start = requestAnimationFrame(() => {
    setImpact(true);

    setTimeout(() => {
      setImpact(false);
    }, 200);
  });

  return () => cancelAnimationFrame(start);
}, []);

  if (!visible) {
    return null;
  }

  return (
    <div
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
        {displayValue}
      </span>
    </div>
  );
}

type BmProps = {
  bms: BmView[];
  armor?: number;
  size?: number;
 
};
export default function Bm({
  bms,
  size = 32,
  armor,
 
}: BmProps) {

  
  const armorBm: BmView = {
  id: -1,
  image: 1,
  name: "Armure",
  life: -1,
  display: "armor",
  bonus: {armor}, };

  const visualBms: BmView[] = [
  ...bms,
  ...(armor !== 0 ? [armorBm] : []),
  ];


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
        gap: "4px",
      }}
    >
      {displayedBms.filter((bm) => bm.display !== "none")
                    .map((bm) => (
        <BmItem
          key={bm.id}
          bm={bm}
          size={size}
          onDisappear={() => removeBm(bm.id)}
        />
      ))}
    </div>
  );
}

function getBmDisplayValue(bm: BmView): number {
  if (bm.display === "none") {
    return 0;
  }

  if (bm.display === "life") {
    return bm.life;
  }

  return bm.bonus[bm.display] ?? 0;
}

function zeroBmDisplayValue(bm: BmView): BmView {
  if (bm.display === "none") {
    return bm;
  }

  if (bm.display === "life") {
    return {
      ...bm,
      life: 0,
    };
  }

  return {
    ...bm,
    bonus: {
      ...bm.bonus,
      [bm.display]: 0,
    },
  };
}
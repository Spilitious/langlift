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
  const previousValue = useRef(bm.value);

  const [displayValue, setDisplayValue] = useState(bm.value);
  const [impact, setImpact] = useState(false);
  const [fading, setFading] = useState(false);
  const [visible, setVisible] = useState(bm.value > 0);

  useEffect(() => {
  const oldValue = previousValue.current;
  const newValue = bm.value;

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
}, [bm.value]);

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
  size?: number;
 
};
export default function Bm({
  bms,
  size = 32,
 
}: BmProps) {
  const [displayedBms, setDisplayedBms] =
  
    useState<BmView[]>(bms);

  useEffect(() => {
    setDisplayedBms((current) => {
      const result: BmView[] = [];

      // BM présents dans le nouvel état
      for (const newBm of bms) {
        result.push(newBm);
      }

      // BM qui viennent de disparaître :
      // on les conserve temporairement avec value = 0
      for (const oldBm of current) {
        const stillExists = bms.some(
          (bm) => bm.id === oldBm.id
        );

        if (!stillExists) {
          result.push({
            ...oldBm,
            value: 0,
          });
        }
      }

      return result;
    });
  }, [bms]);

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
      {displayedBms.map((bm) => (
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
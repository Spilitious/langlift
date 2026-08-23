"use client";

import { useEffect, useState } from "react";
import { FightPopupData } from "../../../../shared/types/fightPopUp";

type FightPopUpProps = {
  details:FightPopupData
  x: number;
  y: number;
  trigger: number;
  onEnd: () => void;
};


export default function FightPopUp({
  details,
  x,
  y,
  trigger,
  onEnd,
}: FightPopUpProps) {
  const [visible, setVisible] = useState(false);
  const [animate, setAnimate] = useState(false);

  

const colors = {
  damage: "red",
  dodge: "blue",
  block: "green",
  heal: "green"
};

    const color = colors[details.type];

  useEffect(() => {
    // Au chargement de la page : rien ne s'affiche
    if (trigger === 0) return;

    setVisible(true);
    setAnimate(false);

    // Laisse le navigateur afficher la position initiale
    const startAnimation = setTimeout(() => {
      setAnimate(true);
    }, 20);

    // Puis on retire complètement le texte
    const hide = setTimeout(() => {
      setVisible(false);
    }, 1000);

    return () => {
      clearTimeout(startAnimation);
      clearTimeout(hide);
    };
  }, [trigger]);

  if (!visible) {
    return null;
  }

  setTimeout(() => {
  onEnd();
}, 1000);

  return (
    <div
      style={{
         position: "absolute",
         left: `${x+8}%`,
         top: `${y}%`,
  //  transform: "translate(-50%, -50%)",
  

        fontSize: "32px",
        fontWeight: "bold",
        color,
        textShadow: "2px 2px 3px black",

        pointerEvents: "none",

        opacity: animate ? 0 : 1,
         transform: animate
        ? "translate(-50%, -80%)"
        : "translate(-50%, 0)",
        zIndex:100,
        transition:
          "transform 1000ms ease-out, opacity 1000ms ease-out",
      }}
    >
      {details.text}
    </div>
  );
}
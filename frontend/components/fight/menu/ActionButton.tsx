"use client";

import { useState, useRef } from "react";
import type { AbilityView } from "@shared/types/abilityView";
import ActionTooltip from "./ActionToolTip";
import { getActionImagePath } from "@/utils/spritePaths";
import type { PjView } from "@shared/types/fighterView";

type ActionButtonProps = {
  image:string;
   action?: AbilityView;
   pj: PjView;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
};

export default function ActionButton({
  image,
  action,
  selected,
  pj,
  onClick,
  disabled = false,
}: ActionButtonProps) {
  const [hover, setHover] = useState(false);

  const [showTooltip, setShowTooltip] = useState(false);

const hoverTimeoutRef =
  useRef<ReturnType<typeof setTimeout> | null>(null);
const handleMouseEnter = () => {
  if (!disabled) {
    setHover(true);
  }

  if (!action) return;

  hoverTimeoutRef.current = setTimeout(() => {
    setShowTooltip(true);
  }, 1000);
};

const handleMouseLeave = () => {
  setHover(false);

  if (hoverTimeoutRef.current) {
    clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = null;
  }

  setShowTooltip(false);
};

 const handleClick = () => {
      const audio = new Audio(`/sounds/click.mp3`);
      audio.volume = 0.3;
      audio.play();
      onClick();
  }

const handlePointerDown = () => {
  if (hoverTimeoutRef.current) {
    clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = null;
  }

  setShowTooltip(false);
};

  return (
    <div
       onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
  onPointerDown={handlePointerDown}
   style={{
      position: "relative",
      width: "80px",
      height: "80px",
    }}
    >
    <button
      onClick={handleClick}
      style={{
        padding: 0,
        border: "none",
        background: "transparent",
        cursor: 'url("/ui/cursor/cursor6.png") 0 0, pointer',

        width: "80px",
        height: "80px",
      }}
    >
      {/* Corps / tranche du bouton */}
      <div
        style={{
          width: "74px",
          height: "74px",

          padding: "4px",

          borderRadius: "8px",

          background: selected
            ? "#4a3218"
            : "#9a7435",

          boxShadow: selected
            ? `
                inset 4px 4px 5px #24170b,
                inset -2px -2px 3px #c89b51
              `
            : `
                4px 5px 0 #3b2814,
                6px 7px 6px rgba(0,0,0,0.5)
              `,

          transform: selected
            ? "translate(4px, 5px)"
            : "translate(0, 0)",

          transition:
            "transform 80ms ease, box-shadow 80ms ease",
        }}
      >
        {/* Face du bouton */}
        <div
          style={{
            width: "100%",
            height: "100%",

            boxSizing: "border-box",
            overflow: "hidden",

            borderRadius: "5px",

            borderTop: selected
              ? "3px solid #33200d"
              : "3px solid #d6aa5d",

            borderLeft: selected
              ? "3px solid #33200d"
              : "3px solid #d6aa5d",

            borderRight: selected
              ? "3px solid #c29145"
              : "3px solid #563919",

            borderBottom: selected
              ? "3px solid #c29145"
              : "3px solid #563919",

            background: "#172033",

            filter: disabled
             ? "grayscale(1) brightness(0.55)"
            : selected || hover
              ? "brightness(1.2)"
            : "brightness(1)",

           boxShadow: disabled
            ? "inset 2px 2px 5px rgba(0,0,0,0.6)"
          : selected
          ? "inset 4px 4px 8px rgba(0,0,0,0.65)"
          : hover
            ? "0 0 10px rgba(255,210,80,0.8)"
          : "none",

            opacity: disabled ? 0.65 : 1,
            transition:
              "filter 120ms ease, box-shadow 120ms ease",
          }}
        >
          <img
            src={image}
            alt=""
            draggable={false}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              pointerEvents: "none",

              // Le contenu s'enfonce aussi légèrement
              transform: selected
                ? "translate(2px, 2px)"
                : "translate(0, 0)",

              transition: "transform 80ms ease",
            }}
          />
        </div>
      </div>
    </button>
    {showTooltip && action && (
  <ActionTooltip action={action} pj={pj} />
)}
</div>
  );
}
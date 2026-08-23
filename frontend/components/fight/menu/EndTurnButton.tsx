"use client";

import { useState } from "react";

type EndTurnButtonProps = {
  
  onClick: () => void;
  disabled: boolean;
};

export default function EndTurnButton({
  
  onClick,
  disabled=false,
}: EndTurnButtonProps) {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);

  const image = pressed 
    ? "/ui/endTurn-pressed.png"
    : hover
    ? "/ui/endTurn-hover.png"
    : "/ui/endTurn-idle.png";

 return (
  <button
    onClick={onClick}
  disabled={disabled}

  onMouseEnter={() => {
    if (!disabled) setHover(true);
  }}

  onMouseLeave={() => {
    setHover(false);
    setPressed(false);
  }}

  onMouseDown={() => {
    if (!disabled) setPressed(true);
  }}

  onMouseUp={() => {
    if (!disabled) setPressed(false);
  }}

    style={{
      width: "200px",
      height: "80px",

      padding: 0,
      border: "none",
      background: "transparent",

      cursor: disabled
      ? "none"
      : "pointer",

    pointerEvents: disabled
      ? "none"
      : "auto",

    
    }}
  >
    <img
      src={image}
      alt="EndTurnButton"
      draggable={false}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
        display: "block",
      }}
    />
  </button>
);
}
"use client";

import { useState } from "react";

type NextButtonProps = {
  
  onClick: () => void;
};

export default function NextButton({
  
  onClick,
}: NextButtonProps) {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);

  const image = pressed 
    ? "/ui/fight-pressed.png"
    : hover
    ? "/ui/fight-hover.png"
    : "/ui/fight-idle.png";

 return (
  <button
    onClick={onClick}
    onMouseEnter={() => setHover(true)}
    onMouseLeave={()  => {setHover(false); setPressed(false)}}
    onMouseDown={() => setPressed(true)}
    onMouseUp={() => setPressed(false)}
    
    style={{
      width: "200px",
      height: "80px",

      padding: 0,
      border: "none",
      background: "transparent",

      cursor: "pointer",
      overflow: "hidden",
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
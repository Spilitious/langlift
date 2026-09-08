"use client";

import { useState } from "react";

type MainButtonProps = {
  onClick: () => void;
  name:string;
  disabled?: boolean;

};

export default function MainButton({
  onClick,
  disabled = false,
  name,
}: MainButtonProps) {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);


  const image =
    !disabled && pressed
      ? `/button/button-${name}-pressed.png`
      : !disabled && hover
      ? `/button/button-${name}-hover.png`
      : `/button/button-${name}-idle.png`;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
     // className="clickable"
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

       // cursor: disabled
       // ? "not-allowed"
       // : 'url("/ui/cursor/cursor6.png") 0 0, pointer',
       
        overflow: "hidden",

        opacity: disabled ? 0.45 : 1,
        filter: disabled
          ? "grayscale(70%) brightness(60%)"
          : "none",

        transition:
          "opacity 150ms ease, filter 150ms ease",
      }}
    >
      <img
        src={image}
        alt="Valider"
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
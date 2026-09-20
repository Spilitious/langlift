"use client";

import { useState } from "react";

interface MainMenuButtonProps {
  id: string;
  text: string;
  onClick: (
    event: React.MouseEvent<HTMLElement>
  ) => void;
}

export default function MainMenuButton({
  id,
  text,
  onClick,
}: MainMenuButtonProps) {

  const [isEnabled] = useState(true);

  const [currentState, setCurrentState] =
    useState<
      "up" | "over" | "down" | "disabled"
    >("up");

  const images = {
    up: "/button/button-main-idle.png",
    over: "/button/button-main-hover.png",
    down: "/button/button-main-pressed.png",
    disabled: "/Button/Button7.png",
  };

  const handleMouseDown = () => {
    if (!isEnabled) return;

    setCurrentState("down");
  };

  const handleMouseOver = () => {
    if (!isEnabled) return;

    setCurrentState("over");
  };

  const handleMouseOut = () => {
    if (!isEnabled) return;

    setCurrentState("up");
  };

  return (
    <div
      id={id}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      style={{
        position: "relative",

        width: "300px",
        height: "80px",

        display: "inline-block",

        userSelect: "none",
        cursor: isEnabled
          ? "pointer"
          : "default",
      }}
    >
      {/* IMAGE DU BOUTON */}

      <img
        src={images[currentState]}
        alt=""
        draggable={false}
        style={{
          width: "300px",
          height: "80px",
          display: "block",
        }}
      />

      {/* TEXTE */}

      <div
        style={{
          position: "absolute",
          inset: 0,

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          fontFamily: "Chiller",
          fontSize: "40px",
          textAlign: "center",

          color: isEnabled
            ? "#9d8345"
            : "#696969",

          fontStyle: isEnabled
            ? "normal"
            : "italic",

          pointerEvents: "none",
        }}
      >
        {text}
      </div>
    </div>
  );
}
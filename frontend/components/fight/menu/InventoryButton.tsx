"use client";

import { useState } from "react";

type InventoryButtonProps = {
  open: boolean;
  onClick: () => void;
};

export default function InventoryButton({
  open,
  onClick,
}: InventoryButtonProps) {
  const [hover, setHover] = useState(false);

  const image = open
    ? "/ui/inventory-button-pressed.png"
    : hover
    ? "/ui/inventory-button-hover.png"
    : "/ui/inventory-button-idle.png";

 return (
  <button
    onClick={onClick}
    onMouseEnter={() => setHover(true)}
    onMouseLeave={() => setHover(false)}
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
      alt="Inventaire"
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
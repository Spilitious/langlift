"use client";

import { useState } from "react";

type ActionButtonProps = {
  image: string;
  selected: boolean;
  onClick: () => void;
};

export default function ActionButton({
  image,
  selected,
  onClick,
}: ActionButtonProps) {
  const [hover, setHover] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: 0,
        border: "none",
        background: "transparent",
        //cursor: ""

        width: "86px",
        height: "86px",
      }}
    >
      {/* Corps / tranche du bouton */}
      <div
        style={{
          width: "80px",
          height: "80px",

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

            filter:
              selected || hover
                ? "brightness(1.2)"
                : "brightness(1)",

            boxShadow: selected
              ? "inset 4px 4px 8px rgba(0,0,0,0.65)"
              : hover
                ? "0 0 10px rgba(255,210,80,0.8)"
                : "none",

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
  );
}
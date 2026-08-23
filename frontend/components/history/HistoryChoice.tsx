"use client";

import { useState } from "react";
import NextButton from "./NextButton";
import FightButton from "./FightButton";

import type {
  HistoryChoice as HistoryChoiceType,
  HistoryDestination,
} from "../../../shared/types/history";

type HistoryChoiceProps = {
  choice: HistoryChoiceType;
  onChoice: (destination: HistoryDestination) => void;
};

type ChoiceButtonProps = {
  text: string;
  onClick: () => void;
};

function ChoiceButton({
  text,
  onClick,
}: ChoiceButtonProps) {
  const [hover, setHover] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",

        width: "100%",
        minHeight: "45px",

        display: "flex",
        alignItems: "center",

        // On réserve la place pour la flèche
        padding: "8px 15px 8px 55px",

        background: hover
          ? "rgba(232, 215, 165, 0.12)"
          : "transparent",

        border: "none",

        color: hover
  ? "#f0c35a"
  : "#c18a32",

        fontSize: "20px",
        fontFamily: "Georgia, serif",
        fontWeight: "bold",

        cursor: "pointer",
        textAlign: "left",
        whiteSpace: "normal",
        lineHeight: "1.4",

        transition:
          "background 200ms ease, color 200ms ease",
      }}
    >
      {/* FLÈCHE DE SÉLECTION */}
      {hover && (
        <img
          src="/ui/choice-arrow.png"
          alt=""
          draggable={false}
          style={{
            position: "absolute",

            left: "5px",
            top: "50%",

            width: "40px",
            height: "28px",

            objectFit: "contain",

            transform: "translateY(-50%)",

            pointerEvents: "none",
          }}
        />
      )}

      {text}
    </button>
  );
}

export default function HistoryChoice({
  choice,
  onChoice,
}: HistoryChoiceProps) {

  // Aucun choix
  if (choice.choices.length === 0) {
    return null;
  }

  // Un seul choix → bouton SUITE
  if (choice.choices.length === 1) {
    if(choice.choices[0].text === "Next")
    {
        const currentChoice = choice.choices[0];
         return (
        <NextButton
            onClick={() =>
            onChoice(currentChoice.destination)
            }
        />
    );
    }
    else
    {
    const currentChoice = choice.choices[0];
         return (
        <FightButton
            onClick={() =>
            onChoice(currentChoice.destination)
            }
        />
    );
    }



    }
  // Plusieurs choix
  return (
    <div
      style={{
        width: "100%",

        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",

        gap: "8px",
      }}
    >
      {choice.choices.map(
        (currentChoice, index) => (
          <ChoiceButton
            key={index}
            text={currentChoice.text}
            onClick={() =>
              onChoice(
                currentChoice.destination
              )
            }
          />
        )
      )}
    </div>
  );
}
"use client";

import {useState } from "react";
import {learnAttribut} from "@/utils/api/levelUpApi"
import MainButton from "../button/MainButton";
import { PjView } from "@shared/types/fighterView";
import { useGame } from "@/context/GameContext";
import LevelUpConfirmation from "./LevelUpConfirmation";
import { BaseAttributes } from "@shared/types/label";


type LevelUpAttributeProps = {
  pj: PjView;
  onClose: () => void;
};

export default function LevelUpAttribute({
  pj,
  onClose,
}: LevelUpAttributeProps) {

  const {gameState, setGameState} = useGame();
  const [showLevelUpConfirmation, setShowLevelUpConfirmation] = useState<boolean>(false);
  const [hpDelta, setHpDelta] = useState<number>(0);
  const [attributeLearnt, setAttributeLearnt] = useState<string>();
  const [selectedAttributeId, setSelectedAttributeId] = useState<keyof BaseAttributes | undefined>();
  const [isLearning, setIsLearning] = useState(false);
  const [pendingGameState, setPendingGameState] = useState<typeof gameState | null>(null);

  const attributes: {
    id: keyof BaseAttributes;
    label: string;
    image: string;
  }[] = [
  {
    id: "constitution",
    label: "Constitution",
    image: "/ui/constitution.png",
  },
  {
    id: "strength",
    label: "Force",
    image: "/ui/strength.png",
  },
  {
    id: "magicSkill",
    label: "Maîtrise de la magie",
    image: "/ui/magicSkill.png",
  },
  ];

  /* Sélection ====================================================== */
  
const handleSelect = (
  id: keyof BaseAttributes
) => {
  setSelectedAttributeId(id);
};

  /* Apprentissage ====================================================== */
const handleLearn = async () => {
  if (selectedAttributeId === undefined) return;
  if (isLearning) return;
  if (showLevelUpConfirmation) return;

  try {
    setIsLearning(true);

    const response = await learnAttribut(
      pj.id,
      selectedAttributeId
    );

    setHpDelta(response.hpDelta);
  
    
    const att = attributes.find(att => (att.id === response.attribute))?.label;
    if(att)
      setAttributeLearnt(att);

    setPendingGameState(response.gameState);

    setShowLevelUpConfirmation(true);

  } catch (error) {
    console.error(
      "Erreur apprentissage attribut :",
      error
    );
  } finally {
    setIsLearning(false);
  }
};


  /* ======================================================
     JSX
     ====================================================== */

  return (
    <div
      style={{
        position: "relative",
        width: "70vw",
        height: "90vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "30px",
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        border: "2px solid #6f5730",
        borderRadius: "8px",
        boxSizing: "border-box",
      }}
    >

      {/* TITRE */}

      <div
        style={{
          marginTop: "-15px",
          fontFamily: "'Uncial Antiqua', serif",
          fontSize: "38px",
          fontWeight: "bold",
          color: "#d6b56c",
          textAlign: "center"
        }}
      >
       Niveau supérieur
       </div>
        <div
        style={{
          marginBottom: "5px",
          fontFamily: "'Uncial Antiqua', serif",
          fontSize: "26px",
          fontWeight: "bold",
         color: "#d6b56c",
          textAlign: "center"
        }}
      >
      Choisissez une caractéristique à augmenter 
      </div>

{/* ONGLETS */}

<div
  style={{
    display: "flex",
    width: "100%",
    justifyContent: "center",
    gap: "18px",
    marginTop: "25px",
  }}
>
 
  {/* BOUTON RETOUR */}
</div>
  <button
  onClick={onClose}
  disabled={isLearning || showLevelUpConfirmation}
  style={{
    position: "absolute",
    top: "15px",
    right: "15px",

    width: "35px",
    height: "35px",

    padding: 0,
    border: "none",
    background: "transparent",

    cursor:
      isLearning || showLevelUpConfirmation
        ? "default"
        : "pointer",

    opacity:
      isLearning || showLevelUpConfirmation
        ? 0.4
        : 1,

    pointerEvents:
      isLearning || showLevelUpConfirmation
        ? "none"
        : "auto",
  }}
>
  <img
    src="/ui/Button21.png"
    alt="Fermer"
    draggable={false}
    style={{
      width: "100%",
      height: "100%",
    }}
  />
</button>


  {/* LISTE DES CARAC */}

   <div
  style={{
    width: "100%",
    padding: "35px 10px 10px 10px",
    display: "grid",
    gap: "18px",
    overflowY: "auto",
    boxSizing: "border-box",
    justifyContent: "center",
  }}
>
  {attributes.map((attribute) => {
    const selected =
      attribute.id === selectedAttributeId;

    return (
      <div
        key={attribute.id}
        onClick={() =>
          handleSelect(attribute.id)
        }
        style={{
          width: "650px",
          height: "130px",

          display: "flex",
          alignItems: "center",

          padding: "10px 22px 10px 14px",
          boxSizing: "border-box",

         

          borderRadius: "10px",
          border: "2px solid #b98a3d",

          backgroundColor:
            "rgba(0, 0, 0, 0.30)",

          boxShadow:
            "0 4px 10px rgba(0,0,0,.5)",

          filter: selected
            ? "drop-shadow(0 0 12px rgba(255, 65, 0, 0.85))"
            : "none",

          transform: selected
            ? "scale(1.025)"
            : "scale(1)",

          transition:
            "filter 150ms ease, transform 150ms ease",
        }}
      >
        <img
          src={attribute.image}
          alt={attribute.label}
          draggable={false}
          style={{
            width: "110px",
            height: "110px",
            objectFit: "contain",
            flexShrink: 0,
          }}
        />

        <div
          style={{
            flex: 1,
            textAlign: "center",

            fontFamily:
              "'Uncial Antiqua', serif",

            fontSize: "26px",
            fontWeight: "bold",

            color: "#d6b56c",

            textShadow:
              "0 2px 3px rgba(0,0,0,.8)",
          }}
        >
          {attribute.label}
        </div>
      </div>
    );
  })}
</div>
    


      {/* VALIDATION */}

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <MainButton
           onClick={handleLearn}
           name="validate"
           disabled={
              selectedAttributeId === undefined ||
              isLearning ||
              showLevelUpConfirmation
          }
        />
      </div>

     
    {showLevelUpConfirmation && (
  <LevelUpConfirmation
    pj={pj}
    hp={hpDelta}
    attribute={attributeLearnt}
    onContinue={() => {
      if (pendingGameState) {
        setGameState(pendingGameState);
      }

      onClose();
    }}
  />
)}

    </div>
  );
}
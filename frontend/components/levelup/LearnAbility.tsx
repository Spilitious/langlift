"use client";

import { useEffect, useState } from "react";
import BasicAbilityDisplay from "./BasicAbilityDisplay";
import type { AbilityView } from "@shared/types/abilityView";
import {getLearnableAbilities,learnAbility} from "@/utils/api/levelUpApi"
import MainButton from "../button/MainButton";
import { PjView } from "@shared/types/fighterView";
import { useGame } from "@/context/GameContext";
import LevelUpConfirmation from "./LevelUpConfirmation";


type LearnAbilityProps = {
  pj: PjView;
  onClose: () => void;
  
  
};


export default function LearnAbility({
  pj,
  onClose,
  
  
}: LearnAbilityProps) {

  const {gameState, setGameState} = useGame();

  const [showLevelUpConfirmation, setShowLevelUpConfirmation] = useState<boolean>(false);
  const [hpDelta, setHpDelta] = useState<number>(0);
  const [abilities, setAbilities] =
    useState<AbilityView[]>([]);

  const [selectedAbilityId, setSelectedAbilityId] =
    useState<number | null>(null);

  const [loading, setLoading] = useState(true);

  const [isLearning, setIsLearning] =
    useState(false);

  const [activeTab, setActiveTab] =
  useState<"ability" | "spell">("ability");

  const displayedAbilities = abilities.filter(
  ability => ability.type === activeTab
);
  /* ======================================================
     Chargement des abilities apprenables
     ====================================================== */

  useEffect(() => {

    const loadAbilities = async () => {
      try {
        setLoading(true);

        const result =
          await getLearnableAbilities(pj.id);

        setAbilities(result);

      } catch (error) {
        console.error(
          "Erreur chargement abilities :",
          error
        );

      } finally {
        setLoading(false);
      }
    };

    loadAbilities();

  }, [pj]);




  /* ======================================================
     Sélection
     ====================================================== */

  const handleSelect = (abilityId: number) => {

    setSelectedAbilityId((current) =>
      current === abilityId
        ? null
        : abilityId
    );
  };


  /* ======================================================
     Apprentissage
     ====================================================== */

  const handleLearn = async () => {
  if (selectedAbilityId === null) return;
  if (isLearning) return;
  if (showLevelUpConfirmation) return;

  try {
    setIsLearning(true);

    const response = await learnAbility(
      pj.id,
      selectedAbilityId
    );

    setHpDelta(response.hpDelta);
   
    setGameState(response.gameState);
    setShowLevelUpConfirmation(true);

  } catch (error) {
    console.error(
      "Erreur apprentissage ability :",
      error
    );
  } finally {
    setIsLearning(false);
  }
};


  /* ======================================================
     Chargement
     ====================================================== */

  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Chargement...
      </div>
    );
  }


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
          color: "#e8d7a5",
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
          color: "#e8d7a5",
          textAlign: "center"
        }}
      >
      Choisissez une compétence ou un sortilège
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
  <button
    onClick={() => {
      setActiveTab("ability");
      setSelectedAbilityId(null);
    }}
    style={{
      width: "180px",
      padding: "10px 20px",
      fontFamily: "'Uncial Antiqua', serif",
      fontSize: "18px",
     
      color:
        activeTab === "ability"
          ? "#f8e7a5"
          : "#9c9178",
      background:
        activeTab === "ability"
          ? "rgba(120, 80, 30, 0.8)"
          : "rgba(30, 30, 30, 0.8)",

      border:
        activeTab === "ability"
          ? "2px solid #d6a84b"
          : "2px solid #555",

      borderRadius: "6px 6px 0 0",

      cursor: "pointer",
    }}
  >
    Compétences
  </button>

  <button
    onClick={() => {
      setActiveTab("spell");
      setSelectedAbilityId(null);
    }}
    style={{
      width: "180px",
      padding: "10px 20px",

      fontFamily: "'Uncial Antiqua', serif",
      fontSize: "18px",

      color:
        activeTab === "spell"
          ? "#f8e7a5"
          : "#9c9178",

      background:
        activeTab === "spell"
          ? "rgba(120, 80, 30, 0.8)"
          : "rgba(30, 30, 30, 0.8)",

      border:
        activeTab === "spell"
          ? "2px solid #d6a84b"
          : "2px solid #555",

      borderRadius: "6px 6px 0 0",

      cursor: "pointer",
    }}
  >
    Sortilèges
  </button>
</div>

      {/* BOUTON RETOUR */}

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


      {/* LISTE DES ABILITIES */}

      <div
        style={{
          width: "100%",
          paddingTop:"40px",
          display: "grid",
          gridTemplateColumns:
            "repeat(4, minmax(0, 1fr))",

          gap: "16px",

          overflowY: "auto",

          padding: "10px",
          

          boxSizing: "border-box",
        }}
      >

        {displayedAbilities.map((ability) => {

          const selected =
            ability.basicAbilityId === selectedAbilityId;

          return (
            <div
              key={ability.basicAbilityId}

              onClick={() => {console.log(ability.basicAbilityId)
                handleSelect(ability.basicAbilityId)}
              }

              style={{
                width: "100%",

                padding: "12px",

                boxSizing: "border-box",

                cursor: "pointer",

                borderRadius: "8px",

                filter: selected
                  ? "drop-shadow(0 0 10px rgba(255, 65, 0, 0.8))"
                  : "none",

                transition:
                  "filter 150ms ease",
              }}
            >

              <BasicAbilityDisplay
                ability={ability}
              />

            </div>
          );
        })}

      </div>


      {/* AUCUNE ABILITY DISPONIBLE */}

      {abilities.length === 0 && (
        <div
          style={{
            marginTop: "40px",
            color: "#e8d7a5",
          }}
        >
          Aucune nouvelle compétence disponible.
        </div>
      )}


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
           name="next"
           disabled={
              selectedAbilityId === null ||
              isLearning ||
              showLevelUpConfirmation
          }
        />
      </div>

      {showLevelUpConfirmation && 
       <LevelUpConfirmation
          pj={pj}
          hp={hpDelta}
          onContinue={onClose}
        />}

    </div>
  );
}
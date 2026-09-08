"use client";

import { useState } from "react";

//Les types shared
import { HistoryDestination }
  from "@shared/types/history";

//Les utils shared
import { historyPages } from "@shared/utils/historyPages";
import {historyTexts} from "@shared/utils/historyTexts";

//Les utils du front
import { getHistoryImage } from "@/utils/spritePaths";
import { executeConsequence } from "@/utils/api/consequenceApi";

//Les composants
import HistoryChoice from "./HistoryChoice";
import HistoryTeamDisplay from "./HistoryTeamDisplay";
import { useGame } from "@/context/GameContext";
import HistoryPjDisplay from "../inventory/HistoryPjDisplay";
import type { PjView } from "@shared/types/fighterView";


type HistoryProps = {
  pageId:number | null,
  onDestination: (destination:HistoryDestination) => void,
};

export default function History({
  pageId,
  onDestination,
}: HistoryProps) {


  const {gameState} = useGame();
  const [inventoryOn, setInventoryOn] = useState<boolean>(false);
  
const [selectedPj, setSelectedPj] = useState<PjView | null>(null);
  const currentPage =   historyPages.find((page) => page.id === pageId);
  if (!currentPage) return null;

  const currentText = historyTexts[currentPage.textId]; 
  const currentImage = getHistoryImage(currentPage.imageId);
  

  /* ********************************************* Début fonction ****************************************************/
  const handlePjClick = (id: number) => {
  if (!gameState) return;

  const pj = gameState.team.pjs.find(
    (pj) => pj.id === id
  );

  if (!pj) return;

  setSelectedPj(pj);
  setInventoryOn(true);
};


  const handleChoice = async(destination: HistoryDestination) => {
    if (destination.consequenceId !== undefined) 
      await executeConsequence(destination.consequenceId);
    
    onDestination(destination);
  };

  
  /* ********************************************* Début JSX ****************************************************/
  if (inventoryOn && selectedPj) {
  return (
    <HistoryPjDisplay
      pjId={selectedPj.id}
      onClose={() => {
        setInventoryOn(false);
        setSelectedPj(null);
      }}
      onSelectPlayer={handlePjClick}
    />
  );
}

  return (
  <div
    style={{
      position: "absolute",
      width: "102%",
      height: "105%",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      display: "flex",
      overflow: "hidden",
    }}
  >

   
      {/* GAUCHE : TEXTE 40%       */}
       <div
        style={{
          width: "40%",
          height: "100%",

          backgroundImage:
            'url("/ui/background-texte.png")',

          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",

          display: "flex",
          flexDirection: "column",

          paddingLeft: "100px",
          paddingTop: "70px",
          paddingRight: "40px",
         // padding: "120px 70px 120px 90px",
          boxSizing: "border-box",

          color: "#e8d7a5",
          fontSize: "22px",
          fontFamily: "Georgia, serif",
          fontWeight: "bold",
          whiteSpace: "pre-line",
          userSelect: "none",

         // maskImage:
          //  "linear-gradient(to left, transparent 0%, black 25%, black 100%)",

       //  WebkitMaskImage:
         //    "linear-gradient(to left, transparent 0%, black 25%, black 100%)",

          zIndex: 1,
        }}
      >
        {currentText}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingRight:"50px",
            paddingTop:"30px"
          }}
        >
          <HistoryChoice
          choice={currentPage.choices}
          onChoice={handleChoice}
  />

          
        </div>
      </div>


      {/* ========================= */}
      {/* DROITE : IMAGE 60%       */}
      {/* ========================= */}

      <div
  style={{
    position: "relative",
    width: "60%",
    height: "100%",
    overflow: "visible",
  }}
>
  {/* ROOM : derrière */}
  <img
    src={currentImage}
    alt=""
    draggable={false}
    style={{
      position: "absolute",

      left: "-88px",
      top: "52px",

      width: "100%",
      height: "90%",
      transform: "scaleX(1.15)",
      transformOrigin: "left center",
      objectFit: "cover",
      zIndex: 2,
      maskImage:
      "linear-gradient(to right, transparent 0%, black 10%)",
     WebkitMaskImage:
     "linear-gradient(to right, transparent 0%, black 10%)",
    }}
  />

  {/* BACKGROUND / CADRE : devant */}
  <img
    src="/ui/background-image3.png"
    alt=""
    draggable={false}
    style={{
      position: "absolute",
      inset: 0,

      width: "100%",
      height: "100%",

      objectFit: "fill",

      zIndex: 3,

      pointerEvents: "none",
    }}
  />
</div>
{/* ========================= */}
{/* ÉQUIPE EN BAS             */}
{/* ========================= */}

<div
  style={{
    position: "absolute",

    right: "6%",
    bottom: "35px",
    
transform: "scale(0.7)",
   // transform: "translateX(-50%)",

   // width: "500px",
   // height: "140px",

    zIndex: 10,
  }}
>

   <HistoryTeamDisplay
      onSelectPlayer={handlePjClick}
    />
  </div>

    </div>
  );
}
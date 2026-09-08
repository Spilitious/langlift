"use client";

import Image from "next/image";
import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { getPjAvatarPath } from "@/utils/spritePaths";
import { PjView } from "@shared/types/fighterView";
import Inventory from "./Inventory";
import { useEquipmentDrag } from "./hooks/useEquipmentDrag";
import PjProfilDetail from "./PjProfilDetail";
import LearnAbility from "../levelup/LearnAbility";
import MainButton from "../button/MainButton";
import InventoryTeamDisplay from "./InventoryTeamDisplay";

type HistoryPjDisplayProps = {
  pjId : number;
  onClose: () => void;
  onSelectPlayer: (pjId:number) => void
};

export default function HistoryPjDisplay({
  pjId,
  onClose,
  onSelectPlayer,
}: HistoryPjDisplayProps) {

  const { gameState } = useGame();

  const [showLevelUp, setShowLevelUp] = useState<Boolean>(false);

  const handleLevelUp = () => {
    
    setShowLevelUp(true);
  }

    const selectedPj = pjId === null ? null : gameState?.team.pjs.find(
        pj => pj.id === pjId
      ) ?? null;

       if(selectedPj === null)
    return
  // Hook de gestion de l'équipement 
  const {
    draggedEquipmentId,
    draggedEquipment,
    dragPosition,
    dragOffset,
    handleEquipmentPointerDown,
    handleEquipmentPointerMove,
    handleDropOnBeltSlot,
    handleDropInInventory,
    handleDropOnEquipmentSlot,

  } = useEquipmentDrag({selectedPjView:selectedPj});

const handleCloseLevelUp = () => {
    setShowLevelUp(false);
}  

 

  return (
  <div
    style={{
      position: "relative",
      width: "102%",
      height: "105%",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",

      display: "flex",

      backgroundImage: 'url("/ui/background.png")',
      backgroundSize: "100% 100%",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
    }}
  >

    {/* ======================== */}
    {/* GAUCHE : PROFIL 20%      */}
    {/* ======================== */}

    <div
      style={{
       // width: "20%",
        height: "100%",
        marginTop:"80px",
        marginLeft:"80px",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",

        boxSizing: "border-box",
      }}
    >
      <PjProfilDetail
        player={selectedPj}
        onLevelUp={handleLevelUp}
      />
    </div>


    
    <div
      style={{
     
        height: "100%",
        paddingLeft : "50px",
        marginTop : "80px",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",

        boxSizing: "border-box",
      }}
    >
      {showLevelUp ? (
        <LearnAbility
          pj={selectedPj}
          onClose={handleCloseLevelUp}
        />
      ) : (
        <>
        <Inventory
          pj={selectedPj}
          draggedEquipmentId={draggedEquipmentId}
          dragOffset={dragOffset}
          onDropEquipment={handleDropInInventory}
          onDropEquipmentSlot={handleDropOnEquipmentSlot}
          onEquipmentPointerDown={handleEquipmentPointerDown}
          onDropBeltSlot={handleDropOnBeltSlot}
        />

         <div
  style={{
    position: "absolute",
    bottom: "30px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 20,
  }}
>
  <MainButton onClick={onClose} 
              name="back"/>
</div>

<div
  style={{
    position: "absolute",
    zIndex: 20,
     right: "6%",
    bottom: "35px",
    transform: "scale(0.7)",
  }}
>
  <InventoryTeamDisplay
    pjId={pjId}
    onSelectPlayer={onSelectPlayer} />
</div></>
      )
      
      
      
      }
       
    </div>
 


  </div>
);
}
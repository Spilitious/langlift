"use client";

import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { createPortal } from "react-dom";

import { useEquipmentDrag } from "./hooks/useEquipmentDrag";
import { LEVEL_CONTENT } from "@shared/utils/levelUp";
import { getImageEquipment } from "@/utils/spritePaths";
import { createPotion } from "@/utils/api/equipmentApi";

import Inventory from "./Inventory";
import PjProfilDetail from "./PjProfilDetail";
import LearnAbility from "../levelup/LevelUpAbility";
import LearnTalent from "../levelup/LevelUpTalent";
import LearnSkill from "../levelup/LevelUpSkill";
import MainButton from "../button/MainButton";
import InventoryTeamDisplay from "./InventoryTeamDisplay";
import LearnAttribute from "../levelup/LevelUpAttribute";
import Alchemy from "./Alchemy";


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


  const levelComponents = {
    ability: LearnAbility,
    attribute: LearnAttribute,
    talent:LearnTalent,
    skill:LearnSkill,
    

  };

  const { gameState, setGameState } = useGame();
  const [showLevelUp, setShowLevelUp] = useState<boolean>(false);
  const selectedPj =
    gameState?.team.pjs.find(
      pj => pj.id === pjId
    ) ?? null;

//Message Ui 
  const [message, setMessage] = useState<string | null>(null);

const {
  draggedEquipmentId,
  draggedEquipment,
  dragPosition,
  dragOffset,
  
  setDraggedEquipmentId,
  handleEquipmentPointerDown,
  handleEquipmentPointerMove,
  handleDropOnBeltSlot,
  handleDropInInventory,
  handleDropOnEquipmentSlot,
  handleAddIngredient,
  handleIngredientPointerDown,
  handleDropEquipmentOnPlayer,
} = useEquipmentDrag({
  selectedPjView: selectedPj
});


if (!selectedPj) {
  return null;
}

const showMessage = (message: string, time:number) => {
  setMessage(message);

  setTimeout(() => {
    setMessage(null);
  }, time);
};

/* ***********************************  Drop d'un ingrédient  ************************************** */


 type ContentType = keyof typeof levelComponents;

const contentType:ContentType =
  LEVEL_CONTENT[
    (selectedPj.level + 1) as keyof typeof LEVEL_CONTENT
  ];

 

const Component =
  contentType
    ? levelComponents[contentType]
    : null;

/* ************************************************** DEBUT DES FONCTIONS ******************************** */

const handleLevelUp = () => {
    
    setShowLevelUp(true);
  }

const handleCloseLevelUp = () => {
   console.log("CLOSE LEVEL UP");
    setShowLevelUp(false);
}  



const handleCreatePotion = async ()=> {
 
  const response = await createPotion(selectedPj.id);
  let message = ""
  if(!response.success) 
  {
    message="Recette inconnue."
    if(response.ingredientUsed)
      message+=" Les ingrédients ont été consommés";
    else
      message+=" Les ingrédients ont été preservés";
  }
  else
  {
    message=`Vous avez fabriqué ${response.potion?.name}`
  }
  showMessage(message, 4000);
  setGameState(response.gameState);
 
 
};


 

  return (
  <div
   onPointerMove={handleEquipmentPointerMove}
    style={{
      position: "absolute",
      width: "102%",
      height: "105%",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      display: "flex",
      overflow:"hidden",

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
    flex: 1,
    height: "100%",
    marginTop: "80px",
    marginLeft: "30px",
    display: "flex",
    boxSizing: "border-box",
  }}
>
  {showLevelUp && Component ? (
    <Component
      pj={selectedPj}
      onClose={handleCloseLevelUp}
    />
  ) : (
    <>
     

 <div
        style={{
          width: "45%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          boxSizing: "border-box",
        }}
      >
        <Inventory
          pj={selectedPj}
         
          draggedEquipmentId={draggedEquipmentId}
          dragOffset={dragOffset}
          onDropEquipment={handleDropInInventory}
          onDropEquipmentSlot={handleDropOnEquipmentSlot}
          onEquipmentPointerDown={handleEquipmentPointerDown}
          onDropBeltSlot={handleDropOnBeltSlot}
        />
      </div>
      {/* ALCHIMIE : moitié droite */}
    

      <div
        style={{
          width: "50%",
          height: "100%",
          marginLeft: "30px",
          display: "flex",
          justifyContent: "left",
          alignItems: "flex-start",
          boxSizing: "border-box",
        }}
      >
        <Alchemy
          pj={selectedPj}
          access={gameState?.alchemyAccess}
          message={message}
          onAddIngredient={handleAddIngredient}
          draggedEquipmentId={draggedEquipmentId}
          onIngredientPointerDown={handleIngredientPointerDown}
          onCreatePotion={handleCreatePotion}
        />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
        }}
      >
        <MainButton
          onClick={onClose}
          name="back"
        />
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
          onSelectPlayer={onSelectPlayer}
          draggedEquipmentId={draggedEquipmentId}
          onDropEquipmentOnPlayer={handleDropEquipmentOnPlayer}
        />
        
      </div>
      
     {draggedEquipment &&
  createPortal(
    <img
      src={getImageEquipment(
        draggedEquipment.type,
        draggedEquipment.image
      )}
      alt={draggedEquipment.name}
      draggable={false}
      style={{
        position: "fixed",

        left: dragPosition.x,
        top: dragPosition.y,

        width: `${draggedEquipment.width * 50}px`,
        height: `${draggedEquipment.height * 50}px`,

        objectFit: "contain",

        transform: `translate(
          ${-dragOffset.x}px,
          ${-dragOffset.y}px
        )`,

        pointerEvents: "none",
        zIndex: 100000,
      }}
    />,
    document.body
  )
}
    </>
  )}
</div>

       
    </div>
  
);
}
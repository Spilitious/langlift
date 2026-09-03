"use client";

import { useState, useEffect } from "react";

import type { EquipmentSlot } from "@shared/types/equipmentView";
import { useGame } from "@/context/GameContext";
import PjProfessionInventory from "./PjProfessionInventory";
import Alchemy from "./Alchemy";
import { moveEquipmentToInventory,  moveEquipmentToBelt,  equipEquipment} from "@/utils/api/equipmentApi";
import { getImageEquipment } from "@/utils/spritePaths"
import type { HistoryDestination } from "@shared/types/history";
import type { EquipmentView } from "@shared/types/equipmentView";
import { createPotion } from "@/utils/api/equipmentApi";


type ProfessionProps = {
    professionId:number;
    onDestination: (destination:HistoryDestination) => void;

  };

export default function Profession({
   professionId,
   onDestination,

}:ProfessionProps) {
  
  const { gameState, setGameState} = useGame();

  const [draggedEquipmentId, setDraggedEquipmentId] =
    useState<number | null>(null);

  const [selectedPjId, setSelectedPjId] =
    useState<number | null>(null);

  const [dragOffset, setDragOffset] =
    useState({
      x: 0,
      y: 0,
    });

    const [mousePosition, setMousePosition] =
    useState({
      x: 0,
      y: 0,
    });

   const [ingredients, setIngredients] =
  useState<(EquipmentView | null)[]>([
    null,
    null,
    null,
  ]);

  const [draggedIngredientSlot, setDraggedIngredientSlot] =
  useState<number | null>(null);

  const [craftedPotion, setCraftedPotion] =
  useState<EquipmentView | null>(null);

  useEffect(() => {
    if (!gameState) return;

      setSelectedPjId((current) =>
      current ?? gameState.team.pjs[0]?.id ?? null
    );
  }, [gameState?.team.pjs]);


 const selectedPj =
  gameState?.team.pjs.find(
    (pj) => pj.id === selectedPjId
  );


  

  if (!selectedPj) {
    return null;
  }

  
  if (!gameState) {
    return null;
  }

  
  const draggedEquipment =
  selectedPj.equipment.find(
    (equipment) =>
      equipment.id === draggedEquipmentId)??null;

   
  
  
const handleIngredientPointerDown = (
  event: React.PointerEvent,
  equipmentId: number,
  slotId: number,
) => {
  // On mémorise son slot d'origine
  setDraggedIngredientSlot(slotId);

  // On le retire temporairement de l'alchimie
  setIngredients(current => {
    const next = [...current];
    next[slotId] = null;
    return next;
  });

  // Gestion normale du drag
  handleEquipmentPointerDown(
    event,
    equipmentId
  );
};


/* ************************************** SELECTION D'un objet ******************************* */

const handleEquipmentPointerDown = (
  event: React.PointerEvent,
  equipmentId: number,
) => {
  const rect =
    event.currentTarget.getBoundingClientRect();

  setDraggedEquipmentId(equipmentId);

  setDragOffset({
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  });

  setMousePosition({
    x: event.clientX,
    y: event.clientY,
  });

  
//  event.currentTarget.setPointerCapture(
  //  event.pointerId
 // );
};



/* ************************************** Gestion de la position d'un objet dragged ******************************* */
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
   
    if (draggedEquipmentId === null) return;

    setMousePosition({
      x: event.clientX,
      y: event.clientY,
    });
  };


/* ***********************************  Drop d'un ingrédient  ************************************** */

  const handleAddIngredient = (
  slotId: number,
  equipment: EquipmentView
) => {
  setIngredients(current => {
    const next = [...current];
    next[slotId] = equipment;
    return next;
  });

  setDraggedEquipmentId(null);
};

/* ********************************************* Drop d'un objet sur l'équipement ************************ */
  const handleDropOnEquipmentSlot = async (
  equipmentId: number,
  slot: EquipmentSlot
) => {
  if (selectedPjId === null) return;

  const response =
    await equipEquipment(
      selectedPjId,
      equipmentId,
      slot
    );

    setGameState(response.gameState);
      setDraggedEquipmentId(
    response.moveResult.newEquipmentDragged || null
  );
};


/* ********************************************* Drop d'un objet sur la ceinture ************************ */

  const handleDropOnBeltSlot = async (equipmentId:number,
    newSlot: number
  ) => {
    
    if (selectedPjId === null) return;
    
    
  const response =
    await moveEquipmentToBelt(
      selectedPjId,
      equipmentId,
      newSlot
    );

  setGameState(response.gameState);

  setDraggedEquipmentId(
    response.moveResult.newEquipmentDragged || null
  );

  //console.log(response.gameState.pjs[0].equipment)
 
};

/* ********************************************* Drop d'un objet sur l'inventaire ************************ */

 const handleDropInInventory = async (
  equipmentId: number,
  x: number,
  y: number
) => {
 

  if (selectedPjId === null) return;
  if (draggedEquipment === null) return;

  //Dépot d'une potion ou d'un ingrédient dans l'inventaire

  setDraggedEquipmentId(null);

   

  // L'equipement vient du PJ
  const response =
    await moveEquipmentToInventory(
      selectedPjId,
      equipmentId,
      x,
      y
    );

  const newDraggedId = response.moveResult.newEquipmentDragged;
  setGameState(response.gameState);

  if (newDraggedId !== 0) {
  const newDraggedEquipment =
    response.gameState.team.pjs
      .find((pj) => pj.id === selectedPjId)
      ?.equipment.find(
        (equipment) =>
          equipment.id === newDraggedId
      );

  if (newDraggedEquipment) {
      setDragOffset({
        x: newDraggedEquipment.width * 50 / 2,
        y: newDraggedEquipment.height * 50 / 2,
        });
  }
  setDraggedEquipmentId(newDraggedId);
  } else {
  setDraggedEquipmentId(null);
  }
};


const handleCreatePotion = async () => {
 if (selectedPjId === null) return;

  const ingredientIds = ingredients.map(
    ingredient => ingredient?.id ?? null
  );

  const response = await createPotion(selectedPjId,
    ingredientIds,
    1 // power pour l'instant
  );

  setGameState(response.gameState);
  setCraftedPotion(response.potion);
  if(response.ingredientUsed) {
    setIngredients([
    null,
    null,
    null,
  ]);
}
};
  
  /* *********************************************** DEBUT DU JSX ********************************** */
return (
  <div
    onPointerMove={handlePointerMove}
    style={{
      position: "relative",
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
    }}
  >

    {/* HAUT : Alchimie - 35% */}
    <div
    onPointerUp={() => {
    if (draggedEquipmentId !== null) {
      setDraggedEquipmentId(null);
    }
    }}
      style={{
        width: "100%",
        height: "40%",
      }}
    >
      <Alchemy
        ingredients={ingredients}
        onAddIngredient={handleAddIngredient}
        draggedEquipmentId={draggedEquipmentId}
        onIngredientPointerDown={handleIngredientPointerDown}
        onCreatePotion={handleCreatePotion}
        />
    </div>


    {/* MILIEU : réservé pour plus tard - 35% */}
    <div
      style={{
        width: "100%",
        height: "20%",
      }}
    >
      {/* Futur composant */}
    </div>


    {/* BAS : Inventaire - 30% */}
    <div
      style={{
        width: "100%",
        height: "40%",
      }}
    >
      <PjProfessionInventory
        pj={selectedPj}
        draggedEquipmentId={draggedEquipmentId}
        draggedEquipment={draggedEquipment}
        dragOffset={dragOffset}
        ingredients={ingredients}
        onDropOnInventory={handleDropInInventory}
        onDropOnEquipment={handleDropOnEquipmentSlot}
        onEquipmentPointerDown={handleEquipmentPointerDown}
        onDropOnBelt={handleDropOnBeltSlot}
      />
    </div>


    {/* Objet actuellement déplacé */}
    {draggedEquipment && (
      <img
        src={getImageEquipment(
          draggedEquipment.type,
          draggedEquipment.image
        )}
        alt={draggedEquipment.name}
        draggable={false}
        style={{
          position: "fixed",

          left: mousePosition.x,
          top: mousePosition.y,

          width: `${draggedEquipment.width * 50}px`,
          height: `${draggedEquipment.height * 50}px`,

          objectFit: "contain",

          transform: `translate(
            ${-dragOffset.x}px,
            ${-dragOffset.y}px
          )`,

          pointerEvents: "none",
          zIndex: 10000,
        }}
      />
    )}

  </div>
);
}
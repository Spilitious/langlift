import { useState } from "react";
import type { PjView } from "@shared/types/fighterView";
import type { EquipmentSlot } from "@shared/types/equipmentView";
import { useGame } from "@/context/GameContext";
import {
  moveEquipmentToInventory,
  moveEquipmentToBelt,
  equipEquipment,
  moveEquipmentToAlchemy,
  moveEquipmentToPlayer,
} from "@/utils/api/equipmentApi";
import type { EquipmentView } from "@shared/types/equipmentView";

type Props = {
  
  selectedPjView: PjView | null;


 
};

export function useEquipmentDrag({
 
  selectedPjView,
 
}: Props) {

 const { gameState, setGameState} = useGame();

  const [draggedEquipmentId, setDraggedEquipmentId] =
    useState<number | null>(null);

    
  const [dragPosition, setDragPosition] =
    useState({
      x: 0,
      y: 0,
    });

  const [dragOffset, setDragOffset] =
    useState({
      x: 0,
      y: 0,
    });

  const draggedEquipment =
    selectedPjView?.equipment.find(
      (equipment) =>
        equipment.id === draggedEquipmentId
    ) ?? null;

   

/* ************************************************* Debut des fonctions ****************************************** */

const handleEquipmentPointerDown = (
    event: React.PointerEvent,
    equipmentId: number
  ) => {

    event.preventDefault();

    const rect =
      event.currentTarget.getBoundingClientRect();

    setDraggedEquipmentId(equipmentId);

    setDragOffset({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });

    setDragPosition({
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleEquipmentPointerMove = (
    event: React.PointerEvent
  ) => {
    if (draggedEquipmentId === null) return;

    setDragPosition({
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleDropOnBeltSlot = async (equipmentId:number,
    newSlot: number,

  ) => {
    if (selectedPjView === null) return;
       
       
     const response =
       await moveEquipmentToBelt(
         selectedPjView.id,
         equipmentId,
         newSlot
       );
   
     setGameState(response.gameState);
   
     setDraggedEquipmentId(
       response.moveResult.newEquipmentDragged || null
     );
  };

  const handleDropInInventory = async (
    equipmentId: number,
    x: number,
    y: number
  ) => {
   if (selectedPjView === null) return;

  const response =
    await moveEquipmentToInventory(
      selectedPjView.id,
      equipmentId,
      x,
      y
    );

  const newDraggedId =
  response.moveResult.newEquipmentDragged;

setGameState(response.gameState);

if (newDraggedId !== 0) {
  const newDraggedEquipment =
    response.gameState.team.pjs
      .find((pj) => pj.id === selectedPjView.id)
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


  const handleAddIngredient = async (
  slotId: number,
  equipment: EquipmentView
) => {
  if (selectedPjView === null) return;

  const response =
    await moveEquipmentToAlchemy(
      selectedPjView.id,
      equipment.id,
      slotId
    );

  const newDraggedId =
  response.moveResult.newEquipmentDragged;
  setGameState(response.gameState);

  if (newDraggedId !== 0) {
    const newDraggedEquipment =
      response.gameState.team.pjs
      .find((pj) => pj.id === selectedPjView.id)
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

const handleIngredientPointerDown = (
  event: React.PointerEvent,
  equipmentId: number,
) => {
  handleEquipmentPointerDown(
    event,
    equipmentId
  );
};


  const handleDropOnEquipmentSlot = async (
  equipmentId:number,
  slot: EquipmentSlot
) => {
  if (
    draggedEquipmentId === null ||
    selectedPjView=== null
  ) {
    return;
  }

  const equipment = selectedPjView.equipment.find(
    (item) => item.id === draggedEquipmentId
  );

  if (!equipment) return;

  const response =
    await equipEquipment(
      selectedPjView.id,
      equipmentId,
      slot
    );

    setGameState(response.gameState);
      setDraggedEquipmentId(
    response.moveResult.newEquipmentDragged || null
  );
};

const handleDropEquipmentOnPlayer = async (
  targetPjId: number
) => {
  if (
    draggedEquipmentId === null ||
    selectedPjView === null
  ) {
    return;
  }

  const response =
    await moveEquipmentToPlayer(
      selectedPjView.id,
      targetPjId,
      draggedEquipmentId
    );

  setGameState(response.gameState);

  // Si transfert réussi, fin du drag.
  // Sinon l'équipement reste dans la main.
  if (response.result) {
    setDraggedEquipmentId(null);
  }
};


  return {
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
    
  };
}
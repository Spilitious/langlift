import { useState } from "react";
import type { PjView } from "@shared/types/fighterView";
import type { EquipmentSlot } from "@shared/types/equipmentView";
import { useGame } from "@/context/GameContext";
import {
  moveEquipmentToInventory,
  moveEquipmentToBelt,
  equipEquipment,
} from "@/utils/api/equipmentApi";

type Props = {
  selectedPjId: number | null;
  selectedPj: PjView | null;


   onEquipmentDropOnPj: (
    equipmentId: number,
    targetId: number
  ) => void;
};

export function useEquipmentDrag({
  selectedPjId,
  selectedPj,
  onEquipmentDropOnPj,
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
    selectedPj?.equipment.find(
      (equipment) =>
        equipment.id === draggedEquipmentId
    ) ?? null;

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
  };

  const handleDropInInventory = async (
    equipmentId: number,
    x: number,
    y: number
  ) => {
   if (selectedPjId === null) return;

  const response =
    await moveEquipmentToInventory(
      selectedPjId,
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

  const handleDropOnEquipmentSlot = async (
  equipmentId:number,
  slot: EquipmentSlot
) => {
  if (
    draggedEquipmentId === null ||
    selectedPjId === null
  ) {
    return;
  }

  const equipment = selectedPj?.equipment.find(
    (item) => item.id === draggedEquipmentId
  );

  if (!equipment) return;

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


const handleDropOnPj = (
  targetId: number
) => {
  if (draggedEquipmentId === null) return;

  onEquipmentDropOnPj(
    draggedEquipmentId,
    targetId
  );

  setDraggedEquipmentId(null);

};

  return {
    draggedEquipmentId,
    draggedEquipment,
    dragPosition,
    dragOffset,
    handleDropOnPj,
    handleEquipmentPointerDown,
    handleEquipmentPointerMove,
    handleDropOnBeltSlot,
    handleDropInInventory,
    handleDropOnEquipmentSlot,
    
  };
}
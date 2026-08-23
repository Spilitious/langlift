import { useState } from "react";
import type { PjView } from "@/types/fighterView";
import type { EquipmentSlot } from "@/types/equipment";

type Props = {
  selectedPjId: number | null;
  selectedPj: PjView | null;

  setPjs: React.Dispatch<
    React.SetStateAction<PjView[]>
  >;

   onEquipmentDropOnPj: (
    equipmentId: number,
    targetId: number
  ) => void;
};

export function useEquipmentDrag({
  selectedPjId,
  selectedPj,
  setPjs,
  onEquipmentDropOnPj,
}: Props) {

 
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

  const handleDropOnBeltSlot = (
    newSlot: number
  ) => {
    if (
      draggedEquipmentId === null ||
      selectedPjId === null
    ) {
      return;
    }

    setPjs((current) =>
      current.map((pj) => {
        if (pj.id !== selectedPjId) {
          return pj;
        }

        return {
          ...pj,

          equipment: pj.equipment.map(
            (equipment) =>
              equipment.id ===
              draggedEquipmentId
                ? {
                    ...equipment,

                    location: "belt",
                    beltSlot: newSlot,

                    x: null,
                    y: null,
                  }
                : equipment
          ),
        };
      })
    );

    setDraggedEquipmentId(null);
  };

  const handleDropInInventory = (
    equipmentId: number,
    x: number,
    y: number
  ) => {
    if (selectedPjId === null) return;

    setPjs((current) =>
      current.map((pj) => {
        if (pj.id !== selectedPjId) {
          return pj;
        }

        return {
          ...pj,

          equipment: pj.equipment.map(
            (equipment) =>
              equipment.id === equipmentId
                ? {
                    ...equipment,

                    location: "inventory",

                    x,
                    y,

                    beltSlot: undefined,
                  }
                : equipment
          ),
        };
      })
    );

    setDraggedEquipmentId(null);
  };

  const handleDropOnEquipmentSlot = (
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

  // Vérification évidente côté front
  if (equipment.type !== slot) {
    setDraggedEquipmentId(null);
    return;
  }

  setPjs((current) =>
    current.map((pj) => {
      if (pj.id !== selectedPjId) {
        return pj;
      }

      return {
        ...pj,

        equipment: pj.equipment.map((item) =>
          item.id === draggedEquipmentId
            ? {
                ...item,

                location: "equipped",
                slot,

                x: null,
                y: null,

                beltSlot: undefined,
              }
            : item
        ),
      };
    })
  );

  setDraggedEquipmentId(null);
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
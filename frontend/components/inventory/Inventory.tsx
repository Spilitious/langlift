"use client";

import { useState } from "react";

import type { PjView } from "@shared/types/fighterView";
import { getImageEquipment } from "@/utils/spritePaths"
import EquipmentSlots from "./EquipmentSlots";
import type { EquipmentSlot } from "@shared/types/equipmentView";
import Belt from "../fight/menu/Belt";

type InventoryProps = {
  pj: PjView;
 draggedEquipmentId: number | null;

  dragOffset: {
    x: number;
    y: number;
  };

  onDropEquipment: (
    equipmentId: number,
    x: number,
    y: number
  ) => void;

  onDropEquipmentSlot: (
   equipmentId:number, 
   slot:EquipmentSlot
  ) => void;

  onEquipmentPointerDown: (
    event: React.PointerEvent,
    equipmentId: number
  ) => void;

   onDropBeltSlot: (
    
    equipmentId: number,
    slot:number,
  ) => void;

};

const CELL_WIDTH = 50;
const CELL_HEIGHT = 50;
const INVENTORY_SCALE_Y = 1.03;
const INVENTORY_SCALE_X = 1.02;

export default function Inventory({
  pj,
  draggedEquipmentId, 
  dragOffset,
  onDropEquipment,
  onEquipmentPointerDown,
  onDropEquipmentSlot,
  onDropBeltSlot,
  
}: InventoryProps) {
  

   

    const inventoryEquipment =
  pj.equipment.filter(
    (item) => item.location === "inventory"
  );

  const equipped =
  pj.equipment.filter(
    (item) => item.location === "equipped"
  );

  
const beltEquipment =
  pj.equipment.filter(
    (equipment) =>
      equipment.location === "belt"
  ); 

    const SNAP_THRESHOLD = 0.25;
function snapToCell(
  position: number,
  cellSize: number
) {
  const exact = position / cellSize;

  const baseCell = Math.floor(exact);
  const progress = exact - baseCell;

  return progress >= SNAP_THRESHOLD
    ? baseCell + 1
    : baseCell;
}

    
 
const handlePointerUp = (
  event: React.PointerEvent<HTMLDivElement>
) => {
  if (draggedEquipmentId === null) return;

  const equipment = pj.equipment.find(
    (equipment) =>
      equipment.id === draggedEquipmentId
  );

  if (!equipment) return;


  

  const inventoryRect =
    event.currentTarget.getBoundingClientRect();

  const objectLeft =
    event.clientX -
    inventoryRect.left -
    dragOffset.x;

  const objectTop =
    event.clientY -
    inventoryRect.top -
    dragOffset.y;

  const newX = snapToCell(
    objectLeft,
    CELL_WIDTH
  );

  const newY = snapToCell(
    objectTop,
    CELL_HEIGHT
  );

  const GRID_WIDTH = 10;
  const GRID_HEIGHT = 4;

  const isInsideInventory =
    newX >= 0 &&
    newY >= 0 &&
    newX + equipment.width <= GRID_WIDTH &&
    newY + equipment.height <= GRID_HEIGHT;

  if (!isInsideInventory) {
    return;
  }

  onDropEquipment(
    equipment.id,
    newX,
    newY
  );
};

 return (
  <div
  style={{
    position: "relative",
     width: 750,
     height : 750,
    
    backgroundColor: "rgba(0, 0, 0, 0.58)",
    border: "2px solid #6f5730",
    borderRadius: "10px",
    boxSizing: "border-box",
      color: "#e8d7a5",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",

   
    justifyContent: "center",
    gap: "20px",
  }}
>
  {/* EQUIPEMENTS */}
<div>
  <EquipmentSlots
    equipment={equipped}
    draggedEquipmentId={draggedEquipmentId}
    onEquipmentPointerDown={onEquipmentPointerDown}
    onDrop={onDropEquipmentSlot}
  />
</div>


{/* CEINTURE */}
<div
   style={{
      paddingTop: "30px",
   }}>
  <Belt
    equipment={beltEquipment}
    draggedEquipmentId={draggedEquipmentId}
    onEquipmentPointerDown={onEquipmentPointerDown}
    onDropOnBeltSlot={onDropBeltSlot}
  />
</div>


{/* INVENTAIRE */}
<div
  onPointerUp={handlePointerUp}
  style={{
    position: "relative",

    width: `${10 * CELL_WIDTH * INVENTORY_SCALE_X}px`,
    height: `${4 * CELL_HEIGHT * INVENTORY_SCALE_Y}px`,

    backgroundImage: 'url("/ui/inventory.png")',
    backgroundSize: "100% 100%",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",

    userSelect: "none",
  }}
>
  {inventoryEquipment.map((equipment) => {

    if (equipment.x === null || equipment.y === null) 
      return null;
    
    if (equipment.id === draggedEquipmentId) 
      return null;
  
    return (
      <img
        key={equipment.id}
        src={getImageEquipment(
          equipment.type,
          equipment.image
        )}
        alt={equipment.name}
        draggable={false}
        onPointerDown={(event) =>
          onEquipmentPointerDown(
            event,
            equipment.id
          )
        }
        style={{
          position: "absolute",

          left:
            equipment.x * CELL_WIDTH+5,

          top:
            equipment.y * CELL_HEIGHT+2,

          width:
            equipment.width *
            CELL_WIDTH,

          height:
            equipment.height *
            CELL_HEIGHT,

          objectFit: "contain",

          cursor: "grab",
        }}
      />
    );
  })}

 
</div></div>
);
}
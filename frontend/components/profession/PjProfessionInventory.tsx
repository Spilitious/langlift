"use client";

import { useState } from "react";

import type { PjView } from "@shared/types/fighterView";
import { getImageEquipment } from "@/utils/spritePaths"
import EquipmentSlots from "@/components/inventory/EquipmentSlots";
import type { EquipmentSlot } from "@shared/types/equipmentView";
import Belt from "../fight/menu/Belt";
import type { EquipmentView } from "@shared/types/equipmentView";

type PjProfessionInventoryProps = {
    pj: PjView;
    draggedEquipmentId: number | null;
    draggedEquipment: EquipmentView | null;
    dragOffset: {
    x: number;
    y: number;
  };

  onDropOnInventory: (  equipmentId: number,
    x: number,
    y: number) => void;

  onDropOnEquipment: (
   equipmentId:number,
   slot:EquipmentSlot
  ) => void;

   onDropOnBelt: (
   equipmentId:number,
   slot:number
  ) => void;

  onEquipmentPointerDown: (
    event: React.PointerEvent,
    equipmentId: number
  ) => void;

 ingredients: (EquipmentView | null)[];

};

const CELL_WIDTH = 50;
const CELL_HEIGHT = 50;
const INVENTORY_SCALE_Y = 1.03;
const INVENTORY_SCALE_X = 1.02;

export default function PjShopInventory({
  pj,
  draggedEquipmentId, 
  draggedEquipment,
  dragOffset,
  ingredients,

  onDropOnInventory,
  onEquipmentPointerDown,
  onDropOnEquipment,
  onDropOnBelt,
  
}: PjProfessionInventoryProps) {
  
const visibleEquipment = pj.equipment.filter(
  equipment =>
    !ingredients.some(
      ingredient => ingredient?.id === equipment.id
    )
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

  function snapToCell(position: number, cellSize: number) 
  {
      const exact = position / cellSize;
      const baseCell = Math.floor(exact);
      const progress = exact - baseCell;

      return progress >= SNAP_THRESHOLD
          ? baseCell + 1
          : baseCell;
  }
  
 

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    
     if (!draggedEquipment) return;

   
    const inventoryRect = event.currentTarget.getBoundingClientRect();
    const objectLeft =    event.clientX -    inventoryRect.left -    dragOffset.x;
    const objectTop =     event.clientY -     inventoryRect.top -    dragOffset.y;
    const newX = snapToCell(objectLeft, CELL_WIDTH);
    const newY = snapToCell( objectTop,    CELL_HEIGHT );
    const GRID_WIDTH = 10;
    const GRID_HEIGHT = 4;

    
   const isInsideInventory =
    newX >= 0 &&
    newY >= 0 &&
    newX + draggedEquipment.width <= GRID_WIDTH &&
    newY + draggedEquipment.height <= GRID_HEIGHT;

  if (!isInsideInventory) return;

  onDropOnInventory(
    draggedEquipment.id,
    newX,
    newY
  );
};

/* ************************************************ DEBUT DU JSX ******************************************* */
/* ********************************************************************************************************** */
return (
  <div
    style={{
      position: "relative",
      width: "100%",
      height: "100%",

      backgroundImage:
        'url("/ui/background.png")',

      backgroundSize: "100% 100%",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",

      display: "flex",
    //  justifyContent: "center",
      alignItems: "flex-start",

      paddingTop: "45px",
      paddingLeft:"45px",
      boxSizing: "border-box",
    }}
  >
    {/* Ensemble portrait + inventaire + équipements */}
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* LIGNE PRINCIPALE */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "10px",
        }}
      >
        {/* PORTRAIT */}
        <div
          
          style={{
            flexShrink: 0,
            border: "2px solid #b98a3d",
            borderRadius: "8px",
            boxShadow:"0 3px 8px rgba(0, 0, 0, 0.45)",
          }}
        >
          <img
            src="/sprites/portrait/Portrait2.png"
            alt=""
            draggable={false}
            style={{
              display: "block",
              width: "100px",
              height: "120px",
              objectFit: "contain",
            }}
          />
          </div>
          <div>

             <img
            src="/ui/gold.png"
            alt=""
            draggable={false}
            style={{
              display: "block",
              width: "40px",
              height: "40px",
              objectFit: "contain",
            }}
          />
          </div>
          <div 
        
           style={{
            paddingTop:"3px",
            color: "#d8b56b",
                  fontFamily:
                    "Georgia, serif",
                    fontSize:"22px"
           }}>
            108 
            </div>

        {/* INVENTAIRE */}
        <div
          onPointerUp={handlePointerUp}
          style={{
            position: "relative",

            width: `${
              10 *
              CELL_WIDTH *
              INVENTORY_SCALE_X
            }px`,

            height: `${
              4 *
              CELL_HEIGHT *
              INVENTORY_SCALE_Y
            }px`,
                border:
                    "2px solid #b98a3d",

                  borderRadius: "8px",

                  boxShadow:
                    "0 3px 8px rgba(0, 0, 0, 0.45)",
            backgroundImage:
              'url("/ui/inventory.png")',

            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",

            userSelect: "none",
            flexShrink: 0,
          }}
        >
          {visibleEquipment.map(
            (equipment) => {
              if (
                equipment.x === null ||
                equipment.y === null ||
                equipment.id ===
                  draggedEquipmentId
              ) {
                return null;
              }

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
                      equipment.x *
                        CELL_WIDTH +
                      5,

                    top:
                      equipment.y *
                        CELL_HEIGHT +
                      2,

                    width:
                      equipment.width *
                      CELL_WIDTH,

                    height:
                      equipment.height *
                      CELL_HEIGHT,

                    objectFit: "contain",
                  }}
                />
              );
            }
          )}
        </div>

        {/* ÉQUIPEMENTS */}
        <div
          style={{
            flexShrink: 0,
            marginTop: "-65px",
            marginLeft: "-100px"
          }}
        >
          <EquipmentSlots
            equipment={equipped}
            draggedEquipmentId={
              draggedEquipmentId
            }
            onEquipmentPointerDown={
              onEquipmentPointerDown
            }
            onDrop={onDropOnEquipment}
          />
        </div>
      </div>

      {/* CEINTURE */}
      <div
        onPointerUp={handlePointerUp}
        style={{
          marginTop: "15px",
          marginLeft:"-250px",
        }}
      >
        <Belt
          equipment={beltEquipment}
          draggedEquipmentId={
            draggedEquipmentId
          }
          onEquipmentPointerDown={
            onEquipmentPointerDown
          }
          onDropOnBeltSlot={
            onDropOnBelt
          }
        />
      </div>
    </div>
  </div>
); }
"use client";

import { useState, useRef} from "react";
import { useGame } from "@/context/GameContext";
import type { PjView } from "@shared/types/fighterView";
import { getImageEquipment } from "@/utils/spritePaths"
import EquipmentSlots from "@/components/inventory/EquipmentSlots";
import type { EquipmentSlot } from "@shared/types/equipmentView";
import Belt from "../fight/menu/Belt";
import type { EquipmentView } from "@shared/types/equipmentView";
import PjShopDetail from "./PjShopDetail"
import TeamDisplay from "./TeamDisplay";
import MainButton from "../button/MainButton";
import EquipmentToolTip from "../inventory/EquipmentToolTip";

type PjShopInventoryProps = {
    pj: PjView;
    draggedEquipmentId: number | null;
    draggedEquipment: EquipmentView | null;
    dragOffset: {
    x: number;
    y: number;

    
    
  };

  onSelectPlayer: (pjId: number) => void;
  onContinue: () => void;

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

  onDropEquipmentOnPlayer: (pjId: number) => void;
  

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
  onDropOnInventory,
  onEquipmentPointerDown,
  onDropOnEquipment,
  onDropOnBelt,
  onContinue,
  onSelectPlayer,
  onDropEquipmentOnPlayer,
  
}: PjShopInventoryProps) {
  
  const {gameState} = useGame()

  

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

  function snapToCell(position: number, cellSize: number) 
  {
      const exact = position / cellSize;
      const baseCell = Math.floor(exact);
      const progress = exact - baseCell;

      return progress >= SNAP_THRESHOLD
          ? baseCell + 1
          : baseCell;
  }
  
 
   const [hoveredEquipmentId, setHoveredEquipmentId] =
        useState<number | null>(null);
      
      const hoverTimeoutRef =
        useRef<ReturnType<typeof setTimeout> | null>(null);
      
      const clearEquipmentTooltip = () => {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
          hoverTimeoutRef.current = null;
        }
      
        setHoveredEquipmentId(null);
      };
      
      const handleEquipmentMouseEnter = (
        equipmentId: number
      ) => {
        hoverTimeoutRef.current = setTimeout(() => {
          setHoveredEquipmentId(equipmentId);
        }, 1000);
      };
      
      const handleEquipmentMouseLeave = () => {
        clearEquipmentTooltip();
      };

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
      display: "flex",
      alignItems: "flex-start",

      paddingTop: "25px",
      justifyContent: "center",
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
      <PjShopDetail 
          player={pj}
          gold={gameState?.team.gold}
      />
     
      <img
          src="/ui/link.png"
          alt=""
          draggable={false}
          style={{
            position: "absolute",
            left: "522px",
            top: "12px",

            width: "80px",
            height: "40px",
            objectFit: "contain",
            zIndex: 10,
            pointerEvents: "none",
          }}
      />
      <img
          src="/ui/link.png"
          alt=""
          draggable={false}
          style={{
            position: "absolute",
            left: "522px",
            top: "352px",

            width: "80px",
            height: "40px",
            objectFit: "contain",
            zIndex: 10,
            pointerEvents: "none",
          }}
      />

<div
  style={{
    display: "flex",
    alignItems: "stretch",
    gap: "24px",
    padding: "20px",
    backgroundColor: "rgba(0, 0, 0, 0.58)",
    border: "2px solid #6f5730",
    borderRadius: "12px",
    boxShadow: "0 0 12px rgba(216, 181, 107, 0.4)",

  }}
>
  {/* ================= GAUCHE ================= */}

  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      height:"313px",
      gap: "16px",
    }}
  >
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
          CELL_HEIGHT +17
        }px`,

       // border: "2px solid #b98a3d",
        borderRadius: "8px",

        boxShadow:
          "0 3px 8px rgba(0, 0, 0, 0.45)",

        backgroundImage:
          'url("/ui/inventory2.png")',

        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",

        userSelect: "none",
        flexShrink: 0,
      }}
    >
      {inventoryEquipment.map(
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
           <div
  key={equipment.id}
 
  style={{
    position: "absolute",

    left: equipment.x * CELL_WIDTH + 5,
    top: equipment.y * CELL_HEIGHT + 6,

    width: equipment.width * CELL_WIDTH,
    height: equipment.height * CELL_HEIGHT,
  }}
>
  <img
    src={getImageEquipment(
      equipment.type,
      equipment.image
    )}
    alt={equipment.name}
    draggable={false}
      onMouseEnter={() =>
        handleEquipmentMouseEnter(equipment.id)
      }
      onMouseLeave={handleEquipmentMouseLeave}
    onPointerDown={ 
      
      (event) => { clearEquipmentTooltip();
      onEquipmentPointerDown(
        event,
        equipment.id
      )}
    }
    style={{
      width: "100%",
      height: "100%",
      objectFit: "contain",
    }}
  />

   {hoveredEquipmentId === equipment.id && (
    <EquipmentToolTip equipment={equipment} />
  )}

  <div
    style={{
      position: "absolute",
      left: "25%",
      top: "85%",
      transform: "translate(-50%, -50%)",
      display: "flex",
      alignItems: "center",
      gap: "2px",

      padding: "1px 3px",
      backgroundColor: "rgba(0,0,0,.1)",
     // border: "1px solid #b98a3d",
      borderRadius: "4px",

      color: "#f1d27a",
      fontSize: "10px",
      fontWeight: "bold",

      pointerEvents: "none",
    }}
  >
    {Math.floor(equipment.price / 2)}

    <img
      src="/ui/gold.png"
      alt=""
      draggable={false}
      style={{
        width: "10px",
        height: "10px",
        objectFit: "contain",
      }}
    />
  </div>
</div>
          );
        }
      )}
    </div>

    {/* CEINTURE */}

    <div
      onPointerUp={handlePointerUp}
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        paddingTop:"10px"
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

  {/* ================= DROITE ================= */}

  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      paddingLeft:"20px",
    transform: "translateY(-32px)",
      minWidth: "220px",
   //   alignSelf: "stretch",
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
  </div></div>

  {/* ================= 3e COLONNE ================= */}

<div
  style={{
    display: "flex",
    flexDirection: "column",
    width:"328px",
    gap: "10px",
  }}
>
  {/* TEAM */}
  <div
    style={{
      padding: "20px",
      backgroundColor: "rgba(0, 0, 0, 0.58)",
      border: "2px solid #6f5730",
      borderRadius: "12px",
      boxShadow: "0 0 12px rgba(216, 181, 107, 0.4)",
    }}
  >
    <TeamDisplay
      onSelectPlayer={onSelectPlayer}
      pjId={pj.id}
      onDropEquipmentOnPlayer={onDropEquipmentOnPlayer}
      draggedEquipmentId={draggedEquipmentId}
    />
  </div>

  {/* RETOUR */}
  <div
    style={{
      padding: "21px",
      backgroundColor: "rgba(0, 0, 0, 0.58)",
      border: "2px solid #6f5730",
      borderRadius: "12px",
      boxShadow: "0 0 12px rgba(216, 181, 107, 0.4)",

      display: "flex",
      justifyContent: "center",
    }}
  >
    <MainButton
      onClick={onContinue}
      name="back"
    />
  </div>
</div>

{/* fermeture de LIGNE PRINCIPALE */}
</div>

{/* fermeture ensemble */}
</div>

         </div>
); }
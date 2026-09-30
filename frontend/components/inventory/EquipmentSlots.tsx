import { getImageEquipment } from "@/utils/spritePaths"
import { useRef, useState } from "react";
import EquipmentTooltip from "./EquipmentToolTip"
import type {
  EquipmentView,
  EquipmentType,
} from  "@shared/types/equipmentView";

type EquipmentSlot =
  | "helm"
  | "sword"
  | "armor"
  | "shield";

type EquipmentSlotsProps = {
  equipment: EquipmentView[];
  draggedEquipmentId: number | null;

  onEquipmentPointerDown: (
    event: React.PointerEvent,
    equipmentId: number
  ) => void;

  onDrop: (
    EquipmentId:number,
    slot: EquipmentSlot
  ) => void;
};

export default function EquipmentSlots({
  equipment,
  draggedEquipmentId,
  onEquipmentPointerDown,
  onDrop,
}: EquipmentSlotsProps) {

  const getEquipped = (
  slot: EquipmentSlot
) =>
  equipment.find(
    (item) =>
      item.location === "equipped" &&
      item.slot === slot
  );

  const renderSlot = (
  slot: EquipmentSlot,
  emptyImage: string,
  column: number,
  row: number
) => {
  const item = getEquipped(slot);

  const handlePointerUp = ( event: React.PointerEvent,
  slot: EquipmentSlot
) => {
  if (draggedEquipmentId === null) {
    return;
  }

  event.stopPropagation();
  onDrop(
    draggedEquipmentId,
    slot
  );
};

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

  return (
    <div
      onPointerUp={(event) => handlePointerUp(event, slot)}
       onMouseEnter={() => {
    if (item) {
      handleEquipmentMouseEnter(item.id);
    }
  }}

  onMouseLeave={handleEquipmentMouseLeave}
      style={{
        position: "relative",

        gridColumn: column,
        gridRow: row,

        width: "100px",
        height: "150px",
      }}
    >
      <img
        src={emptyImage}
        draggable={false}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          userSelect: "none",
        }}
      />

      {item &&
        item.id !== draggedEquipmentId && (
          <>
          <img
            src={getImageEquipment(
              item.type,
              item.image
            )}
            alt={item.name}
            draggable={false}
            onPointerDown={(event) =>
              onEquipmentPointerDown(
                event,
                item.id
              )
            }
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",

              objectFit: "contain",

              userSelect: "none",
              WebkitUserSelect: "none",
              cursor: 'url("/ui/cursor/cursor6.png") 0 0, pointer',
             
            }}
          />
           {hoveredEquipmentId === item.id && (
      <EquipmentTooltip equipment={item} />
    )}
          </>
        )}
        
    </div>
  );
};
return (
  <div
    style={{
      display: "grid",

      gridTemplateColumns:
        "124px 124px 124px",

      gridTemplateRows:
        "136px 136px",

      gap: "5px",

     
    }}
  >
    {renderSlot(
      "helm",
      "/equipment/helm-empty.png",
      2,
      1
    )}

    {renderSlot(
      "sword",
      "/equipment/sword-empty.png",
      1,
      2
    )}

    {renderSlot(
      "armor",
      "/equipment/armor-empty.png",
      2,
      2
    )}

    {renderSlot(
      "shield",
      "/equipment/shield-empty.png",
      3,
      2
    )}
  </div>
);
}
import { getImageEquipment } from "@/utils/spritePaths";
import type { EquipmentView } from "@shared/types/equipmentView";
import { useRef, useState } from "react";
import EquipmentTooltip from "../../inventory/EquipmentToolTip";

type BeltProps = {
  equipment: EquipmentView[];

   draggedEquipmentId: number | null;

  onEquipmentPointerDown: (
    event: React.PointerEvent,
    equipmentId: number
  ) => void;

  onDropOnBeltSlot: (equipmentId:number,
    slot: number
  ) => void;
};

const SLOT_SIZE = 50;


export default function Belt({
  equipment,
  draggedEquipmentId,
  onEquipmentPointerDown,
  onDropOnBeltSlot,
}: BeltProps) {

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

  const handlePointerUp = (event:React.PointerEvent,
  slot: number
) => {
  if (draggedEquipmentId === null) {
    return;
  }

    event.stopPropagation();
  onDropOnBeltSlot(
    draggedEquipmentId,
    slot
  );
};

  return (
      <div
        style={{
        position: "relative",

        width: "300px",
        height: "80px",

        backgroundImage:
          'url("/ui/belt-background.png")',

        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        
        flexShrink: 0,
      }}
    >
   <div
  style={{
    display: "flex",
    gap: "15px",
    position: "relative",
    left: "111px",
    top: "9px",
  }}
>
  {[0, 1, 2].map((slot) => {
  const item = equipment.find(
    equipment => equipment.beltSlot === slot
  );

  return (
    <div
      key={slot}
      onPointerUp={(event) =>
        handlePointerUp(event, slot)
      }

      onMouseEnter={() => {
        if (item) {
          handleEquipmentMouseEnter(item.id);
        }
      }}

      onMouseLeave={handleEquipmentMouseLeave}

      style={{
        position: "relative",
        width: "50px",
        height: "50px",
      }}
    >
      {item && item.id !== draggedEquipmentId && (
        <>
          <img
            src={getImageEquipment(
              item.type,
              item.image
            )}
            alt={item.name}
            onPointerDown={(event) => {
              clearEquipmentTooltip();

              onEquipmentPointerDown(
                event,
                item.id
              );
            }}
            draggable={false}
            style={{
              width: "50px",
              height: "50px",
              objectFit: "contain",

              userSelect: "none",
              WebkitUserSelect: "none",
            }}
          />

          {hoveredEquipmentId === item.id && (
            <EquipmentTooltip equipment={item} />
          )}
        </>
      )}
    </div>
  );
})}
</div></div>
  );
}


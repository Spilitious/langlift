import { getImageEquipment } from "@/utils/spritePaths";
import type { Equipment } from "@shared/types/equipment";

type BeltProps = {
  equipment: Equipment[];

   draggedEquipmentId: number | null;

  onEquipmentPointerDown: (
    event: React.PointerEvent,
    equipmentId: number
  ) => void;

  onDropOnBeltSlot: (
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
      (equipment) =>
        equipment.beltSlot === slot
    );

    return (
      <div
        key={slot}
        onPointerUp={() =>
          onDropOnBeltSlot(slot)
        }
        style={{
         
          width: "50px",
          height: "50px",
        }}
      >
        {item &&
          item.id !== draggedEquipmentId && (
            <img
              src={getImageEquipment(
                item.type,
                item.image
              )}
              alt={item.name}
              onPointerDown={(event) =>
                onEquipmentPointerDown(
                  event,
                  item.id
                )
              }
              draggable={false}
              style={{
                width: "50px",
                height: "50px",
                objectFit: "contain",

                userSelect: "none",
                WebkitUserSelect: "none",
              }}
            />
          )}
      </div>
    );
  })}
</div></div>
  );
}


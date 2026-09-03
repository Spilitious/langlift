import { getImageEquipment } from "@/utils/spritePaths"
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

  return (
    <div
      onPointerUp={(event) => handlePointerUp(event, slot)}
      
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

              cursor: "grab",
            }}
          />
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

      position: "relative",
      left: "120px",
      top: "47px",
    }}
  >
    {renderSlot(
      "helm",
      "/sprites/equipment/helm-empty.png",
      2,
      1
    )}

    {renderSlot(
      "sword",
      "/sprites/equipment/sword-empty.png",
      1,
      2
    )}

    {renderSlot(
      "armor",
      "/sprites/equipment/armor-empty.png",
      2,
      2
    )}

    {renderSlot(
      "shield",
      "/sprites/equipment/shield-empty.png",
      3,
      2
    )}
  </div>
);
}
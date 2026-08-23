import type { Action } from "../../../../shared/types/action";
import ActionButton from "./ActionButton";
import InventoryButton from "./InventoryButton";
import EndTurnButton from "./EndTurnButton";
import { getActionImagePath } from "@/utils/actionImagePath";
import type { PjView } from "../../../../shared/types/fighterView";
import Belt from "./Belt";

type ActionMenuProps = {
    pj: PjView | null;
  selectedAction: Action | null;
  inventoryOpen : boolean;
  onSelectAction: (action: Action) => void;
  onToggleInventory : () => void;
  onEndTurn : () => void;

  dragEquipmentId : number | null;
  onDropBeltSlot : (slot:number) => void,
  onEquipmentPointerDown :  (
     event: React.PointerEvent,
     equipmentId: number
  ) => void;
  disabled:boolean,
};

export default function ActionMenu({
  pj,
  selectedAction,
  onSelectAction,
  onToggleInventory,
  inventoryOpen,
  dragEquipmentId,
  onDropBeltSlot,
  onEquipmentPointerDown,
  onEndTurn,
  disabled,

}: ActionMenuProps) {

  const actions = pj?.actions ?? [];

const beltEquipment =
  pj?.equipment.filter(
    (equipment) =>
      equipment.location === "belt"
  ) ?? [];


  const baseActions: Action[] = [
    {
      id: 1,
      name: "Attack",
      type: "base",
      target_type: "npc",
      image: 1,
    },
    {
      id: 2,
      name: "Block",
      type: "base",
      target_type: "self",
      image: 2,
    },
  ];

  const allActions = [
    ...baseActions,
    ...actions,
  ];
 return (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      width: "100%",
      height: "100%",
    }}
  >
    {/* ACTIONS */}
    <div
      style={{
        display: "flex",
        gap: "10px",
        marginLeft: "50px",
      }}
    >
      {allActions.map((action) => (
        <ActionButton
          key={`${action.type}-${action.id}`}
          image={getActionImagePath(
            action.image,
            action.type
          )}
          selected={selectedAction?.id === action.id}
          onClick={() => onSelectAction(action)}
        />
      ))}
    </div>
 <div
      style={{
        marginTop: "100px",
        marginLeft: "auto",
        marginRight: "50px",
      }}
    ></div>

<Belt equipment={beltEquipment} 
    draggedEquipmentId={dragEquipmentId}
     onEquipmentPointerDown={onEquipmentPointerDown}
     onDropOnBeltSlot={onDropBeltSlot}
   />
    {/* INVENTAIRE À DROITE */}
    <div
      style={{
        marginLeft: "auto",
        marginRight: "50px",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      <InventoryButton
        open={inventoryOpen}
        onClick={onToggleInventory}
      />
    </div>

     <div
      style={{
        marginLeft: "auto",
        marginRight: "50px",
         userSelect: "none",
                WebkitUserSelect: "none",
      }}
    >
      <EndTurnButton
        onClick={onEndTurn}
         
        disabled={disabled}
      />
    </div>
  </div>
);
}

import ActionButton from "./ActionButton";
import InventoryButton from "./InventoryButton";
import MainButton from "../../button/MainButton";
import { getActionImagePath } from "@/utils/spritePaths";
import type { PjView } from "../../../../shared/types/fighterView";
import Belt from "./Belt";
import { AbilityView } from "@shared/types/abilityView";
import PjProfil from "./PjProfil";

type ActionMenuProps = {
  pj: PjView;
  selectedAction: AbilityView | null;
  inventoryOpen : boolean;
  onSelectAction: (action: AbilityView) => void;
  onToggleInventory : () => void;
  onEndTurn : () => void;

  dragEquipmentId : number | null;
  onDropBeltSlot : (equipmentId:number, slot:number) => void,
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

  const abilitys = pj?.ability ?? [];

const beltEquipment =
  pj?.equipment.filter(
    (equipment) =>
      equipment.location === "belt"
  ) ?? [];


  const baseAbility: AbilityView[] = [ 
    {
      id: 1,
      basicAbilityId:1,
      image: 1,
      name: "Attack",
      type: "ability",
      school : "Guerrier",
      formula : "",
      detail: "",
      target: "npc",
      ap: 1,
      duration:0

    },
    {
      id: 2,
      basicAbilityId:2,
      image: 2,
      name: "Shield",
      type:'ability',
      school : "Guerrier",
      formula : "",
      detail: "",
      target: "self",
      ap: 1,
      duration:0
    },
  ];

  const allAbilitys = [
    ...baseAbility,
    ...abilitys,
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
    <div 
     style={{
      position:"relative",
      left : "60px",
      top: "10px" }}
      >
    <PjProfil 
       player={pj}/>
    </div>
    
    
    
    {/* ACTIONS */}
    <div
      style={{
        display: "flex",
        gap: "10px",
        marginLeft: "150px",
       
      }}
    >
      {allAbilitys.map((action) => (
        <ActionButton
          key={action.basicAbilityId}
          image={getActionImagePath(action.image)}
          selected={selectedAction?.basicAbilityId === action.basicAbilityId}
          disabled={pj.ap < action.ap}
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
    
     <div
      style={{
        marginLeft: "auto",
        marginRight: "50px",
         userSelect: "none",
                WebkitUserSelect: "none",
      }}
    >
      <MainButton
        onClick={onEndTurn}
        name="endTurn"
        disabled={disabled}
      />
    </div>
  </div>
);
}

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
  
  onSelectAction: (action: AbilityView) => void;
  
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
      name: "Attaque de base",
      type: "ability",
      school : "Guerrier",
      formula : "",
      detail: "",
      target: "npc",
      ap: 1,
      duration:0,
      ignoreProvocation:false,

    },
    {
      id: 2,
      basicAbilityId:2,
      image: 2,
      name: "Défense de base",
      type:'ability',
      school : "Guerrier",
      formula : "",
      detail: "",
      target: "self",
      ap: 1,
      duration:0,
      ignoreProvocation:false,
    },
  ];

  const allAbilitys = [
    ...baseAbility,
    ...abilitys,
  ];


  const displayedAbilities = allAbilitys
  .filter(action => action.type === "spell" || action.type === "ability")
  .slice(0, 8);
  const emptySlots = 8 - displayedAbilities.length;


  const displayedTalents = abilitys.filter(ab => (ab.type ==="talent")).slice(0,3);
  const emptyTalentSlots = 3 - displayedTalents.length;

  const displayedSkills = abilitys.filter(ab => (ab.type ==="skill")).slice(0,3);
  const emptySkillsSlots = 3 - displayedSkills.length;

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
     flexShrink: 0,
      left : "40px",
      top: "10px" }}
      >
    <PjProfil 
       player={pj}/>
    </div>
    
   <div
  style={{
    position: "relative",
    marginTop: "50px",
    marginLeft: "74px",

    display: "flex",
    flexDirection: "column",
    gap: "10px",
  }}
>
  {/* LIGNE 1 : 7 ABILITIES */}
  <div
    style={{
      display: "flex",
      gap: "10px",
    }}
  >
    {displayedAbilities.map((action) => (
      <ActionButton
        key={action.basicAbilityId}
        pj={pj}
        image={getActionImagePath(action.image)}
        action={action}
        selected={
          selectedAction?.basicAbilityId === action.basicAbilityId
        }
        disabled={pj.ap < action.ap}
        onClick={() => onSelectAction(action)}
      />
    ))}

    {Array.from({ length: emptySlots }).map((_, index) => (
      <ActionButton
        key={`ability-empty-${index}`}
         pj={pj}
        image="/ui/action-empty2.png"
        selected={false}
        disabled={true}
        onClick={() => {}}
      />
    ))}
  </div>
{/* LIGNE 2 : TALENTS + SKILLS */}
<div
  style={{
    display: "flex",
    width: "710px", // 7 × 80 + 6 × 10
  }}
>
  {/* 3 TALENTS */}
  <div
    style={{
      display: "flex",
      gap: "10px",
    }}
  >
    {displayedTalents.map((action) => (
      <ActionButton
        key={`talent-${action.basicAbilityId}`}
         pj={pj}
        image={getActionImagePath(action.image)}
         action={action}
        selected={
          selectedAction?.basicAbilityId === action.basicAbilityId
        }
        disabled={pj.ap < action.ap}
        onClick={() => onSelectAction(action)}
      />
    ))}

    {Array.from({ length: emptyTalentSlots }).map((_, index) => (
      <ActionButton
        key={`talent-empty-${index}`}
         pj={pj}
        image="/ui/talent-empty.png"
        selected={false}
        disabled={true}
        onClick={() => {}}
      />
    ))}
  </div>

  {/* 3 SKILLS */}
  <div
    style={{
      display: "flex",
      gap: "10px",
      marginLeft: "auto",
    }}
  >
    {displayedSkills.map((action) => (
      <ActionButton
        key={`skill-${action.basicAbilityId}`}
         pj={pj}
        image={getActionImagePath(action.image)}
         action={action}
        selected={
          selectedAction?.basicAbilityId === action.basicAbilityId
        }
        disabled={pj.ap < action.ap}
        onClick={() => onSelectAction(action)}
      />
    ))}

    {Array.from({ length: emptySkillsSlots }).map((_, index) => (
      <ActionButton
        key={`skill-empty-${index}`}
         pj={pj}
        image="/ui/skill-empty.png"
        selected={false}
        disabled={true}
        onClick={() => {}}
      />
    ))}
  </div>
</div></div>
    
    
 

 {/* BELT */}
  <div
    style={{
      position: "relative",

      // sous la ligne d'abilities
      top: "0px",

      // largeur des 5 premières abilities :
      // 5 × 86 + 4 × 10 = 470px
      left: "250px",

      // centre la Belt sur ce point
      transform: "translateX(-50%)",
    }}
  >
    <Belt
      equipment={beltEquipment}
      draggedEquipmentId={dragEquipmentId}
      onEquipmentPointerDown={onEquipmentPointerDown}
      onDropOnBeltSlot={onDropBeltSlot}
    />
  </div>
    
     <div
      style={{
        marginLeft: "auto",
        marginRight: "50px",
        marginTop:"150px",
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
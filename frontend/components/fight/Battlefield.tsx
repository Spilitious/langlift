"use client";


import Pj from "@/components/fight/fighters/Pj";
import Npc from "@/components/fight/fighters/Npc";
import FightPopUp from "@/components/fight/animations/FightPopUp";
import type { FightPopup } from "../../../shared/types/fightPopUp";


import type {
  NpcSprite,
  PjSprite,
  
 
} from "@/types/fighterSprite";


type BattlefieldProps = {
  pjs: PjSprite[];
  npcs: NpcSprite[];
  previewApCost:number;
  canTargetNpc: (npcId:number) => boolean;

  selectedPjId: number;
  selectedNpcId: number | undefined;

  onPjClick: (id: number) => void;
  onNpcClick: (id: number) => void;
  onAnimationEnd: (
  fighterType: "pj" | "npc",
  fighterId: number
) => void;
 

  fightPopups: FightPopup[];

  onRemoveFightPopup: (
  popupId: number
) => void;

  onDropEquipmentOnPj: (
  pjId: number
) => void;
};

export default function Battlefield({
  pjs,
  npcs,
  canTargetNpc,
  selectedPjId,
  selectedNpcId,
  onPjClick,
  onNpcClick,
  onAnimationEnd,
 
  previewApCost,
  
  fightPopups,
  onRemoveFightPopup,
  onDropEquipmentOnPj,
}: BattlefieldProps) {
  



  // =========================================================
  // JSX
  // =========================================================


  
  return (
    <main
      style={{
        position: "relative",
        height: "100%",
        width: "100%",
        overflow: "hidden",
      //  background: "#c8a77b",
      }}
    >

      {pjs.map((pj) => (
    
        <Pj
          key={pj.id}
          pj_data={pj}
          onClick={() => onPjClick(pj.id)}
          selected={selectedPjId === pj.id}
         
          previewApCost={pj.id === selectedPjId ? previewApCost : 0}
          onAnimationEnd={onAnimationEnd}
          onEquipmentDrop={() => onDropEquipmentOnPj(pj.id)}
        /> 
      ))}

<div
  style={{
    position: "relative",
    width: "100%",
    height: "100%",
  }}>
      {npcs.map((npc) => ( 
        <Npc
          key={npc.id}
          onClick={() => {
          
          onNpcClick(npc.id)}}
          canTargetNpc={canTargetNpc}
          selected={selectedNpcId === npc.id}
          npc_data={npc}

       

          onAnimationEnd={onAnimationEnd}

      
          
        />
      ))}</div>


      {fightPopups.map((popup) => (
        <FightPopUp
          key={popup.id}

          details={popup.details}

          x={popup.x}
          y={popup.y}

          trigger={popup.id}
          onEnd={() => onRemoveFightPopup(popup.id)
  }
        />
      ))}


     

    </main>
  );
}
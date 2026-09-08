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

  selectedPjId: number;
  selectedNpcId: number | undefined;

  onPjClick: (id: number) => void;
  onNpcClick: (id: number) => void;

  onAuthorImpact: (
    fighterType: "pj" | "npc",
    fighterId: number
  ) => void;

  onReactionImpact: (
    fighterType: "pj" | "npc",
    fighterId: number
  ) => void;

  onReactionEnd: () => void;
 

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
  selectedPjId,
  selectedNpcId,
  onPjClick,
  onNpcClick,
  onAuthorImpact,
  onReactionImpact,
  onReactionEnd,
  previewApCost,
  
  fightPopups,
  onRemoveFightPopup,
  onDropEquipmentOnPj,
}: BattlefieldProps) {
  

  console.log(
  "NPCS BATTLEFIELD",
  npcs.map(npc => npc.id)
);


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
          onAuthorImpact={() => onAuthorImpact("pj", pj.id)}
          previewApCost={pj.id === selectedPjId ? previewApCost : 0}
          onReactionImpact={() => onReactionImpact("pj", pj.id )}
          onReactionEnd={() => onReactionEnd()}
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
    console.log(
      "NPC_ID",
      npc.id
    );
      onNpcClick(npc.id)}}
          selected={selectedNpcId === npc.id}
          npc_data={npc}

          onAuthorImpact={() =>
            onAuthorImpact(
              "npc",
              npc.id
            )
          }

          onReactionImpact={() =>
            onReactionImpact(
              "npc",
              npc.id
            )
          }

          onReactionEnd={() =>
            onReactionEnd()

        
          }

          
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
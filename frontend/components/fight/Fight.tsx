"use client";

import { useState, useEffect} from "react";
import Battlefield from "./Battlefield";
import ActionMenu from "./menu/ActionMenu";
import type {Action, ActionRequest} from "../../../shared/types/action";
import { usePotion, sendAction } from "@/utils/api/fightApi";
import Inventory from "./inventory/Inventory";
import { getImageEquipment } from "@/utils/spritePaths";
import { useEquipmentDrag } from "./hooks/useEquipmentDrag";
import { useFightEngine } from "./hooks/useFightEngine";
import type {NpcSprite,   PjSprite,} from "@/types/fighterSprite";


import type { RoomView } from "../../../shared/types/roomView.js";

import type { HistoryDestination } from  "../../../shared/types/history";
import FightTransitionDialog from "./FightTransition";
import FightVictoryDialog from "./FightVictory";
import { getHistoryImage } from "@/utils/spritePaths";
import { loadRoom} from  "@/utils/api/roomApi";
import { useGame } from "@/context/GameContext";


type FightView = "battlefield" | "inventory";

type FightProps = {
  roomId: number,
  onFightEnd: (destination:HistoryDestination) => void,
}


/* **********************************************  Debut composant ********************************* */

export default function Fight({
  roomId,
  onFightEnd,
}:FightProps) {

  const { gameState } = useGame();
  const [room, setRoom] = useState<RoomView | null>(null);
  const [fightView, setFightView] = useState<FightView>("battlefield");    
  
  const [pjs, setPjs] = useState<PjSprite[]>([]);
  const [npcs, setNpcs] = useState<NpcSprite[]>([]);
  const [selectedPjId, setSelectedPjId] = useState<number | null>(1);
  const [selectedNpcId, setSelectedNpcId] = useState<number | null>(null);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const selectedPj = pjs.find((pj) => pj.id === selectedPjId) ?? null;
  const [showTransition, setShowTransition] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [isEndTurnRunning, setIsEndTurnRunning] = useState(false);
  
  console.log("FIGHT MONTE roomId =", roomId);

  //Init des PjSprite au chargement de GameState
  useEffect(() => {
  if (!gameState) return;

  setPjs(
    gameState.pjs.map((pj) => ({
      ...pj,
      animation: {
        id: 0,
        name: "idle",
      },
    }))
  );
}, [gameState?.pjs]);

//Init des NpcSprite au chargement de la room
useEffect(() => {
  const fetchRoom = async () => {
    try {
      const roomData =
        await loadRoom(roomId);

      setRoom(roomData);

      //Transformation des npcView de room en NpcSprite
      const npcSprites: NpcSprite[] =
          roomData.npcs.map((npc) => ({
            ...npc,
            animation: {
              id: 0,
              name: "idle",
            },
      }));
      setNpcs(npcSprites);

      

    } catch (error) {
      console.error(
        "Erreur chargement room",
        error
      );
    }
  };

  fetchRoom();
}, [roomId]);



/* **********************************************  Gestion Potion - Remonté de Inventaire ********************************* */


const handleUsePotion = async (
  potionId: number,

) => {
  if (selectedPjId === null) return;

  /*
  const request = {
    id_pj: selectedPjId,
    id_potion: potionId,
    id_target: targetId,
  };

  try {
    const result = await usePotion(request);

    playActionResult(result);
  } catch (error) {
    console.error(
      "Erreur utilisation potion :",
      error
    );
  } */

 //  playActionResult(getResultAction("PJ1 use hp potion on PJ2"));
};


/* **********************************************  Récupération des Hook ********************************* */


//Hook de gestion des animations
const {
  fightPopups,
  playActionResult,
  handleAuthorImpact,
  handleReactionImpact,
  handleReactionEnd,
  removeFightPopup,
  playEndTurn,
 
} = useFightEngine({
  pjs,
  npcs,
  setPjs,
  setNpcs,
});

// Hook de gestion de l'équipement 
const {
  draggedEquipmentId,
  draggedEquipment,
  dragPosition,
  dragOffset,
  handleEquipmentPointerDown,
  handleEquipmentPointerMove,
  handleDropOnBeltSlot,
  handleDropInInventory,
  handleDropOnEquipmentSlot,
  handleDropOnPj,
} = useEquipmentDrag({
  selectedPjId,
  selectedPj,
  setPjs,
  onEquipmentDropOnPj:handleUsePotion,
 
});

 if (!room) {
    return null;
  }

/* **********************************************  Gestion de la fenêtre ********************************* */

const handleToggleInventory = () => {
  setFightView((current) =>
    current === "inventory"
      ? "battlefield"
      : "inventory"
  );
};


/* **********************************************  Gestion du End Turn ********************************* */

const handleEndTurn = async () => {
  if (isEndTurnRunning) return;

  //Disable le button et le cursor pour eviter des actions pendant les animations
  setIsEndTurnRunning(true);

   handleFightFinished();
  try {

    // On demande au back de lancer l'ia et on récupère le EndTurnResult - A faire
   
    // On fait jouer les animations de EndTurnResult
    //await playEndTurn(EndTurnResultMock4);

    // Si le combat est fini : transition ou retour au text
    /*const lastEvent = EndTurnResultMock4.events.at(-1);
    if (!lastEvent) return;
    if (lastEvent.fightStatus === "victory") {
        handleFightFinished();
        return;
    }

    if (lastEvent.fightStatus === "defeat") {
        handleGameOver();
        return;
    }
  */
    // Enable a nouveau curseur et bouton
  } finally {
    setIsEndTurnRunning(false);
  }
};
  

const handleFightFinished = () => {
  if (room.transitionId > 0) {
    setShowTransition(true);
    return;
  }
  if (room.transitionId == -1) {
      setShowVictory(true);
      return;
  }
      
};


const handleGameOver = () => {
  setShowGameOver(true);
}






/* **********************************************  Gestion Selection Action - Remonté de ActionMenu******************************* */

const handleSelectAction = (action: Action) => {
  setSelectedAction((current) =>
    current?.id === action.id
      ? null
      : action
  );
};

/* **********************************************  Gestion du click sur un PJ - Appel au backEnd à faire ************************ */

const handlePjClick = (pjId: number) => {
  // Aucun skill sélectionné :
  // clic normal = sélection du PJ
  if (!selectedAction) {
    setSelectedPjId(pjId);
    return;
  }

  let mockAction;
  
  // Action sur soi-même
  if (selectedAction.target_type === "self") {
    if (pjId !== selectedPjId) 
        {
            setSelectedAction(null);
            return;
        }

      

  if (selectedPj?.id == 1) {
    mockAction = mockActions[15];
  }
  if (selectedPj?.id == 2) {
    mockAction = mockActions[16];
  }


  if (!mockAction) {
    setSelectedAction(null);
    return;
  } 
  
    playActionResult(mockAction.result);
  }

  // Action attendant un PJ
  if (selectedAction.target_type === "pj") {
  //  executeAction(selectedAction, pjId);
   setSelectedAction(null);
    return;
  }

  // L'action attend un NPC :
  // clic sur PJ = cible invalide → annulation
  if (selectedAction.target_type === "npc") {
    setSelectedAction(null);
    return;
  }

  
  //  executeAction(selectedAction, pjId);
   setSelectedAction(null);
    return;
};

/* **********************************************  Gestion du click sur un NPC - Appel au backend a finir ************************ */

const handleNpcClick = async (npcId: number) => {
  if (!selectedAction) return;
  if (!selectedPjId) return;
 
  // L'action attend un NPC 
  if (selectedAction.target_type === "npc") {
   
   const result = await sendAction({
    id_action: selectedAction.id,
    id_pj: selectedPjId,
    id_target: npcId,
  }); 


    setSelectedAction(null);
    await playActionResult(result);
  
  if (result.fightStatus === "victory") {
    handleFightFinished();
    return;
  }

  if (result.fightStatus === "defeat") {
    handleGameOver();
    return;
  }
}
}



/* *********************************************************************************************************************** */
/* **********************************************  DEBUT JSX ************************************************************* */
/* *********************************************************************************************************************** */
if (!room) {
  return (
    <div>
      Chargement...
    </div>
  );
}

return (
  <main
    onPointerMove={handleEquipmentPointerMove}
    style={{
      width: "100vw",
      height: "100vh",
      display: "flex",
      overflow: "hidden",
      backgroundImage: `url(${getHistoryImage(room.imageId)})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      userSelect: "none",
      WebkitUserSelect: "none",
    }}
  >

    {/* ============================= */}
    {/* TEAM VIEW                     */}
    {/* ============================= */}

    <div
      style={{
        width: "15%",
        height: "100%",
        flexShrink: 0,

        // temporaire
        background: "#c8a77b",
      }}
    >
    </div>


    {/* ============================= */}
    {/* PARTIE DROITE : BATTLEFIELD + ACTION_MENU*/}
    {/* ============================= */}

    <div
      style={{
        width: "85%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >

      {/* BATTLEFIELD / INVENTORY */}

      <div
        style={{
          position:"relative",
          width: "100%",
          height: "70%",
          flexShrink: 0,
        }}
      >
        {showTransition && (
          <FightTransitionDialog
            transitionId={room.transitionId}
            onContinue={() => onFightEnd(room.destination)}
          />
        )}

         {showVictory && (
          <FightVictoryDialog
            roomId={room.id}
            onContinue={() => onFightEnd(room.destination)}
          />
        )}

        {fightView === "battlefield" ? (
          <Battlefield
            pjs={pjs}
            npcs={npcs}

            selectedPjId={selectedPjId}
            selectedNpcId={selectedNpcId}

            onPjClick={handlePjClick}
            onNpcClick={handleNpcClick}

            onAuthorImpact={handleAuthorImpact}
            onReactionImpact={handleReactionImpact}
            onReactionEnd={handleReactionEnd}

            fightPopups={fightPopups}
            onRemoveFightPopup={removeFightPopup}

            onDropEquipmentOnPj={handleDropOnPj}
            
          />
        ) : (
          selectedPj && (
            <Inventory
              pj={selectedPj}
              draggedEquipmentId={draggedEquipmentId}
              onDropEquipment={handleDropInInventory}
              dragOffset={dragOffset}
              onEquipmentPointerDown={handleEquipmentPointerDown}
               onDropEquipmentSlot={handleDropOnEquipmentSlot}
                           />
          )
        )}
      </div>


      {/* ACTION MENU : 25% */}

      <div
        style={{
          width: "100%",
          height: "30%",
          flexShrink: 0,
          backgroundImage: 'url("/ui/actionMenu-background2.png")',
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <ActionMenu
          pj={selectedPj}
          selectedAction={selectedAction}
          onSelectAction={handleSelectAction}
          onToggleInventory={handleToggleInventory}
          inventoryOpen={fightView === "inventory"}
          onEndTurn={handleEndTurn}
          dragEquipmentId={draggedEquipmentId}
          onEquipmentPointerDown={handleEquipmentPointerDown}
          onDropBeltSlot={handleDropOnBeltSlot}
          disabled={isEndTurnRunning}
        />
      </div>
    </div>

    {draggedEquipment && (
      <img
        src={getImageEquipment(
          draggedEquipment.type,
          draggedEquipment.image
        )}
        alt={draggedEquipment.name}
        draggable={false}
        style={{
          position: "fixed",
          left: dragPosition.x,
          top: dragPosition.y,
          width: `${draggedEquipment.width * 50}px`,
          height: `${draggedEquipment.height * 50}px`,
          objectFit: "contain",
          transform: `translate(
            ${-dragOffset.x}px,
            ${-dragOffset.y}px
          )`,
        pointerEvents: "none",
        zIndex: 100000,
        }}
      />
    )}
  
  {isEndTurnRunning && (
  <div
    style={{
      position: "absolute",
      inset: 0,
      zIndex: 99999,
      cursor: "none",
    }}
  />
)}

  </main>
);
}

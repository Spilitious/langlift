"use client";

import { useState, useEffect, useRef} from "react";
import Battlefield from "./Battlefield";
import ActionMenu from "./menu/ActionMenu";
import type { ActionRequest} from "../../../shared/types/action";
import { usePotion, sendAction, executeIA } from "@/utils/api/fightApi";
import Inventory from "../inventory/Inventory";
import { getImageEquipment } from "@/utils/spritePaths";
import { useEquipmentDrag } from "./hooks/useEquipmentDrag";
import { useFightEngine } from "./hooks/useFightEngine";
import type {NpcSprite,   PjSprite,} from "@/types/fighterSprite";
import type { ActionResult } from "@shared/types/actionResult";


import type { HistoryDestination } from  "../../../shared/types/history";
import FightTransitionDialog from "./dialogue/FightTransition";
import FightVictoryDialog from "./dialogue/FightVictory";
import FightPrologueDialog from "./dialogue/FightPrologue";

import { getHistoryImage } from "@/utils/spritePaths";
import { loadRoom} from  "@/utils/api/roomApi";
import { useGame } from "@/context/GameContext";
import TeamDisplay from "@/app/TeamDisplay";
import { Ability } from "../../../backend/src/classes/Abitlity";
import { AbilityView } from "@shared/types/abilityView";
import type { GameStateView } from "@shared/types/gameStateView";
import LearnAbility from "../levelup/LearnAbility";


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

  const { gameState, setGameState } = useGame();
  
  //Gestion pour la vue battleField ou Inventaire
  const [fightView, setFightView] = useState<FightView>("battlefield"); 
  
  //Gestion des Pjs et des Npcs
  const [pjs, setPjs] = useState<PjSprite[]>([]);
  const [npcs, setNpcs] = useState<NpcSprite[]>([]);
  
  //Gestion de l'action selectionnée 
  const [selectedAbility, setSelectedAbility] = useState<AbilityView | null>(null);
  
  // Gestion des boites de dialogue Prologue Transition Victory
  const [showTransition, setShowTransition] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [showPrologue, setShowPrologue] = useState(false);
  
  //Pour savoir si l'IA tourne
  const [isEndTurnRunning, setIsEndTurnRunning] = useState(false);

  //PjSprite selectionné 
  const [selectedPjId, setSelectedPjId] =  useState<number | null>(null);
  const selectedPjSprite =  selectedPjId === null ? undefined : getSelectedPj(pjs, selectedPjId);
  // PJ graphique
  const selectedPjView = gameState?.team.pjs.find(pj => pj.id === selectedPjId);

   //PjSprite selectionné 
  const [selectedNpcId, setSelectedNpcId] = useState<number>();

  //Pour la gestion de la première intent du npc lors de l'entrée dans la room 
  const pendingEntryAnimation = useRef<ActionResult[] | null>(null);

  //Message Ui 
  const [battleMessage, setBattleMessage] = useState<string | null>(null);

  //Pour la pré visualiser le coût en ap 
  const [previewApCost, setPreviewApCost] = useState(0);

/* **************************************************** Gestion message UI ********************************* */
const showBattleMessage = (message: string, time:number) => {
  setBattleMessage(message);

  setTimeout(() => {
    setBattleMessage(null);
  }, time);
};

/* **********************************************  Gestion Potion - Remonté de Inventaire ********************************* */

const handleUsePotion = async (
  potionId: number,
  targetId:number,

) => {
  if (selectedPjView === undefined) 
      return;

  if (selectedPjView.ap < 1) {
     if (selectedPjView.ap < 1) {
    showBattleMessage(
      "1 point d'action requis pour boire une potion",4000
    );
    return;
  }
  }
     
  
  const request = {
    id_pj: selectedPjId,
    id_potion: potionId,
    id_target: targetId,
  };

  try {
    const response = await usePotion(request);

    playActionResult(response.result);

    await playActionResult(response.result);
    setGameState(response.gameState);
    
  } catch (error) {
    console.error(
      "Erreur utilisation potion :",
      error
    );
  } 

 
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
  playEntryInRoom,
 
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
  selectedPjView,
  onEquipmentDropOnPj:handleUsePotion,
 
});


  /* ********************************************** Chargement des PjSprites************************************* */
  useEffect(() => {
  if (!gameState) return;

  const newPjs = gameState.team.pjs.map((pj) => ({
    ...pj,
    animation: {
      id: 0,
      name: "idle" as const,
    },
  }));

  setPjs(newPjs);

  // Sélection automatique du premier PJ
  if (selectedPjId === null && newPjs.length > 0) {
    setSelectedPjId(newPjs[0]!.id);
  }

}, [gameState?.team.pjs]);


/* ********************************************** Chargement de la room avec gestion des prologues***************************** */
useEffect(() => {
 
  const fetchRoom = async () => {
    try {
      // On ferme immédiatement l'éventuel prologue précédent
      setShowPrologue(false);

      console.log("NOUVEAU ROOM ID :", roomId);

      const result = await loadRoom(roomId);


      pendingEntryAnimation.current = result.animation;
      console.log("chargement room", result.gameState.room.npcs);
      setGameState(result.gameState);

      // On décide à partir de LA NOUVELLE room
      if (result.gameState.room.prologueId > 0) {
        setShowPrologue(true);
      }
    } catch (error) {
      console.error(
        "Erreur chargement room",
        error
      );
    }
  };

  fetchRoom();
}, [roomId]);


/* ********************************************** Chargement des NPC ****************************************** */
useEffect(() => {
  if (!gameState?.room) return;

   console.log(
    "NPC DU GAMESTATE :",
    gameState.room.npcs.map(npc => npc.id)
  );
  
  const newNpcs = gameState.room.npcs.map((npc) => ({
    ...npc,
    animation: {
      id: 0,
      name: "idle" as const,
    },
  }));

  console.log(
    "NPC CRÉÉS :",
    newNpcs.map(npc => npc.id)
  );

  setNpcs(newNpcs);
}, [gameState?.room]);

/* ******************************************** Lancement des animation de début de room ********************** */
useEffect(() => {
  if (npcs.length === 0) return;
  if (!pendingEntryAnimation.current) return;

  const animations = pendingEntryAnimation.current;
  pendingEntryAnimation.current = null;

  playEntryInRoom(animations);
}, [npcs]);

/* ************************************************** Gestion du PJ selectionné ************************************ */
function getSelectedPj(pjs: PjSprite[], selectedPjId: number): PjSprite | undefined {
  const pj = pjs.find(pj => pj.id === selectedPjId);

   return pj;
}




/* *************************************** Ecran de chargement avant les fonctions pour se passer du ? ***************** */
if (!gameState?.room || !selectedPjSprite || !gameState.room || selectedPjId == null) {
  return <div>Chargement...</div>;
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

  
  try {

     const response = await executeIA(); 
    
     await playEndTurn(response.results);
     
     // Si le combat est fini : transition ou retour au text
     setGameState(response.gameState);   
     const lastEvent = response.results.at(-1);

    if (!lastEvent) return;
    if (lastEvent.fightStatus === "victory") {
        handleFightFinished(response.gameState);
        return;
    }

    if (lastEvent.fightStatus === "defeat") {
        handleGameOver();
        return;
    }
  
    // Enable a nouveau curseur et bouton
  } finally {
    setIsEndTurnRunning(false);
  }
};
  

const handleFightFinished = (newGameState: GameStateView) => {
  if (newGameState.room.transitionId > 0) {
    setShowTransition(true);
    return;
  }

  if (newGameState.room.transitionId === -1) {
    setShowVictory(true);
  }
};


const handleGameOver = () => {
  setShowGameOver(true);
}






/* **********************************************  Gestion Selection Action - Remonté de ActionMenu******************************* */

const handleSelectAction = (ability: AbilityView) => {

  if (!selectedPjView) return;

  // Pas assez d'AP
  if (selectedPjView.ap < ability.ap) {
    return;
  }

   // Si on reclique sur l'action déjà sélectionnée
  if (selectedAbility?.id === ability.id) {
    setSelectedAbility(null);
    setPreviewApCost(0);
    return;
  }

  if(ability.target === "pj")
   showBattleMessage(
      "Selectionnez un personnage pour lancer l'action", 4000
    );
  if(ability.target === "npc")
   showBattleMessage(
      "Sélectionnez une cible ennemie pour lancer l'action",4000
    );
  if(ability.target === "self")
     showBattleMessage(
      "Cliquez sur votre personnage pour lancer l'action", 4000
    );

  setSelectedAbility((current) =>
    current?.id === ability.id
      ? null
      : ability
  );
  setPreviewApCost(ability.ap);
};

/* **********************************************  Gestion du click sur un PJ - Appel au backEnd à faire ************************ */
const handlePjClick = async (pjId: number) => {

  // Aucun skill sélectionné = sélection du PJ
  if (!selectedAbility) {
    setSelectedPjId(pjId);
    return;
  }

  // Action ciblant un PJ
  if (selectedAbility.target === "pj") {

    const request: ActionRequest = {
      id_action: selectedAbility.basicAbilityId,
      id_pj: selectedPjId,
      id_target: pjId,
    };

    const response = await sendAction(request);

    
    setSelectedAbility(null);
    await playActionResult(response.result);
   
    setPreviewApCost(0);
    setGameState(response.gameState);

    return;
  }

  // Action sur soi-même
  if (
    selectedAbility.target === "self" &&
    pjId === selectedPjId
  ) {

    const request: ActionRequest = {
      id_action: selectedAbility.basicAbilityId,
      id_pj: selectedPjId,
      id_target: pjId,
    };

    const response = await sendAction(request);

    setSelectedAbility(null);
   console.log(
  "AP AVANT :", selectedPjView?.ap,
  "AP APRÈS :",
  response.gameState.team.pjs.find(
    pj => pj.id === selectedPjId
  )?.ap
);

    await playActionResult(response.result);
     setPreviewApCost(0);
    setGameState(response.gameState);

    return;
  }

  // Mauvaise cible → on désélectionne l'action
  setSelectedAbility(null);
  setPreviewApCost(0);
};

/* **********************************************  Gestion du click sur un NPC - Appel au backend a finir ************************ */

const handleNpcClick = async (npcId: number) => {
  if (!selectedAbility) return;
  if (!selectedPjId) return;
 
  
  // L'action attend un Pj : action deselectionné
  if (selectedAbility.target === "pj") {
    setSelectedAbility(null);
    setPreviewApCost(0);
    return;
  }

  // L'action attend un NPC 
  if (selectedAbility.target === "npc") {
   
   const response= await sendAction({
    id_action: selectedAbility.basicAbilityId,
    id_pj: selectedPjId,
    id_target: npcId,
  }); 
   
 
    setSelectedAbility(null);
    await playActionResult(response.result);
    setGameState(response.gameState);
    setPreviewApCost(0);
  
  if (response.result.fightStatus === "victory") {
    handleFightFinished(response.gameState);
  return;
}

  if (response.result.fightStatus === "defeat") {
    handleGameOver();
    return;
  }

 
}
 

}



/* *********************************************************************************************************************** */
/* **********************************************  DEBUT JSX ************************************************************* */
/* *********************************************************************************************************************** */


return (
   <main
    onPointerMove={handleEquipmentPointerMove}
    style={{
      position: "relative",
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
    }}
  >
    {/* BACKGROUND */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `
       linear-gradient(
       rgba(255,255,255,0.1),
      rgba(255,255,255,0.1)
       ),
       url(${getHistoryImage(gameState.room.imageId)})
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        filter: "brightness(1.25) saturate(0.6)",
         width: "100%",
        height: "100%",
        display: "flex",
        userSelect: "none",
        WebkitUserSelect: "none",
        zIndex: 0,
      }}
    />
    {/* CONTENU AU-DESSUS DU BACKGROUND */}
<div
  style={{
    position: "relative",
    zIndex: 1,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    userSelect: "none",
    WebkitUserSelect: "none",
  }}
>
   
      {/* BATTLEFIELD*/}

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
  transitionId={gameState.room.transitionId}
  onContinue={() => {
    

    onFightEnd(gameState.room.destination);
  }}
/>
        )}

         {showVictory && (
          <FightVictoryDialog
            roomId={gameState.room.id}
            onContinue={() => onFightEnd(gameState.room.destination)}
          />
        )}

        {showPrologue && (
          <FightPrologueDialog
              prologueId={gameState.room.prologueId}
              onContinue={() => setShowPrologue(false)}
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
            previewApCost={previewApCost}

            onAuthorImpact={handleAuthorImpact}
            onReactionImpact={handleReactionImpact}
            onReactionEnd={handleReactionEnd}

            fightPopups={fightPopups}
            onRemoveFightPopup={removeFightPopup}

            onDropEquipmentOnPj={handleDropOnPj}
            
          />
        ) : (
          selectedPjSprite && (
            <LearnAbility
              pjId={selectedPjSprite.id}
                           />
          )
        )}
      </div>


      {/* ACTION MENU : 30% */}

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
          pj={selectedPjSprite}
          selectedAction={selectedAbility}
          onSelectAction={handleSelectAction}
          onToggleInventory={handleToggleInventory}
          inventoryOpen={fightView === "inventory"}
          onEndTurn={handleEndTurn}
          dragEquipmentId={draggedEquipmentId}
          onEquipmentPointerDown={handleEquipmentPointerDown}
          onDropBeltSlot={handleDropOnBeltSlot}
          disabled={isEndTurnRunning}
        />
      </div></div>
   

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
{battleMessage && (
  <div
    style={{
      position: "absolute",
      top: "68%",
      left: "50%",
      transform: "translate(-50%, -50%)",

      zIndex: 10000,

      color: "#f8e7a5",
      fontFamily: "'Uncial Antiqua', serif",
      fontSize: 20,
      fontWeight: "bold",

      textShadow: `
        2px 2px 2px #000,
        -1px -1px 2px #000
      `,

      pointerEvents: "none",
      userSelect: "none",
    }}
  >
    {battleMessage}
  </div>
)}


  </main>
);
}

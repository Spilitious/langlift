"use client";

import { useState, useEffect, useRef} from "react";
import Battlefield from "./Battlefield";
import ActionMenu from "./menu/ActionMenu";
import type { ActionRequest} from "../../../shared/types/action";
import { usePotion, sendAction, executeIA } from "@/utils/api/fightApi";
import { getImageEquipment } from "@/utils/spritePaths";
import { useEquipmentDrag } from "./hooks/useEquipmentDrag";
import { useFightEngine } from "./hooks/useFightEngine";
import type {NpcSprite,   PjSprite,} from "@/types/fighterSprite";
import type { ActionResult } from "@shared/types/actionResult";


import type { HistoryDestination } from  "../../../shared/types/history";
import FightTransitionDialog from "./dialogue/FightTransition";
import FightVictoryDialog from "./dialogue/FightVictory";
import FightPrologueDialog from "./dialogue/FightPrologue";
import GameOver from "./dialogue/GameOver";
import { getHistoryImage } from "@/utils/spritePaths";
import { loadRoom} from  "@/utils/api/roomApi";
import { useGame } from "@/context/GameContext";
import { AbilityView } from "@shared/types/abilityView";
import type { GameStateView } from "@shared/types/gameStateView";


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
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);

  //PjSprite selectionné 
  const [selectedPjId, setSelectedPjId] =  useState<number | null>(null);
  const selectedPjSprite =  selectedPjId === null ? undefined : getSelectedPj(pjs, selectedPjId);
  // PJ graphique
  const selectedPjView = gameState?.team.pjs.find(pj => pj.id === selectedPjId);

   //PjSprite selectionné 
  const [selectedNpcId, setSelectedNpcId] = useState<number>();

  //Pour la gestion de la première intent du npc lors de l'entrée dans la room 
  const pendingEntryAnimation = useRef<ActionResult[][] | null>(null);

  //Message Ui 
  const [battleMessage, setBattleMessage] = useState<string | null>(null);

  //Pour la pré visualiser le coût en ap 
  const [previewApCost, setPreviewApCost] = useState(0);

 // const provokingNpc = npcs.find((npc) => npc.bms.some((bm) => bm.basicBmId ===  12));
 const canTargetNpc = (npcId: number): boolean => {

  if (!selectedAbility) return false;

  if (selectedAbility.target !== "npc") {
    return false;
  }

  if (selectedAbility.ignoreProvocation) {
    return true;
  }

  const provokingNpcIds = npcs.filter((npc) =>
      npc.bms.some(
        (bm) => bm.basicBmId === 12
      )
    )
    .map((npc) => npc.id);

   
  if (provokingNpcIds.length === 0) {
    return true;
  }

  return provokingNpcIds.includes(npcId);
};

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
    id_pj: selectedPjView.id,
    id_potion: potionId,
    id_target: targetId,
  };

  try {
    const response = await usePotion(request);

    await playResults(response.result);
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
  removeFightPopup,
  playResults,
  handleAnimationEnd,
  
 
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

  const newPjs = gameState.team.pjs.filter(pj => (pj.fight_absent == 0)).map((pj) => ({
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

      const result = await loadRoom(roomId);


      pendingEntryAnimation.current = result.animation;
      
      setGameState(result.gameState);

      if(!result.gameState.room)
          return;

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

 
  
  const newNpcs = gameState.room.npcs.map((npc) => ({
    ...npc,
    animation: {
      id: 0,
      name: "idle" as const,
    },
  }));

  

  setNpcs(newNpcs);
}, [gameState?.room]);


/* ******************************************** Lancement des animation de début de room ********************** */
useEffect(() => {
  if (npcs.length === 0) return;
  if (!pendingEntryAnimation.current) return;

  const animations =
    pendingEntryAnimation.current;

  pendingEntryAnimation.current = null;

  playResults(animations);

}, [npcs]);

/* ************************************************** Gestion du PJ selectionné ************************************ */
function getSelectedPj(pjs: PjSprite[], selectedPjId: number): PjSprite | undefined {
  const pj = pjs.find(pj => pj.id === selectedPjId);

   return pj;
}

useEffect(() => {
  if (pjs.length === 0) return;

  const selectedPj = pjs.find(
    pj => pj.id === selectedPjId
  );

  // La sélection actuelle est encore valide
  if (
    selectedPj &&
    selectedPj.stats.currhp > 0
  ) {
    return;
  }

  // Cherche le prochain PJ conscient
  const nextPj = pjs.find(
    pj => pj.stats.currhp > 0
  );

  if (nextPj) {
    setSelectedPjId(nextPj.id);
    setSelectedAbility(null);
    setPreviewApCost(0);
  }
}, [pjs, selectedPjId]);


/* *************************************** Ecran de chargement avant les fonctions pour se passer du ? ***************** */
if (!gameState?.room || !selectedPjSprite || !gameState.room || selectedPjId == null) {
  return <div>Chargement...</div>;
}


const room = gameState.room;



/* **********************************************  Gestion du End Turn ********************************* */

const handleEndTurn = async () => {
  if (isAnimationRunning) return;

  // Désactive bouton et curseur pendant les animations
  setIsAnimationRunning(true);

  try {
    const response = await executeIA();

    // Toutes les animations passent par le même moteur
    await playResults(response.results);

    // Synchronisation avec l'état final backend
    setGameState(response.gameState);

    const lastGroup = response.results.at(-1);
    const lastEvent = lastGroup?.at(-1);

    if (!lastEvent) return;

    if (lastEvent.fightStatus === "victory") {
      handleFightFinished(response.gameState);
      return;
    }
   
    if (lastEvent.fightStatus === "defeat") {
      handleGameOver();
      return;
    }

  } finally {
    setIsAnimationRunning(false);
  }
};
  

const handleFightFinished = (newGameState: GameStateView) => {
  if(!newGameState.room)
      return;

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
    await playResults(response.result);
   
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
   
    await playResults(response.result);
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
   
  // Désactive bouton et curseur pendant les animations
  setIsAnimationRunning(true);

   const response= await sendAction({
    id_action: selectedAbility.basicAbilityId,
    id_pj: selectedPjId,
    id_target: npcId,
  }); 
   
 
    setSelectedAbility(null);
    await playResults(response.result);
    setGameState(response.gameState);
    setPreviewApCost(0);
     // Réaactive bouton et curseur à la fin des animations
    setIsAnimationRunning(false);
   const lastGroup = response.result.at(-1);
    const lastEvent = lastGroup?.at(-1);

    if (!lastEvent) return;

    if (lastEvent.fightStatus === "victory") {
      handleFightFinished(response.gameState);
      return;
    }

    if (lastEvent.fightStatus === "defeat") {
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
          onFightEnd(room.destination);
  }}
/>
        )}
          {showGameOver && (
          <GameOver/>
        )}
         {showVictory && (
          <FightVictoryDialog
            roomId={gameState.room.id}
            onContinue={() => onFightEnd(room.destination)}
          />
        )}

        {showPrologue && (
          <FightPrologueDialog
              prologueId={gameState.room.prologueId}
              onContinue={() => setShowPrologue(false)}
         />
        )}

           <Battlefield
            pjs={pjs}
            npcs={npcs}
            canTargetNpc={canTargetNpc}
            selectedPjId={selectedPjId}
            selectedNpcId={selectedNpcId}

            onPjClick={handlePjClick}
            onNpcClick={handleNpcClick}
            previewApCost={previewApCost}

            onAnimationEnd={handleAnimationEnd}

            fightPopups={fightPopups}
            onRemoveFightPopup={removeFightPopup}

            onDropEquipmentOnPj={handleDropOnPj}
            
          />
      
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
         
         
          onEndTurn={handleEndTurn}
          dragEquipmentId={draggedEquipmentId}
          onEquipmentPointerDown={handleEquipmentPointerDown}
          onDropBeltSlot={handleDropOnBeltSlot}
          disabled={isAnimationRunning}
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
  
  {isAnimationRunning && (
  <div
    style={{
      position: "absolute",
      inset: 0,
      zIndex: 99999,
      //cursor: "none",
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

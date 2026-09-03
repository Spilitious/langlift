
import { EndTurnResult } from  "../../../../shared/types/ia";
import { useRef, useState } from "react";
import { getNpcPosition, getPjPosition } from "@/utils/fighterPosition";

import type {
  ActionResult,
  TargetResult,
} from "../../../../shared/types/actionResult";

import type {  PjSprite, NpcSprite, } from "@/types/fighterSprite";

import type {
  FightPopup,
  FightPopupData,
} from "../../../../shared/types/fightPopUp";


type FighterType = "pj" | "npc";

type UseFightEngineProps = {
  pjs: PjSprite[];
  npcs: NpcSprite[];

  setPjs: React.Dispatch<
    React.SetStateAction<PjSprite[]>
  >;

  setNpcs: React.Dispatch<
    React.SetStateAction<NpcSprite[]>
  >;
};

/* **************************************************** Début du composant ********************************** */
/* ********************************************************************************************************** */

export function useFightEngine({
  pjs,
  npcs,
  setPjs,
  setNpcs,
}: UseFightEngineProps) {
  
const actionResolver = useRef<(() => void) | null>(null);

const pendingResult = useRef<ActionResult | null>(null);

const currentStep = useRef(0);

const pendingReactions = useRef(0);

const [fightPopups, setFightPopups] = useState<FightPopup[]>([]);


/* *************************************************** Gestion POPUP *********************************************** */

const removeFightPopup = (popupId: number) => {
  setFightPopups((current) =>
    current.filter(
      (popup) => popup.id !== popupId
    )
  );
};

const showFightPopup = (
    details: FightPopupData,
    x: number,
    y: number
  ) => {
    setFightPopups((current) => [
      ...current,
      {
        id: Date.now(),
        details,
        x,
        y,
      },
    ]);
  };


  // =========================================================
  // RESET ANIMATIONS
  // =========================================================

  const resetAnimations = () => {
  const id = Date.now();

  setPjs((current) =>
    current.map((pj) =>
      pj.base_att.currhp <= 0
        ? pj
        : {
            ...pj,
            animation: {
              id,
              name: "idle",
            },
          }
    )
  );

  setNpcs((current) =>
    current.map((npc) =>
      npc.hp <= 0
        ? npc
        : {
            ...npc,
            animation: {
              id,
              name: "idle",
            },
          }
    )
  );
};

/* *************************************************************************************************** */
/* *****************************************  LANCEMENT ACTION *************************************** */
  
const playActionResult = (
  result: ActionResult
): Promise<void> => {

  return new Promise((resolve) => {

    // On mémorise comment signaler
    // que cette action est terminée
    actionResolver.current = resolve;
    pendingResult.current = result;
    currentStep.current = 0;

    const animation = {
      id: Date.now(),
      name: result.animationName,
    };

    if (
  result.author_type === undefined ||
  result.id_author === undefined ||
  result.animationName === "idle"
) {
  playCurrentStep();
  return;
}

    // Auteur PJ
    if (result.author_type === "pj") {
      setPjs((current) =>
        current.map((pj) =>
          pj.id === result.id_author
            ? {
                ...pj,
                animation,
              }
            : pj
        )
      );
    }

    // Auteur NPC
    if (result.author_type === "npc") {
      setNpcs((current) =>
        current.map((npc) =>
          npc.id === result.id_author
            ? {
                ...npc,
                animation,
              }
            : npc
        )
      );
    }
  });
};

// JOUE UNE ETAPE
const playCurrentStep = () => {
    const result =
      pendingResult.current;

    

    if (!result) return;

    const step =
      result.steps[currentStep.current];

    if (!step) {
      pendingResult.current = null;
      return;
    }

    pendingReactions.current =
      step.length;

    step.forEach((targetResult) => {
      applyTargetResult(targetResult);
    });
  };

// Lance l'animation pour l'étape en cours 
const applyTargetResult = (
    target: TargetResult
  ) => {

    
    const animation = {
      id: Date.now(),
      name: target.animationName
    };

    if (target.target_type === "pj") {
      setPjs((current) =>
        current.map((pj) =>
          pj.id === target.id_target
            ? {
                ...pj,

                hp: target.hp_end,
                shield: target.shield_end,
                bms: target.bm_end,

                animation,
              }
            : pj
        )
      );
    }

    if (target.target_type === "npc") {
     
    setNpcs((current) =>
    current.map((npc) => {
      if (npc.id !== target.id_target) {
        return npc;
      }

     

      return {
        ...npc,

       old_intent: npc.npc_intent,
       pending_intent: target.new_intent,

        hp: target.hp_end,
        shield: target.shield_end,
        bms: target.bm_end,

        animation,
      };
    })
  );
}
  }

// 
const handleAuthorImpact = (
    authorType: FighterType,
    authorId: number
  ) => {

   
    const result =
      pendingResult.current;

    if (!result) return;

    if (
      result.author_type !== authorType ||
      result.id_author !== authorId
    ) {
      return;
    }
    

    playCurrentStep();
  };

  // =========================================================
  // IMPACT REACTION
  // =========================================================

  const handleReactionImpact = (
    fighterType: FighterType,
    fighterId: number
  ) => {
    const result =
      pendingResult.current;

    if (!result) return;

    const step =
      result.steps[currentStep.current];

    if (!step) return;

    const targetResult =
      step.find(
        (target) =>
          target.target_type ===
            fighterType &&
          target.id_target ===
            fighterId
      );

    if (!targetResult) return;

    const fighter =
      fighterType === "pj"
        ? pjs.find(
            (pj) =>
              pj.id === fighterId
          )
        : npcs.find(
            (npc) =>
              npc.id === fighterId
          );

    if (!fighter) return;
    const [x, y] =
  fighterType === "npc"
    ? getNpcPosition(fighter.position)
    : getPjPosition(fighter.position);

showFightPopup(
  targetResult.popup,
  x,
  y
);
  };

  // =========================================================
  // FIN REACTION
  // =========================================================

  const handleReactionEnd = () => {
 
    pendingReactions.current -= 1;
    if (
      pendingReactions.current > 0
    ) {
      return;
    }

    const result =
      pendingResult.current;

    if (!result) return;

    const step =
    result.steps[currentStep.current];
    // Valide les changements d'intent
    step.forEach((target) => {
    if (
      target.target_type === "npc" &&
      target.animationName === "change_intent"
    ) {
      setNpcs((current) =>
        current.map((npc) =>
          npc.id === target.id_target
            ? {
                ...npc,
                npc_intent:
                  npc.pending_intent ??
                  npc.npc_intent,

                pending_intent: undefined,
                old_intent: undefined,
              }
            : npc
        )
      );
    }
  });

    currentStep.current += 1;

    if (
      currentStep.current <
      result.steps.length
    ) {
      playCurrentStep();
      return;
    }

    pendingResult.current = null;

    resetAnimations();

   
    // Signale que l'ActionResult
    // est complètement terminé
    actionResolver.current?.();
    actionResolver.current = null;
  };


  /* ********************************************* Lance les animations du result de l'IA après EndTurn ********************* */
 const playEndTurn = async (
  result: EndTurnResult
) => {

  for (const event of result.events) {
      await playActionResult(event); 
  }


};
  
  


  // =========================================================
  // API DU HOOK
  // =========================================================

  return {
    fightPopups,
    playEndTurn,
    playActionResult,
    removeFightPopup,
    handleAuthorImpact,
    handleReactionImpact,
    handleReactionEnd,
    
  };
}
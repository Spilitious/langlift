import { useRef, useState } from "react";
import {
  getNpcPosition,
  getPjPosition,
} from "@/utils/fighterPosition";

import type {
  ActionResult,
} from "../../../../shared/types/actionResult";

import type {
  PjSprite,
  NpcSprite,
} from "@/types/fighterSprite";

import type {
  FightPopup,
  FightPopupData,
} from "../../../../shared/types/fightPopUp";


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


export function useFightEngine({
  pjs,
  npcs,
  setPjs,
  setNpcs,
}: UseFightEngineProps) {

  const [fightPopups, setFightPopups] =
    useState<FightPopup[]>([]);


  const popupIdRef = useRef(0);
  const animationIdRef = useRef(0);

  /* Un resolver par fighter pour gerer les animations simultanés */
  const animationResolvers = useRef<
  Map<
    string,
    {
      result: ActionResult;
      resolve: () => void;
    }
  >
>(new Map());
  // =========================================================
  // POPUPS
  // =========================================================

  const removeFightPopup = (
    popupId: number
  ) => {
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
        id: ++popupIdRef.current,
        details,
        x,
        y,
      },
    ]);
  };


  // =========================================================
  // RESET
  // =========================================================

  const resetAnimations = () => {

    const id = Date.now();

    setPjs((current) =>
      current.map((pj) =>
        pj.stats.currhp <= 0
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
        npc.stats.currhp <= 0
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


  // =========================================================
  // JOUE UN ACTION RESULT
  // =========================================================

  const playActionResult = (
    result: ActionResult
  ): Promise<void> => {

    return new Promise((resolve) => {

      const animation = {
        id: ++animationIdRef.current,
        name: result.animationName,
      };

      const key =
        `${result.fighter_type}-${result.fighter_id}`;

      animationResolvers.current.set(key, {
  result,
  resolve,
});


      // =====================
      // PJ
      // =====================

      if (result.fighter_type === "pj") {

        const fighter = pjs.find(
          (pj) =>
            pj.id === result.fighter_id
        );

        if (!fighter) {
          animationResolvers.current.delete(key);
          resolve();
          return;
        }

        if (result.popup) {

          const [x, y] =
            getPjPosition(
              fighter.position
            );

          showFightPopup(
            result.popup,
            x,
            y
          );
        }

        setPjs((current) =>
          current.map((pj) =>
            pj.id === result.fighter_id
              ? {
                  ...pj,

                  stats: {
                    ...pj.stats,
                    currhp: result.hp_end,
                    shield:
                      result.shield_end,
                    armor:
                      result.armor_end,
                  },

                  bms: result.bm_end,

                  animation,
                }
              : pj
          )
        );
      }


      // =====================
      // NPC
      // =====================

      if (result.fighter_type === "npc") {

        const fighter = npcs.find(
          (npc) =>
            npc.id === result.fighter_id
        );

        if (!fighter) {
          animationResolvers.current.delete(key);
          resolve();
          return;
        }

        if (result.popup) {

          const [x, y] =
            getNpcPosition(
              fighter.position, fighter.size
            );

          showFightPopup(
            result.popup,
            x,
            y
          );
        }

        setNpcs((current) =>
          current.map((npc) => {

            if (
              npc.id !==
              result.fighter_id
            ) {
              return npc;
            }

            return {
              ...npc,

              stats: {
                ...npc.stats,
                currhp: result.hp_end,
                shield:
                  result.shield_end,
                armor:
                  result.armor_end,
              },

              bms: result.bm_end,

              old_intent:
                result.new_intent
                  ? npc.intent
                  : npc.old_intent,

              pending_intent:
                result.new_intent,

              animation,
            };
          })
        );
      }
    });
  };


  // =========================================================
  // FIN D'UNE ANIMATION
  // =========================================================

  const handleAnimationEnd = (
  fighterType: "pj" | "npc",
  fighterId: number
) => {
  const key = `${fighterType}-${fighterId}`;

  const pending =
    animationResolvers.current.get(key);

  if (!pending) return;

  // Si c'était un changement d'intent,
  // on valide immédiatement le nouvel intent
  if (
    fighterType === "npc" &&
    pending.result.animationName === "change_intent"
  ) {
    setNpcs((prev) =>
      prev.map((npc) =>
        npc.id === fighterId
          ? {
              ...npc,
              intent:
                npc.pending_intent ?? npc.intent,
              pending_intent: undefined,
              old_intent: undefined,
            }
          : npc
      )
    );
  }

  animationResolvers.current.delete(key);
  pending.resolve();
};


  // =========================================================
  // JOUE ActionResult[][]
  // =========================================================

  const playResults = async (
    results: ActionResult[][]
  ) => {

    for (const group of results) {

      await Promise.all(
        group.map(
          (result) =>
            playActionResult(result)
        )
      );

      resetAnimations();
    }
  };


  // =========================================================
  // API
  // =========================================================

  return {
    fightPopups,

    playResults,
    playActionResult,

    removeFightPopup,

    handleAnimationEnd,
  };
}
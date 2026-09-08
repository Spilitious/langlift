"use client";

import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { getImageEquipment } from "@/utils/spritePaths";
import type { EquipmentView } from "@shared/types/equipmentView";
import MainButton from "../button/MainButton";
import { equipEquipment } from "@/utils/api/equipmentApi";

type AlchemyProps = {
  draggedEquipmentId: number | null;
  ingredients: (EquipmentView | null)[];
  onAddIngredient: (slot:number, ing:EquipmentView) => void;

  
   onIngredientPointerDown: (
    event: React.PointerEvent,
    equipmentId: number,
    slotId:number,
  ) => void;
  
  onCreatePotion : () => void;

};
export default function ShopInventory({
  draggedEquipmentId,
  onIngredientPointerDown,
  ingredients,
  onAddIngredient,
  onCreatePotion,
  
}: AlchemyProps) {

  const { gameState } = useGame();

  if (!gameState) return null;
  const alchemySlots = [
  { id: 0, left: "62%", top: "37%" },
  { id: 1, left: "69%", top: "37%" },
  { id: 2, left: "76%", top: "37%" },
];


  const handlePointerUp = (
  event: React.PointerEvent<HTMLDivElement>,
  slotId: number
) => {
  if (draggedEquipmentId === null) return;

  const eq = gameState.team.pjs[0]?.equipment.find(
    equip => equip.id === draggedEquipmentId
  );

  if (!eq) return;
  if (eq.type !== "ingredient") return;

  event.stopPropagation();
  onAddIngredient(slotId, eq)
};

  return (
  <main
    style={{
      width: "100%",
      height: "100%",
    }}
  >
    <div
      
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",

        backgroundImage:
          'url("/ui/alchemy/background-alchemy.png")',

        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",

        paddingTop: "40px",
        boxSizing: "border-box",
      }}
    >
   {alchemySlots.map((slot) => {
  const ingredient = ingredients[slot.id];

  return (
    <div
      key={slot.id}
      
      onPointerUp={(event) =>
        handlePointerUp(event, slot.id)
      }
      style={{
        position: "absolute",
        left: slot.left,
        top: slot.top,

        // grande zone de drop
        width: "5%",
        height: "18%",

        // pour que left/top représente le centre
        transform: "translate(-50%, -50%)",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        zIndex: 10,

        // temporaire
        // background: "rgba(255, 0, 0, 0.25)",
      }}
    >
      {ingredient && (
        <img
          src={getImageEquipment(
            ingredient.type,
            ingredient.image
          )}
            onPointerDown={(event) => onIngredientPointerDown(event, ingredient.id,  slot.id)
                  }
          alt={ingredient.name}
          draggable={false}
          style={{
            // objet plus petit que la zone de drop
            width: "55%",
            height: "75%",
            objectFit: "contain",
           
          }}
        />
      )}
    </div>
  );
})}
      <img
        
        src="/ui/alchemy/alchemy.png"
        alt=""
        draggable={false}
        style={{
          position: "absolute",
          left: "850px",
          top: "100px",

          width: "50%",
          height: "50%",

          objectFit: "contain",
        }}
      />
      <div 
      style={{
          position: "absolute",
          left: "1550px",
          top: "200px",
        }}
>
      <MainButton
          onClick={onCreatePotion}
          name="next"
        /></div>
    </div>
  </main>
);
}
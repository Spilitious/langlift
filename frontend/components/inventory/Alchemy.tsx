"use client";

import { useEffect, useState } from "react";
import { useGame } from "@/context/GameContext";
import { getImageEquipment } from "@/utils/spritePaths";
import type { EquipmentView } from "@shared/types/equipmentView";
import MainButton from "../button/MainButton";
import { equipEquipment } from "@/utils/api/equipmentApi";

import type { PjView } from "@shared/types/fighterView";

type AlchemyProps = {
  draggedEquipmentId: number | null;
  pj:PjView;
  onAddIngredient: (slot:number, ing:EquipmentView) => void;
  message:string | null;
  access:boolean | undefined;
  
   onIngredientPointerDown: (
    event: React.PointerEvent,
    equipmentId: number,
    slotId:number,

  ) => void;
  
  onCreatePotion : () => void;

};
export default function Alchemy({
  draggedEquipmentId,
  onIngredientPointerDown,
  pj,
  onAddIngredient,
  onCreatePotion,
  message,
  access,
  
}: AlchemyProps) {

 // const { gameState } = useGame();

 
  const alchemySlots = [
  { id: 0, left: "30%", top: "27%" },
  { id: 1, left: "50%", top: "27%" },
  { id: 2, left: "70%", top: "27%" },
];
const alchemyEquipment = pj.equipment.filter(
  equip => equip.location === "alchemy"
);

const potion = alchemyEquipment.find(
  equip => equip.alchemySlot === 4
);






const disable =
  alchemyEquipment.length <= 1 ||
  potion !== undefined;


    const ingredients = [0, 1, 2].map(slotId =>
    pj.equipment.find(
    equipment =>
      equipment.location === "alchemy" &&
      equipment.alchemySlot === slotId
  ) ?? null
);

/* ********************************************** DEBUT DES FONCTION *************************** */
/* **************************************************** Gestion message UI ********************************* */



const handlePointerUp = (
  event: React.PointerEvent<HTMLDivElement>,
  slotId: number
) => {
  if (draggedEquipmentId === null) return;

 const eq = pj.equipment.find(
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
      width: "680px",
      height: "30%",
    }}
  >
    <div
      
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        backgroundColor: "rgba(0, 0, 0, 0.58)",
        border: "2px solid #6f5730",
        borderRadius: "10px",
        boxSizing: "border-box",
        color: "#e8d7a5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        //  backgroundImage:
        //  'url("/ui/alchemy/background-alchemy.png")',

        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",

        paddingTop: "40px",
        
      }}>
      {!access && (
      <div
    style={{
      position: "absolute",
      inset: 0,
      zIndex: 9999,

      backgroundColor: "rgba(20, 20, 20, 0.70)",
      backdropFilter: "grayscale(1)",

      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      color: "#b9b9b9",
      fontFamily: "'Uncial Antiqua', serif",
      fontSize: "22px",
      fontWeight: "bold",

      textShadow: "2px 2px 3px #000",

      cursor: "not-allowed",
    }}
  >
    Alchimie indisponible
  </div>
)}
    
   {alchemySlots.map((slot) => {
  const ingredient = ingredients[slot.id];
  if (ingredient?.id === draggedEquipmentId) {
  return null;}

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
        width: "10%",
        height: "18%",

        // pour que left/top représente le centre
        transform: "translate(-50%, -50%)",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        zIndex: 10,

        // temporaire
        //background: "rgba(255, 0, 0, 0.25)",
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
            width: "80%",
            height: "95%",
            objectFit: "contain",
           
          }}
        />
      )}
    </div>
  );
})}
 <div
      style={{
        position: "absolute",
        left: "50%",
        top: "60%",

        // grande zone de drop
        width: "10%",
        height: "18%",

        // pour que left/top représente le centre
        transform: "translate(-50%, -50%)",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        zIndex: 10,

        // temporaire
     //  background: "rgba(255, 0, 0, 0.25)",
      }}
    >
      {potion && (potion.id !== draggedEquipmentId) &&
        <img
    src={getImageEquipment(
      potion.type,
      potion.image
    )}
    onPointerDown={(event) =>
      onIngredientPointerDown(
        event,
        potion.id,
        4
      )
    }
    alt={potion.name}
    draggable={false}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "contain",
    }}
  />
}
    </div>
 

      <img
        
        src="/ui/alchemy/alchemy.png"
        alt=""
        draggable={false}
        style={{
          width: "70%",
          height: "70%",

          objectFit: "contain",
        }}
      />
      <div 
     
>
      <MainButton
          onClick={onCreatePotion}
          name="create"
          disabled={!access || disable}
        /></div>
    </div>
    
{message && (
  <div
    style={{
      position: "relative",
      top: "9%",
      left: "52%",
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
    {message}
  </div>
)}
  </main>
);
}
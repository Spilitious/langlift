"use client";

import { useState, useEffect } from "react";
import ShopInventory from "./ShopInventory";
import type { EquipmentSlot } from "@shared/types/equipmentView";
import { useGame } from "@/context/GameContext";
import PjShopInventory from "./PjShopInventory";

import { createPortal } from "react-dom";
import {
  moveEquipmentToInventory,
  moveEquipmentToBelt,
  equipEquipment,
  buyEquipment,
  sellEquipment,
  moveEquipmentToPlayer,
} from "@/utils/api/equipmentApi";
import { getImageEquipment } from "@/utils/spritePaths"
import type { HistoryDestination } from "@shared/types/history";
import {loadShop} from "../../utils/api/shopApi";


type ShopProps = {
    shopId:number;
    onDestination: (destination:HistoryDestination) => void;

  };

export default function Shop({
   shopId,
   onDestination,

}:ShopProps) {
  
  const { gameState, setGameState} = useGame();

  const [draggedEquipmentId, setDraggedEquipmentId] =
    useState<number | null>(null);

  const [selectedPjId, setSelectedPjId] =
  useState<number | null>(null);

 
  const [dragOffset, setDragOffset] =
    useState({
      x: 0,
      y: 0,
    });

    const [mousePosition, setMousePosition] =
    useState({
      x: 0,
      y: 0,
    });

    
   
        
   
useEffect(() => {
  const fetchShop = async () => {
    try {
      const result = await loadShop(shopId);

      setGameState(result);
    } catch (error) {
      console.error(
        "Erreur chargement shop",
        error
      );
    }
  };

  fetchShop();
}, [shopId, setGameState]);

useEffect(() => {
  if (!gameState) return;

  setSelectedPjId(current =>
    current ?? gameState.team.pjs[0]?.id ?? null
  );
}, [gameState]);
 

  const selectedPj =
  gameState?.team.pjs.find(
    pj => pj.id === selectedPjId
  );



  if (!selectedPj) {
    return null;
  }

  
  if (!gameState) {
    return null;
  }

  
  if (!gameState.shop) {
    return null;
  }

  
const draggedEquipment =
  selectedPj.equipment.find(
    (equipment) =>
      equipment.id === draggedEquipmentId
  )
  ??
  gameState.shop.equipments.find(
    (equipment) =>
      equipment.id === draggedEquipmentId
  )
  ??
  null;



const handleDestination = () => {
    if(!gameState.shop)
      return
    onDestination(gameState.shop.destination);
  };


/* ************************************** SELECTION D'un objet ******************************* */
const handleEquipmentPointerDown = (
  event: React.PointerEvent,
  equipmentId: number
) => {
  const rect =
    event.currentTarget.getBoundingClientRect();

  setDraggedEquipmentId(equipmentId);

  setDragOffset({
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  });

  setMousePosition({
    x: event.clientX,
    y: event.clientY,
  });

//  event.currentTarget.setPointerCapture(
  //  event.pointerId
 // );
};



/* ************************************** Gestion de la position d'un objet dragged ******************************* */
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
   
    if (draggedEquipmentId === null) return;

    setMousePosition({
      x: event.clientX,
      y: event.clientY,
    });
  };


/* ***********************************  Drop d'un objet sur la zone du marchant pour vendre ************************************** */
const handleDropOnShop = async (
  equipmentId: number
) => {
  if (!selectedPj) return;

  const equipment =
    selectedPj.equipment.find(
      (equipment) =>
        equipment.id === equipmentId
    );

  // L'objet n'appartient pas au PJ :
  // ce n'est donc pas une vente.
  if (!equipment) {
    setDraggedEquipmentId(null);
    return;
  }

  const sellPrice =
    Math.floor(equipment.price / 2);

  const response =
    await sellEquipment(
      selectedPj.id,
      equipmentId,
      sellPrice
    );

  setGameState(
    response.gameState
  );

  setDraggedEquipmentId(null);
};

/* ********************************************* Drop d'un objet sur l'équipement ************************ */
  const handleDropOnEquipmentSlot = async (
  equipmentId: number,
  slot: EquipmentSlot
) => {
  if (selectedPjId === null) return;

  const response =
    await equipEquipment(
      selectedPjId,
      equipmentId,
      slot
    );

    setGameState(response.gameState);
      setDraggedEquipmentId(
    response.moveResult.newEquipmentDragged || null
  );
};


/* ********************************************* Drop d'un objet sur la ceinture ************************ */

  const handleDropOnBeltSlot = async (equipmentId:number,
    newSlot: number
  ) => {
    
    if (selectedPjId === null) return;
    
    
  const response =
    await moveEquipmentToBelt(
      selectedPjId,
      equipmentId,
      newSlot
    );

  setGameState(response.gameState);

  setDraggedEquipmentId(
    response.moveResult.newEquipmentDragged || null
  );

  //console.log(response.gameState.pjs[0].equipment)
 
};

/* ********************************************* Drop d'un objet sur l'inventaire ************************ */

 const handleDropInInventory = async (
  equipmentId: number,
  x: number,
  y: number
) => {
 

  if (selectedPjId === null) return;
  if (draggedEquipment === null) return;
  if (!gameState.shop) return ;

  const isFromShop =
    gameState.shop.equipments.some(
      (equipment) =>
        equipment.id === equipmentId
    );

  if (isFromShop) {
    // achat
    const response = await buyEquipment(shopId, selectedPjId, equipmentId, x, y, draggedEquipment.price);
    setGameState(response.gameState);
    
    if (!response.buyResult.result) {
        switch (response.buyResult.reason) {
           
            case "not_enough_gold": console.log("Pas assez d'or");
            break;

            case "no_space":
            console.log("Pas assez de place dans l'inventaire");
            break;

            case "pj_not_found":
            console.log("PJ introuvable");
            break;
  }
}

setDraggedEquipmentId(null);

    return;
  }

  // L'equipement vient du PJ
  const response =
    await moveEquipmentToInventory(
      selectedPjId,
      equipmentId,
      x,
      y
    );

  const newDraggedId =
  response.moveResult.newEquipmentDragged;

setGameState(response.gameState);

if (newDraggedId !== 0) {
  const newDraggedEquipment =
    response.gameState.team.pjs
      .find((pj) => pj.id === selectedPjId)
      ?.equipment.find(
        (equipment) =>
          equipment.id === newDraggedId
      );

  if (newDraggedEquipment) {
    setDragOffset({
      x: newDraggedEquipment.width * 50 / 2,
      y: newDraggedEquipment.height * 50 / 2,
    });
  }

  setDraggedEquipmentId(newDraggedId);
} else {
  setDraggedEquipmentId(null);
}

   
};


const handleDropEquipmentOnPlayer = async (
  targetPjId: number
) => {
  if (
    draggedEquipmentId === null ||
    selectedPjId === null
  ) {
    return;
  }

  const response =
    await moveEquipmentToPlayer(
      selectedPjId,
      targetPjId,
      draggedEquipmentId
    );

  setGameState(response.gameState);

  // Si transfert réussi, fin du drag.
  // Sinon l'équipement reste dans la main.
  if (response.result) {
    setDraggedEquipmentId(null);
  }
};
  
  /* *********************************************** DEBUT DU JSX ********************************** */

  return (
    <div
   
    onPointerMove={handlePointerMove}
      style={{
      position: "absolute",
      width: "101%",
      height: "102%",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      display: "flex",
      backgroundImage: 'url("/ui/newBackground.png")',
      backgroundSize: "100% 100%",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
    }}
  >
      {/* Partie haute : marchand */}
   <div
  style={{
    position: "absolute",
    top: 50,
    left: "50%",
    transform: "translateX(-50%)",

    width: "100%",
    height: "51%",
  }}
>
  <ShopInventory
    draggedEquipmentId={draggedEquipmentId}
    onEquipmentPointerDown={handleEquipmentPointerDown}
    onDropOnShop={handleDropOnShop}
  />
</div>

      {/* Partie basse : inventaire PJ */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "45%",
          alignContent:"center",
        }}
      >
        <PjShopInventory
          onContinue={handleDestination}
          pj={selectedPj}
          onSelectPlayer={setSelectedPjId}
          draggedEquipmentId={draggedEquipmentId}
          draggedEquipment={draggedEquipment}
          dragOffset={dragOffset}
          onDropOnInventory={handleDropInInventory}
          onDropOnEquipment={handleDropOnEquipmentSlot}
          onEquipmentPointerDown={handleEquipmentPointerDown}
          onDropOnBelt={handleDropOnBeltSlot}
          onDropEquipmentOnPlayer={handleDropEquipmentOnPlayer}
         
        
        
        />
      </div>
      
           {draggedEquipment &&
        createPortal(
          <img
            src={getImageEquipment(
              draggedEquipment.type,
              draggedEquipment.image
            )}
            alt={draggedEquipment.name}
            draggable={false}
            style={{
              position: "fixed",
      
              left: mousePosition.x,
              top: mousePosition.y,
      
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
          />,
          document.body
        )
      }
    </div>
  );
}
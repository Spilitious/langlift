"use client";

import { useGame } from "@/context/GameContext";
import { getImageEquipment } from "@/utils/spritePaths";
import type { EquipmentView } from "@shared/types/equipmentView";

type ShopInventoryProps = {
  draggedEquipmentId: number | null;

  onEquipmentPointerDown: (
    event: React.PointerEvent,
    equipmentId: number
  ) => void;

    onDropOnShop: (
    equipmentId: number
  ) => void;

};
export default function ShopInventory({
  draggedEquipmentId,
  onEquipmentPointerDown,
  onDropOnShop,
}: ShopInventoryProps) {

  const { gameState } = useGame();

  if (!gameState) return null;

  const shop = gameState.shops[0];

  if (!shop) return null;

  const shopEquipments = shop.equipments;


const handlePointerUp = (
  event: React.PointerEvent<HTMLDivElement>
) => {
  if (draggedEquipmentId === null) {
    return;
  }

  event.stopPropagation();

  onDropOnShop(draggedEquipmentId);
};

  
return (
  <main>
    <div
   
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        overflow: "hidden",
      }}
    >
      {/* ========================= */}
      {/* GAUCHE : SHOP 70%        */}
      {/* ========================= */}

      <div
       onPointerUp={handlePointerUp}
        style={{
          
          width: "70%",
          height: "100%",

          backgroundImage:
            'url("/ui/background-texte.png")',

          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",

          paddingTop: "40px",
          boxSizing: "border-box",

          zIndex: 1,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",

            display: "grid",
            gridTemplateColumns:
              "repeat(6, 150px)",
            gridAutoRows: "210px",

            justifyContent: "center",
            alignContent: "start",

            gap: "30px",
            padding: "20px",

            boxSizing: "border-box",
            overflowY: "auto",
          }}
        >
          {shopEquipments.map((equipment) => {
            const isPotion =
              equipment.type === "potion";

            return (
              <div
                key={equipment.id}
                style={{
                  width: isPotion
                    ? "160px"
                    : "160px",

                  height: isPotion
                    ? "160px"
                    : "210px",

                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",

                  padding: "8px",

                  background:
                    "rgba(55, 32, 16, 0.90)",

                  border:
                    "2px solid #b98a3d",

                  borderRadius: "8px",

                  boxShadow:
                    "0 3px 8px rgba(0, 0, 0, 0.45)",

                  color: "#d8b56b",
                  fontFamily:
                    "Georgia, serif",

                 
                  boxSizing: "border-box",
                }}
              >
                <img
                  src={getImageEquipment(
                    equipment.type,
                    equipment.image
                  )}
                    onPointerDown={(event) =>
                       onEquipmentPointerDown(
                        event,
                        equipment.id
                      )
                  }
                  alt={equipment.name}
                  draggable={false}
                  style={{
                    width: isPotion
                      ? "50px"
                      : "100px",

                    height: isPotion
                      ? "50px"
                      : "100px",
                      visibility:
                     equipment.id === draggedEquipmentId
                    ? "hidden"
                    : "visible",
                    objectFit: "contain",
                  
                  }}
                />

                <div
                  style={{
                    marginTop: "5px",
                    width: "100%",

                    fontSize: isPotion
                      ? "14px"
                      : "17px",

                    fontWeight: "bold",
                    textAlign: "center",

                    whiteSpace: "normal",
                    overflowWrap: "break-word",
                  }}
                >
                  {equipment.name}
                </div>

                <div
                  style={{
                    marginTop: "5px",
                    width: "100%",

                    fontSize: isPotion
                      ? "12px"
                      : "14px",

                    textAlign: "center",
                    whiteSpace: "normal",
                    overflowWrap: "break-word",
                  }}
                >
                  {equipment.text}
                </div>

                <div
  style={{
    marginTop: "3px",
    fontSize: "15px",
    color: "#e6d3a2",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
  }}
>
  {equipment.price}

  <img
    src="/ui/gold.png"
    alt="or"
    draggable={false}
    style={{
      width: "14px",
      height: "14px",
      objectFit: "contain",
    }}
  />
</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================= */}
      {/* DROITE : IMAGE 30%       */}
      {/* ========================= */}

      <div
        style={{
          position: "relative",
          width: "30%",
          height: "100%",
          overflow: "visible",
        }}
      >
        <img
          src="/room/room16.png"
          alt=""
          draggable={false}
          style={{
            position: "absolute",

            left: "-100px",
            top: "30px",

            width: "100%",
            height: "90%",

            transform: "scaleX(1.15)",
            transformOrigin: "left center",

            objectFit: "cover",

            zIndex: 2,

            maskImage:
              "linear-gradient(to right, transparent 0%, black 10%)",

            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 10%)",
          }}
        />

        <img
          src="/ui/background-image3.png"
          alt=""
          draggable={false}
          style={{
            position: "absolute",
            inset: 0,

            width: "100%",
            height: "100%",

            objectFit: "fill",

            zIndex: 3,
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  </main>
);
}
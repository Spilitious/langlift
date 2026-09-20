"use client";

import Image from "next/image";
import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { getPjAvatarPath } from "@/utils/spritePaths";

type InventoryTeamDisplayProps = {
  onSelectPlayer: (id: number) => void;
  pjId:number;
   onDropEquipmentOnPlayer: (pjId: number) => void;
  draggedEquipmentId: number | null;
  
};

export default function InventoryTeamDisplay({
  onSelectPlayer,
  pjId,
  onDropEquipmentOnPlayer,
  draggedEquipmentId,

}: InventoryTeamDisplayProps) {

  const { gameState } = useGame();

  const [hoveredPjId, setHoveredPjId] =
  useState<number | null>(null);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
      }}
    >
     {gameState?.team.pjs
          .filter((player) => player.id !== pjId)
          .map((player) => {

    const isDropTarget =
      draggedEquipmentId !== null &&
      hoveredPjId === player.id;

    return (
      <div
        key={player.id}

        onPointerEnter={() => {
          if (draggedEquipmentId !== null) {
            setHoveredPjId(player.id);
          }
        }}

        onPointerLeave={() => {
          setHoveredPjId(null);
        }}

        onClick={() => {
          if (draggedEquipmentId !== null) return;

          onSelectPlayer(player.id);
        }}

        onPointerUp={() => {
          if (draggedEquipmentId === null) return;

          setHoveredPjId(null);
          onDropEquipmentOnPlayer(player.id);
        }}

        style={{
          position: "relative",

          width: 130,
          height: 130,
          flexShrink: 0,

          cursor:
            'url("/ui/cursor/cursor6.png") 0 0, pointer',

          transform: isDropTarget
            ? "scale(1.08)"
            : "scale(1)",

          filter: isDropTarget
            ? "brightness(1.15)"
            : "brightness(1)",

          transition:
            "transform 150ms ease-out, filter 150ms ease-out",
        }}
      >

          {/* Portrait */}
         <div
  style={{
    width: "100%",
    height: "100%",

    border: isDropTarget
      ? "3px solid #ffe08a"
      : "3px solid #b98a3d",

    borderRadius: 8,

    boxShadow: isDropTarget
      ? `
          0 0 8px #ffd65a,
          0 0 18px rgba(255, 190, 40, 0.8),
          0 3px 8px rgba(0, 0, 0, 0.45)
        `
      : "0 3px 8px rgba(0, 0, 0, 0.45)",

    boxSizing: "border-box",
    overflow: "hidden",

    transition:
      "border-color 150ms ease-out, box-shadow 150ms ease-out",
  }}
>
            <Image
              src={getPjAvatarPath(player.avatar)}
              alt={player.name}
              width={130}
              height={130}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>

          {/* Level up */}
          {player.canLevelUp && (
            <>
              <div className="level-up-glow" />

              <div
                style={{
                  position: "absolute",
                  top: -7,
                  right: -7,

                  width: 28,
                  height: 28,

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  borderRadius: "50%",
                  border: "2px solid #ffe08a",

                  background:
                    "radial-gradient(circle, #d9a72e 0%, #7a4c0b 100%)",

                  color: "#fff2b0",

                  fontSize: 25,
                  fontWeight: "bold",
                  lineHeight: 1,

                  textShadow: "1px 1px 2px #000",

                  boxShadow:
                    "0 0 6px #ffd65a, " +
                    "0 0 12px rgba(255,190,40,.8)",

                  zIndex: 2,
                  pointerEvents: "none",
                   cursor: 'url("/ui/cursor/cursor6.png") 0 0, pointer',
                }}
              >
                +
              </div>
            </>
          )}

              </div>
      );
    })}
    </div>
  );
}
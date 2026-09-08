"use client";

import Image from "next/image";

import { useGame } from "@/context/GameContext";
import { getPjAvatarPath } from "@/utils/spritePaths";

type InventoryTeamDisplayProps = {
  onSelectPlayer: (id: number) => void;
  pjId:number;
  
};

export default function InventoryTeamDisplay({
  onSelectPlayer,
  pjId,
}: InventoryTeamDisplayProps) {

  const { gameState } = useGame();

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
  .map((player) => (

        /* Conteneur du portrait */
        <div
          key={player.id}
          onClick={() => onSelectPlayer(player.id)}
          style={{
            position: "relative",

            width: 130,
            height: 130,
            flexShrink: 0,

            cursor: "pointer",
          }}
        >

          {/* Portrait */}
          <div
            style={{
              width: "100%",
              height: "100%",

              border: "3px solid #b98a3d",
              borderRadius: 8,

              boxShadow:
                "0 3px 8px rgba(0, 0, 0, 0.45)",

              boxSizing: "border-box",
              overflow: "hidden",
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
                }}
              >
                +
              </div>
            </>
          )}

        </div>
      ))}
    </div>
  );
}
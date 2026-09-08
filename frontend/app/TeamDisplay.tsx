"use client";

import { useState } from "react";
import PlayerProfil from "./PlayerProfil";
import type { PjView } from "@shared/types/fighterView";

interface TeamDisplayProps {
  players: PjView[];
  selectedPlayerId: number;
  onSelectPlayer: (id: number) => void;
}

const TeamDisplay = ({ players, selectedPlayerId, onSelectPlayer }: TeamDisplayProps) => {


  return (
    <div
      style={{
       position: "relative",
      width: "100%",
      height: "100%",
        backgroundImage:'url("/ui/background-vertical.png")',
         backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
      }}
    >
      {players.map((player, index) => (
        <div
          key={player.id}
          style={{
            position: "absolute",
            left: 35,
            top: 35+190 * index,
          }}
        >
          <PlayerProfil
            player={player}
            active={selectedPlayerId === player.id}
            onClick={() => onSelectPlayer(player.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default TeamDisplay;
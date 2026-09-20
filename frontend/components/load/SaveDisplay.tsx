"use client";

import type { PjPreview } from "@shared/types/fighterView";
import PjPreviewDisplay from "@/components/load/PjPreviewDisplay";

interface SaveDisplayProps {
  players: PjPreview[];
}

export default function SaveDisplay({
  players,
}: SaveDisplayProps) {
  const maxProfiles = 3;

  const emptySlots =
    maxProfiles - players.length;

  return (
   <div
  style={{
    display: "flex",
    width: "100%",
    gap: "10px",
    padding: "0 10px 10px",
    backgroundColor: "rgba(0,0,0,.9)",
  }}
>
  {players.map(player => (
    <div
      key={player.name}
      style={{
        flex: "1 1 0",
        minWidth: 0,
        height: "220px",

        border: "1px solid  #6f5730",
        borderRadius: "8px",

        backgroundColor: "rgba(0,0,0,.9)",
       // color: "white",

        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <PjPreviewDisplay player={player} />
    </div>
  ))}

  {Array.from({
    length: emptySlots,
  }).map((_, index) => (
    <div
      key={`empty-${index}`}
      style={{
        flex: "1 1 0",
        minWidth: 0,
        height: "220px",

        backgroundColor: "rgba(0,0,0,.9)",

        border: "1px solid  #6f5730",
        borderRadius: "8px",

        boxSizing: "border-box",
      }}
    />
  ))}
</div>
  );
}
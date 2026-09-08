import { NpcIntentView } from "@shared/types/npcIntentView";
import { getIntentImagePath } from "@/utils/spritePaths";

import { getPjImagePath, getPjAvatarPath } from "@/utils/spritePaths";

type NpcIntentProps = {
  intent: NpcIntentView;
  size?: number;
};

export default function NpcIntent({
  intent,
  size = 100,
}: NpcIntentProps) {
  return (
    <div
      style={{
        position: "relative",
        width: `${size}px`,
        height: `${size}px`,
        left: "-50px",
        top: "25px"
      }}
    >
      <img
        src={getIntentImagePath(intent.action)}
        alt="Intention du NPC"
        style={{
           position: "relative",
          width: "48px",
          height: "48px",
           top: "13px",
          left: "15px",
          objectFit: "contain",
          pointerEvents: "none",
          userSelect: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          top: "-5px",
          left: "42px",

          width: "20px",
          height: "20px",
          borderRadius: "50%",

          background: "black",
          border: "1px solid white",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          color: "red",
          fontSize: "11px",
          fontWeight: "bold",
        }}
      >
        {intent.value}
      </div>
      {/* Cible */}
{intent.target !== 0 && (
  <>
   <img
      src="/ui/target_arrow.png"
      alt="Cible"
      style={{
        position: "absolute",

        left: "55px",
        top: "50%",

        width: "40px",
        height: "60px",

        objectFit: "contain",

        transform: "translateY(-50%)",

        pointerEvents: "none",
        userSelect: "none",

        zIndex: 2,
      }}
    />
  <div
    style={{
      position: "absolute",

      // à droite de l'intention
      left: `${size + 20}px`,
      top: "12px",

      width: "48px",
      height: "48px",

      borderRadius: "50%",
      overflow: "hidden",

      border: "2px solid black",
      background: "white",
    }}
  >
    <img
      src={getPjAvatarPath(intent.target_image)}
      alt={`PJ ${intent.target}`}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
      }}
    />
  </div></>
)}
    </div>
  );
}
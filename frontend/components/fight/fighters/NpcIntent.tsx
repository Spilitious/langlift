import { NpcIntentView } from "@shared/types/npcIntentView";
import { getIntentImagePath } from "@/utils/spritePaths";
import { useRef, useState } from "react";
import NpcIntentDetail from  "./NpcIntentDetail";

import { getPjImagePath, getPjAvatarPath } from "@/utils/spritePaths";

type NpcIntentProps = {
  intent: NpcIntentView;
  size?: number;
};

export default function NpcIntent({
  intent,
  size = 100,
}: NpcIntentProps) {

  const value = intent.value2 ===0 
  ? intent.value
  : intent.value2 + "x" + intent.value
  
  const [showDetail, setShowDetail] = useState(false);

  const intentRef = useRef<HTMLDivElement | null>(null);

const [detailBelow, setDetailBelow] = useState(false);

const hoverTimeoutRef =
  useRef<ReturnType<typeof setTimeout> | null>(null);

const handleMouseEnter = () => {
   if (intentRef.current) {
    const rect =
      intentRef.current.getBoundingClientRect();

    // Par exemple : si l'icône est à moins de 180px du haut
    setDetailBelow(rect.top < 180);
  }

  hoverTimeoutRef.current = setTimeout(() => {
    setShowDetail(true);
  }, 1000);
};

const handleMouseLeave = () => {
  if (hoverTimeoutRef.current) {
    clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = null;
  }

  setShowDetail(false);
};
  
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
    <div
     ref={intentRef}
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
  style={{
    position: "relative",
    width: "48px",
    height: "48px",
    top: "13px",
    left: "15px",
     
  }}
>
  <img
    src={getIntentImagePath(intent.action)}
    
    alt="Intention du NPC"
    style={{
      width: "48px",
      height: "48px",
      objectFit: "contain",
      pointerEvents: "none",
      userSelect: "none",
    }}
  />

  {showDetail && (
    <NpcIntentDetail intent={intent}
     below={detailBelow} />
  )}
</div>

      {value!=-1 && <div
        style={{
          position: "relative",
          top: "-5px",
          left: "42px",

          minWidth: "10px",
          maxWidth: "24px",
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
        {value}
      </div>}
      {/* Cible */}
{intent.target_image !== 0 && (
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
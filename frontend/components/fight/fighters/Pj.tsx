"use client";


//Les types shared
import type { PjSprite } from "@/types/fighterSprite";
import { getAnimationType }
  from "@shared/types/animation";

//Les composants
import HealthBar from "./HealthBar";
import BlockShield from "./BlockShield";
import ActionPoints from "./ActionPoints";
import Bm from "./Bm";

import PjBlockAnimation from "../animations/PjBlockAnimation";
import PjDeathAnimation from "../animations/PjDeathAnimation";
import PjFrameAnimation from "../animations/PjFrameAnimation";
import OverlayAnimation from "../animations/OverlayAnimation";

//Les utils du frontend
import { getPjImagePath } from "@/utils/spritePaths";

//Les types du frontend
import type {OverlayAnimationName, FrameAnimationName} from "@/utils/animationFrame";

import { getPjPosition } from "@/utils/fighterPosition";


import { useState } from "react";

type PjProps = {
   pj_data:PjSprite;
   selected:boolean;
    onClick: () => void;
    onAuthorImpact?: () => void;
  onReactionImpact?: () => void;
  onReactionEnd: () => void;
 onEquipmentDrop: () => void;
};

export default function Pj({
  pj_data,
  selected,
  onClick,
  onAuthorImpact,
  onReactionImpact,
  
  onReactionEnd,
  onEquipmentDrop,
}: PjProps) {

   const [showUi, setShowUi] = useState(true);
   const animationType = getAnimationType(pj_data.animation.name);
   const [x, y] = getPjPosition(pj_data.position);


let animationContent;

switch (animationType) {
 case "frame":
  animationContent = (
    <PjFrameAnimation
      image={pj_data.image}
      animationName={
        pj_data.animation.name as FrameAnimationName
      }
      trigger={pj_data.animation.id}

      onImpact={
        pj_data.animation.name === "attack"
          ? onAuthorImpact
          : onReactionImpact
      }

      onEnd={
        pj_data.animation.name === "attack"
          ? undefined
          : onReactionEnd
      }
    />
  );
  break;

  case "overlay":
  animationContent = (
    <>
      <div
        onClick={onClick}
        style={{
          position: "relative",
          zIndex: 1,
        }}
      >
        <img
          src={
            getPjImagePath(pj_data.image) +
            "-idle.png"
          }
          className="fighter-sprite"
          draggable={false}
        />
      </div>

      <OverlayAnimation
        animationName={
          pj_data.animation.name as OverlayAnimationName
        }
        trigger={pj_data.animation.id}
        onImpact={onReactionImpact}
        onEnd={onReactionEnd}
      />
    </>
  );
  break;
  
   case "blocked":
  animationContent = (
    <>
      <div
        onClick={onClick}
        style={{
          position: "relative",
          zIndex: 1,
        }}
      >
        <img
          src={
            getPjImagePath(pj_data.image) +
            "-idle.png"
          }
          className="fighter-sprite"
          draggable={false}
        />
      </div>

      <PjBlockAnimation
        trigger={pj_data.animation.id}
        onImpact={onReactionImpact}
        onEnd={onReactionEnd}
      />
    </>
  );
  break;
    
    

  case "death":
    animationContent = (
      <PjDeathAnimation
        
        trigger={pj_data.animation.id}
        onImpact={onReactionImpact}
        onHideUi={() => setShowUi(false)}
        onEnd={onReactionEnd}
        image={pj_data.image}
      />
    );
    break;

  case "idle":
    animationContent = (
      <div
        onClick={onClick}
        style={{
          position: "relative",
          zIndex: 1,
        }}
      >
        <img
          src={
            getPjImagePath(pj_data.image) +
            "-idle.png"
          }
          className="fighter-sprite"
        />
      </div>
    );
    break;
}

  return (
  
  <div
    onPointerUp={onEquipmentDrop}
    style={{
      position: "absolute",
      left: `${x}%`,
      top: `${y}%`,
      width: "240px",
      height: "160px",
      overflow: "visible",
    }}
  >
    {selected && (
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "15px",
          width: "150px",
          height: "35px",
          transform: "translateX(-50%)",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(255,220,80,0.65) 0%, rgba(255,190,40,0.3) 45%, transparent 75%)",
          boxShadow:
            "0 0 18px rgba(255,210,60,0.8)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
    )}

    {animationContent}

    
        {showUi && (
  <> 
      <div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
     marginLeft: "-52px",
     transform: "translateY(-25px)",
  }}
>
  <BlockShield
    block={pj_data.shield}
    size={60}
  />

  <div
    style={{
      marginLeft: "-25px",
    }}
  >
    <HealthBar
      hp={pj_data.hp}
      maxHp={pj_data.maxHp}
    />
    </div>
</div>
<div
    style={{
      marginLeft: "30px",
      marginTop: "-30px",
    }}
  >
    <Bm
    bms={pj_data.bms}
    size={28}/>
  </div>

<div
  style={{
    position: "absolute",
    top: "30px",
  }}
>
  <ActionPoints
    ap={pj_data.ap}
    size={32}
  />

</div></>)}
 
</div>
)}
"use client";

import { useState } from "react";

import NpcFrameAnimation from "../animations/NpcFrameAnimation";
import NpcBlockAnimation from "../animations/NpcBlockAnimation";
import NpcDeathAnimation from "../animations/NpcDeathAnimation";
import OverlayAnimation from "../animations/OverlayAnimation";
import ShakeAnimation from "../animations/ShakeAnimation";
import NpcIntentChangeAnimation from "../animations/NpcIntentChangeAnimation";
import { getNpcPosition } from "@/utils/fighterPosition";

import HealthBar from "./HealthBar";
import BlockShield from "./BlockShield";
import NpcIntent from "./NpcIntent";
import Bm from "./Bm";

import type { NpcSprite } from "@/types/fighterSprite";
import type {
  FrameAnimationName,
  OverlayAnimationName,
} from "@/utils/animationFrame";

import { getAnimationType } from "@shared/types/animation";
import { getNpcImagePath } from "@/utils/spritePaths";

type NpcProps = {
  npc_data: NpcSprite;
  selected: boolean;
  onClick: () => void;
  onAuthorImpact?: () => void;
  onReactionImpact?: () => void;
  onReactionEnd: () => void;
  
  

};

export default function Npc({
  npc_data,
  selected,
  onClick,
  onAuthorImpact,
  onReactionImpact,
  onReactionEnd,
 
}: NpcProps) {
  const [showUi, setShowUi] = useState(true);

  const [x, y] = getNpcPosition(npc_data.position);
  const animationType =
    getAnimationType(npc_data.animation.name);

   
  const idleSprite = (
    <div
      onClick={onClick}
      style={{
        position: "relative",
        zIndex: 1,
      }}
    >
      <img
        src={
          getNpcImagePath(npc_data.image) +
          "-idle.png"
        }
         className="fighter-sprite"
        
      />
    </div>
  );

  let animationContent;

  switch (animationType) {
    case "frame":
      animationContent = (
        <NpcFrameAnimation
          image={npc_data.image}
          animationName={
            npc_data.animation.name as FrameAnimationName
          }
          trigger={npc_data.animation.id}
          onImpact={
            npc_data.animation.name === "attack"
              ? onAuthorImpact
              : onReactionImpact
          }
          onEnd={
            npc_data.animation.name === "attack"
              ? undefined
              : onReactionEnd
          }
        />
      );
      break;

    case "overlay":
      animationContent = (
        <>
          {idleSprite}

          <OverlayAnimation
            animationName={
              npc_data.animation.name as OverlayAnimationName
            }
            trigger={npc_data.animation.id}
            onImpact={onReactionImpact}
            onEnd={onReactionEnd}
          />
        </>
      );
      break;

    case "blocked":
      animationContent = (
        <>
          {idleSprite}

          <NpcBlockAnimation
            trigger={npc_data.animation.id}
            onImpact={onReactionImpact}
            onEnd={onReactionEnd}
          />
        </>
      );
      break;

    case "death":
      animationContent = (
        <NpcDeathAnimation
          image={npc_data.image}
          trigger={npc_data.animation.id}
          onImpact={onReactionImpact}
          onHideUi={() => setShowUi(false)}
          onEnd={onReactionEnd}
        />
      );
      break;

    case "idle":
      animationContent = idleSprite;
      break;
    
   case "shake":
  animationContent = (
    <>
      <img
        src={
          getNpcImagePath(npc_data.image) +
          "-idle.png"
        }
        draggable={false}
        style={{
          width: "240px",
          height: "160px",
          objectFit: "contain",

          animation:
            "npcShake 80ms infinite alternate",
        }}
      />

      <ShakeAnimation
        trigger={npc_data.animation.id}
        onImpact={onAuthorImpact}
      />
    </>
  );
  break;


  case "change_intent":
   
  animationContent = (
    <>
      <img
        src={
          getNpcImagePath(npc_data.image) +
          "-idle.png"
        }
        draggable={false}
        style={{
          width: "240px",
          height: "160px",
          objectFit: "contain",
        }}
      />
      
      <NpcIntentChangeAnimation
        key={npc_data.animation.id}
        oldIntent={npc_data.old_intent}
        newIntent={npc_data.pending_intent!}
        trigger={npc_data.animation.id}
        onEnd={onReactionEnd}
      />
    </>
  );
  break;
  }

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: "240px",
        height: "160px",
        overflow: "visible",
      }}
    >
      {animationContent}

      {showUi && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "-25px",
              transform: "translateY(-25px)",
            }}
          >
            <BlockShield
              block={npc_data.stats.shield}
              size={60}
            />

            <div
              style={{
                marginLeft: "-25px",
              }}
            >
              <HealthBar
                hp={npc_data.hp}
                maxHp={npc_data.maxHp}
              />
            </div>
          </div>

          <div
            style={{
              marginLeft: "40px",
              marginTop: "-30px",
            }}
          >
            <Bm
              bms={npc_data.bms}
              size={28}
            />
          </div>

  {npc_data.animation.name !== "change_intent" && (
  <div
    style={{
      position: "absolute",
      top: "-55px",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 10,
    }}
  >
    <NpcIntent
      intent={npc_data.npc_intent}
      size={70}
    />
  </div>
)}
        </>
      )}
    </div>
  );
}
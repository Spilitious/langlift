"use client";

import { useState } from "react";

import NpcFrameAnimation from "../animations/NpcFrameAnimation";
import NpcBlockAnimation from "../animations/NpcBlockAnimation";
import NpcDeathAnimation from "../animations/NpcDeathAnimation";
import OverlayAnimation from "../animations/OverlayAnimation";
import ShakeAnimation from "../animations/ShakeAnimation";
import NpcSpawnAnimation from "../animations/NpcSpawnAnimation";
import NpcIntentChangeAnimation from "../animations/NpcIntentChangeAnimation";
import { getNpcPosition, getSizeNpc } from "@/utils/fighterPosition";

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
 onAnimationEnd: (
  fighterType: "pj" | "npc",
  fighterId: number
) => void;
  
  canTargetNpc : (npcId:number) => boolean,

};

export default function Npc({
  npc_data,
  selected,
  canTargetNpc,
  onClick,
  onAnimationEnd,
 
}: NpcProps) {

  const [showUi, setShowUi] = useState(true);
  const [x, y] = getNpcPosition(npc_data.position, npc_data.size);
  const animationType = getAnimationType(npc_data.animation.name);
  const handleAnimationEnd = () => {onAnimationEnd("npc", npc_data.id);};
  const npcScale = getSizeNpc(npc_data.size);
  const intentTop = -90 - 160 * (npcScale - 1);


  const canTarget = canTargetNpc(npc_data.id);

  const idleSprite = (
    <div
     onClick={() => {
       if (!canTargetNpc(npc_data.id)) return;

       onClick();
      }}
      style={{
        position: "relative",
        zIndex: 1,
       
        cursor: canTarget
          ? 'url("/ui/cursor/cursor6.png") 0 0, pointer'
          : 'url("/ui/cursor/cursor8.png") 0 0, pointer',

        //  filter: canTarget
        //  ? "none"
        //  : "brightness(0.55)",

        transition: "filter 150ms ease",

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
          onEnd={handleAnimationEnd}
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
            onEnd={handleAnimationEnd}
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
            animation={npc_data.animation.name}
            onEnd={handleAnimationEnd}
          />
        </>
      );
      break;
    
     case "spawn":
     
      animationContent = (
        <>
          <NpcSpawnAnimation
           image= {getNpcImagePath(npc_data.image) +
          "-idle.png"}
           onEnd={handleAnimationEnd}
          />
        </>
      );
      break;

    case "death":
      animationContent = (
        <NpcDeathAnimation
          image={npc_data.image}
          trigger={npc_data.animation.id}
          onHideUi={() => setShowUi(false)}
          onEnd={handleAnimationEnd}
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
       
        onEnd={handleAnimationEnd}
      />
    </>
  );
  break;


  
   
 case "change_intent":
  animationContent = (
    <img
      src={
        getNpcImagePath(npc_data.image) +
        "-idle.png"
      }
      draggable={false}
      className="fighter-sprite"
    />
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
        <div
    style={{
      width: "240px",
      height: "160px",
      transform: `scale(${npcScale})`,
      transformOrigin: "center bottom",
    }}
  >
      {animationContent}
</div>

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
                hp={npc_data.stats.currhp}
                maxHp={npc_data.stats.maxhp}
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
              armor={npc_data.stats.armor}
             
            />
          </div>
   <div
  style={{
    position: "absolute",
    top: `${intentTop}px`,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 10,
  }}
>
  {npc_data.animation.name === "change_intent" ? (
    <NpcIntentChangeAnimation
      key={npc_data.animation.id}
      oldIntent={npc_data.old_intent}
      newIntent={npc_data.pending_intent!}
      trigger={npc_data.animation.id}
      onEnd={handleAnimationEnd}
    />
  ) : (
    <NpcIntent
      intent={npc_data.intent}
      size={70}
    />
  )}
</div>
        </>
      )}
    </div>
  );
}
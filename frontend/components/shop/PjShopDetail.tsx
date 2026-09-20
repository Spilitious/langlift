import Image from "next/image";
import GraphicBar from "../../app/GraphicBar";
import type { PjView } from "@shared/types/fighterView";
import { getPjAvatarPath } from "@/utils/spritePaths";
import { useState } from "react";

type PjShopDetailProps = {
   player: PjView;
   gold:number | undefined;
};

export default function PjShopDetail({ player, gold}: PjShopDetailProps)  {

    const textStyle: React.CSSProperties = {
    userSelect: "none",
    fontFamily: "'Uncial Antiqua', serif",
   };


   return (
  <div
  style={{
    width: 500,
    height:356,
    padding: "24px",
    backgroundColor: "rgba(0, 0, 0, 0.58)",
    border: "2px solid #6f5730",
    borderRadius: "10px",
    boxSizing: "border-box",
    color: "#e8d7a5",
    userSelect:"none",
    display: "flex",
    flexDirection: "column",
  }}
>
<div
  style={{
    display: "flex",
    gap: 30,
    alignItems: "flex-start",
  }}
>
{/* ================= GAUCHE ================= */}

<div
  style={{
    width: 300,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }}
>
  {/* ================= PORTRAIT + INFOS ================= */}

  <div
    style={{
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: 20,
    }}
  >
    {/* Portrait + halo */}
    <div
      style={{
        position: "relative",
        width: 130,
        height: 130,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          border: "3px solid #b98a3d",
          borderRadius: "8px",
          boxShadow: "0 3px 8px rgba(0, 0, 0, 0.45)",
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

      {player.canLevelUp && (
        <>
          <div className="level-up-glow" />

          <div
            style={{
              position: "absolute",
              top: "-7px",
              right: "-7px",
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
                "0 0 6px #ffd65a, 0 0 12px rgba(255,190,40,.8)",
              zIndex: 2,
              pointerEvents: "none",
            }}
          >
            +
          </div>
        </>
      )}
    </div>

    {/* Infos à droite du portrait */}
    <div
      style={{
        flex: 1,
        height: 130,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",

        color: "#d6b56c",
        fontFamily: "Georgia, serif",
        fontWeight: "bold",
        lineHeight: "1.5",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 22,
          ...textStyle,
        }}
      >
        {player.name}
      </div>

      <div
        style={{
          fontSize: 14,
          ...textStyle,
        }}
      >
        Niveau {player.level}
      </div>

      <div
        style={{
          fontSize: 14,
          ...textStyle,
        }}
      >
        <div>
          Constitution : {player.stats.constitution}
        </div>

        <div>
          Force : {player.stats.strength}
        </div>

        <div>
          Magie : {player.stats.magicSkill}
        </div>

        <div>
          Armure : {player.stats.armor}
        </div>
      </div>
    </div>
  </div>

  {/* ================= SEPARATEUR ================= */}

  <div
    style={{
      width: "70%",
      height: "2px",
      margin: "20px 0",
      background:
        "linear-gradient(to right, transparent, #d8b56b, transparent)",
    }}
  />

  {/* ================= HP / XP ================= */}

  <div
    style={{
      width: "80%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingRight:"50px",
      gap: 12,
    }}
  >
    <GraphicBar
      color="#FF0000"
      curr={player.stats.currhp}
      max={player.stats.maxhp}
      text="HP"
      width={250}
      height={12}
      borderWidth={3}
    />

    <GraphicBar
      color="#0000FF"
      curr={player.xp}
      max={player.nextLevelXp}
      text="XP"
      width={250}
      height={12}
      borderWidth={3}
    />
  </div>

  {/* capacités éventuellement */}
</div>
    {/* ================= DROITE ================= */}

    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 7,
        paddingTop: 7,

        color: "#d6b56c",
        fontFamily: "'Uncial Antiqua', serif",
        fontWeight: "bold",
        fontSize: 14,
      }}
    >
      <div>Damage : {player.stats.damage}</div>
      <div>Bouclier bonus : {player.stats.shield_bonus}</div>
      <div>Regen : {player.stats.regen}</div>
      <div>Epine : {player.stats.spike}</div>
      <div>Evasion : {player.stats.evasion}</div>
      <div>Reflex : {player.stats.reflex}</div>
      <div>AP : {3 + player.stats.ap}</div>
      <div>Protection : {player.stats.ward}</div>
    </div>
    
  </div>
  <div
    style={{
      marginTop: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      color: "#d6b56c",
      fontFamily: "'Uncial Antiqua', serif",
      fontWeight: "bold",
      fontSize: "18px",
    }}
  >
    <img
      src="/ui/gold.png"
      alt="or"
      draggable={false}
      style={{
        width: "40px",
        height: "40px",
        objectFit: "contain",
      }}
    />

    <span>{gold} or</span>
  </div>

  </div>
);

}

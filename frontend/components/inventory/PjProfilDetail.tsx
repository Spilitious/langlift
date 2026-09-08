import Image from "next/image";
import GraphicBar from "../../app/GraphicBar";
import type { PjView } from "@shared/types/fighterView";
import { getPjAvatarPath } from "@/utils/spritePaths";
import { useState } from "react";
import PjAbilitiesDisplay from "./PjAbilitiesDisplay";
import { Pj } from "../../../backend/src/classes/Pj";

type PjProfilDetailProps = {
  onLevelUp: () => void
  player: PjView;
};

const PjProfil = ({ player, onLevelUp }: PjProfilDetailProps) => {

 
    
  const textStyle: React.CSSProperties = {
    userSelect: "none",
    fontFamily: "'Uncial Antiqua', serif",
  };


  return (
    <div
      style={{
      width: 380,
      padding: "24px",
      backgroundColor: "rgba(0, 0, 0, 0.58)",
      border: "2px solid #6f5730",
      borderRadius: "10px",
      boxSizing: "border-box",
      color: "#e8d7a5",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
  
  {/* ======================== */}
  {/* PROFIL                   */}
  {/* ======================== */}

  <div
    style={{
      width: "100%",
      display: "flex",
      justifyContent: "center",
    }}
  >
      {/* Portrait + halo */}
      <div
        onClick={() => {if (player.canLevelUp) {onLevelUp();}}}
        style={{
          position: "relative",
          width: 130,
          height: 130,
          flexShrink: 0,
      }}>
    
    
    <div
      style={{
        width: "100%",
        height: "100%",
        border: "3px solid #b98a3d",
        borderRadius: "8px",
        boxShadow: "0 3px 8px rgba(0, 0, 0, 0.45)",
        boxSizing: "border-box",
        overflow: "hidden",
        }}>

        <Image
          src={getPjAvatarPath(player.avatar)}
          alt={player.name}
          width={130}
          height={130}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}/>
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
            background:"radial-gradient(circle, #d9a72e 0%, #7a4c0b 100%)",
            color: "#fff2b0",
            fontSize: 25,
            fontWeight: "bold",
            lineHeight: 1,
            textShadow: "1px 1px 2px #000",
            boxShadow: "0 0 6px #ffd65a, 0 0 12px rgba(255,190,40,.8)",
            zIndex: 2,
            pointerEvents: "none",
          }}>
      +
      </div>
      </>
    )}
    </div>
          
  
        {/* Infos */}
        <div
          style={{
            flex: 1,
            height: 130,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            color: "#e8d7a5",
            fontFamily: "Georgia, serif",
            fontWeight: "bold",
            lineHeight: "1.5",
            whiteSpace: "pre-line",
            textAlign: "center",
          }}
        >
          {/* Nom */}
          <div
            style={{
              fontSize: 22,
              ...textStyle,
            }}
          >
            {player.name}
          </div>

          {/* Classe + niveau */}
          <div
            style={{
              fontSize: 14,
              ...textStyle,
            }}
          >
            Aventurier niveau {player.level}
          </div>

          {/* Attributs */}
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
<div
  style={{
    width: "50%",
    height: "2px",
    margin: "24px 0",
    background:
      "linear-gradient(to right, transparent, #d8b56b, transparent)",
  }}
/>
     {/* ======================== */}
{/* STATS                    */}
{/* ======================== */}

<div
  style={{
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
  }}
>
  {/* XP */}
  <GraphicBar
    color="#0000FF"
    curr={player.xp}
    max={player.nextLevelXp}
    text="XP"
    width={300}
    height={12}
    borderWidth={3}
  />

  {/* Stats secondaires */}
  <div
    style={{
      width: "100%",

      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      columnGap: 20,
      rowGap: 8,

      textAlign: "center",

      color: "#e8d7a5",
      fontFamily: "'Uncial Antiqua', serif",
      fontWeight: "bold",
      fontSize: 14,
    }}
  >
    <div>Damage : {player.stats.damage}</div>
    <div>Bouclier : {player.stats.shield}</div>

    <div>Regen : {player.stats.regen}</div>
    <div>Epine : {player.stats.spike}</div>

    <div>Evasion : {player.stats.evasion}</div>
    <div>Reflex : {player.stats.reflex}</div>

    <div>Ap : {3 + player.stats.ap}</div>
    <div>Protection : {player.stats.ward}</div>
  </div>
</div>

<div
  style={{
    width: "50%",
    height: "2px",
    margin: "24px 0",
    background:
      "linear-gradient(to right, transparent, #d8b56b, transparent)",
  }}
/>
  
 {/* ======================== */}
{/* CAPACITÉS                */}
{/* ======================== */}

<div
  style={{
    width: "100%",
    display: "flex",
    justifyContent: "center",
  }}
>
  <PjAbilitiesDisplay pj={player} />
</div>
</div>
      
   
  );
};

export default PjProfil;
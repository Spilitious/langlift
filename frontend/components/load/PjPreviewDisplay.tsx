import Image from "next/image";
import type { PjPreview } from "@shared/types/fighterView";
import { getPjAvatarPath } from "@/utils/spritePaths";
import GraphicBar from "@/app/GraphicBar";

type PjPreviewDisplayProps = {
  player: PjPreview;
};




export default function PjPreviewDisplay({
  player}: PjPreviewDisplayProps)  {

  const textStyle: React.CSSProperties = {
    userSelect: "none",
    fontFamily: "'Uncial Antiqua', serif",
  };

 return (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "110px 130px",
      columnGap: "20px",
      rowGap: "8px",
      alignItems: "center",
      userSelect: "none",
      fontFamily: "'Uncial Antiqua', serif",
      color: "#6f5730",
      fontWeight: "bold",

      width: "100%",
      height: "100%",

      padding: "10px",
      boxSizing: "border-box",
    }}
  >
    {/* COLONNE 1 : PORTRAIT */}
    <div
      style={{
        width: "110px",
        height: "130px",

        border: "3px solid #b98a3d",
        borderRadius: "8px",

        boxShadow:
          "0 3px 8px rgba(0,0,0,.45)",

        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <Image
        src={getPjAvatarPath(player.avatar)}
        alt={player.name}
        width={110}
        height={130}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>

    {/* COLONNE 2 : INFORMATIONS */}
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
         alignItems: "center",
        textAlign: "center",
        gap: "2px",
      }}
    >
      <div
        style={{
          fontSize: "22px",
        }}
      >
        {player.name}
      </div>

      <div
        style={{
          fontSize: "18px",
        }}
      >
        Niveau {player.level}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0px",
          fontSize: "16px",
        }}
      >
        <div>
          Constitution : {player.base_att.constitution}
        </div>

        <div>
          Force : {player.base_att.strength}
        </div>

        <div>
          Magie : {player.base_att.magicSkill}
        </div>
      </div>
    </div>

    {/* BARRES HP + XP SUR LES 2 COLONNES */}
    <div
      style={{
        gridColumn: "1 / -1",

        display: "flex",
        flexDirection: "column",
        gap: "8px",

        width: "100%",
      }}
    >
      <GraphicBar
        color="#FF0000"
        curr={player.base_att.currhp}
        max={player.base_att.currhp}
        text="HP"
        width={240}
        height={12}
        borderWidth={3}
      />

      <GraphicBar
        color="#0000FF"
        curr={player.xp}
        max={player.nextLevelXp}
        text="XP"
        width={240}
        height={12}
        borderWidth={3}
      />
    </div>
  </div>
);
};

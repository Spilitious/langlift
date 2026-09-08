import Image from "next/image";
import type { PjView } from "@shared/types/fighterView";
import { getPjAvatarPath } from "@/utils/spritePaths";

type PjProfilProps = {
  player: PjView;
};

const PjProfil = ({ player }: PjProfilProps) => {
  const textStyle: React.CSSProperties = {
    userSelect: "none",
    fontFamily: "'Uncial Antiqua', serif",
    color: "#e8d7a5",
    fontWeight: "bold",
  };

  const statColumnStyle: React.CSSProperties = {
    ...textStyle,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    fontSize: 14,
    textAlign: "center",
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "130px 1fr",
        columnGap: 20,
        alignItems: "center",
        padding: 10,
        boxSizing: "border-box",
      }}
    >
      {/* ===================== */}
      {/* PORTRAIT */}
      {/* ===================== */}

      <div
        style={{
          position: "relative",
          width: 130,
          height: 150,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            border: "3px solid #b98a3d",
            borderRadius: 8,
            boxShadow: "0 3px 8px rgba(0,0,0,.45)",
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <Image
            src={getPjAvatarPath(player.avatar)}
            alt={player.name}
            width={130}
            height={150}
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
                top: -7,
                right: -7,

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

      {/* ===================== */}
      {/* PARTIE DROITE */}
      {/* ===================== */}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* NOM + NIVEAU */}

        <div
          style={{
            ...textStyle,
            display: "flex",
            justifyContent: "center",
            alignItems: "baseline",
            gap: 10,
          }}
        >
          <div
            style={{
              fontSize: 22,
            }}
          >
            {player.name}
          </div>

          <div
            style={{
              fontSize: 20,
            }}
          >
            niveau {player.level}
          </div>
        </div>

        {/* TRAIT DORÉ */}

        <div
          style={{
            width: "70%",
            height: 2,
            alignSelf: "center",
            margin: "8px 0 12px",

            background:
              "linear-gradient(to right, transparent, #d8b56b, transparent)",
          }}
        />

        {/* ===================== */}
        {/* 3 COLONNES DE STATS */}
        {/* ===================== */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            columnGap: 20,
          }}
        >
          {/* COLONNE 1 */}

          <div style={statColumnStyle}>
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
              AP : {player.ap}
            </div>
          </div>

          {/* COLONNE 2 */}

          <div style={statColumnStyle}>
            
            <div>
              Armure : {player.stats.damage}
            </div>
              <div>
              Dégâts bonus : {player.stats.damage}
            </div>
            <div>
              Bouclier bonus : {player.stats.shield}
            </div>
            <div>
              Bouclier reflex : {player.stats.reflex}
            </div>
           

          </div>

          {/* COLONNE 3 */}

          <div style={statColumnStyle}>
            <div>
              Evasion : {player.stats.evasion}
            </div>

            <div>
              Epine : {player.stats.spike}
            </div>
            <div>
              Regen : {player.stats.regen}
            </div>
           

            <div>
              Protection : {player.stats.ward}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PjProfil;
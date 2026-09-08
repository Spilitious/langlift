import { getActionImagePath } from "@/utils/spritePaths";
import type { PjView } from "@shared/types/fighterView";

type PjAbilitiesDisplayProps = {
  pj: PjView;
};

export default function PjAbilitiesDisplay({
  pj,
}: PjAbilitiesDisplayProps) {

  return (
    <div
      style={{
        width: "100%",

        display: "flex",
        flexDirection: "column",
        alignItems: "center",

        gap: "12px",
      }}
    >
      {pj.ability.map((ab) => (

        <div
          key={ab.id}
          style={{
            width: "100%",

            display: "grid",
            gridTemplateColumns: "72px 160px 1fr",
            alignItems: "center",

            columnGap: "18px",

            fontFamily: "'Uncial Antiqua', serif",
            color: "#d6b56c",
          }}
        >

          {/* COLONNE 1 : IMAGE */}
          <img
            src={getActionImagePath(ab.image)}
            alt={ab.name}
            draggable={false}
            style={{
              width: "72px",
              height: "72px",

              objectFit: "cover",

              border: "2px solid #b98a3d",
              borderRadius: "8px",

              boxShadow:
                "0 3px 8px rgba(0,0,0,.45)",
            }}
          />


          {/* COLONNE 2 : NOM + ÉCOLE */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",

              alignItems: "center",
              justifyContent: "center",

              gap: "10px",

              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "19px",
                fontWeight: "bold",
              }}
            >
              {ab.name}
            </div>

            <div
              style={{
                fontSize: "13px",
              }}
            >
              École de {ab.school}
            </div>
          </div>


          {/* COLONNE 3 : FORMULE + AP */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",

              alignItems: "center",
              justifyContent: "center",

              gap: "10px",

              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "14px",
              }}
            >
              {ab.formula}
            </div>

            <div
              style={{
                fontSize: "13px",
                fontWeight: "bold",
              }}
            >
              {ab.ap} AP
            </div>
          </div>

        </div>

      ))}
    </div>
  );
}
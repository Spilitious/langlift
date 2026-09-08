import { getActionImagePath } from "@/utils/spritePaths";
import type { AbilityView } from "@shared/types/abilityView";

type BasicAbilityDisplayProps = {
  ability: AbilityView;
};

export default function BasicAbilityDisplay({
  ability,
}: BasicAbilityDisplayProps) {
  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",

        padding: "14px 18px",

        border: "2px solid #b98a3d",
        borderRadius: "8px",

        color: "#d6b56c",
        fontFamily: "'Uncial Antiqua', serif",

        backgroundColor: "rgba(0, 0, 0, 0.20)",

        userSelect: "none",
      }}
    >
      {/* ============================== */}
      {/* PARTIE HAUTE */}
      {/* ============================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "72px 1fr",
          columnGap: "18px",
          alignItems: "center",
        }}
      >
        {/* IMAGE */}

        <img
          src={getActionImagePath(ability.image)}
          alt={ability.name}
          draggable={false}
          style={{
            width: "72px",
            height: "72px",

            objectFit: "cover",

            border: "2px solid #b98a3d",
            borderRadius: "8px",

            boxShadow: "0 3px 8px rgba(0,0,0,.45)",
          }}
        />

        {/* NOM + ÉCOLE + AP */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",

            alignItems: "center",
            justifyContent: "center",

            gap: "5px",

            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "19px",
              fontWeight: "bold",
            }}
          >
            {ability.name}
          </div>

          <div
            style={{
              fontSize: "13px",
            }}
          >
            École de {ability.school}
          </div>

          <div
            style={{
              fontSize: "13px",
              fontWeight: "bold",
            }}
          >
            {ability.ap} AP
          </div>
        </div>
      </div>

      {/* ============================== */}
      {/* SÉPARATEUR DORÉ */}
      {/* ============================== */}

      <div
        style={{
          width: "70%",
          height: "2px",

          margin: "13px auto",

          background:
            "linear-gradient(to right, transparent, #d8b56b, transparent)",
        }}
      />

      {/* ============================== */}
      {/* DESCRIPTION */}
      {/* ============================== */}

      <div
        style={{
          fontSize: "15px",
          lineHeight: "1.5",
          textAlign: "center",

          padding: "0 8px",
        }}
      >
        {ability.detail}
      </div>

      {/* FORMULE */}

      <div
        style={{
          marginTop: "10px",

          fontSize: "13px",
         

          textAlign: "center",
        }}
      >
        {ability.formula}
      </div>
    </div>
  );
}
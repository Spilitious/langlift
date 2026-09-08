"use client";

import MainButton from "@/components/button/MainButton";
import type { PjView } from "@shared/types/fighterView";

type LevelUpConfirmationProps = {
  pj: PjView;
  hp: number;
  onContinue: () => void;
};

export default function LevelUpConfirmation({
  pj,
  onContinue,
  hp,
}: LevelUpConfirmationProps) {

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        background: "rgba(0, 0, 0, 0.45)",
        zIndex: 10000,
      }}
    >
      {/* FENÊTRE */}
      <div
        style={{
          width: "720px",
          minHeight: "300px",
          padding: "40px 50px 25px",

          backgroundImage: 'url("/ui/background.png")',
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",

          boxSizing: "border-box",

          display: "flex",
          flexDirection: "column",
          alignItems: "center",

          color: "#e8d7a5",
          fontFamily: "Georgia, serif",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        {/* TEXTES */}
        <div
          style={{
            flex: 1,

            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",

            gap: "18px",

            fontSize: "22px",
            lineHeight: 1.5,
          }}
        >
          <div>
            {pj.name} atteint le niveau {pj.level}
          </div>

          <div>
            {pj.name} gagne {hp} points de vie
          </div>
        </div>

        {/* BOUTON */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "25px",
          }}
        >
          <MainButton 
          onClick={onContinue}
          name="next" />
        </div>
      </div>
    </div>
  );
}
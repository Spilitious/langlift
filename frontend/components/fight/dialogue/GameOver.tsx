"use client";

import MainButton from "../../button/MainButton";

import { useApp } from "@/context/AppContext";

export default function GameOver() {

    const {setScreen} = useApp();
 
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
      <div
        style={{
          width: "720px",
          minHeight: "220px",
          padding: "40px",
          backgroundImage: 'url("/ui/background.png")',
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          color: "#e8d7a5",
          fontSize: "22px",
          fontFamily: "Georgia, serif",
          fontWeight: "bold",
          lineHeight: "1.5",
          whiteSpace: "pre-line",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "42px",
            fontWeight: "bold",
            marginBottom: "12px",
        }}>
        Défaite
      </div>

      <div>
        Votre équipe a été vaincu et votre aventure s'arrête ici 
      </div>

      <div
          style={{
            marginTop: "30px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <MainButton
            onClick={() => setScreen("menu")}
            name="ok"
          />
        </div>
      </div>
    </div>
  );
}
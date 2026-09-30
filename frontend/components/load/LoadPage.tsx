"use client";

import {
  useEffect,
  useState,
} from "react";

import { useGame } from "@/context/GameContext";
import { useApp } from "@/context/AppContext";

import SaveDisplay from "./SaveDisplay";
import MainButton from  "../button/MainButton"
import { getSaves, loadGame, deleteSave} from "@/utils/api/gameStateApi";
import type { SavePreview } from "@shared/types/gameStateView";


export default function LoadPage() {
  const { setGameState } = useGame();

  const {
    setScreen,
  } = useApp();

  const [saves, setSaves] =
    useState<SavePreview[]>([]);

  const [selectedSaveId, setSelectedSaveId] =
    useState<number | null>(null);
  
   const [needReloadSaves, setNeedReloadSaves] =
    useState<boolean>(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [hoveredSaveId, setHoveredSaveId] =
  useState<number | null>(null);

  useEffect(() => {
    const fetchSaves = async () => {
      try {
        const data = await getSaves();

        setSaves(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Erreur inconnue"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSaves();
  }, [needReloadSaves, []] );

  
const handleDeleteSave = async() => {
  if(!selectedSaveId)
      return

  await deleteSave(selectedSaveId);

  setSelectedSaveId(null);
  setNeedReloadSaves(true);

}
  
const handleLoadGame = async () => {
  if (selectedSaveId === null) {
    return;
  }

  try {
    const gameState =
      await loadGame(selectedSaveId);

    setGameState(gameState);
    setScreen("game");

  } catch (error) {
    console.error(error);
  }
};

  if (loading) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Chargement...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        width: "101%",
        height: "102%",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        flexDirection: "column",
       justifyContent: "center",
        alignItems: "center",
        backgroundImage: 'url("/ui/newBackground.png")',
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        borderRadius: "8px",
      }}
    >
    

      <div
        style={{
          marginTop: "100px",
          marginBottom: "10px",
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "30px",
          width: "1800px",
  }}
>
        {saves.map(save => {
          const isEmpty =
            save.players.length === 0;
            const isSelected = selectedSaveId === save.id;


const isHovered =
  hoveredSaveId === save.id;
          return (
            <div
              key={save.id}
              onMouseEnter={() => {
  if (!isEmpty) {
    setHoveredSaveId(save.id);
  }
}}

onMouseLeave={() => {
  setHoveredSaveId(null);
}}
              onClick={
                isEmpty
                  ? undefined
                  : () => {
                      if(selectedSaveId !== save.id) {
                      const audio = new Audio(`/sounds/click.mp3`);
                      audio.volume = 0.3;
                      audio.play(); }
                      setSelectedSaveId(save.id)
                    }
              }

            style={{
  width: "100%",
  height: "270px",

  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",

  boxSizing: "border-box",
  borderRadius: "8px",

  
  border: isSelected
    ? "3px solid #d8b56b"
    : isHovered
      ? "3px solid #a98b50"
      : "3px solid #6f5730",

  backgroundColor: isSelected
    ? "rgba(157,131,69,.18)"
    : isHovered
      ? "rgba(100,80,40,.18)"
      : "rgba(0,0,0,.35)",

  boxShadow: isSelected
    ? "0 0 10px #d8b56b, inset 0 0 12px rgba(216,181,107,.25)"
    : isHovered
      ? "0 0 6px rgba(216,181,107,.45)"
      : "none",

  transform: isSelected
    ? "scale(1.015)"
    : isHovered
      ? "scale(1.008)"
      : "scale(1)",

  transition:
    "border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease, background-color 150ms ease",

   
  cursor: isEmpty
    ? 'url("/ui/cursor/cursor5.png") 0 0, pointer'
    : 'url("/ui/cursor/cursor6.png") 0 0, pointer',

    color:  isSelected? "#d8b56b" : "#6f5730",

  opacity: isEmpty ? 0.5 : 1,
}}
            >
              <div
                style={{
                  width: "100%",
                  padding: "4px",
                  fontSize: "20px",
                  fontFamily: "Garamond, serif",
                  textAlign:  "center",
                  backgroundColor:"rgba(0,0,0,.8)",
                }}>

                Sauvegarde {save.id}
                {" - "}
                {formatDate(
                  save.date
                )}
              </div>

              <SaveDisplay
                players={
                  save.players
                }
              />
            </div>
          );
        })}
      </div>

      

       <div
             style={{
              position: "relative",
           //    bottom: "10px",
             //  left: "50%",
            //   transform: "translateX(-50%)",
               overflow: "hidden",
               boxSizing: "border-box",
             }}
           >
             <MainButton
               name="loadGame"
               disabled={selectedSaveId===null?  true : false}
               onClick={handleLoadGame}
               width={400}
               height={200}
             />
           </div>

        <div
        style={{
          position: "absolute",
          bottom: "30px",
          right: "40px",
        }}
      >
        <MainButton
          name="back"
          disabled={false}
          onClick={() =>
            setScreen("menu")
          }
        />
      </div>
        <div
        style={{
          position: "absolute",
          bottom: "30px",
          left: "40px",
        }}
      >
        <MainButton
          name="delete"
          disabled={selectedSaveId===null? true : false}
          onClick={handleDeleteSave}
          
        />
      </div>
    </div>
  );
}

function formatDate(
  isoDate: string | null
): string {
  if (!isoDate) {
    return "Vide";
  }

  const date =
    new Date(isoDate);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Vide";
  }

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  const hours =
    String(
      date.getHours()
    ).padStart(2, "0");

  const minutes =
    String(
      date.getMinutes()
    ).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
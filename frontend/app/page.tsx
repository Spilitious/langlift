"use client";

import { useState, useEffect} from "react";

import MainMenu from "@/components/MainMenu";
import Game from "@/components/Game";
import { saveGame, newGame, loadGame, reloadGameState  } from "@/utils/api/gameStateApi";

import {
  GameProvider,
  useGame,
} from "@/context/GameContext";


import {
  AppProvider,
  useApp,
} from "@/context/AppContext";

import { resetGameState } from "@/utils/api/gameStateApi";
import LoadPage from "@/components/load/LoadPage";
import NoFreeSlotDialog from "@/components/NoFreeSlotDialog";

type AppScreen =
  | "menu"
  | "loadGamePage"
  | "game"
  | "credits";

function GameContent() {
  const {
    gameState,
    setGameState,
  } = useGame();


  const {screen, setScreen} = useApp();
  const [ShowNoFreeSaveDialog, setShowNoFreeSaveDialog] = useState<boolean>(false);

/* ******************************************** UseEffect pour le lancement ou le refresh ************************ */
useEffect(() => {
  const reloadCurrentGame = async () => {
    if (
      screen !== "game" ||
      gameState !== null
    ) {
      return;
    }

    try {
      const data = await reloadGameState();

      if (data === null) {
        setScreen("menu");
        return;
      }

      setGameState(data);

    } catch (error) {
      console.error(
        "Erreur lors du rechargement :",
        error
      );

      setScreen("menu");
    }
  };

  reloadCurrentGame();
}, [
  screen,
  gameState,
  setGameState,
  setScreen,
]);

 /* ****************************************** NEWGAME - LOADGAME - SAVEGAME *************************************** */
const handleNewGame = async () => {
  const response = await newGame();

  if (!response.success) {
    // afficher ta boîte de dialogue
    setShowNoFreeSaveDialog(true);
    return;
  }

  setGameState(response.gameState);
  setScreen("game");
};


const handleLoadGame = async () => {
    setScreen("loadGamePage");
};

const handleMainMenu = () => {
  setScreen("menu");
}

const handleGoToLoadPage = () => {
  setShowNoFreeSaveDialog(false);
  setScreen("loadGamePage");
};

const handleSaveGame = async () => {
  try {
    await saveGame();
   
  } catch (error) {
    console.error(
      "Erreur sauvegarde :",
      error
    );
  }
};

/* **************************************************** DEBUT DU SWITH POUR L'ECRAN *********************************** */
 switch (screen) {
  case "menu":
    return (
       <main
       style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundImage:
          'url("/ui/35.png")',
      }}
    >
      <MainMenu
        onNewGame={handleNewGame}
        onLoadGame={handleLoadGame}
      />
      {ShowNoFreeSaveDialog && 
        <NoFreeSlotDialog 
         onConfirm={handleGoToLoadPage}/>
      }
      </main>
    );

  case "loadGamePage":
    
    return (
      
      <main
       style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundImage:
          'url("/ui/35.png")',
      }}
    >
        <LoadPage />
      </main>
    );

  case "game":
    if (!gameState) {
      return <div>Chargement...</div>;
    }

   return (
    <main
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundImage:
          'url("/ui/35.png")',
      }}
    >
      <button
        onClick={handleMainMenu}
        style={{
          position: "fixed",
          top: "10px",
          left: "10px",
          zIndex: 99999,

          padding: "8px 14px",

          backgroundColor: "#5a2d1a",
          color: "white",

          border:
            "1px solid #d8b56b",

          borderRadius: "5px",

          cursor: "pointer",
        }}
      >
        Menu Principal
      </button>

      <Game />
    </main>
  );

   
  }
}

export default function Page() {
  return (
     <AppProvider>
    <GameProvider>
      <GameContent />
    </GameProvider>
    </AppProvider>
  );
}
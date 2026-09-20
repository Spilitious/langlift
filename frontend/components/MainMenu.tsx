"use client";

import MainButton from "./button/MainButton"


type MainMenuProps = {
    onNewGame: () => void;
    onLoadGame: () => void;

    
  };



export default function MainMenu({
  onNewGame,
  onLoadGame }:MainMenuProps)
{





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
      {/* ================= TITRE ================= */}

      <div
        style={{
          position: "absolute",
          top: "260px",
          width: "1500px",
          height: "200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
         
         
        }}
      >
        <img
          src="/ui/titre.png"
          alt="titre"
                     
         />
       
      </div>

      {/* ================= NEW GAME ================= */}

      <div
        style={{
          position: "absolute",
          top: "700px",
          left: "30%",
        
          
          transform: "translateX(-50%)",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        <MainButton
          name="newGame"
          onClick={onNewGame}
          width={400}
          height={200}
        />
      </div>

      {/* ================= LOAD GAME ================= */}

      <div
        style={{
          position: "absolute",
          top: "700px",
          left: "70%",
          transform: "translateX(-50%)",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        <MainButton
          name="loadGame"
          onClick={onLoadGame}
          width={400}
          height={200}
        />
      </div>

    
    </div>
  );
};

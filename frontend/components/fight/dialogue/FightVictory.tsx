"use client";

import { useState, useEffect } from "react";
import NextButton from "../../history/NextButton";
import type { VictoryResult, XpResult} from "@shared/types/actionResult";
import {victoryRoom} from "../../../utils/api/roomApi"
import type { EquipmentView } from "@shared/types/equipmentView";



type FightVictoryDialogProps = {
  roomId: number;
  onContinue: () => void;
};
export default function FightVictoryDialog({
  roomId,
  onContinue,
}: FightVictoryDialogProps) {
const [xpResults, setXpResults] = useState<XpResult[]>([]);
const [loots, setLoots] = useState<EquipmentView[]>([]);


useEffect(() => {
  const loadVictory = async () => {
    const results = await victoryRoom();
    setXpResults(results.xpResult);
      setLoots(results.loots);

  
  };

  loadVictory();
}, []);

const groupedLoots = loots.reduce((acc, loot) => {

  const existing = acc.find(
    item => item.basicEquipmentId === loot.basicEquipmentId
  );

  if (existing) {
    existing.quantity++;
  } else {
    acc.push({
      basicEquipmentId: loot.basicEquipmentId,
      name: loot.name,
      quantity: 1,
    });
  }

  return acc;

}, [] as {
  basicEquipmentId: number;
  name: string;
  quantity: number;
}[]);

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

          backgroundImage:
            'url("/ui/background.png")',

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
    
     
       Victoire
      </div>

      <div>
  {xpResults.map((result) => (
    <div
      key={result.pjName}
      style={{
        //fontSize: "24px",
        //fontWeight: "bold",
        //marginBottom: "12px",
      }}
    >
      <div>
        {result.pjName} gagne {result.xpGained} points d'expérience
      </div>

      {result.level_up && (
        <div
          style={{
            fontSize: "28px",
            fontWeight: "bold",
          }}
        >
          {result.pjName} gagne un niveau !
        </div>
      )}
    </div>
  ))}
</div>
<div style={{ marginTop: "20px" }}>
{groupedLoots.map((loot) => (
  <div key={loot.basicEquipmentId}>
    Vous récupérez {loot.quantity}  <i>{loot.name}</i>
   </div>
 
))}</div>
        <div
          style={{
            marginTop: "30px",

            display: "flex",
            justifyContent: "center",
          }}
        >
          <NextButton
            onClick={onContinue}
          />
        </div>
      </div>
    </div>
  );
}
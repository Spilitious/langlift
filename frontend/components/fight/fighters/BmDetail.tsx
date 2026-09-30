import type { BmView } from "@shared/types/bmView";
import { getBmEffectText } from "@/utils/DetailsText";
import { isNumberObject } from "util/types";

type BmDetailProps = {
  bm: BmView;
};

export default function BmDetail({ bm }: BmDetailProps) {

  const duration =
  bm.life > 0
    ? `${bm.life} ${bm.life > 1 ? "tours" : "tour"}`
    : "infini";



  return (
    <div
      style={{
        position: "absolute",
        bottom: "45px",
        left: "50%",
        transform: "translateX(-50%)",

        width: "300px",
        padding: "10px",

        background: "rgba(10, 10, 15, 0.95)",
        border: "1px solid #c9a35d",
        borderRadius: "5px",

        color: "white",
        fontSize: "13px",

        pointerEvents: "none",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          textAlign: "center",
          fontWeight: "bold",
          color: "#d6aa5d",
          fontSize: "15px",
          marginBottom: "6px",
        }}
      >
        {bm.name}
      </div>

      <div style={{
          textAlign: "center",
         // fontWeight: "bold",
          color: "#d6aa5d",
          fontSize: "12px",
          marginBottom: "6px",
        }}>
        {getBmEffectText(bm)}
      </div>
        <div style={{
          textAlign: "center",
          //fontWeight: "bold",
          color: "#d6aa5d",
          fontSize: "12px",
          marginBottom: "6px",
        }}>
        Durée : {duration}
      </div>
    </div>
  );
}
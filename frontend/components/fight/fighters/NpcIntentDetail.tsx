
import type { NpcIntentView } from "@shared/types/npcIntentView";
import { getActionDetailsText } from "@/utils/DetailsText";

type NpcIntentDetailProps = {
  intent: NpcIntentView;
  below:boolean;
};

export default function NpcIntentDetail({
  intent,
   below = false
}: NpcIntentDetailProps) {

  return (
    <div
      style={{
        position: "absolute",
         ...(below
    ? {
        top: "55px",
      }
    : {
        bottom: "55px",
      }),
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
              fontSize: "16px",
              marginBottom: "6px",
            }}
          >
            {intent.name} 
          </div>
    
          <div
           style={{
              textAlign: "center",
             
              color: "#d6aa5d",
              // color: "#7c5106",
              fontSize: "12px",
              marginBottom: "6px",
            }}>
           {getActionDetailsText(intent)}
          </div>
    </div>
  );
}
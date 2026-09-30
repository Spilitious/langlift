import { getAbilityDetailsText } from "@/utils/DetailsText";
import type { AbilityView } from "@shared/types/abilityView";
import { PjView } from "@shared/types/fighterView";

type Props = {
  action: AbilityView;
  pj:PjView
};

export default function ActionTooltip({
  action,
  pj,
}: Props) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "calc(100% + 10px)",
        left: "50%",
        transform: "translateX(-50%)",

        width: "260px",
        padding: "10px",

        background: "rgba(10, 10, 15, 0.96)",
        border: "1px solid #c9a35d",
        borderRadius: "5px",

        color: "#e8d7a5",
        fontSize: "14px",
        textAlign: "center",

        zIndex: 1000,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          color: "#d6aa5d",
          fontSize: "17px",
          fontWeight: "bold",
          marginBottom: "6px",
        }}
      >
        {action.name}
      </div>      
        <div
          style={{
          
          fontSize: "14px",
       
          marginBottom: "6px",
          }}
        >
         {getAbilityDetailsText(action, pj)}
        </div>

        <div>
        Coût : {action.ap} PA
      </div>
      
    </div>
  );
}
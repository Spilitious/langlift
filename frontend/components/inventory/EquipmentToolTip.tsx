import type { EquipmentView } from "@shared/types/equipmentView";
import { STAT_EQUIPMENT_LABELS, StatName } from "@shared/types/label";

type EquipmentDetailProps = {
  equipment: EquipmentView;
  below?:boolean
};

export default function EquipmentToolTip({
  equipment,
   below=false,
}: EquipmentDetailProps) {

  const displayedStats = Object.entries(STAT_EQUIPMENT_LABELS)
    .map(([stat, label]) => ({
      stat: stat as StatName,
      label,
      value: equipment.bonus[stat as StatName],
    }))
    .filter(item => item.value !== undefined);

  return (
    <div
      style={{
       
        position: "absolute",
        ...(below
    ? {
        top: "calc(100% + 5px)",
      }
    : {
        bottom: "calc(100% + 5px)",
      }),
       
        left: "50%",
        transform: "translateX(-50%)",

        width: "240px",
        padding: "10px",

        background: "rgba(10, 10, 15, 0.96)",
        border: "1px solid #c9a35d",
        borderRadius: "5px",

        color: "#e8d7a5",
        fontSize: "14px",

        zIndex: 1000,
        pointerEvents: "none",
      }}
    >
      {/* NOM */}
      <div
        style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "16px",
          color: "#d6aa5d",
          marginBottom: "8px",
        }}
      >
        {equipment.name}
      </div>

      {/* STATS */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
        }}
      >
        {displayedStats.map(({ stat, label, value }) => (
          <div key={stat}>
            {label} : +{value}
          </div>
        ))}
      </div>
    </div>
  );
}
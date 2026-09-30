
import {  useRef, useState } from "react";


type ActionPointsProps = {
  ap: number;
  size?: number;
  previousApCost: number;
};

export default function ActionPoints({
  ap,
  size = 32,
  previousApCost,
}: ActionPointsProps) {
  const MAX_AP = 4;
  const displayedAp = Math.max(0, Math.min(MAX_AP, ap));


  
    const [showDetail, setShowDetail] = useState(false);
    const hoverTimeoutRef =
      useRef<ReturnType<typeof setTimeout> | null>(null);
    
    const handleMouseEnter = () => {
      hoverTimeoutRef.current = setTimeout(() => {
        setShowDetail(true);
      }, 1000);
    };
    
    const handleMouseLeave = () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
    
      setShowDetail(false);
    };
  

  return (
    <div
    
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        
        display: "flex",
        flexDirection: "column",
        gap: "4px",
      }}
    >
  {Array.from({ length: MAX_AP }).map((_, index) => {
  const firstVisibleIndex = MAX_AP - displayedAp;

  const visible = index >= firstVisibleIndex;

  // position parmi les AP visibles : 0 = celui du haut
  const visibleIndex = index - firstVisibleIndex;

  const previewSpent =
    visible &&
    visibleIndex < previousApCost;

  return (
    <div
      key={index}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      {visible && (
        <img
          src="/ui/actionPoint.png"
          alt="Point d'action"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            pointerEvents: "none",
            userSelect: "none",
            opacity: previewSpent ? 0.3 : 1,
            transition: "opacity 300ms ease",
          }}
        />
      )}
    </div>
  );
})}
      {/* TOOLTIP */}
    {showDetail && (
      <div
        style={{
          position: "absolute",
          bottom: "120px",
          left: "50%",
          transform: "translateX(-50%)",

          width: "300px",
          padding: "8px",

          background: "rgba(10, 10, 15, 0.95)",
          border: "1px solid #c9a35d",
          borderRadius: "5px",

          color: "#d6aa5d",
          fontWeight: "bold",
          fontSize: "16px",
          textAlign: "center",

          pointerEvents: "none",
          zIndex: 1000,
        }}
      >
        Points d'action
      </div>
    )}
    </div>
  );
}
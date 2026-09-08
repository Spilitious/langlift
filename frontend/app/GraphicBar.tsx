'use client';
"use client";

import React, { useEffect, useRef, useState } from "react";

interface GraphicBarProps {
  color: string;
  curr: number;
  max: number;
  text: string;
  width: number;
  height: number;
  borderWidth: number;
  duration?: number;
}

const GraphicBar: React.FC<GraphicBarProps> = ({
  color,
  curr,
  max,
  text,
  width,
  height,
  borderWidth,
  duration = 500,
}) => {
  const [currentValue, setCurrentValue] = useState(curr);

  const previousValue = useRef(curr);

  let colorRect = color;
  let colorBackground = "#DDDDDD";

  if (color === "#FF0000") {
    colorRect = "#DD5050";
    colorBackground = "#FFDDDD";
  } else if (color === "#0000FF") {
    colorRect = "#5050DD";
    colorBackground = "#DDDDFF";
  } else if (color === "#00FF00") {
    colorRect = "#50DD50";
    colorBackground = "#DDFFDD";
  }

  const borderColorLight = "#BBBBBB";
  const borderColorDark = "#303030";

  useEffect(() => {
    const start = previousValue.current;
    const end = curr;

    if (start === end) {
      setCurrentValue(end);
      return;
    }

    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const newValue = Math.round(
        start + (end - start) * progress
      );

      setCurrentValue(newValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCurrentValue(end);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    previousValue.current = end;

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [curr, duration]);

  const ratio =
    max > 0
      ? Math.max(0, Math.min(currentValue / max, 1))
      : 0;

  return (
    <svg
      width={width + borderWidth * 2}
      height={height + borderWidth * 2}
    >
      {/* Bordure claire */}
      <rect
        x="0"
        y="0"
        width={width + borderWidth * 2}
        height={height + borderWidth * 2}
        fill={borderColorLight}
      />

      {/* Bordure droite sombre */}
      <line
        x1={width + borderWidth * 2}
        y1="0"
        x2={width + borderWidth * 2}
        y2={height + borderWidth * 2}
        stroke={borderColorDark}
        strokeWidth={borderWidth}
      />

      {/* Bordure basse sombre */}
      <line
        x1="0"
        y1={height + borderWidth * 2}
        x2={width + borderWidth * 2}
        y2={height + borderWidth * 2}
        stroke={borderColorDark}
        strokeWidth={borderWidth}
      />

      {/* Fond */}
      <rect
        x={borderWidth}
        y={borderWidth}
        width={width}
        height={height}
        fill={colorBackground}
      />

      {/* Valeur */}
      <rect
        x={borderWidth}
        y={borderWidth}
        width={ratio * width}
        height={height}
        fill={colorRect}
      />

      {/* Texte */}
      <text
        x="50%"
        y="55%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize={height * 0.9}
        fill="#000000"
        fontWeight="bold"
      >
        {`${text} : ${currentValue}/${max}`}
      </text>
    </svg>
  );
};

export default GraphicBar;
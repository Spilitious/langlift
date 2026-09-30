"use client";

type NpcSpawnAnimationProps = {
  image: string;
  onEnd: () => void;
};

export default function NpcSpawnAnimation({
  image,
  onEnd,
}: NpcSpawnAnimationProps) {

    const audio = new Audio("sounds/zombie_spawn.mp3");
            audio.volume = 0.5;

            audio.play();
  
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
      }}
    >
      <img
        src={image}
        draggable={false}
        onAnimationEnd={onEnd}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "contain",

          animation:
            "npcSpawn 2000ms ease-out forwards",

          userSelect: "none",
          pointerEvents: "none",
        }}
      />

      <style>{`
        @keyframes npcSpawn {
          0% {
            transform: translateY(100%);
          }

          75% {
            transform: translateY(-3%);
          }

          100% {
            transform: translateY(0%);
          }
        }
      `}</style>
    </div>
  );
}
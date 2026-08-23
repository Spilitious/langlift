type ActionPointsProps = {
  ap: number;
  size?: number;
};

export default function ActionPoints({
  ap,
  size = 32,
}: ActionPointsProps) {
  const displayedAp = Math.max(0, Math.min(3, ap));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
      }}
    >
      {Array.from({ length: 3 }).map((_, index) => {
        const visible = index >= 3 - displayedAp;

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
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
interface IntersectionDotProps {
  position: "left" | "center" | "right";
}

export function IntersectionDot({ position }: IntersectionDotProps) {
  const positionClasses = {
    left: "left-0 -translate-x-1/2",
    center: "left-1/2 -translate-x-1/2",
    right: "right-0 translate-x-1/2",
  };

  return (
    <div
      className={`absolute bottom-0 translate-y-1/2 z-10 ${positionClasses[position]}`}
    >
      <div
        className="rounded-full"
        style={{
          width: "4px",
          height: "4px",
          background: "#FEDA24",
          boxShadow: "0 0 5px #FEDA24, 0 0 20px #FEDA24, 0 0 30px #FEDA24",
        }}
      />
    </div>
  );
}

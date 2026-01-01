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
          width: "6px",
          height: "6px",
          background: "#FFF",
        }}
      />
    </div>
  );
}

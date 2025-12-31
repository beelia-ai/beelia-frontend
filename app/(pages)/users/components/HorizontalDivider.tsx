interface HorizontalDividerProps {
  containerWidth?: number;
}

export function HorizontalDivider({ containerWidth = 1000 }: HorizontalDividerProps) {
  // Calculate overflow: 30% on each side
  const overflowAmount = containerWidth * 0.3;
  const totalWidth = containerWidth + (overflowAmount * 2);

  return (
    <div
      style={{
        width: `${totalWidth}px`,
        marginLeft: `-${overflowAmount}px`,
        opacity: 0.2,
        background: "linear-gradient(90deg, rgba(255, 193, 19, 0.00) 0%, #FFC113 17.77%, #FFC113 82.21%, rgba(255, 193, 19, 0.00) 100%)",
        height: "1px",
      }}
    />
  );
}


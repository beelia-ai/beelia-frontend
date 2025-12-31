interface VerticalDividerProps {
  containerHeight?: number;
}

export function VerticalDivider({ containerHeight = 1000 }: VerticalDividerProps) {
  return (
    <div
      style={{
        height: `${containerHeight}px`,
        opacity: 0.2,
        background: "linear-gradient(180deg, rgba(255, 193, 19, 0.00) 0%, #FFC113 17.77%, #FFC113 82.21%, rgba(255, 193, 19, 0.00) 100%)",
        width: "1px",
      }}
    />
  );
}


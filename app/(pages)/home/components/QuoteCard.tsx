interface QuoteCardProps {
  quote: string;
}

export function QuoteCard({ quote }: QuoteCardProps) {
  return (
    <div
      className="w-full flex items-center"
      style={{
        height: "fit-content",
        padding: "40px 40px",
      }}
    >
      <p
        className="text-white"
        style={{
          fontFamily: "var(--font-outfit), Outfit, sans-serif",
          fontWeight: 300,
          fontSize: "18px",
          lineHeight: "160%",
        }}
      >
        {quote}
      </p>
    </div>
  );
}

interface QuoteCardProps {
  quote: string;
}

export function QuoteCard({ quote }: QuoteCardProps) {
  return (
    <div className="w-full p-6 flex items-center" style={{ height: "fit-content" }}>
      <p
        className="text-white"
        style={{
          fontFamily: "var(--font-outfit), Outfit, sans-serif",
          fontWeight: 400,
          fontSize: "14px",
          lineHeight: "160%",
        }}
      >
        {quote}
      </p>
    </div>
  );
}


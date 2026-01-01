interface QuoteCardProps {
  quote: string;
}

export function QuoteCard({ quote }: QuoteCardProps) {
  return (
    <div
      className="w-full flex items-center px-5 py-10 md:px-10 md:py-10"
      style={{
        height: "fit-content",
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

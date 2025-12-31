interface FooterLinkProps {
  href?: string;
  children: React.ReactNode;
  external?: boolean;
  onClick?: () => void;
}

export function FooterLink({
  href,
  children,
  external = false,
  onClick,
}: FooterLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <a
      href={href || "#"}
      onClick={handleClick}
      {...(external && {
        target: "_blank",
        rel: "noopener noreferrer",
      })}
      className="footer-link text-right hover:text-white/80 transition-all duration-300 cursor-pointer"
      style={{
        fontFamily: "var(--font-outfit), sans-serif",
        fontWeight: 400,
        fontSize: "0.9rem",
        lineHeight: "120%",
        letterSpacing: "-0.02em",
        textTransform: "uppercase",
        color: "#FFFFFF",
      }}
    >
      {children}
    </a>
  );
}

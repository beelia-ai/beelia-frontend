interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}

export function FooterLink({
  href,
  children,
  external = false,
}: FooterLinkProps) {
  return (
    <a
      href={href}
      {...(external && {
        target: "_blank",
        rel: "noopener noreferrer",
      })}
      className="footer-link text-right hover:text-white/80 transition-all duration-300"
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

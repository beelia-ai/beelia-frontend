export function FontPreloader() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            if (document.querySelector('link[href="/fonts/EditorsNote-Italic.woff2"]')) return;
            const link = document.createElement("link");
            link.rel = "preload";
            link.as = "font";
            link.type = "font/woff2";
            link.crossOrigin = "anonymous";
            link.href = "/fonts/EditorsNote-Italic.woff2";
            document.head.appendChild(link);
          })();
        `,
      }}
    />
  );
}


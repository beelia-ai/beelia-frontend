export function FontPreloader() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            const fonts = [
              "/fonts/EditorsNote-Italic.woff2",
              "/fonts/EditorsNote-MediumItalic.woff2"
            ];
            fonts.forEach(function(href) {
              if (document.querySelector('link[href="' + href + '"]')) return;
              const link = document.createElement("link");
              link.rel = "preload";
              link.as = "font";
              link.type = "font/woff2";
              link.crossOrigin = "anonymous";
              link.href = href;
              document.head.appendChild(link);
            });
          })();
        `,
      }}
    />
  );
}


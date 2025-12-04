export function PreloadLogo() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            if (!document.querySelector('link[rel="preload"][href="/icons/Union.svg"]')) {
              const link = document.createElement('link');
              link.rel = 'preload';
              link.as = 'image';
              link.href = '/icons/Union.svg';
              link.setAttribute('fetchpriority', 'high');
              document.head.appendChild(link);
            }
          })();
        `,
      }}
    />
  );
}


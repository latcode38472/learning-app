import type { ReactNode } from 'react';

/** In-page navigation must not replace the fragment owned by HashRouter. */
export function PageAnchor({ target, className, children }: { target: string; className?: string; children: ReactNode }) {
  return (
    <a
      href={`#${target}`}
      className={className}
      onClick={(event) => {
        event.preventDefault();
        const element = document.getElementById(target);
        if (!element) return;
        element.focus({ preventScroll: true });
        element.scrollIntoView({ block: 'start' });
      }}
    >
      {children}
    </a>
  );
}

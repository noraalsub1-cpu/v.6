import React, { useRef, useEffect } from 'react';

// This is a workaround for KaTeX not being available as a module from a CDN script
declare const katex: {
  render(expression: string, element: HTMLElement, options?: any): void;
};

const RenderedEquation: React.FC<{ equation: string, isBlock: boolean }> = ({ equation, isBlock }) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current && typeof katex !== 'undefined') {
      try {
        katex.render(equation, ref.current, {
          throwOnError: false,
          displayMode: isBlock,
        });
      } catch (e) {
        console.error("KaTeX render error:", e);
        if (ref.current) {
          ref.current.textContent = isBlock ? `$$${equation}$$` : `$${equation}$`;
        }
      }
    }
  }, [equation, isBlock]);

  return <span ref={ref} />;
};

export const EquationRenderer: React.FC<{ text: string }> = ({ text }) => {
  if (typeof text !== 'string') {
    return null;
  }
  
  // Split by block equations ($$ ... $$) and inline equations ($ ... $)
  // This regex handles both delimiters.
  const parts = text.split(/(\$\$[^`]+\$\$|\$[^`]+\$)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const equation = part.substring(2, part.length - 2);
          return (
            <div key={index} className="my-3 text-center" dir="ltr">
              <RenderedEquation equation={equation} isBlock={true} />
            </div>
          );
        } else if (part.startsWith('$') && part.endsWith('$')) {
           const equation = part.substring(1, part.length - 1);
           return <RenderedEquation key={index} equation={equation} isBlock={false} />;
        }
        else {
          return part.split('\n').map((line, i) => (
            <React.Fragment key={`${index}-${i}`}>
              {line}
              {i < part.split('\n').length - 1 && <br />}
            </React.Fragment>
          ));
        }
      })}
    </>
  );
};

import katex from 'katex';
import React from 'react';

export interface KatexRenderProps {
  equation: string;
  inline: boolean;
  onClick: (e: React.MouseEvent<HTMLSpanElement>) => void;
}

function KatexRenderer({ equation, inline, onClick }: KatexRenderProps): JSX.Element {
  const katexElementRef = React.useRef(null);

  React.useEffect(() => {
    const katexElement = katexElementRef.current;
    if (katexElement !== null) {
      katex.render(equation, katexElement, {
        displayMode: !inline, // true === block display //
        errorColor: '#cc0000',
        output: 'html',
        strict: 'warn',
        throwOnError: false,
        trust: false,
      });
    }
  }, [equation, inline]);

  return (
    // We use spacers either side to ensure Android doesn't try and compose from the
    // inner text from Katex. There didn't seem to be any other way of making this work,
    // without having a physical space.
    <>
      <span className="spacer"> </span>
      <span onClick={onClick} ref={katexElementRef} role="button" tabIndex={-1} />
      <span className="spacer"> </span>
    </>
  );
}

export { KatexRenderer };
export default KatexRenderer;

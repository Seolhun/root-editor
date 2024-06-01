import React from 'react';

import { Button } from '~/components';

import { KatexRenderer } from './KatexRenderer';

type KatexEquationAltererProps = {
  initialEquation?: string;
  onConfirm: (string, boolean) => void;
};

function KatexEquationAlterer({ initialEquation = '', onConfirm }: KatexEquationAltererProps): JSX.Element {
  const [equation, setEquation] = React.useState<string>(initialEquation);
  const [inline, setInline] = React.useState<boolean>(true);

  const onClick = React.useCallback(() => {
    onConfirm(equation, inline);
  }, [onConfirm, equation, inline]);

  const onCheckboxChange = React.useCallback(() => {
    setInline(!inline);
  }, [setInline, inline]);

  return (
    <>
      <div className="KatexEquationAlterer_defaultRow">
        Inline
        <input checked={inline} onChange={onCheckboxChange} type="checkbox" />
      </div>
      <div className="KatexEquationAlterer_defaultRow">Equation </div>
      <div className="KatexEquationAlterer_centerRow">
        {inline ? (
          <input
            onChange={(event) => {
              setEquation(event.target.value);
            }}
            className="KatexEquationAlterer_textArea"
            value={equation}
          />
        ) : (
          <textarea
            onChange={(event) => {
              setEquation(event.target.value);
            }}
            className="KatexEquationAlterer_textArea"
            value={equation}
          />
        )}
      </div>
      <div className="KatexEquationAlterer_defaultRow">Visualization </div>
      <div className="KatexEquationAlterer_centerRow">
        <KatexRenderer equation={equation} inline={false} onClick={() => null} />
      </div>
      <div className="KatexEquationAlterer_dialogActions">
        <Button onClick={onClick}>Confirm</Button>
      </div>
    </>
  );
}

export { KatexEquationAlterer };
export default KatexEquationAlterer;

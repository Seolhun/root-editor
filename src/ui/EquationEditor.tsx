import type { Ref, RefObject } from 'react';

import { ChangeEvent, forwardRef } from 'react';
import * as React from 'react';

import './EquationEditor.css';

type BaseEquationEditorProps = {
  equation: string;
  inline: boolean;
  setEquation: (equation: string) => void;
};

function EquationEditor(
  { equation, inline, setEquation }: BaseEquationEditorProps,
  forwardedRef: Ref<HTMLInputElement | HTMLTextAreaElement>,
): JSX.Element {
  const onChange = (event: ChangeEvent) => {
    setEquation((event.target as HTMLInputElement).value);
  };

  return inline && forwardedRef instanceof HTMLInputElement ? (
    <span className="EquationEditor_inputBackground">
      <span className="EquationEditor_dollarSign">$</span>
      <input
        autoFocus={true}
        className="EquationEditor_inlineEditor"
        onChange={onChange}
        ref={forwardedRef as RefObject<HTMLInputElement>}
        value={equation}
      />
      <span className="EquationEditor_dollarSign">$</span>
    </span>
  ) : (
    <div className="EquationEditor_inputBackground">
      <span className="EquationEditor_dollarSign">{'$$\n'}</span>
      <textarea
        className="EquationEditor_blockEditor"
        onChange={onChange}
        ref={forwardedRef as RefObject<HTMLTextAreaElement>}
        value={equation}
      />
      <span className="EquationEditor_dollarSign">{'\n$$'}</span>
    </div>
  );
}

export default forwardRef(EquationEditor);

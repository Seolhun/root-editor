import React from 'react';

type BaseEquationEditorProps = {
  equation: string;
  inline: boolean;
  inputRef: { current: HTMLInputElement | HTMLTextAreaElement | null };
  setEquation: (string) => void;
};

function InlineEquationEditor({ equation, inputRef, onChange }: EquationEditorImplProps): JSX.Element {
  return (
    <span className="EquationEditor_inputBackground">
      <span className="EquationEditor_dollarSign">$</span>
      <input className="EquationEditor_inlineEditor" onChange={onChange} ref={inputRef} value={equation} />
      <span className="EquationEditor_dollarSign">$</span>
    </span>
  );
}

type BlockEquationEditorImplProps = {
  equation: string;
  inputRef: { current: HTMLTextAreaElement | null };
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

function BlockEquationEditor({ equation, inputRef, onChange }: BlockEquationEditorImplProps): JSX.Element {
  return (
    <div className="EquationEditor_inputBackground">
      <span className="EquationEditor_dollarSign">{'$$\n'}</span>
      <textarea className="EquationEditor_blockEditor" onChange={onChange} ref={inputRef} value={equation} />
      <span className="EquationEditor_dollarSign">{'\n$$'}</span>
    </div>
  );
}

function EquationEditor({ equation, inline, inputRef, setEquation }: BaseEquationEditorProps): JSX.Element {
  const onChange = (event) => {
    setEquation(event.target.value);
  };

  const props = {
    equation,
    inputRef,
    onChange,
  };

  return inline ? (
    <InlineEquationEditor {...props} inputRef={inputRef as React.RefObject<HTMLInputElement>} />
  ) : (
    <BlockEquationEditor {...props} inputRef={inputRef as React.RefObject<HTMLTextAreaElement>} />
  );
}

type EquationEditorImplProps = {
  equation: string;
  inputRef: { current: HTMLInputElement | null };
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export { EquationEditor };
export default EquationEditor;

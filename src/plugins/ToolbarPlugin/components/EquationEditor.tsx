import React from 'react';

type BaseEquationEditorProps = {
  equation: string;
  inline: boolean;
  inputRef: { current: null | HTMLInputElement | HTMLTextAreaElement };
  setEquation: (string) => void;
};

function InlineEquationEditor({ equation, onChange, inputRef }: EquationEditorImplProps): JSX.Element {
  return (
    <span className="EquationEditor_inputBackground">
      <span className="EquationEditor_dollarSign">$</span>
      <input className="EquationEditor_inlineEditor" value={equation} onChange={onChange} ref={inputRef} />
      <span className="EquationEditor_dollarSign">$</span>
    </span>
  );
}

type BlockEquationEditorImplProps = {
  equation: string;
  inputRef: { current: null | HTMLTextAreaElement };
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

function BlockEquationEditor({ equation, onChange, inputRef }: BlockEquationEditorImplProps): JSX.Element {
  return (
    <div className="EquationEditor_inputBackground">
      <span className="EquationEditor_dollarSign">{'$$\n'}</span>
      <textarea className="EquationEditor_blockEditor" value={equation} onChange={onChange} ref={inputRef} />
      <span className="EquationEditor_dollarSign">{'\n$$'}</span>
    </div>
  );
}

function EquationEditor({ equation, setEquation, inline, inputRef }: BaseEquationEditorProps): JSX.Element {
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
  inputRef: { current: null | HTMLInputElement };
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export { EquationEditor };
export default EquationEditor;

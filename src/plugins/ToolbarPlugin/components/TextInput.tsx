import React from 'react';
import classNames from 'classnames';

interface ToolbarTextInputProps {
  label: string;
}

type HtmlProps = React.HTMLAttributes<HTMLInputElement>;
function ToolbarTextInput({ label, id, className, ...rests }: ToolbarTextInputProps & HtmlProps): JSX.Element {
  return (
    <div className="ToolbarTextInput__Wrapper">
      <label htmlFor={id} className="ToolbarTextInput__Label">
        {label}
      </label>
      <input {...rests} id={id} type="text" className={classNames('ToolbarTextInput__Input', className)} />
    </div>
  );
}

export { ToolbarTextInput };
export default ToolbarTextInput;

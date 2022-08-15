import React from 'react';
import classNames from 'classnames';

export type FormLabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

function FormLabel({ children, className, ...rests }: FormLabelProps): JSX.Element {
  return (
    <label {...rests} className={classNames('Root__FormLabel', className)}>
      {children}
    </label>
  );
}

export { FormLabel };
export default FormLabel;

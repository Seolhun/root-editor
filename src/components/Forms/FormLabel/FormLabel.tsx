import React from 'react';
import clsx from 'clsx';

export type FormLabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

function FormLabel({ children, className, ...rests }: FormLabelProps): JSX.Element {
  return (
    <label {...rests} className={clsx('Root__FormLabel', className)}>
      {children}
    </label>
  );
}

export { FormLabel };
export default FormLabel;

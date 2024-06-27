import clsx from 'clsx';
import React from 'react';

export type FormLabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

function FormLabel({ className, children, ...rests }: FormLabelProps): JSX.Element {
  return (
    <label {...rests} className={clsx('Root__FormLabel', className)}>
      {children}
    </label>
  );
}

export { FormLabel };
export default FormLabel;

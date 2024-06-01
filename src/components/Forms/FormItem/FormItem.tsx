import React from 'react';
import clsx from 'clsx';

export type FormItemProps = React.HTMLAttributes<HTMLDivElement>;

function FormItem({ children, className, ...rests }: FormItemProps): JSX.Element {
  return (
    <div {...rests} className={clsx('Root__FormItem', className)}>
      {children}
    </div>
  );
}

export { FormItem };
export default FormItem;

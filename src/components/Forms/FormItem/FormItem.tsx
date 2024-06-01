import clsx from 'clsx';
import React from 'react';

export type FormItemProps = React.HTMLAttributes<HTMLDivElement>;

function FormItem({ className, children, ...rests }: FormItemProps): JSX.Element {
  return (
    <div {...rests} className={clsx('Root__FormItem', className)}>
      {children}
    </div>
  );
}

export { FormItem };
export default FormItem;

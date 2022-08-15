import React from 'react';
import classNames from 'classnames';

export type FormItemProps = React.HTMLAttributes<HTMLDivElement>;

function FormItem({ children, className, ...rests }: FormItemProps): JSX.Element {
  return (
    <div {...rests} className={classNames('Root__FormItem', className)}>
      {children}
    </div>
  );
}

export { FormItem };
export default FormItem;

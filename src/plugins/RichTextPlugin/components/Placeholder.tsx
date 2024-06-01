import React from 'react';
import clsx from 'clsx';

type ElementProps = React.HTMLAttributes<HTMLDivElement>;
function Placeholder({ children, className }: ElementProps): JSX.Element {
  return <div className={clsx('Root__Editor__Placeholder', className)}>{children}</div>;
}

export { Placeholder };
export default Placeholder;

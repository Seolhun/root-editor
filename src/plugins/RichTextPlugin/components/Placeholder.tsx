import clsx from 'clsx';
import React from 'react';

type ElementProps = React.HTMLAttributes<HTMLDivElement>;
function Placeholder({ className, children }: ElementProps): JSX.Element {
  return <div className={clsx('Root__Editor__Placeholder', className)}>{children}</div>;
}

export { Placeholder };
export default Placeholder;

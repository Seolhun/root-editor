import clsx from 'clsx';
import React from 'react';

type ElementProps = React.HTMLAttributes<HTMLDivElement>;
function Divider({ className, ...rests }: ElementProps): JSX.Element {
  return <div {...rests} className={clsx('Root__Divider', className)} />;
}

export { Divider };
export default Divider;

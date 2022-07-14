import React from 'react';
import classNames from 'classnames';

type ElementProps = React.HTMLAttributes<HTMLDivElement>;
function Placeholder({ children, className }: ElementProps): JSX.Element {
  return (
    <div className={classNames('Root__Editor__Placeholder', className)}>
      {children}
    </div>
  );
}

export { Placeholder };
export default Placeholder;

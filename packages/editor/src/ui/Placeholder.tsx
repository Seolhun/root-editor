import * as React from 'react';

import './Placeholder.scss';

type ElementType = HTMLDivElement;
type ElementProps = React.HTMLAttributes<ElementType>;

const Placeholder = React.forwardRef<ElementType, ElementProps>(({ className, children, ...others }, ref) => {
  return (
    <div {...others} className={className || 'RootEditor__Placeholder'} ref={ref}>
      {children}
    </div>
  );
});

export default Placeholder;

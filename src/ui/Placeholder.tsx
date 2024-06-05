import * as React from 'react';

import './Placeholder.css';

type ElementType = HTMLDivElement;
type ElementProps = React.HTMLAttributes<ElementType>;

const Placeholder = React.forwardRef<ElementType, ElementProps>(({ className, children, ...others }, ref) => {
  return (
    <div {...others} className={className || 'Placeholder__root'} ref={ref}>
      {children}
    </div>
  );
});

export default Placeholder;

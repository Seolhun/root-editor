import { useMergeRefs } from '@floating-ui/react';
import clsx from 'clsx';
import * as React from 'react';

import { useOpenerContext } from './useOpenerContext';

type ElementType = HTMLDivElement;
type ElementProps = React.HTMLAttributes<ElementType>;

export const OpenerTrigger = React.forwardRef<ElementType, ElementProps>(({ className, children, ...props }, ref) => {
  const contextValues = useOpenerContext();
  const childrenRef = (children as any)?.ref;

  const mergedRef = useMergeRefs([contextValues?.refs.setReference, ref, childrenRef]);

  return (
    <div
      className={clsx(className)}
      data-state={contextValues?.open ? 'open' : 'closed'}
      ref={mergedRef}
      {...contextValues?.getReferenceProps(props)}
    >
      {children}
    </div>
  );
});
